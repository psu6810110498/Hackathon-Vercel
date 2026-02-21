import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { IReadingVocab } from "@/types/analysis";

export interface VocabCardProps {
  vocab: IReadingVocab;
  className?: string;
}

/**
 * Vocabulary item display (word, pinyin, meaning, example)
 */
export function VocabCard({ vocab, className }: VocabCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="pt-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-lg font-semibold">{vocab.word}</span>
          <span className="text-sm text-muted-foreground">{vocab.pinyin}</span>
        </div>
        <p className="mt-1 text-sm">{vocab.meaning}</p>
        {vocab.example && (
          <p className="mt-2 text-xs italic text-muted-foreground">
            {vocab.example}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
