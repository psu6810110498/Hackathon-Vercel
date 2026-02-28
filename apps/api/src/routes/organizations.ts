/**
 * Organization Routes — CRUD + member management
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { prisma } from '../services/db/prisma';
import { logAudit } from '../services/audit/logger';

type Variables = {
  userId: string;
  orgId: string;
  role: string;
};
const orgs = new Hono<{ Variables: Variables }>();

// All routes require auth
orgs.use('*', authMiddleware);

// ============================================
// POST /orgs — Create organization
// ============================================

orgs.post('/', async (c) => {
  try {
    const userId = c.get('userId');
    const { name, slug } = await c.req.json();

    if (!name || !slug) {
      return c.json({ error: 'Name and slug are required' }, 400);
    }

    // Check slug uniqueness
    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (existing) {
      return c.json({ error: 'Slug already taken' }, 409);
    }

    // Create org + add creator as ORG_ADMIN
    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        members: {
          create: { userId, role: 'ORG_ADMIN' },
        },
      },
      include: { members: true },
    });

    await logAudit(org.id, userId, 'organization.created', 'organization', { name, slug });

    return c.json({ success: true, organization: org }, 201);
  } catch (err) {
    console.error('[POST /orgs]', err);
    return c.json({ error: 'Failed to create organization' }, 500);
  }
});

// ============================================
// GET /orgs/:slug — Get org details
// ============================================

orgs.get('/:slug', requireRole('VIEWER'), async (c) => {
  const orgId = c.get('orgId');
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      _count: { select: { members: true } },
    },
  });
  return c.json(org);
});

// ============================================
// PATCH /orgs/:slug — Update org settings
// ============================================

orgs.patch('/:slug', requireRole('ORG_ADMIN'), async (c) => {
  const orgId = c.get('orgId');
  const userId = c.get('userId');
  const body = await c.req.json();

  const { name, settings, logoUrl } = body;
  const org = await prisma.organization.update({
    where: { id: orgId },
    data: {
      ...(name && { name }),
      ...(settings && { settings }),
      ...(logoUrl && { logoUrl }),
    },
  });

  await logAudit(orgId, userId, 'organization.updated', 'organization', body);

  return c.json(org);
});

// ============================================
// GET /orgs/:slug/members — List members
// ============================================

orgs.get('/:slug/members', requireRole('VIEWER'), async (c) => {
  const orgId = c.get('orgId');
  const members = await prisma.organizationMember.findMany({
    where: { organizationId: orgId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { joinedAt: 'asc' },
  });
  return c.json(members);
});

// ============================================
// POST /orgs/:slug/members — Add member directly
// ============================================

orgs.post('/:slug/members', requireRole('ORG_ADMIN'), async (c) => {
  const orgId = c.get('orgId');
  const actorId = c.get('userId');
  const { userId, role } = await c.req.json();

  if (!userId) {
    return c.json({ error: 'userId is required' }, 400);
  }

  try {
    const member = await prisma.organizationMember.create({
      data: {
        organizationId: orgId,
        userId,
        role: role || 'MEMBER',
      },
    });

    // Also link user to org
    await prisma.user.update({
      where: { id: userId },
      data: { organizationId: orgId },
    });

    await logAudit(orgId, actorId, 'member.added', 'member', { userId, role });

    return c.json(member, 201);
  } catch {
    return c.json({ error: 'Already a member or user not found' }, 409);
  }
});

// ============================================
// PATCH /orgs/:slug/members/:userId — Change role
// ============================================

orgs.patch('/:slug/members/:userId', requireRole('ORG_ADMIN'), async (c) => {
  const orgId = c.get('orgId');
  const actorId = c.get('userId');
  const targetUserId = c.req.param('userId');
  const { role } = await c.req.json();

  if (!role) {
    return c.json({ error: 'Role is required' }, 400);
  }

  const member = await prisma.organizationMember.update({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId: targetUserId,
      },
    },
    data: { role },
  });

  await logAudit(orgId, actorId, 'member.role_changed', 'member', {
    targetUserId,
    newRole: role,
  });

  return c.json(member);
});

// ============================================
// DELETE /orgs/:slug/members/:userId — Remove member
// ============================================

orgs.delete('/:slug/members/:userId', requireRole('ORG_ADMIN'), async (c) => {
  const orgId = c.get('orgId');
  const actorId = c.get('userId');
  const targetUserId = c.req.param('userId');

  await prisma.organizationMember.delete({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId: targetUserId,
      },
    },
  });

  // Unlink user from org
  await prisma.user.update({
    where: { id: targetUserId },
    data: { organizationId: null },
  });

  await logAudit(orgId, actorId, 'member.removed', 'member', { targetUserId });

  return c.json({ success: true });
});

// ============================================
// GET /orgs/:slug/usage — Org usage dashboard
// ============================================

orgs.get('/:slug/usage', requireRole('TEACHER'), async (c) => {
  const orgId = c.get('orgId');

  const [memberCount, totalAnalyses, quotas] = await Promise.all([
    prisma.organizationMember.count({ where: { organizationId: orgId } }),
    prisma.analysis.count({
      where: { user: { organizationId: orgId } },
    }),
    prisma.usageQuota.findMany({
      where: { organizationId: orgId },
      orderBy: { count: 'desc' },
      take: 20,
    }),
  ]);

  return c.json({
    memberCount,
    totalAnalyses,
    topUsers: quotas,
  });
});

export { orgs as orgRoutes };
