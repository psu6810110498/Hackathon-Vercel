"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { MIN_ESSAY_LENGTH, MAX_ESSAY_LENGTH } from "@/lib/utils/validation";

export interface EssayInputProps {
  /** Called with (essayText, hskLevel) when user submits */
  onSubmit: (text: string, hskLevel: 4 | 5 | 6) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Essay text area + HSK level + submit controls
 */
export function EssayInput({
  onSubmit,
  disabled = false,
  className,
}: EssayInputProps) {
  const [text, setText] = useState("");
  const [level, setLevel] = useState<4 | 5 | 6>(5);
  const length = text.trim().length;
  const valid = length >= MIN_ESSAY_LENGTH && length <= MAX_ESSAY_LENGTH;

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length >= MIN_ESSAY_LENGTH && trimmed.length <= MAX_ESSAY_LENGTH) {
      onSubmit(trimmed, level);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <label className="mb-2 block text-sm font-medium">ระดับ HSK</label>
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value) as 4 | 5 | 6)}
          className="h-10 rounded-lg border border-border bg-surface-card px-3 py-2 text-sm text-foreground focus:border-primary focus:shadow-input outline-none transition-all"
        >
          <option value={4}>HSK 4</option>
          <option value={5}>HSK 5</option>
          <option value={6}>HSK 6</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">บทความ (ภาษาจีน)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="วางหรือพิมพ์บทความที่ต้องการวิเคราะห์ (อย่างน้อย 50 ตัวอักษร)..."
          rows={10}
          className="text-chinese w-full resize-none rounded-xl border border-border bg-surface-card px-5 py-4 placeholder:text-muted-foreground focus:border-primary focus:shadow-input outline-none transition-all"
          disabled={disabled}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {length} / {MAX_ESSAY_LENGTH} ตัวอักษร
          {length > 0 && length < MIN_ESSAY_LENGTH && (
            <span className="text-amber-600"> (อย่างน้อย {MIN_ESSAY_LENGTH})</span>
          )}
        </p>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={disabled || !valid}
      >
        วิเคราะห์การเขียน
      </Button>
    </div>
  );
}
