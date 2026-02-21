import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        success: {
          DEFAULT: "#10B981",
          muted: "rgba(16, 185, 129, 0.1)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          muted: "rgba(245, 158, 11, 0.1)",
        },
        error: {
          DEFAULT: "#EF4444",
          muted: "rgba(239, 68, 68, 0.1)",
        },
        brand: {
          DEFAULT: "#0070F3", // Vercel Blue
          hover: "#0060E5",
          muted: "rgba(0, 112, 243, 0.1)",
        }
      },
      fontFamily: {
        sans: ["Geist", "Noto Sans Thai", "system-ui", "sans-serif"],
        heading: ["Geist", "system-ui", "sans-serif"],
        hanzi: ["Noto Serif TC", "Noto Sans SC", "serif"],
        chinese: ["Noto Sans SC", "sans-serif"],
        thai: ["Noto Sans Thai", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
        glow: "0 0 16px rgba(0, 112, 243, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
