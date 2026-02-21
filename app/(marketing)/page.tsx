import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * Modern Light Landing Page
 */
export default async function HomePage() {
  const session = await auth();
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 py-20 bg-white relative overflow-hidden page-enter">
      {/* Aesthetic Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-[100%] blur-[80px] pointer-events-none" />

      <div className="text-center max-w-3xl relative z-10 w-full mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-black/5 mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-[pulse_2s_infinite]" />
          <span className="text-[10px] font-mono font-medium text-zinc-600 uppercase tracking-widest">
            HSK 4-6 Engine Live
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-6 leading-[1.1]">
          Master Chinese <br className="hidden md:block" />
          <span className="text-zinc-400">with Native Intelligence.</span>
        </h1>

        <p className="max-w-xl mx-auto text-lg md:text-xl text-zinc-500 mb-10 font-light leading-relaxed">
          The most advanced AI writing and reading analysis platform designed
          specifically for Thai learners tackling HSK 4-6.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 rounded-lg font-medium hover:bg-zinc-800 transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
            >
              Enter Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 rounded-lg font-medium hover:bg-zinc-800 transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
              >
                Start for Free <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black border border-black/10 px-8 py-3.5 rounded-lg font-medium hover:bg-zinc-50 transition-colors shadow-sm"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10 px-4">
        <FeatureCard
          title="Writing Analysis"
          desc="4-dimensional grading on grammar, vocabulary, coherence, and native context."
        />
        <FeatureCard
          title="Reading Comprehension"
          desc="AI-generated questions based on extracted vocabulary tailored to your exact level."
        />
        <FeatureCard
          title="Accessible Pricing"
          desc="3 free analyses daily. Upgrade to Premium for unlimited access at 199 THB/mo."
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bento-card p-6 md:p-8 bg-white/80 backdrop-blur-sm border-black/5 hover:border-black/10 hover:shadow-md transition-all">
      <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-black/5 flex items-center justify-center mb-5">
        <CheckCircle2 size={18} className="text-black" />
      </div>
      <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed font-light">{desc}</p>
    </div>
  );
}
