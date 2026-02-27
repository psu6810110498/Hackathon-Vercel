/**
 * Sentry Error Tracking Service
 * Captures unhandled exceptions and performance tracing
 */

import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Context, Next } from 'hono';

// Only initialize if DSN is provided (i.e. in production/staging)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Performance Tracking
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    // Profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  });
}

// ============================================
// Hono Error Middleware
// ============================================

export async function sentryMiddleware(c: Context, next: Next) {
  try {
    // Attach tags if user/org is authenticated
    const userId = c.get('userId');
    const orgId = c.get('orgId');
    const requestId = c.get('requestId');

    if (process.env.SENTRY_DSN) {
      Sentry.setContext('request', {
        id: requestId,
        url: c.req.url,
        method: c.req.method,
      });

      if (userId) Sentry.setUser({ id: userId });
      if (orgId) Sentry.setTag('organization_id', orgId);
    }

    await next();
  } catch (error: unknown) {
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: {
          path: c.req.path,
          method: c.req.method,
        }
      });
    }
    
    // Re-throw so standard Hono error handler catches it
    throw error;
  }
}
