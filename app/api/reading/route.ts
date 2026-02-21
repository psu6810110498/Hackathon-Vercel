/**
 * POST /api/reading — Reading analysis endpoint
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
} from "@/lib/db/queries";
import { validateReadingInput, isValidHskLevel } from "@/lib/utils/validation";
import { analyzeReading } from "@/lib/ai/analyzer";

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
    const { passage, hskLevel: level } = body;

    const inputCheck = validateReadingInput(passage);
    if (!inputCheck.valid) {
      return NextResponse.json(
        { error: inputCheck.error ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    if (!isValidHskLevel(level)) {
      return NextResponse.json(
        { error: "ระดับ HSK ต้องเป็น 4, 5 หรือ 6" },
        { status: 400 }
      );
    }

    const text = inputCheck.data!;
    const hskLevel = level as 4 | 5 | 6;

    // 4. Business logic
    const result = await analyzeReading(text, hskLevel);
    if (!result) {
      return NextResponse.json(
        { error: "วิเคราะห์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
        { status: 500 }
      );
    }

    // 5. Save and increment usage
    await createAnalysis({
      userId,
      mode: "READING",
      hskLevel,
      inputText: text,
      result: result as object,
    });
    await incrementDailyUsage(userId);

    return NextResponse.json({
      success: true,
      result,
      usage: currentUsage + 1,
    });
  } catch (err) {
    console.error("[API /api/reading]", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}
