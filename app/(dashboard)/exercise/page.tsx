"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BrainCircuit,
  Target,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { IExercise } from "@/types/analysis";

type HskLevelNum = 3 | 4 | 5 | 6;

const LEVEL_OPTIONS: { value: HskLevelNum; label: string }[] = [
  { value: 3, label: "HSK 3" },
  { value: 4, label: "HSK 4" },
  { value: 5, label: "HSK 5" },
  { value: 6, label: "HSK 6" },
];

export default function ExercisePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exercises, setExercises] = useState<IExercise[] | null>(null);
  const [level, setLevel] = useState<HskLevelNum>(5);

  // State for tracking user answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const handleGenerate = async () => {
    setError("");
    setExercises(null);
    setAnswers({});
    setRevealed({});
    setLoading(true);

    try {
      const res = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hskLevel: level }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "API Error. Please try again.");
        return;
      }
      setExercises(data.result.exercises);
    } catch {
      setError("Network Error. Please verify connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (exId: string, ans: string) => {
    if (revealed[exId]) return;
    setAnswers((prev) => ({ ...prev, [exId]: ans }));
  };

  const checkAnswer = (exId: string) => {
    if (!answers[exId]) return;
    setRevealed((prev) => ({ ...prev, [exId]: true }));
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-6">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-black tracking-tight mb-2 leading-none flex items-center gap-3">
            <BrainCircuit className="text-purple-600" size={32} />
            Targeted Practice
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 max-w-lg font-light leading-relaxed font-mono">
            แบบฝึกหัดที่สร้างจากจุดอ่อนของคุณ (Weak Patterns)
            เพื่อเสริมจุดบอดให้ตรงจุด
          </p>
        </div>
      </div>

      {!exercises && !loading ? (
        <div className="bento-card bg-white p-8 md:p-12 text-center max-w-2xl mx-auto border-black/10 page-enter">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="text-purple-600" size={32} />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            เลือกเป้าหมาย HSK ของคุณ
          </h2>
          <p className="text-zinc-500 text-sm mb-8 font-thai">
            AI จะดึงประวัติการเขียนและการอ่านของคุณจากฐานข้อมูล
            เพื่อสร้างแบบฝึกหัดที่ตรงกับจุดที่คุณมักจะทำผิดบ่อยที่สุด
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {LEVEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLevel(opt.value)}
                className={cn(
                  "px-6 py-2 rounded text-sm font-mono transition-all shadow-sm",
                  level === opt.value
                    ? "bg-black text-white border border-transparent"
                    : "bg-white text-zinc-600 border border-black/10 hover:border-black/20 hover:text-black",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full sm:w-auto px-10 py-6 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
          >
            สร้างแบบฝึกหัดเฉพาะคุณ (Generate)
          </Button>

          {error && (
            <div className="mt-6 p-4 border border-rose-200 bg-rose-50 text-rose-600 text-sm font-mono rounded-lg shadow-sm">
              {error}
            </div>
          )}
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-6" />
          <p className="text-sm font-mono text-zinc-500 animate-pulse tracking-widest uppercase">
            Synthesizing Weakness Patterns...
          </p>
        </div>
      ) : (
        <div className="space-y-6 page-enter">
          <button
            onClick={() => setExercises(null)}
            className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-black transition-colors font-semibold mb-2"
          >
            <ArrowLeft size={12} />
            BACK_TO_GENERATOR
          </button>

          <div className="space-y-8">
            {exercises?.map((ex, idx) => {
              const isRevealed = revealed[ex.id];
              const userAns = answers[ex.id] || "";
              const isCorrect = isRevealed && userAns === ex.answer;

              return (
                <div
                  key={ex.id}
                  className={cn(
                    "bento-card p-6 md:p-8 transition-colors duration-300",
                    isRevealed
                      ? isCorrect
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-rose-50/50 border-rose-200"
                      : "bg-white border-black/10",
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-purple-600 bg-purple-50 px-3 py-1 rounded inline-block">
                      {ex.type.replace("-", " ")}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 border border-zinc-200 px-2 py-0.5 rounded">
                      Target: {ex.targetPattern}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-medium text-black mb-6 leading-loose block font-hanzi">
                    {ex.question}
                  </h3>

                  {/* Options (Multiple Choice / Fill Blank Options) */}
                  {ex.options && ex.options.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-3 mb-6">
                      {ex.options.map((opt, i) => {
                        let btnClass =
                          "bg-white border-zinc-200 hover:border-purple-300 hover:bg-purple-50 text-zinc-700";
                        if (userAns === opt) {
                          btnClass =
                            "bg-purple-100 border-purple-400 text-purple-900";
                        }
                        if (isRevealed) {
                          if (opt === ex.answer) {
                            btnClass =
                              "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"; // Correct answer highlight
                          } else if (userAns === opt && userAns !== ex.answer) {
                            btnClass =
                              "bg-rose-100 border-rose-500 text-rose-900"; // Wrong selected highlight
                          } else {
                            btnClass =
                              "bg-zinc-50 border-zinc-200 text-zinc-400 opacity-50"; // Dim others
                          }
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectAnswer(ex.id, opt)}
                            disabled={isRevealed}
                            className={cn(
                              "px-4 py-3 rounded-xl border transition-all text-left text-sm md:text-base cursor-pointer",
                              btnClass,
                            )}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mb-6">
                      <input
                        type="text"
                        value={userAns}
                        onChange={(e) =>
                          handleSelectAnswer(ex.id, e.target.value)
                        }
                        disabled={isRevealed}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                      />
                    </div>
                  )}

                  {/* Check Button */}
                  {!isRevealed && (
                    <Button
                      onClick={() => checkAnswer(ex.id)}
                      disabled={!userAns}
                      className="w-full sm:w-auto"
                      variant="outline"
                    >
                      ตรวจคำตอบ (Check Answer)
                    </Button>
                  )}

                  {/* Explanation Section */}
                  {isRevealed && (
                    <div className="mt-6 pt-6 border-t border-black/5 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="flex items-center gap-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle2
                            className="text-emerald-500"
                            size={20}
                          />
                        ) : (
                          <XCircle className="text-rose-500" size={20} />
                        )}
                        <span
                          className={cn(
                            "font-semibold text-lg",
                            isCorrect ? "text-emerald-700" : "text-rose-700",
                          )}
                        >
                          {isCorrect
                            ? "ถูกต้อง! (Correct)"
                            : "ยังไม่ถูก (Incorrect)"}
                        </span>
                      </div>

                      {!isCorrect && (
                        <div className="mb-3 text-sm">
                          <span className="text-zinc-500">
                            คำตอบที่ถูกคือ:{" "}
                          </span>
                          <span className="font-bold text-emerald-600">
                            {ex.answer}
                          </span>
                        </div>
                      )}

                      <div className="bg-white/50 rounded-lg p-4 text-sm md:text-base text-zinc-700 leading-relaxed font-thai">
                        <span className="font-semibold block mb-1">
                          คำอธิบาย:
                        </span>
                        {ex.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
