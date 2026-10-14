import { useState, useEffect, useCallback, useMemo, type FormEvent } from "react";
import { useDashboard, useDashboardActions } from "../../context/DashboardContext";
import {
  getBranchMenuApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  updateMenuItemApi,
  type Menu,
  type MenuCategory,
} from "../../api/admin";
import { ApiError } from "../../api/client";
import { Input } from "../../components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export default function CategoriesPage() {
  const { branches, selectedBranchId, setSelectedBranchId } = useDashboard();
  const { showToast } = useDashboardActions();

  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);

  // Search states
  const [categorySearch, setCategorySearch] = useState("");
  const [dishSearch, setDishSearch] = useState("");

  // Form states
  const [newCatName, setNewCatName] = useState("");
  const [newCatOrder, setNewCatOrder] = useState<string>("0");
  const [creating, setCreating] = useState(false);

  // Edit states
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editOrder, setEditOrder] = useState("0");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete & moving states
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [movingItemId, setMovingItemId] = useState<string | null>(null);

  const fetchMenu = useCallback(async (branchId: string) => {
    if (!branchId) {
      setCurrentMenu(null);
      return;
    }
    setLoading(true);
    try {
      const m = await getBranchMenuApi(branchId);
      setCurrentMenu(m);
      if (m?.categories?.length) {
        setSelectedCatId((prev) =>
          m.categories.some((c) => c.id === prev) ? prev : m.categories[0].id,
        );
      } else {
        setSelectedCatId("");
      }
    } catch {
      setCurrentMenu(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMenu(selectedBranchId);
  }, [selectedBranchId, fetchMenu]);

  const categories: MenuCategory[] = useMemo(() => {
    return [...(currentMenu?.categories || [])].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
    );
  }, [currentMenu?.categories]);

  const filteredCategories = useMemo(() => {
    const q = categorySearch.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  const allMenuItems = useMemo(() => categories.flatMap((c) => c.items || []), [categories]);
  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];
  const itemsInActiveCat = useMemo(
    () => allMenuItems.filter((i) => i.category_id === activeCategory?.id),
    [allMenuItems, activeCategory?.id],
  );

  const filteredItemsInActiveCat = useMemo(() => {
    const q = dishSearch.trim().toLowerCase();
    if (!q) return itemsInActiveCat;
    return itemsInActiveCat.filter((i) => i.name.toLowerCase().includes(q));
  }, [itemsInActiveCat, dishSearch]);

  // Handlers
  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBranchId) return showToast("Select a branch outlet first.", "error");
    if (!newCatName.trim()) return showToast("Category name is required.", "error");

    setCreating(true);
    try {
      const order = parseInt(newCatOrder, 10);
      await createCategoryApi(selectedBranchId, newCatName.trim(), Number.isNaN(order) ? 0 : order);
      await fetchMenu(selectedBranchId);
      showToast(`Category "${newCatName.trim()}" created!`, "success");
      setNewCatName("");
      setNewCatOrder("0");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to create category.", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleSaveEdit = async (catId: string) => {
    if (!editName.trim()) return showToast("Category name is required.", "error");
    setSavingEdit(true);
    try {
      const ord = parseInt(editOrder, 10);
      await updateCategoryApi(catId, {
        name: editName.trim(),
        display_order: Number.isNaN(ord) ? 0 : ord,
      });
      await fetchMenu(selectedBranchId);
      showToast(`Category "${editName.trim()}" updated!`, "success");
      setEditingCatId(null);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to update category.", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteCategory = async (cat: MenuCategory) => {
    const dishCount = allMenuItems.filter((i) => i.category_id === cat.id).length;
    let fallbackId: string | undefined;

    if (dishCount > 0) {
      const otherCats = categories.filter((c) => c.id !== cat.id);
      const fallback = otherCats[0];
      const promptText = fallback
        ? `Category "${cat.name}" has ${dishCount} dishes assigned.\nDelete category and move these dishes to "${fallback.name}"?`
        : `Category "${cat.name}" has ${dishCount} dishes assigned.\nDelete category anyway?`;
      if (!window.confirm(promptText)) return;
      fallbackId = fallback?.id;
    } else {
      if (!window.confirm(`Delete empty category "${cat.name}"?`)) return;
    }

    setDeletingCatId(cat.id);
    try {
      await deleteCategoryApi(cat.id, fallbackId);
      await fetchMenu(selectedBranchId);
      showToast(`Category "${cat.name}" deleted.`, "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to delete category.", "error");
    } finally {
      setDeletingCatId(null);
    }
  };

  const handleMoveDish = async (itemId: string, targetCategoryId: string) => {
    if (!targetCategoryId || targetCategoryId === activeCategory?.id) return;
    setMovingItemId(itemId);
    try {
      await updateMenuItemApi(itemId, { category_id: targetCategoryId });
      await fetchMenu(selectedBranchId);
      showToast("Dish moved to new category.", "success");
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to move dish.", "error");
    } finally {
      setMovingItemId(null);
    }
  };

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  return (
    <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Menu Categories Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize menu category sequences, customize display orders, and reassign dishes across
            sections.
          </p>
        </div>

        {/* Branch Outlet Picker */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Branch Outlet:</label>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold outline-none bg-slate-900 border border-slate-700 text-slate-200 cursor-pointer"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Creation Card */}
      <div
        className="rounded-2xl p-5 border flex flex-col gap-3 shadow-xl"
        style={{ background: "#111827", borderColor: "#1e2d45" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Create New Category for {selectedBranch?.name || "Selected Outlet"}
          </span>
          <span className="text-[11px] text-slate-400">
            Sequence numbers determine presentation ordering on student apps (0 appears first).
          </span>
        </div>

        <form
          onSubmit={handleCreateCategory}
          className="flex flex-wrap sm:flex-nowrap items-center gap-3"
        >
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="e.g. Starters, Main Course, Refreshments, Combos..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full text-xs h-10 bg-slate-900 border border-slate-700 text-white rounded-xl"
            />
          </div>
          <div className="w-28">
            <Input
              type="number"
              min="0"
              placeholder="Display Order"
              title="Display Order (0, 1, 2...)"
              value={newCatOrder}
              onChange={(e) => setNewCatOrder(e.target.value)}
              className="w-full text-xs h-10 bg-slate-900 border border-slate-700 text-white text-center rounded-xl"
            />
          </div>
          <button
            type="submit"
            disabled={creating || !newCatName.trim()}
            className="px-5 h-10 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shrink-0 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
          >
            {creating ? "Adding..." : "＋ Add Category"}
          </button>
        </form>
      </div>

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Categories List & Manager */}
        <div
          className="lg:col-span-5 rounded-2xl p-4 border flex flex-col gap-3"
          style={{ background: "#111827", borderColor: "#1e2d45" }}
        >
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Configured Categories ({categories.length})
            </span>
            {loading && <span className="text-[10px] text-orange-400">Loading…</span>}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <HugeiconsIcon icon={Search01Icon} size={14} />
            </span>
            <Input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search categories…"
              className="w-full text-xs h-8 pl-8.5 bg-slate-900 border border-slate-700 text-white rounded-xl placeholder:text-slate-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[300px]">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No categories configured for this outlet yet. Use the form above to add your first
                section.
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No categories match &quot;{categorySearch}&quot;.
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const count = allMenuItems.filter((i) => i.category_id === cat.id).length;
                const isSelected = (activeCategory?.id || categories[0]?.id) === cat.id;
                const isEditing = editingCatId === cat.id;

                if (isEditing) {
                  return (
                    <div
                      key={cat.id}
                      className="p-3.5 rounded-xl border border-orange-500/60 bg-orange-500/10 flex flex-col gap-2.5"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-semibold">
                          Category Name
                        </label>
                        <Input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="text-xs h-8 bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-semibold">
                          Display Sequence Order #
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={editOrder}
                          onChange={(e) => setEditOrder(e.target.value)}
                          className="text-xs h-8 bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCatId(null)}
                          disabled={savingEdit}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={savingEdit || !editName.trim()}
                          onClick={() => handleSaveEdit(cat.id)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg cursor-pointer"
                        >
                          {savingEdit ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCatId(cat.id)}
                    className="p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    style={{
                      background: isSelected ? "rgba(249,115,22,0.12)" : "#131b2e",
                      borderColor: isSelected ? "#f97316" : "#1e2d45",
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                        <span>{cat.name}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Display Order #{cat.display_order ?? 0}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          background: isSelected ? "#f97316" : "#1e2d45",
                          color: isSelected ? "#ffffff" : "#94a3b8",
                        }}
                      >
                        {count} dishes
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCatId(cat.id);
                          setEditName(cat.name);
                          setEditOrder(String(cat.display_order ?? 0));
                        }}
                        className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded-md border border-slate-700 hover:bg-slate-800 cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={deletingCatId === cat.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDeleteCategory(cat);
                        }}
                        className="text-[11px] text-red-400 hover:text-red-300 px-2 py-1 rounded-md border border-red-900/50 hover:bg-red-950/60 cursor-pointer"
                        title="Delete category"
                      >
                        {deletingCatId === cat.id ? "…" : "✕"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Dishes in Selected Category & Reassignment */}
        <div
          className="lg:col-span-7 rounded-2xl p-5 border flex flex-col gap-4 shadow-xl"
          style={{ background: "#111827", borderColor: "#1e2d45" }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">
                {activeCategory ? `Dishes in "${activeCategory.name}"` : "Category Dishes"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {itemsInActiveCat.length} dishes assigned. Reassign items to other categories in
                real time.
              </p>
            </div>
            {activeCategory && (
              <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                Display Order: #{activeCategory.display_order ?? 0}
              </span>
            )}
          </div>

          {itemsInActiveCat.length > 0 && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <HugeiconsIcon icon={Search01Icon} size={14} />
              </span>
              <Input
                type="text"
                value={dishSearch}
                onChange={(e) => setDishSearch(e.target.value)}
                placeholder="Search dishes in category…"
                className="w-full text-xs h-8 pl-8.5 bg-slate-900 border border-slate-700 text-white rounded-xl placeholder:text-slate-500"
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[300px]">
            {itemsInActiveCat.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No dishes currently assigned to "{activeCategory?.name || "this category"}".
              </div>
            ) : filteredItemsInActiveCat.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No dishes match &quot;{dishSearch}&quot;.
              </div>
            ) : (
              filteredItemsInActiveCat.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-200 truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Base Price: ₹{item.base_price}
                      {item.is_available ? (
                        <span className="ml-2 text-emerald-400 font-sans font-normal">
                          In Stock
                        </span>
                      ) : (
                        <span className="ml-2 text-slate-500 font-sans font-normal">Sold Out</span>
                      )}
                    </div>
                  </div>

                  {/* Reassign dropdown */}
                  {categories.length > 1 && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400 font-medium">Move to:</span>
                      <select
                        disabled={movingItemId === item.id}
                        value={activeCategory?.id || ""}
                        onChange={(e) => void handleMoveDish(item.id, e.target.value)}
                        className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
