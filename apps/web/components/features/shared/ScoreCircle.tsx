"use client";

import { cn } from "@/lib/utils/cn";

const SIZE = 120;
const STROKE = 8;
const R = (SIZE - STROKE) / 2;
const CIRCUM = 2 * Math.PI * R;

export interface ScoreCircleProps {
  score: number;
  size?: number;
  className?: string;
}

/**
 * Circular score display (0–100)
 */
export function ScoreCircle({
  score,
  size = SIZE,
  className,
}: ScoreCircleProps) {
  const normalized = Math.min(100, Math.max(0, Math.round(score)));
  const strokeDashoffset = CIRCUM - (normalized / 100) * CIRCUM;
  const color = normalized >= 70 ? "stroke-success" : normalized >= 50 ? "stroke-warning" : "stroke-error";

  const r = (size - STROKE) / 2;
  const circum = 2 * Math.PI * r;
  const offset = circum - (normalized / 100) * circum;

  return (
    <div className={cn("relative inline-flex", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="stroke-[#E8EAF2]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={STROKE}
          strokeDasharray={circum}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-700", color)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
        {normalized}
      </span>
    </div>
  );
}
