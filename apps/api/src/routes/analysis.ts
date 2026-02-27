/**
 * Analysis routes — writing & reading analysis
 * Enhanced with rate limiting + AI caching (Phase 2)
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { rateLimitMiddleware } from '../middleware/rateLimit';
import { getCachedResult, setCachedResult } from '../services/cache/aiCache';
import {
  incrementDailyUsage,
  createAnalysis,
  logError,
  updateWeakPatterns,
  calculatePredictedScore,
  updatePredictedScore,
} from '../services/db/queries';
import {
  WritingAnalysisInput,
  ReadingAnalysisInput,
  HSK_CONFIG,
  type HskConfigKey,
} from '@hsk/shared';
import { analyzeWriting, analyzeReading } from '../services/ai/analyzer';

const analysis = new Hono();

// All analysis routes require auth + rate limiting
analysis.use('*', authMiddleware);
analysis.use('*', rateLimitMiddleware());

// ============================================
// POST /analysis/writing
// ============================================

analysis.post('/writing', async (c) => {
  try {
    const userId = c.get('userId');

    // Validate input
    const body = await c.req.json();
    const parsed = WritingAnalysisInput.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง' }, 400);
    }

    const { text, hskLevel } = parsed.data;
    const levelKey = `HSK${hskLevel}` as HskConfigKey;
    const minChars = HSK_CONFIG[levelKey].minChars;

    if (text.length < minChars) {
      return c.json({
        error: `สำหรับ HSK ${hskLevel} กรุณาพิมพ์อย่างน้อย ${minChars} ตัวอักษร`,
      }, 400);
    }

    // Pre-flight Logic: Reject completely non-Chinese text
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
    if (!chineseChars || (chineseChars.length / text.length) < 0.2) {
      return c.json({
        error: `ดูเหมือนว่าข้อความนี้จะไม่ใช่ภาษาจีน หรือมีตัวอักษรจีนน้อยเกินไป กรุณาเขียนเป็นภาษาจีนเพื่อทำการวิเคราะห์`,
      }, 400);
    }

    // Check cache first
    const nocache = c.req.query('nocache') === '1';
    if (!nocache) {
      const cached = await getCachedResult('writing', text, hskLevel, userId);
      if (cached) {
        return c.json({ success: true, result: cached, cached: true });
      }
    }

    // AI analysis
    const result = await analyzeWriting(text, hskLevel as 3 | 4 | 5 | 6);
    if (!result) {
      return c.json({ error: 'วิเคราะห์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, 500);
    }

    // Cache the result
    await setCachedResult('writing', text, hskLevel, result, userId);

    // Save to DB
    const getScoreTotal = (score: number | { vocabulary?: number; grammar?: number; content?: number; structure?: number }) => {
      if (typeof score === 'number') return score;
      if (!score) return 0;
      return (score.vocabulary || 0) + (score.grammar || 0) + (score.content || 0) + (score.structure || 0);
    };

    await createAnalysis({
      userId,
      mode: 'WRITING',
      hskLevel,
      inputText: text,
      result: result as object,
      score: Math.round(getScoreTotal(result.score)),
    });
    await incrementDailyUsage(userId);

    // Cognitive layer
    if (result.errors && result.errors.length > 0) {
      for (const err of result.errors) {
        await logError(userId, {
          errorType: err.type,
          wrongText: err.original,
          correction: err.suggestion,
          hskLevel,
          context: text.slice(0, 500),
        });
      }
      await updateWeakPatterns(userId, result.errors.map((e: { type: string }) => ({ type: e.type })));
    }

    const predictedScore = await calculatePredictedScore(userId);
    await updatePredictedScore(userId, predictedScore);

    return c.json({ success: true, result });
  } catch (err) {
    console.error('[API /analysis/writing]', err);
    return c.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, 500);
  }
});

// ============================================
// POST /analysis/reading
// ============================================

analysis.post('/reading', async (c) => {
  try {
    const userId = c.get('userId');

    // Validate input
    const body = await c.req.json();
    const parsed = ReadingAnalysisInput.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง' }, 400);
    }

    const { passage, hskLevel } = parsed.data;

    // Check cache first
    const nocache = c.req.query('nocache') === '1';
    if (!nocache) {
      const cached = await getCachedResult('reading', passage, hskLevel, userId);
      if (cached) {
        return c.json({ success: true, result: cached, cached: true });
      }
    }

    // AI analysis
    const result = await analyzeReading(passage, hskLevel as 1 | 2 | 3 | 4 | 5 | 6);
    if (!result) {
      return c.json({ error: 'วิเคราะห์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }, 500);
    }

    // Cache the result
    await setCachedResult('reading', passage, hskLevel, result, userId);

    // Save to DB
    await createAnalysis({
      userId,
      mode: 'READING',
      hskLevel,
      inputText: passage,
      result: result as object,
    });
    await incrementDailyUsage(userId);

    return c.json({ success: true, result });
  } catch (err) {
    console.error('[API /analysis/reading]', err);
    return c.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, 500);
  }
});

export { analysis as analysisRoutes };

