import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
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
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-7rem)]">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
