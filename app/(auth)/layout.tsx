import { Command } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFA] relative overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo Link */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 group transition-all hover:scale-105 active:scale-95 relative z-10"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-xl shadow-black/10 group-hover:shadow-black/20 transition-all">
          <Command size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-black">
          HSK AI Coach
        </span>
      </Link>

      {/* Main Container */}
      <div className="w-full max-w-[440px] px-4 relative z-10 animate-in fade-in zoom-in duration-500">
        {children}
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center w-full px-4 pointer-events-none opacity-40">
        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-500">
          Powered by DeepSeek & Claude 3.5
        </p>
      </div>
    </div>
  );
}
