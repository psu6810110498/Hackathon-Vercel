"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

/**
 * Enterprise Auth Guard HOC
 * Automatically redirects unauthenticated users to the login page
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated && !pathname.startsWith("/login")) {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  // Prevent hydration errors by not rendering anything until mounted
  if (!mounted) return null;

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
