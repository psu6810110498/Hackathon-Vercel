import { MockExamPlayer } from "@/components/features/mock-exam/MockExamPlayer";
import { H51327 } from "@/lib/hsk/exams/h51327";

export const metadata = {
  title: "Mock Exam | HSK AI Coach",
  description:
    "Complete HSK 5 Mock Exam simulator (H51327) with real-time scoring and AI analysis.",
};

/**
 * Mock Exam Page
 * Renders the high-fidelity HSK exam player.
 */
export default function MockExamPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-7xl">
      <MockExamPlayer exam={H51327} />
    </div>
  );
}
