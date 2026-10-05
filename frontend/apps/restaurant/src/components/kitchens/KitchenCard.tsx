import type { KitchenUnit } from "@/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Toggle from "@/components/common/Toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { KitchenUtensilsIcon, PencilEdit02Icon, Delete02Icon } from "@hugeicons/core-free-icons";

interface KitchenCardProps {
  kitchen: KitchenUnit;
  onToggleActive: (kitchen: KitchenUnit) => void;
  onEdit: (kitchen: KitchenUnit) => void;
  onDelete: (id: string) => void;
}

export function KitchenCard({ kitchen, onToggleActive, onEdit, onDelete }: KitchenCardProps) {
  return (
    <Card
      className={`border transition-all flex flex-col justify-between ${
        kitchen.is_active ? "border-border shadow-2xs" : "border-border/60 opacity-75 bg-muted/20"
      }`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <HugeiconsIcon icon={KitchenUtensilsIcon} className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-foreground">{kitchen.name}</CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                ID: {kitchen.id.slice(0, 8)}…
              </p>
            </div>
          </div>

          <Badge
            variant={kitchen.is_active ? "outline" : "secondary"}
            className={
              kitchen.is_active
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold text-[10px]"
                : "text-muted-foreground text-[10px]"
            }
          >
            {kitchen.is_active ? "Active" : "Disabled"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 text-xs">
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-[11px] text-muted-foreground">Station Online</span>
          <Toggle on={kitchen.is_active} onChange={() => onToggleActive(kitchen)} />
        </div>
      </CardContent>

      <div className="p-3 bg-muted/20 border-t border-border/50 flex items-center justify-end gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(kitchen)}
          className="h-7 px-2 text-xs gap-1"
        >
          <HugeiconsIcon icon={PencilEdit02Icon} className="w-3.5 h-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(kitchen.id)}
          className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 gap-1"
        >
          <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
