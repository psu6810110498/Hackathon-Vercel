import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Register page — redirect to login (NextAuth handles sign-up via Google / Magic Link)
 */
export default function RegisterPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>สมัครสมาชิก</CardTitle>
          <CardDescription>
            ใช้ Google หรืออีเมลเพื่อสร้างบัญชี — ไม่ต้องกรอกรหัสผ่าน
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/login">
            <Button className="w-full">ไปหน้าเข้าสู่ระบบ</Button>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-primary hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
