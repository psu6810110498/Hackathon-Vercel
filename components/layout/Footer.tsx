import Link from "next/link";
import { Command } from "lucide-react";

/**
 * Modern Light Site Footer
 */
export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-zinc-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-black text-white shrink-0 opacity-20">
              <Command size={12} />
            </div>
            <p className="text-xs text-zinc-500 font-medium">
              © {new Date().getFullYear()} Acme Corp. All rights reserved.
            </p>
          </div>

          <div className="flex gap-8 text-[13px] font-medium text-zinc-500">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-black transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="hover:text-black transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
