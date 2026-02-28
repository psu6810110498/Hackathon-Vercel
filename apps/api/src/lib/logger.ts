/**
 * Structured Logger
 * JSON-formatted logs with request context
 * Ready for Axiom/Datadog/any log aggregator
 */

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  requestId?: string;
  userId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  error?: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

function emit(entry: LogEntry) {
  const line = JSON.stringify(entry);
  if (entry.level === 'error') {
    console.error(line);
  } else if (entry.level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const structuredLogger = {
  info(message: string, meta?: Partial<Omit<LogEntry, 'level' | 'message' | 'timestamp'>>) {
    emit({ level: 'info', message, ...meta, timestamp: new Date().toISOString() });
  },

  warn(message: string, meta?: Partial<Omit<LogEntry, 'level' | 'message' | 'timestamp'>>) {
    emit({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() });
  },

  error(message: string, meta?: Partial<Omit<LogEntry, 'level' | 'message' | 'timestamp'>>) {
    emit({ level: 'error', message, ...meta, timestamp: new Date().toISOString() });
  },
};

/**
 * Hono middleware: log every request with duration
 */
import { Context, Next } from 'hono';

export async function requestLoggerMiddleware(c: Context, next: Next) {
  const start = Date.now();
  await next();
  const durationMs = Date.now() - start;

  structuredLogger.info('request', {
    requestId: c.get('requestId'),
    userId: c.get('userId'),
    endpoint: c.req.path,
    method: c.req.method,
    statusCode: c.res.status,
    durationMs,
  });
}
