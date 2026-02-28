/**
 * Request ID Middleware
 * Generates a unique X-Request-ID header for every request
 */

import { Context, Next } from 'hono';
import { randomUUID } from 'crypto';

export async function requestIdMiddleware(c: Context, next: Next) {
  const requestId = c.req.header('x-request-id') || randomUUID().slice(0, 8);
  c.set('requestId', requestId);
  c.header('X-Request-ID', requestId);
  await next();
}
