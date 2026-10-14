import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/portal";

export interface PillProps {
  status: "available" | "unavailable" | OrderStatus;
  className?: string;
}

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: BadgeVariant;
    className?: string;
  }
> = {
  available: {
    label: "Available",
    variant: "outline",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  },
  unavailable: {
    label: "Off",
    variant: "secondary",
    className: "text-muted-foreground",
  },
  new: {
    label: "New",
    variant: "outline",
    className:
      "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  },
  preparing: {
    label: "Preparing",
    variant: "outline",
    className:
      "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  },
  ready: {
    label: "Ready",
    variant: "outline",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  },
  completed: {
    label: "Done",
    variant: "secondary",
    className: "text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    variant: "destructive",
  },
};

export default function Pill({ status, className }: PillProps) {
  const conf = STATUS_CONFIG[status] ?? {
    label: status,
    variant: "secondary" as const,
  };

  return (
    <Badge
      variant={conf.variant}
      className={cn(
        "h-5 px-2 text-[11px] font-semibold whitespace-nowrap",
        conf.className,
        className,
      )}
    >
      {conf.label}
    </Badge>
  );
}
