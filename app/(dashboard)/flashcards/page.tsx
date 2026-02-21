import { Layers, Clock } from "lucide-react";

/**
 * Flashcards — Coming Soon placeholder
 */
export default function FlashcardsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center page-enter">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5">
        <Layers size={32} />
      </div>
      <h1 className="font-heading text-2xl text-content-primary mb-2">
        Flashcards
      </h1>
      <p className="text-sm text-content-tertiary max-w-md">
        บัตรคำศัพท์ HSK อัจฉริยะ — ใช้ระบบ Spaced Repetition (FSRS)
        ทบทวนคำที่คุณมักลืมก่อน
      </p>
      <div className="flex items-center gap-2 mt-6 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-600">
        <Clock size={14} />
        เร็วๆ นี้
      </div>
    </div>
  );
}
