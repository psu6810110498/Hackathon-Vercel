/**
 * User routes — usage info, profile
 * Migrated from app/api/usage/route.ts
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { canPerformAnalysis, getUserById } from '../services/db/queries';
import { MAX_DAILY_USAGE_FREE } from '@hsk/shared';

const user = new Hono();

user.use('*', authMiddleware);

// ============================================
// GET /user/usage
// ============================================

user.get('/usage', async (c) => {
  try {
    const userId = c.get('userId');

    const dbUser = await getUserById(userId);
    const { allowed, currentUsage } = await canPerformAnalysis(userId);
    const plan = dbUser?.plan ?? 'FREE';
    const limit = plan === 'PREMIUM' ? null : MAX_DAILY_USAGE_FREE;

    return c.json({ usage: currentUsage, limit, allowed, plan });
  } catch (err) {
    console.error('[API /user/usage]', err);
    return c.json(
      { error: 'เกิดข้อผิดพลาด', usage: 0, limit: MAX_DAILY_USAGE_FREE, plan: 'FREE' },
      500
    );
  }
});

export { user as userRoutes };
