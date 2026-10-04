import type { InventoryItem } from "@/api";
import type { MenuItemVM } from "@/lib/portal";
import { formatMoney } from "@/lib/portal";
import FoodDot from "@/components/common/FoodDot";
import Toggle from "@/components/common/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableRow, TableCell } from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

export interface MergedInventoryItem extends MenuItemVM {
  inventory: InventoryItem | null;
  stockQuantity: number;
  isInStock: boolean;
}

interface InventoryTableRowProps {
  item: MergedInventoryItem;
  isBusy: boolean;
  onInitStock: (id: string) => void;
  onUpdateQuantity: (id: string, inv: InventoryItem | null, qty: number) => void;
  onToggleStock: (id: string, inv: InventoryItem | null, currentStock: number) => void;
}

export function InventoryTableRow({
  item,
  isBusy,
  onInitStock,
  onUpdateQuantity,
  onToggleStock,
}: InventoryTableRowProps) {
  const inv = item.inventory;
  const qty = item.stockQuantity;
  const isAvailable = item.isInStock && qty > 0;

  return (
    <TableRow className="hover:bg-muted/30">
      {/* Name & Veg indicator */}
      <TableCell className="py-3 font-medium text-xs">
        <div className="flex items-center gap-2">
          <FoodDot type={item.foodType} />
          <div>
            <span className="font-semibold text-foreground">{item.name}</span>
            {item.description && (
              <p className="text-[11px] text-muted-foreground line-clamp-1">{item.description}</p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Category */}
      <TableCell className="text-xs text-muted-foreground py-3">
        <Badge variant="secondary" className="text-[10px] font-normal">
          {item.category}
        </Badge>
      </TableCell>

      {/* Price */}
      <TableCell className="text-xs font-semibold py-3">{formatMoney(item.price)}</TableCell>

      {/* Stock Quantity / Status */}
      <TableCell className="py-3">
        {inv ? (
          <div className="flex items-center gap-2">
            <Badge
              className={`text-[11px] font-mono font-bold ${
                qty === 0
                  ? "bg-destructive/15 text-destructive border border-destructive/30"
                  : qty <= 5
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {qty} in stock
            </Badge>
            {qty === 0 && (
              <span className="text-[10px] font-semibold text-destructive uppercase">Sold Out</span>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => onInitStock(item.id)}
            className="h-6 text-[10px] gap-1 font-medium"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="w-3 h-3" />
            Track Stock
          </Button>
        )}
      </TableCell>

      {/* In Stock toggle */}
      <TableCell className="py-3 text-center">
        <Toggle on={isAvailable} onChange={() => onToggleStock(item.id, inv, qty)} />
      </TableCell>

      {/* Quick Adjust Buttons */}
      <TableCell className="py-3 text-right pr-6">
        {inv ? (
          <div className="inline-flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-xs"
              disabled={isBusy || qty <= 0}
              onClick={() => onUpdateQuantity(item.id, inv, qty - 5)}
              className="h-7 w-7 text-xs font-bold"
              title="Decrease stock by 5"
            >
              -5
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              disabled={isBusy || qty <= 0}
              onClick={() => onUpdateQuantity(item.id, inv, qty - 1)}
              className="h-7 w-7 text-xs font-bold"
              title="Decrease stock by 1"
            >
              -1
            </Button>
            <Input
              type="number"
              min={0}
              value={qty}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  void onUpdateQuantity(item.id, inv, val);
                }
              }}
              className="h-7 w-14 text-center text-xs font-mono font-bold p-1"
            />
            <Button
              variant="outline"
              size="icon-xs"
              disabled={isBusy}
              onClick={() => onUpdateQuantity(item.id, inv, qty + 1)}
              className="h-7 w-7 text-xs font-bold"
              title="Increase stock by 1"
            >
              +1
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              disabled={isBusy}
              onClick={() => onUpdateQuantity(item.id, inv, qty + 10)}
              className="h-7 w-7 text-xs font-bold text-emerald-600"
              title="Restock +10"
            >
              +10
            </Button>
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground">Not initialized</span>
        )}
      </TableCell>
    </TableRow>
  );
}
