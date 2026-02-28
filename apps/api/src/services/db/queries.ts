/**
 * Reusable database queries for HSK AI Coach
 */

import { prisma } from "./prisma";
import type { Plan, Mode } from "@prisma/client";

const MAX_DAILY_USAGE_FREE = 3;

/**
 * Get user by ID with usage info
 */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      plan: true,
      dailyUsage: true,
      lastUsageDate: true,
    },
  });
}

/**
 * Reset daily usage if last usage was not today (Thai timezone-safe: use UTC date)
 */
export async function ensureDailyUsageFresh(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastUsageDate: true, dailyUsage: true },
  });
  if (!user) return null;

  const now = new Date();
  const last = user.lastUsageDate;
  const sameDay =
    last &&
    last.getUTCFullYear() === now.getUTCFullYear() &&
    last.getUTCMonth() === now.getUTCMonth() &&
    last.getUTCDate() === now.getUTCDate();

  if (!sameDay && user.dailyUsage > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { dailyUsage: 0, lastUsageDate: now },
    });
    return 0;
  }
  return user.dailyUsage;
}

/**
 * Check if user can perform an analysis (usage limit)
 */
export async function canPerformAnalysis(
  userId: string
): Promise<{ allowed: boolean; currentUsage: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, dailyUsage: true, lastUsageDate: true },
  });
  if (!user) {
    return { allowed: false, currentUsage: 0 };
  }

  const now = new Date();
  const last = user.lastUsageDate;
  const sameDay =
    last &&
    last.getUTCFullYear() === now.getUTCFullYear() &&
    last.getUTCMonth() === now.getUTCMonth() &&
    last.getUTCDate() === now.getUTCDate();

  let dailyUsage = user.dailyUsage;
  if (!sameDay) {
    dailyUsage = 0;
    await prisma.user.update({
      where: { id: userId },
      data: { dailyUsage: 0, lastUsageDate: now },
    });
  }

  const allowed =
    user.plan === "PREMIUM" || dailyUsage < MAX_DAILY_USAGE_FREE;
  return { allowed, currentUsage: dailyUsage };
}

/**
 * Increment daily usage after successful analysis
 */
export async function incrementDailyUsage(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      dailyUsage: { increment: 1 },
      lastUsageDate: new Date(),
    },
  });
}

/**
 * Create a new analysis record
 */
export async function createAnalysis(params: {
  userId: string;
  mode: Mode;
  hskLevel: number;
  inputText: string;
  result: object;
  score?: number;
}) {
  return prisma.analysis.create({
    data: params,
  });
}

/**
 * Get analyses for a user (e.g. history page)
 */
export async function getAnalysesByUserId(
  userId: string,
  options?: { limit?: number; offset?: number }
) {
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;
  return prisma.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
    select: {
      id: true,
      mode: true,
      hskLevel: true,
      score: true,
      createdAt: true,
      inputText: true,
    },
  });
}

/** CognitiveProfile weakPatterns item shape */
export interface WeakPatternItem {
  type: string;
  errorRate: number;
  count: number;
}

/**
 * Get or create user cognitive profile
 */
export async function getUserProfile(userId: string) {
  let profile = await prisma.cognitiveProfile.findUnique({
    where: { userId },
  });
  if (!profile) {
    profile = await prisma.cognitiveProfile.create({
      data: { userId },
    });
  }
  return profile;
}

/**
 * Update weak patterns from latest errors (aggregate by type, compute rate)
 */
export async function updateWeakPatterns(
  userId: string,
  errors: Array<{ type: string }>
) {
  const profile = await getUserProfile(userId);
  const typeCounts = new Map<string, number>();
  for (const e of errors) {
    const t = e.type || "อื่นๆ";
    typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1);
  }
  const total = errors.length;
  const weakPatterns: WeakPatternItem[] = Array.from(typeCounts.entries()).map(
    ([type, count]) => ({
      type,
      count,
      errorRate: total > 0 ? Math.round((count / total) * 100) : 0,
    })
  );
  await prisma.cognitiveProfile.update({
    where: { userId },
    data: {
      weakPatterns: weakPatterns as object,
      totalAnalyses: { increment: 1 },
      updatedAt: new Date(),
    },
  });
}

/**
 * Log a single error to ErrorLog
 */
export async function logError(
  userId: string,
  errorData: {
    errorType: string;
    wrongText: string;
    correction: string;
    hskLevel: number;
    context?: string | null;
  }
) {
  return prisma.errorLog.create({
    data: {
      userId,
      errorType: errorData.errorType,
      wrongText: errorData.wrongText,
      correction: errorData.correction,
      hskLevel: errorData.hskLevel,
      context: errorData.context ?? undefined,
    },
  });
}

/**
 * Get top error types for user (by count)
 */
export async function getTopErrors(userId: string, limit = 10) {
  const rows = await prisma.errorLog.groupBy({
    by: ["errorType"],
    where: { userId },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });
  return rows.map((r) => ({ errorType: r.errorType, count: r._count.id }));
}

/**
 * Calculate predicted score from recent analyses (average of last 10 writing scores)
 */
export async function calculatePredictedScore(userId: string): Promise<number | null> {
  const recent = await prisma.analysis.findMany({
    where: { userId, mode: "WRITING", score: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { score: true },
  });
  const scores = recent.map((r) => r.score).filter((s): s is number => s != null);
  if (scores.length === 0) return null;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(avg);
}

/**
 * Update cognitive profile with predicted score (and optional pass date)
 */
export async function updatePredictedScore(
  userId: string,
  predictedScore: number | null,
  predictedPassDate?: Date | null
) {
  await prisma.cognitiveProfile.update({
    where: { userId },
    data: {
      predictedScore: predictedScore ?? undefined,
      predictedPassDate: predictedPassDate ?? undefined,
      updatedAt: new Date(),
    },
  });
}

export { MAX_DAILY_USAGE_FREE };
