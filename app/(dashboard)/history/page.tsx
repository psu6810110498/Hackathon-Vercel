import { auth } from "@/lib/auth/config";
import { getAnalysesByUserId } from "@/lib/db/queries";
import { formatRelativeTime } from "@/lib/utils/format";
import { HSKLevelBadge } from "@/components/features/shared/HSKLevelBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

/**
 * User's past analyses (history)
 */
export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const analyses = await getAnalysesByUserId(session.user.id, { limit: 50 });

  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-semibold">ประวัติการวิเคราะห์</h1>
      {analyses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            ยังไม่มีประวัติ — ไปที่{" "}
            <Link href="/dashboard" className="text-primary hover:underline">
              หน้าหลัก
            </Link>{" "}
            เพื่อวิเคราะห์บทความ
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {analyses.map((a) => (
            <li key={a.id}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="flex items-center gap-2">
                    <HSKLevelBadge level={a.hskLevel as 1 | 2 | 3 | 4 | 5 | 6} />
                    <span className="text-sm text-muted-foreground">
                      {a.mode === "WRITING" ? "การเขียน" : "การอ่าน"}
                    </span>
                    {a.score != null && (
                      <span className="text-sm font-medium">คะแนน {a.score}</span>
                    )}
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {formatRelativeTime(a.createdAt)}
                  </time>
                </CardHeader>
                <CardContent className="py-0">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {a.inputText.slice(0, 150)}
                    {a.inputText.length > 150 ? "…" : ""}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
