import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border shadow-sm",
        primary:
          "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 border border-primary/40",
        orange:
          "bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600 border border-orange-500/40",
        cyan: "bg-cyan-500 text-white shadow-md shadow-cyan-500/20 hover:bg-cyan-600 border border-cyan-500/40",
        emerald:
          "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 border border-emerald-500/40",
        pink: "bg-pink-500 text-white shadow-md shadow-pink-500/20 hover:bg-pink-600 border border-pink-500/40",
        secondary:
          "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border",
        outline:
          "border border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-rose-950/40 text-rose-400 border border-rose-800/60 hover:bg-rose-900/60 hover:text-rose-200",
        amberSubtle: "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25",
        cyanSubtle: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25",
        emeraldSubtle:
          "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25",
      },
      size: {
        default: "h-9 px-3.5 py-2",
        sm: "h-7 px-2.5 py-1 text-[11px] rounded-lg",
        xs: "h-6 px-2 py-0.5 text-[10px] rounded-md",
        lg: "h-11 px-5 py-2.5 text-sm rounded-xl",
        icon: "h-8 w-8 p-0 rounded-lg",
        iconSm: "h-7 w-7 p-0 rounded-md",
        "icon-sm": "h-7 w-7 p-0 rounded-md",
        "icon-xs": "h-6 w-6 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
