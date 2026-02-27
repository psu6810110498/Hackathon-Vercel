/**
 * RBAC Middleware — Role-Based Access Control
 * Checks user role within the current organization context
 */

import { Context, Next } from 'hono';
import { prisma } from '../services/db/prisma';

type OrgRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'TEACHER' | 'MEMBER' | 'VIEWER';

const ROLE_HIERARCHY: Record<OrgRole, number> = {
  SUPER_ADMIN: 5,
  ORG_ADMIN: 4,
  TEACHER: 3,
  MEMBER: 2,
  VIEWER: 1,
};

/**
 * Require minimum role in the current org
 * Must be used AFTER authMiddleware
 * Org slug comes from route param :slug
 */
export function requireRole(minRole: OrgRole) {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const slug = c.req.param('slug');
    if (!slug) {
      return c.json({ error: 'Organization slug required' }, 400);
    }

    // Find org + user's membership
    const org = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId },
          select: { role: true },
        },
      },
    });

    if (!org) {
      return c.json({ error: 'Organization not found' }, 404);
    }

    const membership = org.members[0];
    if (!membership) {
      return c.json({ error: 'Not a member of this organization' }, 403);
    }

    const userLevel = ROLE_HIERARCHY[membership.role as OrgRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole];

    if (userLevel < requiredLevel) {
      return c.json({
        error: `Requires ${minRole} role or higher`,
        currentRole: membership.role,
      }, 403);
    }

    // Attach org context
    c.set('orgId', org.id);
    c.set('orgSlug', org.slug);
    c.set('orgRole', membership.role);

    await next();
  };
}

/**
 * Require org context without role check (any member)
 */
export function requireOrg() {
  return requireRole('VIEWER');
}
