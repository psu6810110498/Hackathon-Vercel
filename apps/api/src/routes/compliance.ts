/**
 * Compliance Routes — PDPA & Enterprise Privacy
 * 
 * Implements: 
 * - Privacy Consent Management
 * - Right to Access (Data Export)
 * - Right to Erasure (Account Deletion)
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { prisma } from '../services/db/prisma';

type Variables = {
  userId: string;
  orgId: string;
  role: string;
};
const compliance = new Hono<{ Variables: Variables }>();

compliance.use('*', authMiddleware);

// ============================================
// POST /compliance/consent — Accept Privacy Policy
// ============================================
compliance.post('/consent', async (c) => {
  const userId = c.get('userId');

  await prisma.user.update({
    where: { id: userId },
    data: { consentAccepted: true },
  });

  return c.json({ success: true, message: 'Privacy policy consent recorded' });
});

// ============================================
// GET /compliance/export — Right to Access
// ============================================
compliance.get('/export', async (c) => {
  const userId = c.get('userId');

  // Fetch all user data
  const userPackage = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      analyses: {
        orderBy: { createdAt: 'desc' },
      },
      flashcards: {
        orderBy: { createdAt: 'desc' },
      },
      cognitiveProfile: true,
      errorLogs: { // For troubleshooting reference
        orderBy: { createdAt: 'desc' },
        take: 100, // Reasonable cap
      }
    },
  });

  if (!userPackage) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Remove sensitive info before exporting
  const { password, ...safeUserPackage } = userPackage;

  // The client can trigger a JSON download
  c.header('Content-Type', 'application/json');
  c.header('Content-Disposition', `attachment; filename="hsk_data_export_${userId}.json"`);
  
  return c.json(safeUserPackage);
});

// ============================================
// DELETE /compliance/account — Right to Erasure
// ============================================
compliance.delete('/account', async (c) => {
  const userId = c.get('userId');
  
  // Enterprise-grade approach: Soft delete first, mark for reaper job
  // (Provides an undo window and preserves referential integrity initially)
  await prisma.user.update({
    where: { id: userId },
    data: { 
      deletedAt: new Date(),
      // Optionally obfuscate PII immediately:
      name: '[Deleted User]',
      email: `${userId}@deleted.hsk.local`,
      image: null,
    },
  });

  // Note: If they belong to an organization, we keep the OrganizationMember record
  // but the user details are obfuscated above. The audit logs will still show their ID.

  return c.json({ 
    success: true, 
    message: 'Account scheduled for permanent deletion within 30 days.' 
  });
});

export { compliance as complianceRoutes };
