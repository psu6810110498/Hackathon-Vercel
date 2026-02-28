import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, Noto_Serif_SC } from "next/font/google";
import ClientProviders from "@/components/providers/ClientProviders";
import { ConsentBanner } from "@/components/compliance/ConsentBanner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cjk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HSK AI Coach — Enterprise Preparedness",
  description: "AI-assisted HSK prep with modern SaaS capabilities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is standard for next-themes to prevent mismatch on first load
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${dmSerif.variable} ${notoSerifSC.variable} font-sans bg-background text-foreground antialiased`}
      >
        <ClientProviders>
          {children}
          <ConsentBanner />
        </ClientProviders>
      </body>
    </html>
  );
}
