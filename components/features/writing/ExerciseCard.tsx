import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export interface ExerciseCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Practice exercise container
 */
export function ExerciseCard({
  title,
  description,
  children,
  className,
}: ExerciseCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
