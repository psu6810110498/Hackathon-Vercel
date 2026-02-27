"use client";

import { cn } from "@/lib/utils/cn";
import type { IScoreBreakdown } from "@/types/analysis";

const SIZE = 120; // Slightly smaller for mobile-first
const STROKE = 4;

interface ScoreBarProps {
  label: string;
  score: number;
  max: number;
  delay?: number;
}

function ScoreBar({ label, score, max, delay = 0 }: ScoreBarProps) {
  const pct = Math.round((score / max) * 100);

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-zinc-500 uppercase tracking-widest text-[9px] md:text-[10px]">
          {label}
        </span>
        <span className="font-mono text-black font-semibold">
          {score}
          <span className="text-zinc-400 font-normal">/{max}</span>
        </span>
      </div>
      <div className="h-1 w-full bg-zinc-100 overflow-hidden rounded-full">
        <div
          className="h-full bg-black transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

export interface ScoreCardProps {
  score: IScoreBreakdown;
  className?: string;
}

/**
 * Modern Light Minimalist Score Display
 */
export function ScoreCard({ score, className }: ScoreCardProps) {
  const r = (SIZE - STROKE) / 2;
  const circum = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score.total));
  const offset = circum - (pct / 100) * circum;

  const getScoreColor = (p: number) => {
    if (p >= 80) return "#09090B"; // Black
    if (p >= 60) return "#52525B"; // Zinc-600
    return "#A1A1AA"; // Zinc-400
  };

  const scoreColor = getScoreColor(pct);

  return (
    <div className={cn("bento-card p-5 md:p-6 page-enter", className)}>
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Minimal Circle */}
        <div
          className="relative flex-shrink-0 flex items-center justify-center"
          style={{ width: SIZE, height: SIZE }}
        >
          <svg width={SIZE} height={SIZE} className="rotate-[-90deg]">
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={r}
              fill="none"
              strokeWidth={STROKE}
              className="stroke-zinc-100"
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={r}
              fill="none"
              strokeWidth={STROKE}
              strokeDasharray={circum}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke={scoreColor}
              className="transition-all duration-[1500ms] ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl font-bold tracking-tighter text-black font-heading leading-none">
              {score.total}
            </span>
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
              Score
            </span>
          </div>
        </div>

        {/* Minimal Score Bars */}
        <div className="flex-1 w-full space-y-3 pt-1">
          <ScoreBar
            label="Grammar Struct"
            score={score.grammar}
            max={25}
            delay={100}
          />
          <ScoreBar
            label="Vocab Range"
            score={score.vocabulary}
            max={25}
            delay={250}
          />
          <ScoreBar
            label="Coherence Flow"
            score={score.coherence}
            max={25}
            delay={400}
          />
          <ScoreBar
            label="Native Context"
            score={score.native}
            max={25}
            delay={550}
          />
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-black/5 flex items-center gap-2">
        <div
          className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse",
            score.passed ? "bg-black" : "bg-amber-500",
          )}
        />
        <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">
          {score.passed
            ? "HSK Passing Criteria Met"
            : "Requires Further Practice"}
        </span>
      </div>
    </div>
  );
}
