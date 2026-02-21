"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Login page — Google OAuth + Email Magic Link
 */
export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl });
    } catch (e) {
      setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await signIn("resend", {
        email: email.trim(),
        callbackUrl,
        redirect: false,
      });
      if (res?.ok) {
        setSent(true);
      } else {
        setError(res?.error ?? "ส่งลิงก์ไม่สำเร็จ กรุณาลองใหม่");
      }
    } catch {
      setError("ส่งลิงก์ไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>เข้าสู่ระบบ</CardTitle>
          <CardDescription>ใช้ Google หรืออีเมลรับลิงก์เข้าใช้งาน</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            เข้าสู่ระบบด้วย Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
              <span className="bg-card px-2">หรือ</span>
            </div>
          </div>
          {sent ? (
            <p className="text-center text-sm text-muted-foreground">
              เราได้ส่งลิงก์เข้าสู่ระบบไปที่อีเมลของคุณแล้ว กรุณาตรวจสอบกล่องจดหมาย
            </p>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                ส่งลิงก์เข้าสู่ระบบ
              </Button>
            </form>
          )}
          <p className="text-center text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="text-primary hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
