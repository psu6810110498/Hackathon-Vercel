"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import {
  PenLine,
  BookOpen,
  Target,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Flame,
  BarChart3,
  ArrowRight,
  Command,
  ChevronRight,
} from "lucide-react";

const MOCK_DATA = {
  userName: "คุณจรัส",
  hskLevel: 5,
  daysRemaining: 23,
  readiness: 73,
  predictedScore: 187,
  totalScore: 300,
  studyStreak: 7,
  weakPoints: ["把-sentence", "虽然...但是", "Result Complement"],
  todaysTasks: [
    { label: "Essay วิเคราะห์เชิงลึก 1 ชิ้น", done: true },
    { label: "ทบทวนคำศัพท์ด้วย Spaced Repetition", done: false },
    { label: "Mock Exam: Reading Part 1", done: false },
  ],
  skills: [
    { label: "Grammar", score: 72, max: 100 },
    { label: "Vocabulary", score: 65, max: 100 },
    { label: "Writing", score: 78, max: 100 },
    { label: "Reading", score: 70, max: 100 },
  ],
};

export default function DashboardPage() {
  const [data] = useState(MOCK_DATA);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-10 space-y-6 lg:space-y-8 min-h-screen">
      {/* ── Light Modern Header Banner ── */}
      <div className="relative overflow-hidden bento-card p-6 md:p-8 isolate page-enter">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white/20 -z-10" />
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10 w-full">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-2 py-1 rounded bg-black/5 border border-black/5">
              <Command size={12} className="text-black" />
              <span className="text-[10px] font-mono tracking-widest text-black uppercase">
                Overview
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-heading mb-1 text-black tracking-tight leading-tight">
              Good morning, {data.userName}
            </h1>
            <p className="text-zinc-500 text-sm">
              <span className="font-medium text-black">
                HSK {data.hskLevel}
              </span>{" "}
              goal in{" "}
              <span className="font-medium text-black">
                {data.daysRemaining} days
              </span>
            </p>
          </div>

          <div className="flex border border-black/10 rounded-xl overflow-hidden bg-white/60 shadow-sm w-full md:w-auto mt-2 md:mt-0">
            <div className="p-4 bg-white/80 border-r border-black/5 flex flex-col justify-center">
              <p className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mb-0.5">
                Readiness
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-black tracking-tighter">
                  {data.readiness}
                </span>
                <span className="text-sm text-zinc-400">%</span>
              </div>
            </div>
            <div className="p-4 w-full md:w-40 flex flex-col justify-center">
              <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-1000"
                  style={{ width: `${data.readiness}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-zinc-500 mt-2 flex justify-between">
                <span>Current</span>
                <span className="text-black font-semibold">On Track</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 reveal-1">
        <StatCard
          icon={<BarChart3 size={16} />}
          label="Predicted Score"
          value={`${data.predictedScore}/${data.totalScore}`}
          subtext="+12 pts"
          subtextColor="text-emerald-600 bg-emerald-50 border-emerald-200"
        />
        <StatCard
          icon={<Flame size={16} />}
          label="Study Streak"
          value={`${data.studyStreak} Days`}
          subtext="Active"
          subtextColor="text-amber-600 bg-amber-50 border-amber-200"
        />
        <StatCard
          icon={<AlertTriangle size={16} />}
          label="Major Weakness"
          value="Grammar"
          subtext="把-sentence"
          subtextColor="text-rose-600 bg-rose-50 border-rose-200"
        />
        <StatCard
          icon={<Target size={16} />}
          label="Today's Tasks"
          value={`${data.todaysTasks.filter((t) => !t.done).length} Tasks`}
          subtext="Incomplete"
          subtextColor="text-zinc-600 bg-zinc-100 border-zinc-200"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 reveal-2">
        {/* ── Today's Plan ── */}
        <div className="lg:col-span-8 bento-card p-5 md:p-6 flex flex-col h-full bg-white relative">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-black tracking-wide">
              Action Plan
            </h3>
            <button className="text-[10px] uppercase tracking-widest font-mono text-zinc-500 hover:text-black transition-colors">
              View All ↗
            </button>
          </div>

          <div className="space-y-1.5 flex-1">
            {data.todaysTasks.map((task, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors border border-transparent",
                  task.done
                    ? "opacity-50"
                    : "bg-zinc-50 hover:bg-zinc-100 hover:border-black/5 cursor-pointer group",
                )}
              >
                {task.done ? (
                  <CheckCircle2 size={16} className="text-zinc-400" />
                ) : (
                  <Circle
                    size={16}
                    className="text-zinc-300 group-hover:text-blue-500 transition-colors"
                  />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    task.done
                      ? "text-zinc-400 line-through decoration-zinc-300"
                      : "text-black",
                  )}
                >
                  {task.label}
                </span>
                {!task.done && (
                  <ArrowRight
                    size={14}
                    className="ml-auto text-zinc-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Skill Radar ── */}
        <div className="lg:col-span-4 bento-card p-5 md:p-6 flex flex-col h-full bg-zinc-50/50">
          <h3 className="text-sm font-semibold text-black tracking-wide mb-5">
            Skill Analysis
          </h3>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {data.skills.map((skill) => {
              const pct = Math.round((skill.score / skill.max) * 100);
              return (
                <div key={skill.label} className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-zinc-600 font-medium">
                      {skill.label}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-1000"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 reveal-3">
        <QuickAction
          href="/essay"
          icon={<PenLine size={18} />}
          title="Essay Grader"
          desc="AI Writing Analysis"
        />
        <QuickAction
          href="/reading"
          icon={<BookOpen size={18} />}
          title="Reading Trainer"
          desc="Speed & Comp"
        />
        <QuickAction
          href="/mock-exam"
          icon={<Target size={18} />}
          title="Mock Exam"
          desc="Full test sim."
        />
        <QuickAction
          href="/flashcards"
          icon={<Layers size={18} />}
          title="Flashcards"
          desc="Vocabulary rep."
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  subtextColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  subtextColor: string;
}) {
  return (
    <div className="bento-card p-4 md:p-5 flex flex-col justify-between min-h-[110px]">
      <div className="flex justify-between items-start mb-2">
        <span className="text-zinc-400 bg-zinc-50 p-1.5 rounded-md border border-black/5">
          {icon}
        </span>
        <span
          className={cn(
            "text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border",
            subtextColor,
          )}
        >
          {subtext}
        </span>
      </div>
      <div>
        <p className="text-xl md:text-2xl font-bold text-black tracking-tight leading-none mb-1">
          {value}
        </p>
        <p className="text-[11px] md:text-xs text-zinc-500 font-medium">
          {label}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-center rounded-xl border border-black/[0.06] bg-white p-4 transition-all hover:bg-zinc-50 hover:border-black/15 hover:shadow-sm"
    >
      <div className="mb-2.5 text-black">{icon}</div>
      <h4 className="text-sm font-semibold text-black mb-0.5 flex items-center gap-1">
        {title}{" "}
        <ChevronRight
          size={12}
          className="text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all"
        />
      </h4>
      <p className="text-[11px] text-zinc-500">{desc}</p>
    </Link>
  );
}
