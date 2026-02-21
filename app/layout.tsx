import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "HSK AI Coach — เตรียมสอบ HSK ด้วย AI",
  description:
    "แพลตฟอร์มเตรียมสอบ HSK 4-6 สำหรับคนไทย วิเคราะห์การเขียนและการอ่านด้วย AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={sarabun.className}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-7rem)]">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
