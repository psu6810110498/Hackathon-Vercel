import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="container py-6 space-y-6">
      <Skeleton className="h-8 w-32" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bento-card p-6 bg-white space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="space-y-4 pt-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="bento-card p-6 bg-white space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="pt-4">
            <Skeleton className="h-10 w-32 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
