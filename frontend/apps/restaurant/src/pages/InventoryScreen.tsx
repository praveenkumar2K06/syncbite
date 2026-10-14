import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getBranchInventoryApi,
  initItemInventoryApi,
  updateStockApi,
  toUserMessage,
  type InventoryItem,
} from "@/api";
import { usePortal } from "@/context/PortalContext";
import { useMenu } from "@/hooks/useMenu";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Package01Icon, Search01Icon, RefreshCwIcon } from "@hugeicons/core-free-icons";
import { InventoryStatCards, type InventoryStats } from "@/components/inventory/InventoryStatCards";
import {
  InventoryTableRow,
  type MergedInventoryItem,
} from "@/components/inventory/InventoryTableRow";

type StockStatusFilter = "all" | "in_stock" | "low_stock" | "out_of_stock";

export default function InventoryScreen() {
  const { branchId, showToast } = usePortal();
  const { menu } = useMenu({ branchId, showToast });
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StockStatusFilter>("all");
  const [busyItemIds, setBusyItemIds] = useState<Record<string, boolean>>({});

  const loadInventory = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    try {
      const data = await getBranchInventoryApi(branchId);
      setInventoryList(data);
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [branchId, showToast]);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  // Build a mapped lookup by menu_item_id
  const inventoryMap = useMemo(() => {
    const map = new Map<string, InventoryItem>();
    for (const inv of inventoryList) {
      map.set(inv.menu_item_id, inv);
    }
    return map;
  }, [inventoryList]);

  // Merge menu items with inventory data
  const mergedItems = useMemo((): MergedInventoryItem[] => {
    return menu.items.map((item) => {
      const inv = inventoryMap.get(item.id);
      return {
        ...item,
        inventory: inv ?? null,
        stockQuantity: inv ? inv.quantity : 0,
        isInStock: inv ? inv.is_in_stock && inv.quantity > 0 : item.isAvailable,
      };
    });
  }, [menu.items, inventoryMap]);

  // Quick stats
  const stats = useMemo((): InventoryStats => {
    let total = mergedItems.length;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    for (const item of mergedItems) {
      const q = item.stockQuantity;
      const available = item.isInStock;
      if (!available || q === 0) {
        outOfStock++;
      } else if (q <= 5) {
        lowStock++;
      } else {
        inStock++;
      }
    }
    return { total, inStock, lowStock, outOfStock };
  }, [mergedItems]);

  // Filtered view
  const filteredItems = useMemo(() => {
    return mergedItems.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (statusFilter === "in_stock" && (!item.isInStock || item.stockQuantity <= 5)) {
        return false;
      }
      if (statusFilter === "low_stock" && (item.stockQuantity <= 0 || item.stockQuantity > 5)) {
        return false;
      }
      if (statusFilter === "out_of_stock" && item.stockQuantity > 0 && item.isInStock) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [mergedItems, selectedCategory, statusFilter, search]);

  // Operations
  const handleInitStock = async (menuItemId: string) => {
    if (!branchId) return;
    setBusyItemIds((prev) => ({ ...prev, [menuItemId]: true }));
    try {
      const created = await initItemInventoryApi(branchId, menuItemId, 25);
      setInventoryList((prev) => [...prev, created]);
      showToast("Stock initialized with 25 units.");
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setBusyItemIds((prev) => ({ ...prev, [menuItemId]: false }));
    }
  };

  const handleUpdateQuantity = async (
    menuItemId: string,
    inv: InventoryItem | null,
    newQty: number,
  ) => {
    if (!branchId) return;
    const targetQty = Math.max(0, newQty);

    if (!inv) {
      setBusyItemIds((prev) => ({ ...prev, [menuItemId]: true }));
      try {
        const created = await initItemInventoryApi(branchId, menuItemId, targetQty);
        setInventoryList((prev) => [...prev, created]);
        showToast(`Stock initialized to ${targetQty} units.`);
      } catch (err) {
        showToast(toUserMessage(err), "error");
      } finally {
        setBusyItemIds((prev) => ({ ...prev, [menuItemId]: false }));
      }
      return;
    }

    setBusyItemIds((prev) => ({ ...prev, [menuItemId]: true }));
    try {
      const isStillInStock = targetQty > 0 ? (inv.is_in_stock ?? true) : false;
      const updated = await updateStockApi(inv.id, {
        quantity: targetQty,
        is_in_stock: isStillInStock,
      });
      setInventoryList((prev) => prev.map((i) => (i.id === inv.id ? updated : i)));
      showToast(`Stock updated to ${targetQty} units.`);
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setBusyItemIds((prev) => ({ ...prev, [menuItemId]: false }));
    }
  };

  const handleToggleStockAvailability = async (
    menuItemId: string,
    inv: InventoryItem | null,
    currentStock: number,
  ) => {
    if (!branchId) return;

    if (!inv) {
      await handleInitStock(menuItemId);
      return;
    }

    const nextAvailable = !inv.is_in_stock;
    setBusyItemIds((prev) => ({ ...prev, [menuItemId]: true }));
    try {
      const updated = await updateStockApi(inv.id, {
        quantity: nextAvailable && currentStock === 0 ? 10 : currentStock,
        is_in_stock: nextAvailable,
      });
      setInventoryList((prev) => prev.map((i) => (i.id === inv.id ? updated : i)));
      showToast(nextAvailable ? "Item marked as in stock." : "Item marked as out of stock.");
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setBusyItemIds((prev) => ({ ...prev, [menuItemId]: false }));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Package01Icon} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Inventory & Stock Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Live branch stock count, automatic out-of-stock triggers and quick replenishment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadInventory} className="gap-1.5 text-xs">
              <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Status Metrics Cards */}
        <InventoryStatCards stats={stats} />

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <Input
              placeholder="Search dishes or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                if (val !== null) setSelectedCategory(val);
              }}
            >
              <SelectTrigger className="h-9 text-xs min-w-[130px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Categories
                </SelectItem>
                {menu.categories.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex rounded-md border border-border p-0.5 bg-muted/40 text-xs">
              {(
                [
                  ["all", "All"],
                  ["in_stock", "In Stock"],
                  ["low_stock", "Low (≤5)"],
                  ["out_of_stock", "Sold Out"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-3 py-1 rounded text-xs transition-colors ${
                    statusFilter === key
                      ? "bg-card text-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Items Table */}
        <Card className="border-border overflow-hidden">
          <CardHeader className="py-3 px-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Stock Units & Availability
                </CardTitle>
                <CardDescription className="text-xs">
                  Showing {filteredItems.length} menu items
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs h-9">Dish / Item</TableHead>
                <TableHead className="text-xs h-9">Category</TableHead>
                <TableHead className="text-xs h-9">Price</TableHead>
                <TableHead className="text-xs h-9">Stock Status</TableHead>
                <TableHead className="text-xs h-9 text-center">Accepting Orders</TableHead>
                <TableHead className="text-xs h-9 text-right pr-6">Quick Adjust Units</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground text-xs"
                  >
                    <HugeiconsIcon
                      icon={RefreshCwIcon}
                      className="w-4 h-4 animate-spin inline-block mr-2"
                    />
                    Loading inventory records…
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground text-xs"
                  >
                    No items match the selected inventory filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <InventoryTableRow
                    key={item.id}
                    item={item}
                    isBusy={Boolean(busyItemIds[item.id])}
                    onInitStock={handleInitStock}
                    onUpdateQuantity={handleUpdateQuantity}
                    onToggleStock={handleToggleStockAvailability}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
