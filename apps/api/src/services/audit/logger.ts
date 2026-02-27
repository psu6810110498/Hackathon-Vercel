/**
 * Audit Logger Service
 * Records admin actions to the AuditLog table
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma';

export async function logAudit(
  organizationId: string | null,
  actorId: string,
  action: string,
  resource: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId,
        actorId,
        action,
        resource,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    // Don't fail the main operation if audit logging fails
    console.error('[Audit] Failed to log:', err);
  }
}
