import * as React from "react";
import { cn } from "../../lib/utils";

export interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "warning";
  disabled?: boolean;
}

export interface ActionMenuProps {
  trigger: React.ReactNode;
  items: ActionMenuItem[];
  align?: "left" | "right";
  className?: string;
}

export function ActionMenu({ trigger, items, align = "right", className }: ActionMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1 min-w-[170px] rounded-lg border border-border bg-popover/95 p-1 text-xs text-popover-foreground shadow-xl backdrop-blur-md animate-fade-in",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              disabled={item.disabled}
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
                item.variant === "destructive"
                  ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                  : item.variant === "warning"
                    ? "text-primary hover:bg-primary/10 hover:text-primary"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.icon && <span className="text-sm shrink-0">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
