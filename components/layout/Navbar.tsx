import Link from "next/link";
import { auth, signOut } from "@/lib/auth/config";
import { Command } from "lucide-react";

/**
 * Modern Light Top Navigation
 */
export async function Navbar() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-[100] h-[60px] w-full border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex h-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Command size={14} />
          </div>
          <span className="font-semibold text-black tracking-wide">
            HSK Coach
          </span>
        </Link>
        <nav className="flex items-center gap-5">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] font-medium text-zinc-600 hover:text-black transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/history"
                className="text-[13px] font-medium text-zinc-600 hover:text-black transition-colors hidden sm:block"
              >
                History
              </Link>
              <div className="h-4 w-[1px] bg-black/10 mx-2 hidden sm:block" />
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
                className="inline"
              >
                <button
                  type="submit"
                  className="text-[13px] font-medium text-zinc-600 hover:text-black transition-colors"
                >
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium text-zinc-600 hover:text-black transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="text-[13px] font-medium bg-black text-white px-4 py-1.5 rounded-md hover:bg-zinc-800 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
