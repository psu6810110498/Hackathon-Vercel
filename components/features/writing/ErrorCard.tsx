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
    <Card
      className={cn(
        "relative overflow-hidden bg-white border border-black/10 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      {/* Top accent line */}
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-rose-500" />

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center gap-3">
          {index != null && (
            <span className="flex h-5 w-5 items-center justify-center rounded border border-black/10 bg-zinc-50 text-[10px] font-mono font-bold text-black shrink-0">
              {index + 1}
            </span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-black text-white text-[10px] font-mono uppercase tracking-widest font-semibold shadow-sm">
            {error.type}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 text-sm">
        <div className="grid gap-2 p-3 bg-zinc-50 rounded-lg border border-black/5">
          <p className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="text-[9px] font-mono text-rose-600 uppercase tracking-widest font-semibold w-16">
              Remove
            </span>
            <span className="line-through decoration-rose-300 font-chinese md:text-base text-zinc-600 bg-white px-2 py-0.5 rounded border border-black/5 leading-relaxed">
              {error.original}
            </span>
          </p>
          <p className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest font-semibold w-16">
              Accept
            </span>
            <span className="font-medium font-chinese text-emerald-700 md:text-base bg-white px-2 py-0.5 rounded border border-black/5 leading-relaxed">
              {error.suggestion}
            </span>
          </p>
        </div>

        <p className="text-thai text-[13px] md:text-sm text-zinc-700 leading-relaxed font-light mt-4">
          {error.explanation}
        </p>

        {(error.hskRule || error.thaiMistakeTip) && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-black/5 mt-2">
            {error.hskRule && (
              <span className="text-[9px] md:text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                <span className="font-semibold">RULE:</span> {error.hskRule}
              </span>
            )}
            {error.thaiMistakeTip && (
              <span className="text-[9px] md:text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                <span className="font-semibold">TH_CAVEAT:</span>{" "}
                {error.thaiMistakeTip}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
