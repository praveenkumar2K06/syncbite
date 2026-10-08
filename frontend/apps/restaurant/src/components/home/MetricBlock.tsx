import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Clock01Icon } from "@hugeicons/core-free-icons";

export interface MetricBlockProps {
  label: string;
  value: number | string;
  tone?: "green" | "red" | "amber" | "blue";
  icon: typeof Clock01Icon;
  subtext?: string;
}

export function MetricBlock({ label, value, tone, icon, subtext }: MetricBlockProps) {
  const toneClasses = {
    red: "text-destructive",
    green: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    blue: "text-blue-600 dark:text-blue-400",
  };

  const iconBgClasses = {
    red: "bg-red-500/10 text-destructive",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  const toneClass = tone ? toneClasses[tone] : "text-foreground";
  const iconBgClass = tone ? iconBgClasses[tone] : "bg-muted text-muted-foreground";

  return (
    <Card className="bg-card shadow-2xs border-border transition-all hover:border-foreground/20">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <div className={cn("p-2 rounded-lg shrink-0", iconBgClass)}>
            <HugeiconsIcon icon={icon} strokeWidth={2} className="w-4 h-4" />
          </div>
        </div>
        <p className={cn("text-2xl sm:text-3xl font-bold tracking-tight", toneClass)}>{value}</p>
        {subtext && <p className="text-[11px] text-muted-foreground mt-1 truncate">{subtext}</p>}
      </CardContent>
    </Card>
  );
}
