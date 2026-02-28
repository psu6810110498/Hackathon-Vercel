import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Enterprise Theme Toggle */}
      <div className="absolute top-4 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Ambient Chinese Character Decor (WCAG AA Compliant: hidden from screen readers & interactions) */}
      <div className="ambient-character -top-20 -left-10" aria-hidden="true">
        学
      </div>
      <div className="ambient-character bottom-0 -right-20" aria-hidden="true">
        进
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        {/* Modern Panel Container */}
        <div className="modern-panel dark:bg-card dark:border-white/5 p-8 rounded-2xl w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
