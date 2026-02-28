/**
 * Audit Routes — query audit logs
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { prisma } from '../services/db/prisma';

type Variables = {
  userId: string;
  orgId: string;
  role: string;
};
const audit = new Hono<{ Variables: Variables }>();

// ============================================
// GET /orgs/:slug/audit — Paginated audit log
// ============================================

audit.get(
  '/orgs/:slug/audit',
  authMiddleware,
  requireRole('ORG_ADMIN'),
  async (c) => {
    const orgId = c.get('orgId');
    const page = parseInt(c.req.query('page') || '1');
    const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { organizationId: orgId },
        include: {
          actor: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where: { organizationId: orgId } }),
    ]);

    return c.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }
);

export { audit as auditRoutes };
