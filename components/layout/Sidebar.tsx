"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/dashboard", label: "หน้าหลัก" },
  { href: "/history", label: "ประวัติ" },
  { href: "/profile", label: "โปรไฟล์" },
];

/**
 * Side navigation for dashboard
 */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-48 border-r border-border bg-surface-elevated/50 p-4">
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-brand text-primary-foreground"
                : "text-content-secondary hover:bg-surface-overlay hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
