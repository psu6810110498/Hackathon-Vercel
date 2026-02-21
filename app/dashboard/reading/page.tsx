"use client";

import { useState } from "react";
import { PassageInput } from "@/components/features/reading/PassageInput";
import { VocabCard } from "@/components/features/reading/VocabCard";
import { QuestionCard } from "@/components/features/reading/QuestionCard";
import type {
  IReadingAnalysisResult,
  IReadingQuestion,
  IDifficultWord,
  IReadingVocab,
} from "@/types/analysis";
import {
  ArrowLeft,
  BookOpen,
  AlertCircle,
  HelpCircle,
  BookType,
} from "lucide-react";

export default function ReadingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<IReadingAnalysisResult | null>(null);
  const [passageText, setPassageText] = useState("");

  const handleSubmit = async (text: string, level: number) => {
    setError("");
    setResult(null);
    setLoading(true);
    setPassageText(text);

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passage: text, hskLevel: level }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "API Error. Please try again.");
        return;
      }
      setResult(data.result);
    } catch {
      setError("Network Error. Please verify connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setPassageText("");
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* ── Page Header ── */}
      <div className="mb-8 md:mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-6">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-black tracking-tight mb-2 leading-none">
            Reading Intelligence
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 max-w-lg font-light leading-relaxed font-mono">
            Advanced reading comprehension analyzer. Summarizes Chinese text,
            extracts vocabulary, and generates test questions.
          </p>
        </div>
        {!result && (
          <div className="mt-4 md:mt-0 flex items-center justify-center md:justify-start gap-2 text-[10px] font-mono text-zinc-500 border border-black/10 px-3 py-1.5 rounded bg-white shadow-sm w-fit mx-auto md:mx-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[pulse_2s_infinite]" />
            ANALYZER_READY
          </div>
        )}
      </div>

      {!result ? (
        <div className="max-w-3xl mx-auto md:mx-0">
          <PassageInput
            onSubmit={handleSubmit}
            disabled={loading}
            className="page-enter"
          />

          {loading && (
            <div className="mt-6 flex flex-col items-center justify-center py-10 bg-zinc-50/50 rounded-xl border border-black/5">
              <span className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-4" />
              <p className="text-xs font-mono text-zinc-500 animate-pulse">
                EXTRACTING_KNOWLEDGE...
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 border border-rose-200 bg-rose-50 text-rose-600 text-[11px] md:text-xs font-mono rounded shadow-sm">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 page-enter">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-black transition-colors font-semibold"
          >
            <ArrowLeft size={12} />
            RETURN_TO_INPUT
          </button>

          <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              {/* Summary Section */}
              <div className="bento-card bg-white border-black/10 p-6">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                  <BookOpen size={16} className="text-blue-600" />
                  สรุปเนื้อหา (Thai Summary)
                </h3>
                <p className="text-zinc-700 leading-relaxed font-thai text-sm md:text-base">
                  {result.summary}
                </p>
              </div>

              {/* Comprehension Questions */}
              {result.questions && result.questions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <HelpCircle size={16} className="text-emerald-600" />
                    คำถามทดสอบความเข้าใจ (Comprehension Questions)
                  </h3>
                  <div className="grid gap-4">
                    {result.questions.map(
                      (q: IReadingQuestion, idx: number) => (
                        <QuestionCard key={idx} question={q} index={idx} />
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6 md:space-y-8">
              {/* Difficult Words (Thai Learners Focus) */}
              {result.difficultWords && result.difficultWords.length > 0 && (
                <div className="bento-card bg-amber-50/50 border-amber-200 p-5">
                  <h3 className="text-[11px] font-mono text-amber-800 uppercase tracking-widest flex items-center gap-2 font-semibold mb-4">
                    <AlertCircle size={14} />
                    คำที่คนไทยมักสับสน
                  </h3>
                  <div className="space-y-4">
                    {result.difficultWords.map(
                      (dw: IDifficultWord, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded border border-amber-100 shadow-sm"
                        >
                          <p className="text-lg font-bold text-amber-900 mb-1">
                            {dw.word}
                          </p>
                          <p className="text-xs text-rose-600 font-medium mb-1 line-through decoration-rose-400">
                            มักแปลผิดว่า: {dw.commonMistake}
                          </p>
                          <p className="text-xs text-emerald-700 font-medium">
                            ความหมายจริง: {dw.correct}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Vocabulary List */}
              {result.vocabulary && result.vocabulary.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <BookType size={16} className="text-purple-600" />
                    คำศัพท์สำคัญ (Key Vocabulary)
                  </h3>
                  <div className="grid gap-3 max-h-[600px] overflow-y-auto align-scrollbar pb-2 pr-1">
                    {result.vocabulary.map((v: IReadingVocab, idx: number) => (
                      <VocabCard key={idx} vocab={v} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
