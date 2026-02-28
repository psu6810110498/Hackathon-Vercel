import { Skeleton } from "@/components/ui/skeleton";
import { Command } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 md:py-10 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Header Banner Skeleton */}
      <div className="relative overflow-hidden bento-card p-6 md:p-8 isolate bg-white">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10 w-full">
          <div className="space-y-3 w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 mb-1 px-2 py-1">
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="flex border border-black/5 rounded-xl overflow-hidden bg-white/60 w-full md:w-auto">
            <div className="p-4 border-r border-black/5 flex flex-col justify-center space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
            <div className="p-4 w-full md:w-40 flex flex-col justify-center space-y-3">
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards Row Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bento-card p-5 flex flex-col justify-between min-h-[110px] bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Recent Activity Skeleton */}
        <div className="lg:col-span-8 bento-card p-6 bg-white space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-lg border border-black/[0.03] bg-zinc-50/50"
              >
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-6 w-12 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Skill Progress Skeleton */}
        <div className="lg:col-span-4 bento-card p-6 bg-zinc-50/50 space-y-6">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-6 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bento-card p-5 bg-white space-y-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
