"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInput } from "@hsk/shared";
import * as z from "zod";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";

type RegisterFormValues = z.infer<typeof RegisterInput>;

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterInput),
  });

  const passwordValue = watch("password") || "";

  // Compute password checks
  const passwordChecks = {
    length: passwordValue.length >= 6,
    uppercase: /[A-Z]/.test(passwordValue),
    special: /[^a-zA-Z0-9]/.test(passwordValue),
  };

  // Calculate strength (0 to 3)
  const strength = Object.values(passwordChecks).filter(Boolean).length;

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", data);
      setUser(res.data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { error?: string } } };
      setError(
        errorResponse.response?.data?.error || "การสมัครสมาชิกไม่สำเร็จ",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/google`;
  };

  return (
    <div className="space-y-6 reveal-1">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground">
          เริ่มต้นเตรียมสอบ HSK ไปกับ AI Coach
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center reveal-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 reveal-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">ชื่อ (Name)</label>
          <input
            {...register("name")}
            type="text"
            className="w-full px-3 py-2 bg-transparent border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="ชื่อของคุณ"
          />
          {errors.name && (
            <span className="text-xs text-destructive">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">อีเมล (Email)</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-3 py-2 bg-transparent border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="name@company.com"
          />
          {errors.email && (
            <span className="text-xs text-destructive">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">รหัสผ่าน (Password)</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className={`w-full px-3 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-destructive mt-1 block">
              {errors.password.message}
            </span>
          )}

          {/* Password Strength UI */}
          <div className="pt-2 space-y-2">
            <div className="flex gap-1 h-1.5 w-full">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 rounded-full transition-colors duration-300 ${
                    strength >= step
                      ? strength === 1
                        ? "bg-destructive"
                        : strength === 2
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check
                  size={14}
                  className={
                    passwordChecks.length ? "text-green-500" : "opacity-30"
                  }
                />
                <span>ยาว 6 ตัวอักษรขึ้นไป</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check
                  size={14}
                  className={
                    passwordChecks.uppercase ? "text-green-500" : "opacity-30"
                  }
                />
                <span>พิมพ์ใหญ่ 1 ตัว</span>
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <Check
                  size={14}
                  className={
                    passwordChecks.special ? "text-green-500" : "opacity-30"
                  }
                />
                <span>อักขระพิเศษ 1 ตัว (!@#$%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">
            ยืนยันรหัสผ่าน (Confirm Password)
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showPassword ? "text" : "password"}
              className={`w-full px-3 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-destructive focus:ring-destructive/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-destructive mt-1 block">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-4"
        >
          {isLoading ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก"}
        </button>
      </form>

      <div className="relative reveal-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            หรือ (Enterprise SSO)
          </span>
        </div>
      </div>

      <button
        onClick={loginWithGoogle}
        className="w-full flex items-center justify-center gap-2 border border-input bg-transparent py-2.5 rounded-md font-medium hover:bg-secondary transition-colors reveal-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        ล็อกอินด้วย Google
      </button>

      <p className="text-center text-sm text-muted-foreground reveal-6">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="text-primary hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </div>
  );
}
