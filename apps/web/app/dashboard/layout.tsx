import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { OrgSwitcher } from "@/components/layout/OrgSwitcher";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Dashboard | HSK AI Coach",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors selection:bg-primary/20 selection:text-primary">
        {/* Ambient Chinese Characters - Enterprise Decor */}
        <div className="ambient-character -top-10 -left-10" aria-hidden="true">
          学
        </div>
        <div
          className="ambient-character bottom-0 right-0 md:right-10"
          aria-hidden="true"
        >
          进
        </div>

        <MobileNav />
        <Sidebar />

        {/* Global Toolbar */}
        <div className="fixed top-4 right-4 md:top-6 md:right-8 z-50 flex items-center gap-3">
          <div className="hidden md:block">
            <OrgSwitcher />
          </div>

          <ThemeToggle />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full overflow-y-auto relative pb-24 pt-16 md:pb-6 md:pt-6 md:pl-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
