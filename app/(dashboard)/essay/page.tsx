"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ScoreCard } from "@/components/features/essay/ScoreCard";
import { NativeMeter } from "@/components/features/essay/NativeMeter";
import { HanziHighlight } from "@/components/features/essay/HanziHighlight";
import { ErrorList } from "@/components/features/writing/ErrorList";
import { LoadingSpinner } from "@/components/features/shared/LoadingSpinner";
import { HSK_CONFIG } from "@/lib/hsk/config";
import { getScoreTotal, getSeverityInfo } from "@/types/analysis";
import type {
  IWritingAnalysisResult,
  IScoreBreakdown,
  HSKLevel,
} from "@/types/analysis";
import {
  Sparkles,
  Command,
  CheckCircle2,
  Copy,
  ArrowLeft,
  ArrowRight,
  CornerDownRight,
} from "lucide-react";

type HskLevelNum = 3 | 4 | 5 | 6;
type ViewMode = "original" | "rewrite";

const LEVEL_OPTIONS: { value: HskLevelNum; label: string }[] = [
  { value: 4, label: "HSK 4" },
  { value: 5, label: "HSK 5" },
  { value: 6, label: "HSK 6" },
];

const OPTIMAL_RANGES: Record<number, { min: number; max: number }> = {
  4: { min: 80, max: 120 },
  5: { min: 120, max: 200 },
  6: { min: 200, max: 400 },
};

