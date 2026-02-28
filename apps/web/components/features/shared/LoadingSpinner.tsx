import { cn } from "@/lib/utils/cn";

export interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

/**
 * Loading state spinner
 */
export function LoadingSpinner({
  className,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-brand border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="กำลังโหลด"
    />
  );
}
