"use client";

import { useState, useEffect } from "react";
import { EssayInput } from "@/components/features/writing/EssayInput";
import { ErrorList } from "@/components/features/writing/ErrorList";
import { ScoreCircle } from "@/components/features/shared/ScoreCircle";
import { HSKLevelBadge } from "@/components/features/shared/HSKLevelBadge";
import { LoadingSpinner } from "@/components/features/shared/LoadingSpinner";
import { ModeToggle } from "@/components/features/shared/ModeToggle";
import { PassageInput } from "@/components/features/reading/PassageInput";
import { VocabCard } from "@/components/features/reading/VocabCard";
import { QuestionCard } from "@/components/features/reading/QuestionCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getScoreTotal } from "@/types/analysis";
import type { IWritingAnalysisResult, IReadingAnalysisResult } from "@/types/analysis";
import type { AppMode } from "@/components/features/shared/ModeToggle";

/**
 * Main app: split screen — input left, result right. Writing + Reading toggle.
 */
export default function DashboardPage() {
  const [mode, setMode] = useState<AppMode>("WRITING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [writingResult, setWritingResult] = useState<IWritingAnalysisResult | null>(null);
  const [readingResult, setReadingResult] = useState<IReadingAnalysisResult | null>(null);
  const [usage, setUsage] = useState<{ usage: number; limit: number | null } | null>(null);

  const fetchUsage = async () => {
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();
      if (res.ok) setUsage({ usage: data.usage, limit: data.limit });
    } catch {
      setUsage({ usage: 0, limit: 3 });
    }
  };

  const handleWritingSubmit = async (text: string, hskLevel: 3 | 4 | 5 | 6) => {
    setError("");
    setWritingResult(null);
    setReadingResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, hskLevel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "เกิดข้อผิดพลาด");
        return;
      }
      setWritingResult(data.result);
      setUsage((u) => (u ? { ...u, usage: data.usage ?? u.usage + 1 } : null));
      fetchUsage();
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleReadingSubmit = async (text: string, hskLevel: 1 | 2 | 3 | 4 | 5 | 6) => {
    setError("");
    setWritingResult(null);
    setReadingResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passage: text, hskLevel }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "เกิดข้อผิดพลาด");
        return;
      }
      setReadingResult(data.result);
      setUsage((u) => (u ? { ...u, usage: data.usage ?? u.usage + 1 } : null));
      fetchUsage();
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  // Load usage on mount
  useEffect(() => {
    fetchUsage();
  }, []);

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">วิเคราะห์ HSK</h1>
        <ModeToggle mode={mode} onModeChange={setMode} />
        {usage != null && usage.limit != null && (
          <span className="text-sm text-muted-foreground">
            ใช้แล้ว {usage.usage} / {usage.limit} ครั้งวันนี้
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {mode === "WRITING" ? (
            <EssayInput
              onSubmit={handleWritingSubmit}
              onSwitchToReading={() => setMode("READING")}
              disabled={loading}
            />
          ) : (
            <PassageInput onSubmit={handleReadingSubmit} disabled={loading} />
          )}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoadingSpinner size="sm" />
              กำลังวิเคราะห์...
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <div className="space-y-4">
          {writingResult && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <ScoreCircle score={getScoreTotal(writingResult.score)} />
                  <HSKLevelBadge level={writingResult.level} />
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-thai text-sm">{writingResult.summary}</p>
                  <p className="text-thai text-sm text-muted-foreground">{writingResult.feedback}</p>
                  {writingResult.nativeTip && (
                    <p className="text-thai text-sm text-amber-800/90">
                      <span className="font-medium">เคล็ดลับคนไทย: </span>
                      {writingResult.nativeTip}
                    </p>
                  )}
                </CardContent>
              </Card>
              <div>
                <h3 className="mb-2 font-medium">ข้อผิดพลาดที่พบ</h3>
                <ErrorList errors={writingResult.errors} />
              </div>
            </>
          )}
          {readingResult && (
            <>
              <Card>
                <CardHeader>
                  <HSKLevelBadge level={readingResult.level} />
                  <p className="text-thai text-sm text-muted-foreground">{readingResult.summary}</p>
                </CardHeader>
              </Card>
              <div>
                <h3 className="mb-2 font-medium">คำศัพท์</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {readingResult.vocabulary.map((v, i) => (
                    <VocabCard key={i} vocab={v} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-medium">คำถามความเข้าใจ</h3>
                <div className="space-y-3">
                  {readingResult.questions.map((q, i) => (
                    <QuestionCard key={i} question={q} index={i} />
                  ))}
                </div>
              </div>
            </>
          )}
          {!writingResult && !readingResult && !loading && (
            <Card>
              <CardContent className="text-thai flex min-h-[200px] items-center justify-center py-12 text-muted-foreground">
                ผลการวิเคราะห์จะแสดงที่นี่
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
