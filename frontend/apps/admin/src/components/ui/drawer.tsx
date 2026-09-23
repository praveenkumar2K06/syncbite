import * as React from "react";
import { cn } from "../../lib/utils";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  width?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  width = "max-w-lg",
}: DrawerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 flex h-full w-full flex-col bg-popover border-l border-border text-popover-foreground shadow-2xl animate-slide-left",
          width,
          className,
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-border p-5">
            <div className="flex flex-col gap-1">
              {title && (
                <div className="text-base font-bold text-foreground leading-none">{title}</div>
              )}
              {description && (
                <div className="text-xs text-muted-foreground mt-1">{description}</div>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-border p-4 bg-muted/50 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
