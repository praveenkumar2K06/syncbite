import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground border border-border",
        approved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        pending: "bg-primary/15 text-primary border border-primary/30",
        rejected: "bg-destructive/15 text-destructive border border-destructive/30",
        suspended: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
        online: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        offline: "bg-destructive/15 text-destructive border border-destructive/30",
        cyan: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
        violet: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
        pink: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
        outline: "text-muted-foreground border border-border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
