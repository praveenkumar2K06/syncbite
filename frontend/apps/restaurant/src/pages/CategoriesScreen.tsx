import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePortal } from "@/context/PortalContext";
import { useMenu } from "@/hooks/useMenu";
import { updateMenuItemApi, toUserMessage } from "@/api";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Restaurant01Icon, Tag01Icon } from "@hugeicons/core-free-icons";
import { AddCategoryBar } from "@/components/categories/AddCategoryBar";
import { CategoriesList } from "@/components/categories/CategoriesList";
import { CategoryDishesPanel } from "@/components/categories/CategoryDishesPanel";

export default function CategoriesScreen() {
  const navigate = useNavigate();
  const { showToast, branchId } = usePortal();
  const { menu, handleAddCategory, handleUpdateCategory, handleDeleteCategory, refreshMenu } =
    useMenu({ branchId, showToast });

  // Form states for creating a new category
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryOrder, setNewCategoryOrder] = useState("0");
  const [creating, setCreating] = useState(false);

  // Selection & Inline editing states
  const [selectedCategory, setSelectedCategory] = useState<string>(menu.categories[0] || "");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editNameVal, setEditNameVal] = useState("");
  const [editOrderVal, setEditOrderVal] = useState("0");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  // Moving dish state
  const [movingItemId, setMovingItemId] = useState<string | null>(null);

  // Ensure selected category is valid if categories change
  const activeCategory = menu.categories.includes(selectedCategory)
    ? selectedCategory
    : menu.categories[0] || "";

  const activeCategoryId = menu.categoryIds[activeCategory];
  const dishesInActiveCat = useMemo(
    () => menu.items.filter((item) => item.category === activeCategory),
    [menu.items, activeCategory],
  );

  const handleCreate = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      showToast("Category name is required", "error");
      return;
    }
    setCreating(true);
    try {
      const order = parseInt(newCategoryOrder, 10);
      await handleAddCategory(trimmed, Number.isNaN(order) ? 0 : order);
      setNewCategoryName("");
      setNewCategoryOrder("0");
      setSelectedCategory(trimmed);
    } finally {
      setCreating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    const catId = menu.categoryIds[editingCategory];
    const trimmed = editNameVal.trim();
    if (!catId || !trimmed) {
      showToast("Category name cannot be empty", "error");
      return;
    }
    setSavingEdit(true);
    try {
      const order = parseInt(editOrderVal, 10);
      await handleUpdateCategory(catId, trimmed, Number.isNaN(order) ? 0 : order);
      if (selectedCategory === editingCategory) {
        setSelectedCategory(trimmed);
      }
      setEditingCategory(null);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (categoryName: string) => {
    const catId = menu.categoryIds[categoryName];
    if (!catId) return;

    const dishes = menu.items.filter((i) => i.category === categoryName);
    const otherCategories = menu.categories.filter((c) => c !== categoryName);
    const fallbackCategoryName = otherCategories[0];
    const fallbackCategoryId = fallbackCategoryName
      ? menu.categoryIds[fallbackCategoryName]
      : undefined;

    if (dishes.length > 0) {
      const confirmMsg = fallbackCategoryName
        ? `Category "${categoryName}" has ${dishes.length} dishes. Delete and move them to "${fallbackCategoryName}"?`
        : `Category "${categoryName}" has ${dishes.length} dishes. Delete category and remove associations?`;
      if (!window.confirm(confirmMsg)) return;
    } else {
      if (!window.confirm(`Delete empty category "${categoryName}"?`)) return;
    }

    setDeletingCategory(categoryName);
    try {
      await handleDeleteCategory(catId, fallbackCategoryId);
      if (selectedCategory === categoryName) {
        setSelectedCategory(otherCategories[0] || "");
      }
    } finally {
      setDeletingCategory(null);
    }
  };

  const handleMoveDish = async (dishId: string, targetCategoryName: string) => {
    const targetCatId = menu.categoryIds[targetCategoryName];
    if (!targetCatId) return;
    setMovingItemId(dishId);
    try {
      await updateMenuItemApi(dishId, { category_id: targetCatId });
      showToast(`Dish moved to "${targetCategoryName}".`);
      await refreshMenu();
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setMovingItemId(null);
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Header with Breadcrumb / Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Tag01Icon} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Menu Category Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Organize food sections, customize customer display order sequences, and reassign
                dishes between categories.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/menu")}
              className="h-9 gap-1.5 text-xs font-semibold"
            >
              <HugeiconsIcon icon={Restaurant01Icon} strokeWidth={2} className="w-3.5 h-3.5" />
              Back to Menu Catalog
            </Button>
          </div>
        </div>

        {/* Quick Add Category Bar */}
        <AddCategoryBar
          name={newCategoryName}
          order={newCategoryOrder}
          creating={creating}
          onNameChange={setNewCategoryName}
          onOrderChange={setNewCategoryOrder}
          onSubmit={handleCreate}
        />

        {/* Two-Column Management Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Categories List & Reordering */}
          <div className="lg:col-span-5 space-y-4">
            <CategoriesList
              categories={menu.categories}
              activeCategory={activeCategory}
              categoryOrders={menu.categoryOrders}
              items={menu.items}
              editingCategory={editingCategory}
              editNameVal={editNameVal}
              editOrderVal={editOrderVal}
              savingEdit={savingEdit}
              deletingCategory={deletingCategory}
              onSelectCategory={setSelectedCategory}
              onStartEdit={(name, order) => {
                setEditingCategory(name);
                setEditNameVal(name);
                setEditOrderVal(String(order));
              }}
              onCancelEdit={() => setEditingCategory(null)}
              onEditNameChange={setEditNameVal}
              onEditOrderChange={setEditOrderVal}
              onSaveEdit={handleSaveEdit}
              onDeleteCategory={handleDelete}
            />
          </div>

          {/* Right Column: Dishes in Selected Category & Quick Reassignment */}
          <div className="lg:col-span-7 space-y-4">
            <CategoryDishesPanel
              activeCategory={activeCategory}
              activeCategoryId={activeCategoryId}
              dishes={dishesInActiveCat}
              categories={menu.categories}
              displayOrder={menu.categoryOrders?.[activeCategory]}
              movingItemId={movingItemId}
              onMoveDish={handleMoveDish}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
