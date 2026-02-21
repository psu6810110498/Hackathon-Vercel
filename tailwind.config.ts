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
        /* Legacy names → map to new palette (light only) */
        border: "#E2E4EF",
        input: "#E2E4EF",
        ring: "#5B6AF0",
        background: "#F7F8FC",
        foreground: "#111827",
        primary: {
          DEFAULT: "#5B6AF0",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          foreground: "#4B5280",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F0F2F8",
          foreground: "#9CA3BF",
        },
        accent: {
          DEFAULT: "#F0F2F8",
          foreground: "#111827",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
        /* New design tokens */
        brand: {
          DEFAULT: "#5B6AF0",
          hover: "#4A58E0",
          muted: "#EEF0FD",
        },
        accentViolet: {
          DEFAULT: "#7C6AF0",
          muted: "#F0EEFE",
        },
        surface: {
          base: "#F7F8FC",
          card: "#FFFFFF",
          elevated: "#F0F2F8",
          overlay: "#E8EAF2",
        },
        content: {
          primary: "#111827",
          secondary: "#4B5280",
          tertiary: "#9CA3BF",
        },
        success: {
          DEFAULT: "#059669",
          muted: "#ECFDF5",
        },
        error: {
          DEFAULT: "#DC2626",
          muted: "#FEF2F2",
        },
        warning: {
          DEFAULT: "#D97706",
          muted: "#FFFBEB",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Thai", "Noto Sans SC", "sans-serif"],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
        "card-hover":
          "0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        brand: "0 4px 12px rgba(91,106,240,0.25)",
        "brand-inset": "inset 0 1px 0 rgba(255,255,255,0.15)",
        input: "0 0 0 3px rgba(91,106,240,0.12)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
