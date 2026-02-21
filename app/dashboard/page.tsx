import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import {
  getUserById,
  getAnalysesByUserId,
  getUserProfile,
  getTopErrors,
  ensureDailyUsageFresh,
} from "@/lib/db/queries";
import { DashboardHome } from "@/components/features/dashboard/DashboardHome";

/**
 * Dashboard Overview Page (Server Component)
 * Fetches real usage and progress data from Prisma
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 1. Ensure usage is reset if it's a new day
  await ensureDailyUsageFresh(userId);

  // 2. Parallel data fetching
  const [user, profile, topErrors, recentActivities] = await Promise.all([
    getUserById(userId),
    getUserProfile(userId),
    getTopErrors(userId, 1),
    getAnalysesByUserId(userId, { limit: 5 }),
  ]);

  if (!user) {
    redirect("/login");
  }

  // 3. Prepare data for client component
  const dashboardData = {
    user: {
      name: user.name,
      plan: user.plan,
      dailyUsage: user.dailyUsage,
    },
    stats: {
      predictedScore: profile?.predictedScore ?? null,
      readiness: profile?.predictedScore
        ? Math.round((profile.predictedScore / 300) * 100)
        : 0,
      studyStreak: 1, // Placeholder for streak logic
      topErrorType: topErrors[0]?.errorType ?? null,
    },
    recentActivities: recentActivities.map((a) => ({
      id: a.id,
      mode: a.mode,
      hskLevel: a.hskLevel,
      score: a.score,
      createdAt: a.createdAt,
      inputText: a.inputText,
    })),
  };

  return <DashboardHome data={dashboardData} />;
}
