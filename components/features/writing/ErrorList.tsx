import { ErrorCard } from "./ErrorCard";
import type { IWritingError } from "@/types/analysis";

export interface ErrorListProps {
  errors: IWritingError[];
  className?: string;
}

/**
 * List of all writing errors
 */
export function ErrorList({ errors, className }: ErrorListProps) {
  if (errors.length === 0) {
    return (
      <p className="text-thai text-sm text-muted-foreground">
        ไม่พบข้อผิดพลาดในส่วนนี้ — ทำได้ดีมาก
      </p>
    );
  }
  return (
    <ul className={`space-y-3 ${className ?? ""}`}>
      {errors.map((err, i) => (
        <li key={i}>
          <ErrorCard error={err} index={i} />
        </li>
      ))}
    </ul>
  );
}
