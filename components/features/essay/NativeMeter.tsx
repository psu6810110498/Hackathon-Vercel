"use client";

import { cn } from "@/lib/utils/cn";
import { getNativeLabel } from "@/types/analysis";

export interface NativeMeterProps {
  score: number; // 0-100
  className?: string;
}

export function NativeMeter({ score, className }: NativeMeterProps) {
  const { label } = getNativeLabel(score);
  const pct = Math.min(100, Math.max(0, Math.round(score)));

  // Light minimal scale
  const getScaleColor = (p: number) => {
    if (p >= 80) return "#09090B"; // Black
    if (p >= 50) return "#71717A"; // Zinc-500
    return "#A1A1AA"; // Zinc-400
  };

  const color = getScaleColor(pct);

  return (
    <div className={cn("bento-card p-5 md:p-6 page-enter", className)}>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <span className="block text-[13px] md:text-sm font-semibold text-black tracking-wide">
            Native Likelihood
          </span>
          <span className="block text-[9px] md:text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
            Fluency Metric
          </span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl md:text-3xl font-bold tracking-tighter"
              style={{ color }}
            >
              {pct}
            </span>
            <span className="text-[10px] md:text-xs font-mono text-zinc-400">
              %
            </span>
          </div>
          <span
            className="text-[8px] md:text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-widest font-semibold border"
            style={{
              borderColor: `${color}30`,
              backgroundColor: `${color}08`,
              color,
            }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Ultra-minimal track */}
      <div className="h-[2px] w-full bg-zinc-200 relative mb-2">
        <div
          className="absolute top-0 left-0 bottom-0 transition-all duration-[1500ms] ease-out rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
          }}
        />

        {/* Scale Markers */}
        <div className="absolute top-[-3px] left-[25%] h-1.5 w-[1px] bg-zinc-400" />
        <div className="absolute top-[-3px] left-[50%] h-1.5 w-[1px] bg-zinc-400" />
        <div className="absolute top-[-3px] left-[75%] h-1.5 w-[1px] bg-zinc-400" />
      </div>

      <div className="flex justify-between mt-2 text-[9px] font-mono uppercase tracking-widest text-zinc-400">
        <span>Needs Work</span>
        <span className="text-black font-semibold">Native</span>
      </div>
    </div>
  );
}
