"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { MIN_ESSAY_LENGTH, MAX_ESSAY_LENGTH } from "@/lib/utils/validation";
import { HSK_CONFIG } from "@/lib/hsk/config";
import type { HSKLevel } from "@/types/analysis";

type HskLevelNum = 1 | 2 | 3 | 4 | 5 | 6;

const LEVEL_OPTIONS: { value: HskLevelNum; label: string }[] = [
  { value: 1, label: "HSK 1" },
  { value: 2, label: "HSK 2" },
  { value: 3, label: "HSK 3" },
  { value: 4, label: "HSK 4" },
  { value: 5, label: "HSK 5" },
  { value: 6, label: "HSK 6" },
];

export interface EssayInputProps {
  /** Called with (essayText, hskLevel) when user submits — only for levels with writing (3–6) */
  onSubmit: (text: string, hskLevel: 3 | 4 | 5 | 6) => void;
  /** Switch to Reading mode (e.g. when HSK 1–2 has no writing) */
  onSwitchToReading?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Essay text area + HSK level + submit. HSK 1–2 show message and "ไปที่ Reading" instead of textarea.
 */
export function EssayInput({
  onSubmit,
  onSwitchToReading,
  disabled = false,
  className,
}: EssayInputProps) {
  const [text, setText] = useState("");
  const [level, setLevel] = useState<HskLevelNum>(5);
  const levelKey: HSKLevel = `HSK${level}` as HSKLevel;
  const config = HSK_CONFIG[levelKey];
  const hasWriting = config.hasWriting;
  const minChars = config.minChars;

  const length = text.trim().length;
  const valid = hasWriting && length >= minChars && length <= MAX_ESSAY_LENGTH;

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (
      hasWriting &&
      trimmed.length >= minChars &&
      trimmed.length <= MAX_ESSAY_LENGTH
    ) {
      onSubmit(trimmed, level as 3 | 4 | 5 | 6);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <label className="mb-2 block text-sm font-medium">ระดับ HSK</label>
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value) as HskLevelNum)}
          className="h-10 rounded-lg border border-border bg-surface-card px-3 py-2 text-sm text-foreground focus:border-primary focus:shadow-input outline-none transition-all"
        >
          {LEVEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {!hasWriting ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface-card py-12 text-center">
          <span className="text-4xl">📖</span>
          <p className="text-content-secondary text-sm">
            HSK {level} ยังไม่มีส่วน Writing
          </p>
          <p className="text-content-tertiary text-xs">
            ลองใช้โหมด Reading แทนครับ
          </p>
          {onSwitchToReading && (
            <Button
              type="button"
              variant="secondary"
              onClick={onSwitchToReading}
              className="mt-2"
            >
              ไปที่ Reading →
            </Button>
          )}
        </div>
      ) : (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium">
              บทความ (ภาษาจีน)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`วางหรือพิมพ์บทความ (อย่างน้อย ${minChars} ตัวอักษร)...`}
              rows={10}
              className="text-chinese w-full resize-none rounded-xl border border-border bg-surface-card px-5 py-4 placeholder:text-muted-foreground focus:border-primary focus:shadow-input outline-none transition-all"
              disabled={disabled}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {length} / {MAX_ESSAY_LENGTH} ตัวอักษร
              {length > 0 && length < minChars && (
                <span className="text-amber-600">
                  {" "}
                  (อย่างน้อย {minChars})
                </span>
              )}
            </p>
          </div>
          <Button onClick={handleSubmit} disabled={disabled || !valid}>
            วิเคราะห์การเขียน
          </Button>
        </>
      )}
    </div>
  );
}
