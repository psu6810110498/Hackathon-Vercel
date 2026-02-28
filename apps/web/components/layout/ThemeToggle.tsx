"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="rounded-full w-10 h-10 flex items-center justify-center bg-card border border-border text-muted-foreground shadow-sm">
        <div className="w-5 h-5" />
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 flex items-center justify-center bg-card border border-border text-foreground shadow-sm hover:bg-secondary transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="w-5 h-5 text-accent" />
      ) : (
        <Sun className="w-5 h-5 text-gold-500" />
      )}
    </button>
  );
}
