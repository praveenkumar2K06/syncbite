import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface ActiveOrdersBannerProps {
  activeCount: number;
}

export function ActiveOrdersBanner({ activeCount }: ActiveOrdersBannerProps) {
  const navigate = useNavigate();

  if (activeCount <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20 shrink-0">
          <HugeiconsIcon
            icon={Clock01Icon}
            strokeWidth={2}
            className="w-4 h-4 text-amber-600 dark:text-amber-400"
          />
        </div>
        <div>
          <p className="text-sm font-semibold m-0">
            {activeCount} active order{activeCount > 1 ? "s" : ""} in progress
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-300/80 m-0">
            Kitchen orders are awaiting preparation and pickup.
          </p>
        </div>
      </div>
      <Button
        onClick={() => navigate("/orders", { viewTransition: true })}
        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 gap-1.5"
      >
        Open Orders Board
        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
