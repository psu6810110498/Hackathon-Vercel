import Link from "next/link";
import { auth, signOut } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";

/**
 * Top navigation: logo, main links, auth
 */
export async function Navbar() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-[100] h-14 w-full border-b border-border bg-white/85 backdrop-blur-[12px]">
      <div className="container flex h-full items-center justify-between">
        <Link href="/" className="font-semibold text-gradient">
          HSK AI Coach
        </Link>
        <nav className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/dashboard" className="text-sm text-content-secondary hover:text-foreground">
                หน้าหลัก
              </Link>
              <Link href="/history" className="text-sm text-content-secondary hover:text-foreground">
                ประวัติ
              </Link>
              <Link href="/profile" className="text-sm text-content-secondary hover:text-foreground">
                โปรไฟล์
              </Link>
              <form
                action={async () => {
                  await signOut({ redirectTo: "/" });
                }}
                className="inline"
              >
                <Button type="submit" variant="ghost" size="sm">
                  ออกจากระบบ
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">เข้าสู่ระบบ</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">สมัครสมาชิก</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
