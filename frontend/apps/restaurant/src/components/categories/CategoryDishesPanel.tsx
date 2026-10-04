import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { MenuItemVM } from "@/lib/portal";
import { formatMoney } from "@/lib/portal";
import FoodDot from "@/components/common/FoodDot";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tag01Icon,
  ArrowRight01Icon,
  Exchange01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

interface CategoryDishesPanelProps {
  activeCategory: string;
  activeCategoryId?: string;
  dishes: MenuItemVM[];
  categories: string[];
  displayOrder?: number;
  movingItemId: string | null;
  onMoveDish: (dishId: string, targetCategoryName: string) => Promise<void>;
}

export function CategoryDishesPanel({
  activeCategory,
  activeCategoryId,
  dishes,
  categories,
  displayOrder,
  movingItemId,
  onMoveDish,
}: CategoryDishesPanelProps) {
  const navigate = useNavigate();
  const [dishSearch, setDishSearch] = useState("");

  const filteredDishes = useMemo(() => {
    const q = dishSearch.trim().toLowerCase();
    if (!q) return dishes;
    return dishes.filter((dish) => dish.name.toLowerCase().includes(q));
  }, [dishes, dishSearch]);

  return (
    <Card className="shadow-2xs border-border bg-card">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="w-4 h-4 text-primary" />
              Dishes in {activeCategory ? `"${activeCategory}"` : "Selected Category"}
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              {dishes.length} {dishes.length === 1 ? "dish" : "dishes"} assigned. Reassign items to
              another category below.
            </CardDescription>
          </div>
          {activeCategoryId && (
            <Badge variant="outline" className="text-[10px]">
              Display Seq #{displayOrder ?? 0}
            </Badge>
          )}
        </div>

        {dishes.length > 0 && (
          <div className="relative pt-2">
            <span className="absolute left-2.5 top-[calc(50%+4px)] -translate-y-1/2 pointer-events-none text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
            </span>
            <Input
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
              placeholder="Search dishes in category…"
              className="pl-8 h-8 text-xs bg-background"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-2.5">
        {dishes.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-xs text-muted-foreground">
              No dishes currently assigned to &quot;{activeCategory}&quot;.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/menu")}
              className="text-xs h-8 gap-1.5"
            >
              Go to Menu to Add Dishes
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
            </Button>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No dishes match &quot;{dishSearch}&quot;.
          </div>
        ) : (
          filteredDishes.map((dish) => {
            const isMoving = movingItemId === dish.id;
            return (
              <div
                key={dish.id}
                className="p-3 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FoodDot type={dish.foodType} />
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-foreground block truncate">
                      {dish.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span className="font-mono text-foreground font-medium">
                        {formatMoney(dish.price)}
                      </span>
                      <span>•</span>
                      <span
                        className={
                          dish.isAvailable
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        }
                      >
                        {dish.isAvailable ? "In Stock" : "Sold Out"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Reassign Category Dropdown */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <HugeiconsIcon icon={Exchange01Icon} strokeWidth={2} className="w-3 neck-3" />
                    Move to:
                  </span>
                  <Select
                    disabled={isMoving}
                    value={activeCategory}
                    onValueChange={(val) => {
                      if (val && val !== activeCategory) {
                        void onMoveDish(dish.id, val);
                      }
                    }}
                  >
                    <SelectTrigger className="h-7 text-[11px] min-w-32 bg-background">
                      <SelectValue placeholder="Move to category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((targetCat) => (
                        <SelectItem key={targetCat} value={targetCat} className="text-xs">
                          {targetCat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
