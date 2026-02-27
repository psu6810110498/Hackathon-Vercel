import { cn } from "@/lib/utils/cn";
import type { HSKLevel } from "@/types/analysis";

export interface HSKLevelBadgeProps {
  level: 1 | 2 | 3 | 4 | 5 | 6 | HSKLevel;
  className?: string;
}

/**
 * HSK level indicator badge (HSK 1–6)
 */
export function HSKLevelBadge({ level, className }: HSKLevelBadgeProps) {
  const num = typeof level === "number" ? level : parseInt(level.replace("HSK", ""), 10);
  const label = typeof level === "number" ? `HSK ${level}` : level;
  const variant =
    num === 6
      ? "bg-accentViolet-muted text-accentViolet-DEFAULT border border-accentViolet-DEFAULT/20"
      : num === 5
        ? "bg-brand-muted text-brand border border-brand/20"
        : num === 4
          ? "bg-success-muted text-success border border-success/20"
          : "bg-muted text-muted-foreground border border-border";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant,
        className
      )}
    >
      {label}
    </span>
  );
}
