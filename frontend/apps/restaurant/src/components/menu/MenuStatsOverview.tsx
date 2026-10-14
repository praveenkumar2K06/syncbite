import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Restaurant01Icon,
  Tick02Icon,
  AlertCircleIcon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";

interface MenuStatsOverviewProps {
  totalDishes: number;
  availableCount: number;
  unavailableCount: number;
  categoriesCount: number;
}

export function MenuStatsOverview({
  totalDishes,
  availableCount,
  unavailableCount,
  categoriesCount,
}: MenuStatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      <Card className="shadow-2xs border-border bg-card">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Total Dishes</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Restaurant01Icon} strokeWidth={2} className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{totalDishes}</p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Across {categoriesCount} categories
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border bg-card">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">In Stock</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {availableCount}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Ready for student orders</p>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border bg-card">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Sold Out</span>
            <div className="p-2 rounded-lg bg-red-500/10 text-destructive">
              <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-destructive">{unavailableCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Temporarily hidden on app</p>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border bg-card">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Categories</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            {categoriesCount}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Active menu sections</p>
        </CardContent>
      </Card>
    </div>
  );
}
