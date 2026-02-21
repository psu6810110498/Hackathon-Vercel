/**
 * POST /api/analyze — Writing analysis endpoint
 * 1. Auth check
 * 2. Usage limit check
 * 3. Input validation
 * 4. Business logic (analyzer)
 * 5. Save to DB, increment usage
 * 6. Return response
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import {
  canPerformAnalysis,
  incrementDailyUsage,
  createAnalysis,
  logError,
  updateWeakPatterns,
  calculatePredictedScore,
  updatePredictedScore,
} from "@/lib/db/queries";
import { validateEssayInput, isValidHskLevelForWriting } from "@/lib/utils/validation";
import { getScoreTotal } from "@/types/analysis";
import { HSK_CONFIG } from "@/lib/hsk/config";
import { analyzeWriting } from "@/lib/ai/analyzer";

const MAX_DAILY_USAGE_FREE = 3;

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนใช้งาน" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Usage limit check
    const { allowed, currentUsage } = await canPerformAnalysis(userId);
    if (!allowed) {
      return NextResponse.json(
        {
          error: `ใช้สิทธิ์วิเคราะห์ครบ ${MAX_DAILY_USAGE_FREE} ครั้ง/วันแล้ว กรุณาอัปเกรดเป็น Premium`,
          currentUsage,
          limit: MAX_DAILY_USAGE_FREE,
        },
        { status: 429 }
      );
    }

    // 3. Input validation
    const body = await request.json().catch(() => ({}));
    const { text, hskLevel: level } = body;

    const inputCheck = validateEssayInput(text, level);
    if (!inputCheck.valid) {
      return NextResponse.json(
        { error: inputCheck.error ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    if (!isValidHskLevelForWriting(level)) {
      return NextResponse.json(
        { error: "ระดับ HSK สำหรับการเขียนต้องเป็น 3, 4, 5 หรือ 6" },
        { status: 400 }
      );
    }

    const essay = inputCheck.data!;
    const hskLevel = level as 3 | 4 | 5 | 6;
    const levelKey = `HSK${hskLevel}` as keyof typeof HSK_CONFIG;
    const minChars = HSK_CONFIG[levelKey].minChars;
    if (essay.length < minChars) {
      return NextResponse.json(
        { error: `สำหรับ HSK ${hskLevel} กรุณาพิมพ์อย่างน้อย ${minChars} ตัวอักษร` },
        { status: 400 }
      );
    }

    // 4. Business logic
    const result = await analyzeWriting(essay, hskLevel);
    if (!result) {
      return NextResponse.json(
        { error: "วิเคราะห์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
        { status: 500 }
      );
    }

    // 5. Save and increment usage
    await createAnalysis({
      userId,
      mode: "WRITING",
      hskLevel,
      inputText: essay,
      result: result as object,
      score: Math.round(getScoreTotal(result.score)),
    });
    await incrementDailyUsage(userId);

    // 6. Cognitive layer: log errors, update weak patterns, predicted score
    for (const err of result.errors) {
      await logError(userId, {
        errorType: err.type,
        wrongText: err.original,
        correction: err.suggestion,
        hskLevel,
        context: essay.slice(0, 500),
      });
    }
    await updateWeakPatterns(
      userId,
      result.errors.map((e) => ({ type: e.type }))
    );
    const predictedScore = await calculatePredictedScore(userId);
    await updatePredictedScore(userId, predictedScore);

    return NextResponse.json({
      success: true,
      result,
      usage: currentUsage + 1,
    });
  } catch (err) {
    console.error("[API /api/analyze]", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}
