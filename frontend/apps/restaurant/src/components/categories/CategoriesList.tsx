import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon, Delete02Icon, Search01Icon } from "@hugeicons/core-free-icons";

interface CategoriesListProps {
  categories: string[];
  activeCategory: string;
  categoryOrders?: Record<string, number>;
  items: Array<{ category: string }>;
  editingCategory: string | null;
  editNameVal: string;
  editOrderVal: string;
  savingEdit: boolean;
  deletingCategory: string | null;
  onSelectCategory: (name: string) => void;
  onStartEdit: (name: string, order: number) => void;
  onCancelEdit: () => void;
  onEditNameChange: (val: string) => void;
  onEditOrderChange: (val: string) => void;
  onSaveEdit: () => Promise<void>;
  onDeleteCategory: (name: string) => Promise<void>;
}

export function CategoriesList({
  categories,
  activeCategory,
  categoryOrders,
  items,
  editingCategory,
  editNameVal,
  editOrderVal,
  savingEdit,
  deletingCategory,
  onSelectCategory,
  onStartEdit,
  onCancelEdit,
  onEditNameChange,
  onEditOrderChange,
  onSaveEdit,
  onDeleteCategory,
}: CategoriesListProps) {
  const [categorySearch, setCategorySearch] = useState("");

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  return (
    <Card className="shadow-2xs border-border bg-card">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold">Categories ({categories.length})</CardTitle>
          <Badge variant="outline" className="text-[10px]">
            Display Sequence
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Click a category to view dishes or edit its name & sequence number.
        </CardDescription>

        <div className="relative pt-2">
          <span className="absolute left-2.5 top-[calc(50%+4px)] -translate-y-1/2 pointer-events-none text-muted-foreground">
            <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
          </span>
          <Input
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder="Search categories…"
            className="pl-8 h-8 text-xs bg-background"
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {categories.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No categories found. Create your first category above.
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No categories match &quot;{categorySearch}&quot;.
          </div>
        ) : (
          filteredCategories.map((c) => {
            const isSelected = activeCategory === c;
            const isEditing = editingCategory === c;
            const dishesCount = items.filter((i) => i.category === c).length;
            const orderNum = categoryOrders?.[c] ?? 0;
            const isDeleting = deletingCategory === c;

            if (isEditing) {
              return (
                <div
                  key={c}
                  className="p-3 rounded-lg border border-primary/50 bg-primary/5 space-y-2.5 shadow-2xs"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground font-semibold">
                      Category Name
                    </label>
                    <Input
                      value={editNameVal}
                      onChange={(e) => onEditNameChange(e.target.value)}
                      className="text-xs h-8 bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-muted-foreground font-semibold">
                      Display Order (Lower appears earlier)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={editOrderVal}
                      onChange={(e) => onEditOrderChange(e.target.value)}
                      className="text-xs h-8 bg-background"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      disabled={savingEdit}
                      onClick={onCancelEdit}
                      className="text-[11px] h-7"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      disabled={savingEdit || !editNameVal.trim()}
                      onClick={onSaveEdit}
                      className="text-[11px] h-7 font-semibold"
                    >
                      {savingEdit ? "Saving…" : "Save Changes"}
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={c}
                onClick={() => onSelectCategory(c)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-2xs"
                    : "border-border bg-card hover:bg-muted/40"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground truncate">{c}</span>
                    <Badge
                      variant={isSelected ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                    >
                      Seq #{orderNum}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {dishesCount} {dishesCount === 1 ? "dish" : "dishes"}
                  </p>
                </div>

                <div
                  className="flex items-center gap-1.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title="Edit Category Name & Order"
                    onClick={() => onStartEdit(c, orderNum)}
                  >
                    <HugeiconsIcon
                      icon={PencilEdit02Icon}
                      strokeWidth={2}
                      className="w-3.5 h-3.5"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isDeleting}
                    className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                    title="Delete Category"
                    onClick={() => onDeleteCategory(c)}
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
