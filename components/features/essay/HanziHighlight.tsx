"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import type { IWritingError } from "@/types/analysis";
import { Copy, AlertCircle, CheckCircle2 } from "lucide-react";

export interface HanziHighlightProps {
  text: string;
  errors: IWritingError[];
  className?: string;
}

interface TextSegment {
  text: string;
  error?: IWritingError;
}

export function HanziHighlight({
  text,
  errors,
  className,
}: HanziHighlightProps) {
  const [activeError, setActiveError] = useState<IWritingError | null>(null);

  const segments: TextSegment[] = useMemo(() => {
    const positioned = errors
      .filter(
        (e) =>
          e.position &&
          e.position.start >= 0 &&
          e.position.end > e.position.start,
      )
      .sort((a, b) => a.position!.start - b.position!.start);

    if (positioned.length === 0) return [{ text }];

    const result: TextSegment[] = [];
    let cursor = 0;

    for (const err of positioned) {
      const start = err.position!.start;
      const end = Math.min(err.position!.end, text.length);

      if (start < cursor) continue;
      if (start > cursor) {
        result.push({ text: text.slice(cursor, start) });
      }
      result.push({ text: text.slice(start, end), error: err });
      cursor = end;
    }
    if (cursor < text.length) result.push({ text: text.slice(cursor) });
    return result;
  }, [text, errors]);

  const getHighlightColor = (category?: string) => {
    // Monochromatic sleek highlights for light mode
    return "text-black bg-zinc-100 border-b border-zinc-300 hover:bg-zinc-200";
  };

  return (
    <div className={cn("relative", className)}>
      <div className="bento-card p-5 md:p-8 lg:p-10 page-enter">
        <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-black/5 pb-4">
          <div>
            <span className="block text-[13px] md:text-sm font-semibold text-black">
              Analysis Results
            </span>
            <span className="block text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
              {errors.length} Issues Detected
            </span>
          </div>
          <button className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center rounded border border-black/5 hover:bg-zinc-50 text-zinc-500 hover:text-black transition-colors">
            <Copy size={14} />
          </button>
        </div>

        <div className="text-hanzi text-lg md:text-xl lg:text-2xl leading-[2.0] md:leading-[2.2] tracking-wider text-zinc-800 font-light">
          {segments.map((seg, i) =>
            seg.error ? (
              <span
                key={i}
                className={cn(
                  "cursor-pointer rounded-sm px-1 py-0.5 mx-[2px] transition-all duration-200 inline-block align-baseline",
                  getHighlightColor(seg.error.category),
                  activeError?.id === seg.error.id &&
                    "bg-black text-white font-medium border-black shadow-md scale-105",
                )}
                onClick={() =>
                  setActiveError(
                    activeError?.id === seg.error!.id ? null : seg.error!,
                  )
                }
              >
                {seg.text}
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </div>
      </div>

      {activeError && (
        <div className="mt-4 modern-panel p-4 md:p-5 rounded-xl reveal-1 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-6">
            {/* Left: Before/After */}
            <div className="flex-shrink-0 w-full md:w-[240px] space-y-3 p-3 md:p-4 bg-zinc-50 rounded-lg border border-black/5">
              <div>
                <span className="flex items-center gap-1.5 text-[9px] font-mono font-medium text-rose-600 uppercase tracking-widest mb-1.5">
                  <AlertCircle size={12} /> Remove
                </span>
                <span className="text-zinc-600 line-through decoration-rose-300 font-chinese text-sm md:text-base block bg-white px-2 py-1.5 rounded border border-black/5 shadow-sm">
                  {activeError.original}
                </span>
              </div>
              <div className="mt-3">
                <span className="flex items-center gap-1.5 text-[9px] font-mono font-semibold text-emerald-600 uppercase tracking-widest mb-1.5">
                  <CheckCircle2 size={12} /> Suggestion
                </span>
                <span className="text-emerald-700 font-medium font-chinese text-sm md:text-base block bg-white px-2 py-1.5 rounded border border-black/5 shadow-sm">
                  {activeError.suggestion}
                </span>
              </div>
            </div>

            {/* Right: Explanation */}
            <div className="flex-1 space-y-3 md:space-y-4 py-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-1 rounded bg-black text-white text-[9px] font-mono uppercase tracking-widest font-semibold shadow-sm">
                  {activeError.type}
                </span>
                <button
                  onClick={() => setActiveError(null)}
                  className="text-zinc-400 hover:text-black transition-colors"
                >
                  <span className="text-[10px] md:text-xs font-mono">
                    CLOSE(Esc)
                  </span>
                </button>
              </div>

              <p className="text-thai text-[13px] md:text-[14px] text-zinc-700 leading-relaxed font-light">
                {activeError.explanation}
              </p>

              {(activeError.hskRule || activeError.thaiMistakeTip) && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-black/5">
                  {activeError.hskRule && (
                    <span className="text-[9px] md:text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                      RULE: {activeError.hskRule}
                    </span>
                  )}
                  {activeError.thaiMistakeTip && (
                    <span className="text-[9px] md:text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                      TH_CAVEAT: {activeError.thaiMistakeTip}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
