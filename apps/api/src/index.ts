/**
 * HSK AI Coach — Hono API Server
 * Entry point for the separated backend
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

// Routes
import { authRoutes } from './routes/auth';
import { analysisRoutes } from './routes/analysis';
import { exerciseRoutes } from './routes/exercise';
import { userRoutes } from './routes/user';
import { jobRoutes } from './routes/jobs';
import { billingRoutes } from './routes/billing';
import { orgRoutes } from './routes/organizations';
import { invitationRoutes } from './routes/invitations';
import { auditRoutes } from './routes/audit';
import { complianceRoutes } from './routes/compliance';

import { secureHeaders } from 'hono/secure-headers';

import { requestIdMiddleware } from './middleware/requestId';
import { requestLoggerMiddleware } from './lib/logger';
import { sentryMiddleware } from './lib/sentry';
import { metricsMiddleware, getMetricsRegistry, metricsContentType } from './lib/metrics';

// ============================================
// App Setup
// ============================================

const app = new Hono();

// Security and Observability Middleware
app.use('*', secureHeaders());
app.use('*', sentryMiddleware);
app.use('*', metricsMiddleware);
app.use('*', requestIdMiddleware);
app.use('*', requestLoggerMiddleware);
app.use('*', prettyJSON());
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Prometheus metrics scraper endpoint
app.get('/metrics', async (c) => {
  c.header('Content-Type', metricsContentType);
  return c.text(await getMetricsRegistry());
});

// ============================================
// Health Check (enhanced with Redis)
// ============================================

import { isRedisHealthy } from './lib/redis';
import { getCacheStats, flushAICache } from './services/cache/aiCache';

app.get('/health', async (c) => {
  const redisOk = await isRedisHealthy();
  const cacheStats = getCacheStats();
  return c.json({
    status: 'ok',
    service: 'hsk-ai-coach-api',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    redis: redisOk ? 'ok' : 'disconnected',
    cache: cacheStats,
  });
});

// ============================================
// Admin endpoints
// ============================================

app.get('/admin/cache/stats', (c) => c.json(getCacheStats()));
app.post('/admin/cache/flush', async (c) => {
  const deleted = await flushAICache();
  return c.json({ flushed: deleted });
});

// ============================================
// Routes
// ============================================

app.route('/auth', authRoutes);
app.route('/analysis', analysisRoutes);
app.route('/exercise', exerciseRoutes);
app.route('/user', userRoutes);
app.route('/jobs', jobRoutes);
app.route('/billing', billingRoutes);
app.route('/orgs', orgRoutes);
app.route('/', invitationRoutes);
app.route('/', auditRoutes);
app.route('/compliance', complianceRoutes);

// ============================================
// 404 handler
// ============================================

app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// ============================================
// Global error handler
// ============================================

app.onError((err, c) => {
  console.error('[API Error]', err);
  return c.json(
    { error: 'Internal server error', message: err.message },
    500
  );
});

// ============================================
// Start server
// ============================================

import { serve } from '@hono/node-server';

const port = parseInt(process.env.PORT || '4000', 10);

serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 HSK AI Coach API running on http://localhost:${port}`);
});
