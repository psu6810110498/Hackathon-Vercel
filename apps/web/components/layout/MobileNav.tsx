"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PenTool, Layers, Timer } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Writing", href: "/dashboard/writing", icon: PenTool },
  { name: "Flash!", href: "/dashboard/flashcards", icon: Layers },
  { name: "Exam", href: "/dashboard/exercise", icon: Timer },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="bg-card/80 backdrop-blur-xl border-t border-border px-4 py-3 flex justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-16 h-12"
            >
              <div className="relative z-10 flex flex-col items-center">
                <Icon
                  size={20}
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] mt-1 font-medium transition-colors duration-300",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hidden sm:block", // hides text on very small screens unless active
                  )}
                >
                  {item.name}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="mobile-active-pill"
                  className="absolute inset-0 bg-primary/10 rounded-xl rounded-b-none border-b-2 border-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
