import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "Dashboard | HSK AI Coach",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors selection:bg-black/10 selection:text-black">
      {/* Mobile Navigation Bar */}
      <MobileNav />

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto page-enter relative pb-20 pt-[60px] md:pt-0">
        {/* Subtle noisy overlay for modern aesthetic */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none fixed" />

        {/* Ensure children stay within bounds on mobile */}
        <div className="max-w-[100vw] overflow-x-hidden md:max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}
