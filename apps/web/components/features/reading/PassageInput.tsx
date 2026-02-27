"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { MIN_READING_LENGTH, MAX_READING_LENGTH } from "@/lib/utils/validation";

type HskLevelNum = 1 | 2 | 3 | 4 | 5 | 6;

const LEVEL_OPTIONS: { value: HskLevelNum; label: string }[] = [
  { value: 1, label: "HSK 1" },
  { value: 2, label: "HSK 2" },
  { value: 3, label: "HSK 3" },
  { value: 4, label: "HSK 4" },
  { value: 5, label: "HSK 5" },
  { value: 6, label: "HSK 6" },
];

export interface PassageInputProps {
  onSubmit: (text: string, level: HskLevelNum) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Reading passage input + HSK level + submit (HSK 1–6)
 */
export function PassageInput({
  onSubmit,
  disabled = false,
  className,
}: PassageInputProps) {
  const [text, setText] = useState("");
  const [level, setLevel] = useState<HskLevelNum>(5);
  const length = text.trim().length;
  const valid = length >= MIN_READING_LENGTH && length <= MAX_READING_LENGTH;

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (
      trimmed.length >= MIN_READING_LENGTH &&
      trimmed.length <= MAX_READING_LENGTH
    ) {
      onSubmit(trimmed, level);
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
      <div>
        <label className="mb-2 block text-sm font-medium">บทความอ่าน (ภาษาจีน)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="วางบทความที่ต้องการวิเคราะห์คำศัพท์และคำถาม (อย่างน้อย 100 ตัวอักษร)..."
          rows={14}
          className="text-chinese w-full resize-none rounded-xl border border-border bg-surface-card px-5 py-4 placeholder:text-muted-foreground focus:border-primary focus:shadow-input outline-none transition-all"
          disabled={disabled}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {length} / {MAX_READING_LENGTH} ตัวอักษร
          {length > 0 && length < MIN_READING_LENGTH && (
            <span className="text-amber-600"> (อย่างน้อย {MIN_READING_LENGTH})</span>
          )}
        </p>
      </div>
      <Button onClick={handleSubmit} disabled={disabled || !valid}>
        วิเคราะห์การอ่าน
      </Button>
    </div>
  );
}
