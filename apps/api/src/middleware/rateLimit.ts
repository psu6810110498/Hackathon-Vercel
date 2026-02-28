/**
 * Rate Limiting Middleware
 * Sliding window counter using Redis INCR + EXPIRE
 * Returns X-RateLimit-* headers
 */

import { Context, Next } from 'hono';
import { getRedis } from '../lib/redis';

interface RateLimitConfig {
  free: number;
  premium: number;
  windowSec: number; // window in seconds (86400 = 1 day)
}

const DEFAULT_CONFIG: RateLimitConfig = {
  free: 3,
  premium: 50,
  windowSec: 86400, // 24 hours
};

/**
 * Rate limit middleware — checks usage per user per day
 */
export function rateLimitMiddleware(config: Partial<RateLimitConfig> = {}) {
  const { free, premium, windowSec } = { ...DEFAULT_CONFIG, ...config };

  return async (c: Context, next: Next) => {
    const userId = c.get('userId');
    if (!userId) {
      // No auth = no rate limiting (auth middleware should catch first)
      return next();
    }

    const plan = c.get('user')?.plan || 'FREE';
    const limit = plan === 'PREMIUM' ? premium : free;

    const redis = getRedis();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const key = `ratelimit:${userId}:${today}`;

    try {
      const current = await redis.incr(key);

      // Set TTL on first request of the day
      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      // Set rate limit headers
      c.header('X-RateLimit-Limit', String(limit));
      c.header('X-RateLimit-Remaining', String(Math.max(0, limit - current)));
      c.header('X-RateLimit-Reset', today);

      // Warn at 80%
      if (current >= Math.floor(limit * 0.8) && current < limit) {
        c.header('X-RateLimit-Warning', `Usage at ${Math.round((current / limit) * 100)}%`);
      }

      // Hard block at limit
      if (current > limit) {
        return c.json({
          error: plan === 'FREE'
            ? `ใช้สิทธิ์ครบ ${free} ครั้ง/วันแล้ว กรุณาอัปเกรดเป็น Premium`
            : `ถึงขีดจำกัด ${premium} ครั้ง/วันแล้ว`,
          usage: current - 1,
          limit,
          plan,
        }, 429);
      }
    } catch (err) {
      // Redis down → fall through (don't block users)
      console.error('[RateLimit] Redis error, allowing request:', err);
    }

    await next();
  };
}
