import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

interface AddCategoryBarProps {
  name: string;
  order: string;
  creating: boolean;
  onNameChange: (val: string) => void;
  onOrderChange: (val: string) => void;
  onSubmit: () => Promise<void>;
}

export function AddCategoryBar({
  name,
  order,
  creating,
  onNameChange,
  onOrderChange,
  onSubmit,
}: AddCategoryBarProps) {
  return (
    <Card className="shadow-2xs border-border bg-card">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground block">Add New Menu Category</span>
            <span className="text-[11px] text-muted-foreground">
              Lower display order sequence numbers show first on student mobile app.
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Input
              placeholder="e.g. Combos, Desserts, Beverages"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="text-xs h-9 min-w-[200px]"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-muted-foreground">Order:</span>
              <Input
                type="number"
                min="0"
                value={order}
                onChange={(e) => onOrderChange(e.target.value)}
                className="text-xs h-9 w-18 text-center"
              />
            </div>
            <Button
              size="sm"
              disabled={creating || !name.trim()}
              onClick={onSubmit}
              className="h-9 text-xs font-semibold gap-1.5 shrink-0"
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="w-3.5 h-3.5" />
              {creating ? "Adding…" : "Add Category"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
