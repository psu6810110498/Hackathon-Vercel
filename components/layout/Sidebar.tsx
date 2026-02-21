"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  PenLine,
  BookOpen,
  Target,
  Layers,
  BarChart3,
  User,
  ChevronLeft,
  ChevronRight,
  Command,
  BrainCircuit,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/essay", icon: PenLine, label: "Essay Grader" },
  { href: "/dashboard/reading", icon: BookOpen, label: "Reading" },
  { href: "/dashboard/exercise", icon: BrainCircuit, label: "Practice" },
  { href: "/dashboard/mock-exam", icon: Target, label: "Mock Exam" },
  { href: "/dashboard/flashcards", icon: Layers, label: "Flashcards" },
  { href: "/dashboard/progress", icon: BarChart3, label: "Progress" },
];

const HSK_LEVELS = [4, 5, 6] as const;

/**
 * Modern Light Minimalist Sidebar (Desktop Only)
 */
export function Sidebar() {
  const pathname = usePathname();
  const [hskLevel, setHskLevel] = useState<4 | 5 | 6>(5);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col z-40 transition-all duration-300 bg-[#FAFAFA] border-r border-black/5 h-screen",
        collapsed ? "w-[68px]" : "w-[240px]",
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-black/[0.03]">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white shrink-0 shadow-sm">
          <Command size={14} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <h1 className="text-sm font-semibold text-black tracking-wide">
              HSK Coach
            </h1>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            Main Menu
          </p>
        )}
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-black/5 text-black"
                  : "text-zinc-500 hover:text-black hover:bg-black/5",
              )}
            >
              <Icon size={16} className={cn(isActive && "text-black")} />

              {!collapsed && <span>{item.label}</span>}

              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* HSK Level Toggle */}
      <div className="px-3 py-4 border-t border-black/[0.03]">
        {!collapsed && (
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              Target Level
            </p>
          </div>
        )}
        <div
          className={cn(
            "flex gap-1 p-1 rounded-md bg-zinc-100 border border-black/5",
            collapsed && "flex-col items-center",
          )}
        >
          {HSK_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setHskLevel(level)}
              className={cn(
                "flex h-7 items-center justify-center rounded text-xs font-semibold transition-colors shadow-sm",
                collapsed ? "w-7" : "flex-1",
                hskLevel === level
                  ? "bg-white text-black border border-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  : "text-zinc-500 hover:text-black shadow-none border border-transparent hover:bg-black/5",
              )}
            >
              H{level}
            </button>
          ))}
        </div>
      </div>

      {/* Profile / Setting */}
      <div className="p-3 border-t border-black/[0.03] bg-zinc-50">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-black/5",
            collapsed && "justify-center",
          )}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white shrink-0 border border-black/10">
            <User size={14} />
          </div>
          {!collapsed && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-xs font-semibold text-black truncate">
                aphchat
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                Pro Plan
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-md bg-white border border-black/10 text-zinc-400 hover:text-black transition-colors z-50 hover:bg-zinc-50 shadow-sm"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
