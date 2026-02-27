/**
 * AI Response Cache — Redis-backed
 * Layer 1: Exact cache (hash of input + level + mode)
 * Layer 2: User-level cache (per-user, 24h TTL)
 */

import { createHash } from 'crypto';
import { getRedis } from '../../lib/redis';

const EXACT_CACHE_TTL = 7 * 24 * 60 * 60; // 7 days
const USER_CACHE_TTL = 24 * 60 * 60;       // 24 hours

// Stats tracking
let hits = 0;
let misses = 0;

/**
 * Generate cache key from input parameters
 */
function makeCacheKey(mode: string, input: string, level: number): string {
  const hash = createHash('sha256')
    .update(`${mode}:${level}:${input.trim()}`)
    .digest('hex')
    .slice(0, 16);
  return `ai:cache:${mode}:${hash}`;
}

function makeUserCacheKey(userId: string, mode: string, level: number): string {
  return `ai:user:${userId}:${mode}:${level}`;
}

/**
 * Try to get cached AI result
 */
export async function getCachedResult(
  mode: string,
  input: string,
  level: number,
  userId?: string
): Promise<unknown | null> {
  try {
    const redis = getRedis();

    // Layer 1: Exact cache
    const exactKey = makeCacheKey(mode, input, level);
    const exactResult = await redis.get(exactKey);
    if (exactResult) {
      hits++;
      return JSON.parse(exactResult);
    }

    // Layer 2: User-level cache (same mode + level within 24h)
    if (userId) {
      const userKey = makeUserCacheKey(userId, mode, level);
      const userResult = await redis.get(userKey);
      if (userResult) {
        hits++;
        return JSON.parse(userResult);
      }
    }

    misses++;
    return null;
  } catch (err) {
    console.error('[AICache] Get error:', err);
    misses++;
    return null;
  }
}

/**
 * Store AI result in cache
 */
export async function setCachedResult(
  mode: string,
  input: string,
  level: number,
  result: unknown,
  userId?: string
): Promise<void> {
  try {
    const redis = getRedis();
    const json = JSON.stringify(result);

    // Layer 1: Exact cache
    const exactKey = makeCacheKey(mode, input, level);
    await redis.setex(exactKey, EXACT_CACHE_TTL, json);

    // Layer 2: User-level cache
    if (userId) {
      const userKey = makeUserCacheKey(userId, mode, level);
      await redis.setex(userKey, USER_CACHE_TTL, json);
    }
  } catch (err) {
    console.error('[AICache] Set error:', err);
  }
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  const total = hits + misses;
  return {
    hits,
    misses,
    total,
    hitRate: total > 0 ? Math.round((hits / total) * 100) : 0,
  };
}

/**
 * Flush all AI cache (admin only)
 */
export async function flushAICache(): Promise<number> {
  try {
    const redis = getRedis();
    const keys = await redis.keys('ai:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    hits = 0;
    misses = 0;
    return keys.length;
  } catch (err) {
    console.error('[AICache] Flush error:', err);
    return 0;
  }
}
