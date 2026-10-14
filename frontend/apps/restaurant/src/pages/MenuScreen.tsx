import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { MenuItemVM } from "@/lib/portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PlusSignIcon,
  Restaurant01Icon,
  Tag01Icon,
  Menu01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { MenuStatsOverview } from "@/components/menu/MenuStatsOverview";
import { MenuItemRow } from "@/components/menu/MenuItemRow";

export interface MenuScreenProps {
  items: MenuItemVM[];
  categories: string[];
  categoryIds?: Record<string, string>;
  categoryOrders?: Record<string, number>;
  onToggleItem: (id: string) => void;
  onEditItem: (item: MenuItemVM) => void;
  onAddItemClick: () => void;
}

type StockFilter = "All Status" | "In Stock" | "Sold Out";

export default function MenuScreen({
  items,
  categories,
  onToggleItem,
  onEditItem,
  onAddItemClick,
}: MenuScreenProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("All Status");

  const availableCount = items.filter((i) => i.isAvailable).length;
  const unavailableCount = items.filter((i) => !i.isAvailable).length;

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      map[item.category] = (map[item.category] || 0) + 1;
    }
    return map;
  }, [items]);

  const shownItems = items.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      (i.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesCat = !catFilter || i.category === catFilter;
    const matchesStock =
      stockFilter === "All Status" ||
      (stockFilter === "In Stock" && i.isAvailable) ||
      (stockFilter === "Sold Out" && !i.isAvailable);
    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Menu Catalog
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage dish prices, food categories, and real-time student ordering availability.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/categories", { viewTransition: true })}
              className="h-9 gap-1.5 text-xs font-semibold"
            >
              <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
              Manage Categories
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={onAddItemClick}
              className="h-9 gap-1.5 text-xs font-semibold"
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="w-3.5 h-3.5" />
              Add New Dish
            </Button>
          </div>
        </div>

        {/* Overview Stats Bar — 4 Cards Across */}
        <MenuStatsOverview
          totalDishes={items.length}
          availableCount={availableCount}
          unavailableCount={unavailableCount}
          categoriesCount={categories.length}
        />

        {/* Filtering & Toolbar Card */}
        <Card className="shadow-2xs border-border bg-card p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Filter Menu:</span>
              <span className="text-xs text-muted-foreground">
                Showing {shownItems.length} of {items.length} dishes
              </span>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-2.5 flex-1 max-w-xl justify-end flex-wrap">
              <div className="relative flex-1 min-w-40">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
                </span>
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dishes or description…"
                  className="pl-8 h-8 text-xs"
                />
              </div>

              <Select
                value={catFilter || "All Categories"}
                onValueChange={(val) =>
                  setCatFilter(val === "All Categories" ? "" : (val as string))
                }
              >
                <SelectTrigger className="h-8 text-xs min-w-36">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="All Categories">All ({items.length})</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c} ({categoryCounts[c] ?? 0})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={stockFilter}
                onValueChange={(val) => setStockFilter(val as StockFilter)}
              >
                <SelectTrigger className="h-8 text-xs min-w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Statuses</SelectLabel>
                    <SelectItem value="All Status">All Status ({items.length})</SelectItem>
                    <SelectItem value="In Stock">In Stock ({availableCount})</SelectItem>
                    <SelectItem value="Sold Out">Sold Out ({unavailableCount})</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* TODO: Convert to React Table */}
        {/* Dishes Table Card */}
        <Card className="shadow-2xs border-border bg-card overflow-hidden">
          <CardHeader className="py-3.5 px-4 sm:px-6 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">Dishes List</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Click any dish to edit details, or toggle availability
              </CardDescription>
            </div>

            <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground font-medium pr-1">
              <span>Category</span>
              <span className="w-24 text-right">Price</span>
              <span className="w-28 text-center">Availability</span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {shownItems.length === 0 ? (
              <div className="py-16 px-4 text-center text-muted-foreground">
                <div className="p-3 rounded-full bg-muted/60 w-fit mx-auto mb-3">
                  <HugeiconsIcon
                    icon={Restaurant01Icon}
                    strokeWidth={1.5}
                    className="w-8 h-8 opacity-50"
                  />
                </div>
                <p className="text-sm font-semibold text-foreground m-0">
                  {items.length === 0 ? "No dishes in menu" : "No dishes match filters"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  {items.length === 0
                    ? "Get started by adding dishes to your menu catalog."
                    : "Try adjusting your search keywords or resetting category filters."}
                </p>
                {items.length === 0 && (
                  <Button onClick={onAddItemClick} size="sm" className="mt-4 text-xs font-semibold">
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      strokeWidth={2}
                      className="w-3.5 h-3.5 mr-1"
                    />
                    Add First Dish
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {shownItems.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    onToggle={onToggleItem}
                    onEdit={onEditItem}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
