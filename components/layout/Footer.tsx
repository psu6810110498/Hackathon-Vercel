import Link from "next/link";

/**
 * Site footer
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated/50 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-content-secondary">
          © {new Date().getFullYear()} HSK AI Coach — เตรียมสอบ HSK ด้วย AI
        </p>
        <div className="flex gap-6 text-sm text-content-secondary">
          <Link href="/dashboard" className="hover:text-foreground">หน้าหลัก</Link>
          <Link href="/profile" className="hover:text-foreground">โปรไฟล์</Link>
        </div>
      </div>
    </footer>
  );
}
