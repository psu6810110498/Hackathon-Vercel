"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  Menu,
  X,
  Command,
  LayoutDashboard,
  PenLine,
  BookOpen,
  Target,
  Layers,
  BarChart3,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/essay", icon: PenLine, label: "Essay Grader" },
  { href: "/dashboard/reading", icon: BookOpen, label: "Reading" },
  { href: "/dashboard/mock-exam", icon: Target, label: "Mock Exam" },
  { href: "/dashboard/flashcards", icon: Layers, label: "Flashcards" },
  { href: "/dashboard/progress", icon: BarChart3, label: "Progress" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-[60px] bg-white/80 backdrop-blur-md border-b border-black/5 z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white shrink-0">
            <Command size={14} />
          </div>
          <span className="text-sm font-semibold tracking-wide text-black">
            HSK Coach
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -mr-2 text-zinc-600 hover:text-black transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Fullscreen Overlay Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-[60px] bg-white z-40 overflow-y-auto page-enter border-t border-black/5 flex flex-col">
          <div className="flex-1 py-6 px-4 space-y-2">
            <p className="px-2 text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-widest mb-4">
              Navigation
            </p>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-black/5 text-black font-semibold"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-black",
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(isActive ? "text-black" : "text-zinc-400")}
                  />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="p-6 border-t border-black/5 bg-zinc-50 mt-auto">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-200 border border-black/10 flex items-center justify-center text-zinc-600">
                A
              </div>
              <div>
                <p className="text-sm font-semibold text-black">aphchat</p>
                <p className="text-[11px] font-mono text-zinc-500">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
