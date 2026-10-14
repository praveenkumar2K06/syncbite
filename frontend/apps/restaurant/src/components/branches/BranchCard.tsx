import type { Branch, Brand } from "@/api";
import { toTimeInput } from "@/lib/portal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Toggle from "@/components/common/Toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Clock01Icon,
  CheckmarkCircle02Icon,
  PencilEdit02Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

interface BranchCardProps {
  branch: Branch;
  brand?: Brand;
  isCurrent: boolean;
  isMerchantOwner: boolean;
  onSelect: (id: string) => void;
  onToggleStatus: (branch: Branch) => void;
  onEdit: (branch: Branch) => void;
  onDelete: (id: string) => void;
}

export function BranchCard({
  branch,
  brand,
  isCurrent,
  isMerchantOwner,
  onSelect,
  onToggleStatus,
  onEdit,
  onDelete,
}: BranchCardProps) {
  return (
    <Card
      className={`border transition-all flex flex-col justify-between ${
        isCurrent
          ? "border-primary/60 shadow-sm bg-primary/[0.01]"
          : "border-border hover:border-border/80"
      }`}
    >
      <CardHeader className="p-4 pb-2 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-foreground">{branch.name}</CardTitle>
              {isCurrent && (
                <Badge className="bg-primary/90 text-primary-foreground text-[10px] px-1.5 py-0 h-4">
                  Active Context
                </Badge>
              )}
            </div>
            {brand && (
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                Brand: {brand.name}
              </p>
            )}
          </div>
          <Badge
            variant={branch.is_active ? "outline" : "secondary"}
            className={
              branch.is_active
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold text-[10px]"
                : "text-muted-foreground text-[10px]"
            }
          >
            {branch.is_active ? "● Online" : "○ Closed"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3 text-xs">
        <div className="flex items-start gap-2 text-muted-foreground">
          <HugeiconsIcon icon={Location01Icon} className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{branch.address_text}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={Clock01Icon} className="w-3.5 h-3.5 shrink-0" />
          <span>
            {toTimeInput(branch.opening_time)} – {toTimeInput(branch.closing_time)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground">Accepting Orders</span>
          <Toggle on={branch.is_active} onChange={() => onToggleStatus(branch)} />
        </div>
      </CardContent>

      <div className="p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between gap-2">
        {!isCurrent ? (
          <Button
            size="sm"
            variant="default"
            onClick={() => onSelect(branch.id)}
            className="h-8 text-xs font-semibold"
          >
            Manage This Branch
          </Button>
        ) : (
          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5" />
            Current Outlet
          </span>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="icon-xs" onClick={() => onEdit(branch)} title="Edit Branch">
            <HugeiconsIcon icon={PencilEdit02Icon} className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
          {isMerchantOwner && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(branch.id)}
              title="Delete Branch"
              className="text-destructive hover:bg-destructive/10"
            >
              <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
