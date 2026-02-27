/**
 * Auth middleware for Hono
 * Verifies JWT from httpOnly cookie and attaches user to context
 */

import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyToken, type TokenPayload } from '../lib/jwt';

// Extend Hono context with user info
declare module 'hono' {
  interface ContextVariableMap {
    user: TokenPayload;
    userId: string;
  }
}

/**
 * Require authentication — returns 401 if no valid token
 */
export async function authMiddleware(c: Context, next: Next) {
  const token = getCookie(c, 'token');

  if (!token) {
    return c.json({ error: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' }, 401);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return c.json({ error: 'Session หมดอายุ กรุณาเข้าสู่ระบบใหม่' }, 401);
  }

  c.set('user', payload);
  c.set('userId', payload.userId);

  await next();
}

/**
 * Optional auth — attaches user if token present, but doesn't block
 */
export async function optionalAuthMiddleware(c: Context, next: Next) {
  const token = getCookie(c, 'token');

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      c.set('user', payload);
      c.set('userId', payload.userId);
    }
  }

  await next();
}
