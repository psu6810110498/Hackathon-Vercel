import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { Button } from "@/components/ui/button";

/**
 * Landing page (not protected)
 */
export default async function HomePage() {
  const session = await auth();
  return (
    <div className="container flex flex-col items-center justify-center gap-8 py-24">
      <h1 className="text-4xl font-bold tracking-tight">
        HSK AI Coach
      </h1>
      <p className="max-w-xl text-center text-muted-foreground">
        เตรียมสอบ HSK 4–6 ด้วย AI วิเคราะห์การเขียนและคำศัพท์จากการอ่าน
        เหมาะสำหรับนักเรียนไทย
      </p>
      <div className="flex gap-4">
        {session?.user ? (
          <Link href="/dashboard">
            <Button size="lg">ไปที่หน้าหลัก</Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline" size="lg">เข้าสู่ระบบ</Button>
            </Link>
            <Link href="/register">
              <Button size="lg">สมัครสมาชิก</Button>
            </Link>
          </>
        )}
      </div>
      <ul className="mt-8 grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
        <li className="rounded-lg border p-4">วิเคราะห์บทความเขียน (ไวยากรณ์ คำศัพท์)</li>
        <li className="rounded-lg border p-4">วิเคราะห์บทความอ่าน (คำศัพท์ + คำถาม)</li>
        <li className="rounded-lg border p-4">ฟรี 3 ครั้ง/วัน — Premium 199 บาท/เดือน</li>
      </ul>
    </div>
  );
}
