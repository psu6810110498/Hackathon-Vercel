/**
 * Prometheus Metrics Service
 * Collects API request volume, latency, and system health
 */

import { Context, Next } from 'hono';
import client from 'prom-client';

// Initialize default system metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ prefix: 'hsk_' });

// ============================================
// Custom Metrics
// ============================================

export const httpRequestsTotal = new client.Counter({
  name: 'hsk_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestDurationSeconds = new client.Histogram({
  name: 'hsk_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30],
});

export const aiRequestsTotal = new client.Counter({
  name: 'hsk_ai_requests_total',
  help: 'Total number of AI requests',
  labelNames: ['provider', 'mode', 'status'],
});

export const aiRequestDurationSeconds = new client.Histogram({
  name: 'hsk_ai_request_duration_seconds',
  help: 'AI request duration in seconds',
  labelNames: ['provider', 'mode'],
  buckets: [1, 2.5, 5, 10, 15, 30, 45, 60],
});

// ============================================
// Hono Middleware
// ============================================

export async function metricsMiddleware(c: Context, next: Next) {
  // Don't track the metrics endpoint itself
  if (c.req.path === '/metrics') {
    return next();
  }

  const startTimer = httpRequestDurationSeconds.startTimer();
  await next();
  
  // Use matched route pattern if available, fallback to path
  const route = c.req.matchedRoutes?.[0]?.path || c.req.path;
  const status = c.res.status.toString();
  const method = c.req.method;

  httpRequestsTotal.labels(method, route, status).inc();
  startTimer({ method, route, status_code: status });
}

// ============================================
// Metrics Endpoint
// ============================================

export async function getMetricsRegistry() {
  return await client.register.metrics();
}

export const metricsContentType = client.register.contentType;
