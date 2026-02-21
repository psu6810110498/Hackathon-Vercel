"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerUser } from "./actions";

/**
 * Register page — Password-based registration
 */
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await registerUser({ name, email, password });
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl overflow-hidden rounded-3xl">
      <CardHeader className="space-y-1 pb-8 pt-8">
        <CardTitle className="text-2xl font-bold tracking-tight text-center text-black">
          สร้างบัญชีใหม่
        </CardTitle>
        <CardDescription className="text-center text-zinc-500 font-light">
          โปรดกรอกข้อมูลเพื่อเริ่มต้นใช้งาน
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pb-10">
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="ชื่อของคุณ"
              className="h-12 rounded-xl bg-zinc-50 border-transparent focus:bg-white focus:border-black/10 transition-all px-4 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              type="email"
              placeholder="อีเมล"
              className="h-12 rounded-xl bg-zinc-50 border-transparent focus:bg-white focus:border-black/10 transition-all px-4 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <Input
              type="password"
              placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
              className="h-12 rounded-xl bg-zinc-50 border-transparent focus:bg-white focus:border-black/10 transition-all px-4 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-black text-white hover:bg-zinc-800 transition-all font-medium active:scale-[0.98] shadow-lg shadow-black/10"
            disabled={loading}
          >
            {loading ? "กำลังสร้างบัญชี..." : "ลงทะเบียน"}
          </Button>
        </form>

        <p className="text-center text-[13px] text-zinc-500 pt-2 font-light">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/login"
            className="text-black font-semibold hover:underline underline-offset-4"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
