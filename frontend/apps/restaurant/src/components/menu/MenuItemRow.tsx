import type { MenuItemVM } from "@/lib/portal";
import FoodDot from "@/components/common/FoodDot";
import Toggle from "@/components/common/Toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MenuItemRowProps {
  item: MenuItemVM;
  onToggle: (id: string) => void;
  onEdit: (item: MenuItemVM) => void;
}

export function MenuItemRow({ item, onToggle, onEdit }: MenuItemRowProps) {
  return (
    <div
      onClick={() => onEdit(item)}
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 sm:px-6 transition-colors hover:bg-muted/30 cursor-pointer group",
        !item.isAvailable && "bg-muted/10 opacity-75",
      )}
    >
      {/* Left: Dish Name & Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0" title="Click to edit dish">
        <FoodDot type={item.foodType} />
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-10 h-10 rounded-md object-cover border border-border bg-muted shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {item.name}
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 md:hidden">
              {item.category}
            </Badge>
          </div>
          {item.description ? (
            <p className="text-xs text-muted-foreground m-0 mt-0.5 truncate max-w-md">
              {item.description}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground/60 m-0 mt-0.5">
              No description provided
            </p>
          )}
        </div>
      </div>

      {/* Right: Category, Price, Availability */}
      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
        <Badge
          variant="secondary"
          className="text-xs px-2.5 py-0.5 hidden md:inline-flex font-normal"
        >
          {item.category}
        </Badge>

        <div className="w-24 text-right">
          <span className="text-sm font-semibold tabular-nums text-foreground">₹{item.price}</span>
        </div>

        <div
          className="w-28 flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Toggle on={item.isAvailable} onChange={() => onToggle(item.id)} />
          <span
            className={cn(
              "text-[11px] font-medium hidden sm:inline",
              item.isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
            )}
          >
            {item.isAvailable ? "In Stock" : "Sold Out"}
          </span>
        </div>
      </div>
    </div>
  );
}
