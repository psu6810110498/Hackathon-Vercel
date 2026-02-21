import { cn } from "@/lib/utils/cn";

export interface HSKLevelBadgeProps {
  level: 4 | 5 | 6 | "HSK4" | "HSK5" | "HSK6";
  className?: string;
}

/**
 * HSK level indicator badge
 */
export function HSKLevelBadge({ level, className }: HSKLevelBadgeProps) {
  const label = typeof level === "number" ? `HSK ${level}` : level;
  const variant =
    label === "HSK 6" || label === "HSK6"
      ? "bg-accentViolet-muted text-accentViolet-DEFAULT border border-accentViolet-DEFAULT/20"
      : label === "HSK 5" || label === "HSK5"
        ? "bg-brand-muted text-brand border border-brand/20"
        : "bg-success-muted text-success border border-success/20";

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
