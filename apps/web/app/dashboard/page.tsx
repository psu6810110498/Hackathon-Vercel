"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  PenTool,
  Timer,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const STATS = [
  {
    label: "Essays Analyzed",
    value: "12",
    icon: PenTool,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Flashcards Mastered",
    value: "348",
    icon: BookOpen,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    label: "Study Hours",
    value: "42.5",
    icon: Timer,
    color: "text-brand-DEFAULT",
    bg: "bg-brand-muted",
  },
  {
    label: "Current Streak",
    value: "7 Days",
    icon: Activity,
    color: "text-success-DEFAULT",
    bg: "bg-success-muted",
  },
];

const RECENT_SESSIONS = [
  {
    id: 1,
    type: "Writing Analysis",
    title: "HSK 5: Technology Essay",
    score: 85,
    date: "2 hours ago",
  },
  {
    id: 2,
    type: "Flashcards",
    title: "HSK 4 Verbs (Review)",
    score: 92,
    date: "Yesterday",
  },
  {
    id: 3,
    type: "Mock Exam",
    title: "HSK 4 Listening Mock Exam",
    score: 78,
    date: "3 days ago",
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-serif tracking-tight font-bold">
            Welcome back,{" "}
            <span className="text-gradient">{user?.name || "Scholar"}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Ready to conquer your next HSK milestone?
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div variants={item} key={i}>
              <div className="bento-card p-5 relative overflow-hidden group">
                <div
                  className={`absolute top-0 right-0 p-8 rounded-bl-full ${stat.bg} -mr-4 -mt-4 transition-transform group-hover:scale-110`}
                />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold font-sans tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart (Mock for now, using a stylized Framer Motion layout) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bento-card p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-serif">Learning Activity</h2>
            <div className="flex items-center gap-2 text-sm text-success-DEFAULT bg-success-muted px-2.5 py-1 rounded-full font-medium">
              <TrendingUp size={14} /> +12% this week
            </div>
          </div>

          <div className="flex-1 flex items-end gap-2 sm:gap-4 mt-auto h-48 border-b border-border pb-2 relative">
            {/* Simple mini bar chart with framer-motion */}
            {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end items-center group cursor-pointer relative h-full"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    delay: 0.4 + i * 0.05,
                    type: "spring" as any,
                    stiffness: 100,
                  }}
                  className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary transition-colors relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-foreground text-background text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">
                    {height} pts
                  </div>
                </motion.div>
                <span className="text-xs text-muted-foreground mt-2 font-mono">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bento-card p-6"
        >
          <h2 className="text-lg font-bold font-serif mb-6">Recent Sessions</h2>
          <div className="space-y-4">
            {RECENT_SESSIONS.map((session, i) => (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                key={session.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border cursor-pointer group"
              >
                <div className="bg-background border border-border p-2 rounded-lg group-hover:scale-105 transition-transform">
                  <CheckCircle size={16} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">
                    {session.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {session.type} • {session.date}
                  </p>
                </div>
                <div className="text-sm font-bold font-mono text-primary">
                  {session.score}
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-6 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            View All History
          </button>
        </motion.div>
      </div>
    </div>
  );
}
