import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Package01Icon, Tick02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";

export interface InventoryStats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface InventoryStatCardsProps {
  stats: InventoryStats;
}

export function InventoryStatCards({ stats }: InventoryStatCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-medium">Catalog Dishes</span>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={Package01Icon} className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-medium">Optimal Stock</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.inStock}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <HugeiconsIcon icon={Tick02Icon} className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-medium">Low Stock (&le;5)</span>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {stats.lowStock}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-border">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground font-medium">Sold Out / Hidden</span>
            <p className="text-2xl font-bold text-destructive mt-1">{stats.outOfStock}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive">
            <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
