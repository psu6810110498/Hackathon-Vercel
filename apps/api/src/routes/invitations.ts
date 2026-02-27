/**
 * Invitation Routes — invite users to organizations
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
const invitations = new Hono<{ Variables: Variables }>();

// ============================================
// POST /orgs/:slug/invite — Create invitation
// ============================================

invitations.post(
  '/orgs/:slug/invite',
  authMiddleware,
  requireRole('ORG_ADMIN'),
  async (c) => {
    const orgId = c.get('orgId');
    const actorId = c.get('userId');
    const { email, role } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Check if already invited
    const existing = await prisma.invitation.findFirst({
      where: {
        organizationId: orgId,
        email,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (existing) {
      return c.json({ error: 'Active invitation already exists for this email' }, 409);
    }

    const invitation = await prisma.invitation.create({
      data: {
        organizationId: orgId,
        email,
        role: role || 'MEMBER',
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72h
      },
    });

    await logAudit(orgId, actorId, 'member.invited', 'invitation', { email, role });

    return c.json({
      success: true,
      invitation: {
        id: invitation.id,
        token: invitation.token,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
      },
      inviteUrl: `${process.env.FRONTEND_URL}/invite/${invitation.token}`,
    }, 201);
  }
);

// ============================================
// GET /invite/:token — Validate invite token
// ============================================

invitations.get('/invite/:token', async (c) => {
  const token = c.req.param('token');

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: {
      organization: { select: { name: true, slug: true, logoUrl: true } },
    },
  });

  if (!invitation) {
    return c.json({ error: 'Invitation not found' }, 404);
  }

  if (invitation.acceptedAt) {
    return c.json({ error: 'Invitation already accepted' }, 410);
  }

  if (invitation.expiresAt < new Date()) {
    return c.json({ error: 'Invitation expired' }, 410);
  }

  return c.json({
    valid: true,
    email: invitation.email,
    role: invitation.role,
    organization: invitation.organization,
  });
});

// ============================================
// POST /invite/:token/accept — Accept invitation
// ============================================

invitations.post('/invite/:token/accept', authMiddleware, async (c) => {
  const token = c.req.param('token');
  const userId = c.get('userId');

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    return c.json({ error: 'Invitation not found' }, 404);
  }

  if (invitation.acceptedAt) {
    return c.json({ error: 'Already accepted' }, 410);
  }

  if (invitation.expiresAt < new Date()) {
    return c.json({ error: 'Invitation expired' }, 410);
  }

  // Add user to org + mark invitation accepted
  await prisma.$transaction([
    prisma.organizationMember.create({
      data: {
        organizationId: invitation.organizationId,
        userId,
        role: invitation.role,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { organizationId: invitation.organizationId },
    }),
    prisma.invitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    }),
  ]);

  await logAudit(
    invitation.organizationId,
    userId,
    'member.joined_via_invite',
    'member',
    { invitationId: invitation.id }
  );

  return c.json({ success: true, organizationId: invitation.organizationId });
});

export { invitations as invitationRoutes };
