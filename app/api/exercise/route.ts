/**
 * POST /api/exercise — Exercise generation endpoint
 * 1. Auth check
 * 2. Usage limit check
 * 3. Fetch user's weak patterns from DB
 * 4. Business logic (generateExercises)
 * 5. Increment usage
 * 6. Return response
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import {
  canPerformAnalysis,
  incrementDailyUsage,
} from "@/lib/db/queries";
import { generateExercises } from "@/lib/ai/analyzer";
import { prisma } from "@/lib/db/prisma";

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
          error: `ใช้สิทธิ์ครบ ${MAX_DAILY_USAGE_FREE} ครั้ง/วันแล้ว กรุณาอัปเกรดเป็น Premium`,
          currentUsage,
          limit: MAX_DAILY_USAGE_FREE,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const hskLevel = body.hskLevel ? Number(body.hskLevel) : 5;

    // 3. Fetch weak patterns
    const profile = await prisma.cognitiveProfile.findUnique({
      where: { userId },
      select: { weakPatterns: true },
    });
    
    // Fallback if no profile or weak patterns exist
    let weakPatternsText = "";
    if (profile?.weakPatterns) {
      const patterns = profile.weakPatterns as Array<{ type: string }>;
      if (Array.isArray(patterns)) {
         weakPatternsText = patterns.map(p => p.type).join(", ");
      }
    }

    if (!weakPatternsText) {
      // Fetch from error logs if profile is missing
      const logs = await prisma.errorLog.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      weakPatternsText = logs.map(l => l.errorType).join(", ");
    }

    // 4. Business logic
    const exercises = await generateExercises(weakPatternsText, hskLevel);
    if (!exercises || exercises.length === 0) {
      return NextResponse.json(
        { error: "สร้างแบบฝึกหัดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
        { status: 500 }
      );
    }

    // 5. Increment usage
    await incrementDailyUsage(userId);

    // 6. Return response
    return NextResponse.json({
      success: true,
      result: { exercises },
      usage: currentUsage + 1,
    });
  } catch (err) {
    console.error("[API /api/exercise]", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}
