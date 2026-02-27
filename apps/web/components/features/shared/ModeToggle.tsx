"use client";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

export type AppMode = "WRITING" | "READING";

export interface ModeToggleProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  className?: string;
}

/**
 * Writing / Reading mode toggle
 */
export function ModeToggle({
  mode,
  onModeChange,
  className,
}: ModeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border bg-surface-elevated p-1",
        className
      )}
    >
      <Button
        variant={mode === "WRITING" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("WRITING")}
      >
        การเขียน
      </Button>
      <Button
        variant={mode === "READING" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("READING")}
      >
        การอ่าน
      </Button>
    </div>
  );
}
