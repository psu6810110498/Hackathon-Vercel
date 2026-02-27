"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PenTool,
  Layers,
  Timer,
  Settings,
  Bot,
  ShieldAlert,
  History,
} from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Writing Analysis", href: "/dashboard/writing", icon: PenTool },
  { name: "Flashcards", href: "/dashboard/flashcards", icon: Layers },
  { name: "Mock Exam", href: "/dashboard/exercise", icon: Timer },
];

const SECONDARY_ITEMS = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Audit Logs", href: "/dashboard/history", icon: History },
  {
    name: "Privacy & Compliance",
    href: "/dashboard/settings/privacy",
    icon: ShieldAlert,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col pt-6 pb-4 shadow-sm z-40 hidden md:flex">
      {/* Brand */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="bg-primary/10 text-primary p-2 rounded-lg">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold leading-none tracking-tight">
            HSK Coach
          </h2>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1 inline-block">
            Enterprise
          </span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  size={18}
                  className={cn(
                    "relative z-10 transition-transform group-hover:scale-110 duration-300",
                    isActive && "text-primary",
                  )}
                />
                <span className="relative z-10">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-4 mt-auto space-y-1">
        <div className="px-3 py-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          System
        </div>
        {SECONDARY_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon
                  size={18}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
