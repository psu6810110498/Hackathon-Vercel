/**
 * GET /api/usage — Check daily usage (for UI limit display)
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import {
  canPerformAnalysis,
  getUserById,
  MAX_DAILY_USAGE_FREE,
} from "@/lib/db/queries";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบ", usage: 0, limit: MAX_DAILY_USAGE_FREE, plan: "FREE" },
        { status: 401 }
      );
    }

    const user = await getUserById(session.user.id);
    const { allowed, currentUsage } = await canPerformAnalysis(session.user.id);
    const plan = user?.plan ?? "FREE";
    const limit = plan === "PREMIUM" ? null : MAX_DAILY_USAGE_FREE;

    return NextResponse.json({
      usage: currentUsage,
      limit,
      allowed,
      plan,
    });
  } catch (err) {
    console.error("[API /api/usage]", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด", usage: 0, limit: MAX_DAILY_USAGE_FREE, plan: "FREE" },
      { status: 500 }
    );
  }
}
