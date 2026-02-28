/**
 * Exercise routes — generate adaptive exercises
 * Migrated from app/api/exercise/route.ts
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { canPerformAnalysis, incrementDailyUsage } from '../services/db/queries';
import { prisma } from '../services/db/prisma';
import { generateExercises } from '../services/ai/analyzer';
import { ExerciseGenerateInput, MAX_DAILY_USAGE_FREE } from '@hsk/shared';

const exercise = new Hono();

exercise.use('*', authMiddleware);

// ============================================
// POST /exercise/generate
// ============================================

exercise.post('/generate', async (c) => {
  try {
    const userId = c.get('userId');

    // Usage limit check
    const { allowed, currentUsage } = await canPerformAnalysis(userId);
    if (!allowed) {
      return c.json({
        error: `ใช้สิทธิ์ครบ ${MAX_DAILY_USAGE_FREE} ครั้ง/วันแล้ว กรุณาอัปเกรดเป็น Premium`,
        currentUsage,
        limit: MAX_DAILY_USAGE_FREE,
      }, 429);
    }

    const body = await c.req.json().catch(() => ({}));
    const parsed = ExerciseGenerateInput.safeParse(body);
    const hskLevel = parsed.success ? parsed.data.hskLevel : 5;

    // Fetch weak patterns
    const profile = await prisma.cognitiveProfile.findUnique({
      where: { userId },
      select: { weakPatterns: true },
    });

    let weakPatternsText = '';
    if (profile?.weakPatterns) {
      const patterns = profile.weakPatterns as Array<{ type: string }>;
      if (Array.isArray(patterns)) {
        weakPatternsText = patterns.map((p) => p.type).join(', ');
      }
    }

    if (!weakPatternsText) {
      const logs = await prisma.errorLog.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      weakPatternsText = logs.map((l) => l.errorType).join(', ');
    }

    // Generate exercises
    const exercises = await generateExercises(weakPatternsText, hskLevel);
    if (!exercises || exercises.length === 0) {
      return c.json({ error: 'สร้างแบบฝึกหัดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, 500);
    }

    await incrementDailyUsage(userId);

    return c.json({
      success: true,
      result: { exercises },
      usage: currentUsage + 1,
    });
  } catch (err) {
    console.error('[API /exercise/generate]', err);
    return c.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, 500);
  }
});

export { exercise as exerciseRoutes };