export default function EssayPage() {
  const [text, setText] = useState("");
  const [level, setLevel] = useState<HskLevelNum>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<IWritingAnalysisResult | null>(null);
  const [essayText, setEssayText] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("original");

  const levelKey: HSKLevel = `HSK${level}` as HSKLevel;
  const config = HSK_CONFIG[levelKey];
  const minChars = config.minChars;
  const optimal = OPTIMAL_RANGES[level] || { min: 80, max: 200 };
  const length = text.trim().length;
  const valid = length >= minChars && length <= 2000;

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!valid) return;

    setError("");
    setResult(null);
    setLoading(true);
    setEssayText(trimmed);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, hskLevel: level }),
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
    setEssayText("");
    setText("");
    setViewMode("original");
  };

  const scoreBreakdown: IScoreBreakdown | null =
    result && typeof result.score === "object"
      ? (result.score as IScoreBreakdown)
      : result
        ? {
            total: getScoreTotal(result.score),
            grammar: 0,
            vocabulary: 0,
            coherence: 0,
            native: 0,
            passed: getScoreTotal(result.score) >= 60,
          }
        : null;

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* ── Page Header ── */}
      <div className="mb-8 md:mb-10 text-center md:text-left page-enter flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-6 md:pb-8">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-black tracking-tight mb-2 leading-none">
            Essay Intelligence
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 max-w-lg font-light leading-relaxed font-mono">
            Modern writing analysis engine. Paste your Chinese essay below for a
            4-dimensional breakdown and native-certified rewrite.
          </p>
        </div>
        {!result && (
          <div className="mt-4 md:mt-0 flex items-center justify-center md:justify-start gap-2 text-[10px] font-mono text-zinc-500 border border-black/10 px-3 py-1.5 rounded bg-white shadow-sm w-fit mx-auto md:mx-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_infinite]" />
            ENGINE_READY
          </div>
        )}
      </div>

      {!result ? (
        /* ═══════════════════════════════
           PRE-SUBMIT (Editor State)
           ═══════════════════════════════ */
        <div className="max-w-3xl mx-auto md:mx-0 page-enter">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
              Select Level
            </span>
          </div>

          <div className="flex gap-2 mb-6 md:mb-8">
            {LEVEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLevel(opt.value)}
                className={cn(
                  "px-4 md:px-6 py-2 rounded text-xs font-mono transition-all shadow-sm",
                  level === opt.value
                    ? "bg-black text-white border border-transparent shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                    : "bg-white text-zinc-600 border border-black/10 hover:border-black/20 hover:text-black",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative group shadow-sm bg-white rounded-xl border border-black/10 transition-colors focus-within:border-black/30 overflow-hidden">
            <div className="bg-zinc-50 px-3 md:px-4 py-2 border-b border-black/5 flex justify-between items-center text-[9px] md:text-[10px] font-mono text-zinc-500">
              <span className="font-semibold text-black">INPUT_BUFFER</span>
              <span
                className={cn(
                  "font-medium",
                  length === 0
                    ? "text-zinc-500"
                    : length < minChars
                      ? "text-rose-600"
                      : length <= optimal.max
                        ? "text-emerald-600"
                        : "text-amber-600",
                )}
              >
                {length.toLocaleString()}/{optimal.max} CHARS
              </span>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing in Chinese...&#10;&#10;(e.g., 生活中，我们每天都会面临各种各样的选择...)"
              rows={12}
              className="w-full resize-none bg-transparent px-4 md:px-6 py-5 md:py-6 text-lg md:text-xl leading-relaxed text-black font-hanzi font-light placeholder:text-zinc-400 focus:outline-none"
              disabled={loading}
            />

            <div className="bg-zinc-50/80 border-t border-black/5 px-3 md:px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[10px] font-mono text-zinc-600 font-medium w-full sm:w-auto text-center sm:text-left">
                {length < minChars ? `REQ_+${minChars - length}` : `LENGTH_OK`}
              </span>

              <button
                onClick={handleSubmit}
                disabled={loading || !valid}
                className={cn(
                  "flex items-center justify-center gap-2 rounded px-6 py-2 md:py-2.5 text-xs font-mono transition-all w-full sm:w-auto shadow-sm",
                  valid && !loading
                    ? "bg-black text-white hover:bg-zinc-800 border border-transparent"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed border border-black/5 shadow-none",
                )}
              >
                {loading ? (
                  "ANALYZING..."
                ) : (
                  <>
                    EXECUTE <CornerDownRight size={12} />
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 border border-rose-200 bg-rose-50 text-rose-600 text-[11px] md:text-xs font-mono rounded shadow-sm">
              {error}
            </div>
          )}
        </div>
      ) : (
        /* ═══════════════════════════════
           POST-SUBMIT (Analysis Display)
           ═══════════════════════════════ */
        <div className="space-y-6">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-black transition-colors mb-4 md:mb-6 font-semibold"
          >
            <ArrowLeft size={12} />
            RETURN_TO_EDITOR
          </button>

          <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
            <div className="lg:col-span-4 space-y-4 md:space-y-6">
              <div className="reveal-1">
                {scoreBreakdown && <ScoreCard score={scoreBreakdown} />}
              </div>

              {result.nativeScore != null && (
                <div className="reveal-1" style={{ animationDelay: "100ms" }}>
                  <NativeMeter score={result.nativeScore} />
                </div>
              )}

              {result.fixPriorities && result.fixPriorities.length > 0 && (
                <div className="reveal-2 bento-card p-5 md:p-6 bg-blue-50/50 border-blue-100">
                  <h3 className="text-[10px] font-mono text-blue-700 mb-4 md:mb-5 uppercase tracking-widest flex items-center gap-2 font-semibold">
                    <Command size={12} /> Priority Fixes
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {result.fixPriorities.map((fp, i) => (
                      <div key={i} className="flex items-start gap-3 md:gap-4">
                        <span className="flex h-5 w-5 items-center justify-center rounded border border-blue-200 bg-white shadow-sm text-[10px] font-mono text-blue-700 shrink-0 font-bold">
                          0{i + 1}
                        </span>
                        <div>
                          <p className="text-[12px] md:text-[13px] text-zinc-800 font-semibold leading-snug mb-1">
                            {fp.issue}
                          </p>
                          <p className="text-[11px] text-zinc-500 leading-snug">
                            {fp.suggestion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-8 space-y-5 md:space-y-6">
              {/* ── Summary Terminal ── */}
              <div className="reveal-3 bento-card border-black/10 bg-white">
                <div className="flex gap-2 p-3 border-b border-black/5 bg-zinc-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[inset_0_1px_rgba(255,255,255,0.4)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[inset_0_1px_rgba(255,255,255,0.4)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[inset_0_1px_rgba(255,255,255,0.4)]" />
                  <div className="ml-2 text-[9px] font-mono text-zinc-400 mt-[1px]">
                    Terminal_Out
                  </div>
                </div>
                <div className="p-4 md:p-6 space-y-4">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase mb-2 font-semibold">
                      {"// ANALYSIS_SUMMARY"}
                    </p>
                    <p className="text-[13px] md:text-[14px] text-zinc-700 leading-relaxed font-thai font-light">
                      {result.summary}
                    </p>
                  </div>
                  {result.nativeTip && (
                    <div className="pt-3 border-t border-black/5 mt-4">
                      <p className="text-[10px] text-blue-600 font-mono uppercase mb-2 font-semibold">
                        {"// NATIVE_SUGGESTION_THAI"}
                      </p>
                      <p className="text-[13px] md:text-[14px] text-zinc-700 leading-relaxed font-thai font-light bg-blue-50/50 p-2.5 rounded border border-blue-100/50">
                        {result.nativeTip}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Interactive View Modes ── */}
              <div className="reveal-3">
                <div className="flex items-center gap-1 mb-4 md:mb-6 border-b border-zinc-200 pb-2 overflow-x-auto align-scrollbar">
                  {(
                    [
                      { key: "original" as ViewMode, label: "ORIGINAL_TEXT" },
                      { key: "rewrite" as ViewMode, label: "AI_REWRITE" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setViewMode(tab.key)}
                      className={cn(
                        "px-3 md:px-4 py-1.5 md:py-2 rounded text-[9px] md:text-[10px] font-mono tracking-widest transition-all shrink-0 font-semibold shadow-sm border",
                        viewMode === tab.key
                          ? "bg-black text-white border-transparent"
                          : "bg-white text-zinc-500 border-black/10 hover:text-black hover:border-black/20 hover:bg-zinc-50",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {viewMode === "original" ? (
                  <HanziHighlight text={essayText} errors={result.errors} />
                ) : result.rewrite ? (
                  <div className="bento-card p-5 md:p-8 lg:p-10 page-enter bg-white border-emerald-500/20 shadow-[0_4px_24px_rgba(16,185,129,0.05)]">
                    <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-black/5 pb-4">
                      <div>
                        <span className="block text-[13px] md:text-sm font-semibold text-black">
                          Native Rewrite
                        </span>
                        <span className="block text-[9px] md:text-[10px] font-mono text-emerald-600 uppercase tracking-widest mt-0.5 font-bold">
                          Optimized Version
                        </span>
                      </div>
                      <button className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center rounded border border-black/5 hover:bg-zinc-50 text-zinc-500 hover:text-black transition-colors">
                        <Copy size={14} />
                      </button>
                    </div>

                    <div className="text-hanzi text-lg md:text-xl lg:text-2xl leading-[2.0] md:leading-[2.2] tracking-wider text-black font-light">
                      {result.rewrite}
                    </div>
                  </div>
                ) : (
                  <div className="bento-card p-8 text-center border-dashed border-zinc-300 bg-zinc-50/50">
                    <p className="text-[10px] font-mono text-zinc-500">
                      NO_REWRITE_DATA_AVAILABLE
                    </p>
                  </div>
                )}
              </div>

              {/* ── Error List ── */}
              {result.errors.length > 0 && (
                <div className="reveal-4 pt-4">
                  <h3 className="text-[10px] font-mono text-zinc-500 mb-3 tracking-widest uppercase font-semibold pl-1">
                    {"// ERROR_LOG_DUMP"}
                  </h3>
                  <div className="grid gap-2 max-h-[500px] overflow-y-auto align-scrollbar pb-4 pr-1">
                    <ErrorList errors={result.errors} />
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
