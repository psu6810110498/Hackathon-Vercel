"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { IReadingQuestion } from "@/types/analysis";

export interface QuestionCardProps {
  question: IReadingQuestion;
  index?: number;
  className?: string;
}

/**
 * Comprehension question (multiple choice) with explanation
 */
export function QuestionCard({
  question,
  index = 0,
  className,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const showResult = selected !== null;
  const correct = selected === question.correctIndex;

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <h4 className="text-sm font-medium">
          {index + 1}. {question.question}
        </h4>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {question.options.map((opt, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                disabled={showResult}
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
                  showResult && i === question.correctIndex && "border-success bg-success-muted",
                  showResult && selected === i && i !== question.correctIndex && "border-error bg-error-muted",
                  !showResult && "hover:bg-muted/50"
                )}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
        {showResult && (
          <p className="text-thai text-sm text-muted-foreground">
            {question.explanation}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
