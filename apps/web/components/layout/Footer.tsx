import Link from "next/link";
import { Command } from "lucide-react";

/**
 * Modern Light Site Footer — Thai Version
 */
export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-zinc-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-black text-white shrink-0 opacity-30">
              <Command size={12} />
            </div>
            <p className="text-xs text-zinc-500 font-medium">
              © {new Date().getFullYear()} HSK AI Coach — เตรียมสอบ HSK ด้วย AI
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8 text-[13px] font-medium text-zinc-500">
            <Link href="/" className="hover:text-black transition-colors">
              หน้าแรก
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-black transition-colors"
            >
              แดชบอร์ด
            </Link>
            <Link
              href="/dashboard/profile"
              className="hover:text-black transition-colors"
            >
              โปรไฟล์
            </Link>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-6 pt-6 border-t border-black/5 text-center">
          <p className="text-[11px] text-zinc-400 font-mono">
            Built with ❤️ for Thai learners of Chinese — Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
