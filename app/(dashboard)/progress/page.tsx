import { BarChart3, Clock } from "lucide-react";

/**
 * Progress — Coming Soon placeholder
 */
export default function ProgressPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center page-enter">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5">
        <BarChart3 size={32} />
      </div>
      <h1 className="font-heading text-2xl text-content-primary mb-2">
        Progress
      </h1>
      <p className="text-sm text-content-tertiary max-w-md">
        ติดตามพัฒนาการของคุณในทุกมิติ — Grammar, Vocab, Writing, Reading พร้อม
        error trend chart
      </p>
      <div className="flex items-center gap-2 mt-6 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-600">
        <Clock size={14} />
        เร็วๆ นี้
      </div>
    </div>
  );
}
