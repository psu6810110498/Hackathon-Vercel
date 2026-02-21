import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { IWritingError } from "@/types/analysis";

export interface ErrorCardProps {
  error: IWritingError;
  index?: number;
  className?: string;
}

/**
 * Single error display (type, original, suggestion, explanation)
 */
export function ErrorCard({ error, index, className }: ErrorCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-border bg-error-muted/50 before:absolute before:left-0 before:right-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-error before:to-transparent before:content-['']", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {index != null && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs font-medium text-amber-900">
              {index + 1}
            </span>
          )}
          <span className="text-sm font-medium text-amber-800">
            {error.type}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">ต้นฉบับ: </span>
          <span className="line-through">{error.original}</span>
        </p>
        <p>
          <span className="text-muted-foreground">แนะนำ: </span>
          <span className="font-medium text-green-700">
            {error.suggestion}
          </span>
        </p>
        <p className="text-thai text-muted-foreground">{error.explanation}</p>
        {error.thaiMistakeTip && (
          <p className="text-thai text-amber-800/90">
            <span className="font-medium">เคล็ดลับคนไทย: </span>
            {error.thaiMistakeTip}
          </p>
        )}
        {error.hskRule && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">กฎ HSK: </span>
            {error.hskRule}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
