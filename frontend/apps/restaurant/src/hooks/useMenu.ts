import { useState, useCallback, useEffect } from "react";
import {
  createBranchMenuApi,
  createCategoryApi,
  createMenuItemApi,
  deleteCategoryApi,
  getBranchMenuApi,
  toUserMessage,
  updateCategoryApi,
  updateMenuItemApi,
} from "@/api";
import { mapMenu, type MenuItemVM, type PortalMenu } from "@/lib/portal";
import { EMPTY_MENU } from "@/constants";
import type { NewMenuItemDraft } from "@/types";

export interface UseMenuOptions {
  branchId: string | null;
  showToast?: (msg: string, type?: "success" | "error") => void;
}

export function useMenu({ branchId, showToast }: UseMenuOptions) {
  const [menu, setMenu] = useState<PortalMenu>(EMPTY_MENU);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemData, setEditItemData] = useState<MenuItemVM | null>(null);
  const [editItemOpen, setEditItemOpen] = useState(false);

  const refreshMenu = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    try {
      const res = await getBranchMenuApi(branchId).catch(() => null);
      setMenu(mapMenu(res));
      setMenuId(res?.id ?? null);
    } catch (err) {
      showToast?.(toUserMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [branchId, showToast]);

  // Lazy fetch on mount / branch switch
  useEffect(() => {
    if (!branchId) {
      setMenu(EMPTY_MENU);
      setMenuId(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getBranchMenuApi(branchId)
      .then((res) => {
        if (!cancelled) {
          setMenu(mapMenu(res));
          setMenuId(res?.id ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMenu(EMPTY_MENU);
          setMenuId(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [branchId]);

  /**
   * A brand new branch has no menu row, and categories/items can only be
   * attached to one. Create it lazily so the first added item works.
   */
  const ensureMenuId = useCallback(
    async (id: string): Promise<string> => {
      if (menuId) return menuId;
      const existing = await getBranchMenuApi(id).catch(() => null);
      if (existing) {
        setMenuId(existing.id);
        setMenu(mapMenu(existing));
        return existing.id;
      }
      const created = await createBranchMenuApi(id);
      setMenuId(created.id);
      return created.id;
    },
    [menuId],
  );

  /** Applies a single updated item into local menu state. */
  const applyItem = useCallback((updated: MenuItemVM) => {
    setMenu((prev) => {
      const exists = prev.items.some((i) => i.id === updated.id);
      const items = exists
        ? prev.items.map((i) => (i.id === updated.id ? updated : i))
        : [...prev.items, updated];
      return {
        ...prev,
        items,
        categories: Object.keys({
          ...prev.categoryIds,
          [updated.category]: updated.categoryId,
        }),
      };
    });
  }, []);

  const requireCategoryId = useCallback(
    async (id: string, name: string, displayOrder = 0): Promise<string> => {
      const existing = menu.categoryIds[name];
      if (existing) return existing;
      await ensureMenuId(id);
      const created = await createCategoryApi(id, name, displayOrder);
      setMenu((prev) => ({
        ...prev,
        categoryIds: { ...prev.categoryIds, [name]: created.id },
        categoryOrders: {
          ...prev.categoryOrders,
          [name]: created.display_order ?? displayOrder,
        },
        categories: prev.categories.includes(name) ? prev.categories : [...prev.categories, name],
      }));
      return created.id;
    },
    [menu.categoryIds, ensureMenuId],
  );

  const handleAddCategory = useCallback(
    async (name: string, displayOrder = 0) => {
      if (!branchId || !name.trim()) return;
      try {
        await requireCategoryId(branchId, name.trim(), displayOrder);
        showToast?.(`Category "${name.trim()}" added.`);
      } catch (err) {
        showToast?.(toUserMessage(err), "error");
      }
    },
    [branchId, requireCategoryId, showToast],
  );

  const handleUpdateCategory = useCallback(
    async (categoryId: string, name: string, displayOrder?: number) => {
      try {
        const updated = await updateCategoryApi(categoryId, {
          name: name.trim(),
          display_order: displayOrder !== undefined ? displayOrder : null,
        });
        if (branchId) {
          const freshMenu = await getBranchMenuApi(branchId);
          setMenu(mapMenu(freshMenu));
        }
        showToast?.(`Category "${updated.name}" updated.`);
      } catch (err) {
        showToast?.(toUserMessage(err), "error");
        throw err;
      }
    },
    [branchId, showToast],
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string, fallbackCategoryId?: string) => {
      try {
        await deleteCategoryApi(categoryId, fallbackCategoryId);
        if (branchId) {
          const freshMenu = await getBranchMenuApi(branchId);
          setMenu(mapMenu(freshMenu));
        }
        showToast?.("Category removed successfully.");
      } catch (err) {
        showToast?.(toUserMessage(err), "error");
        throw err;
      }
    },
    [branchId, showToast],
  );

  const handleAddItem = useCallback(
    async (draft: NewMenuItemDraft) => {
      if (!branchId) return;
      setBusyItemId("new");
      try {
        const categoryId = await requireCategoryId(branchId, draft.category);
        const created = await createMenuItemApi(branchId, {
          category_id: categoryId,
          name: draft.name,
          description: draft.description,
          base_price: draft.price,
          image_url: draft.image_url,
          is_available: true,
          is_veg: draft.foodType === "veg",
        });
        setMenu((prev) => {
          const item: MenuItemVM = {
            id: created.id,
            categoryId: created.category_id,
            category: draft.category,
            name: created.name,
            price: Number(created.base_price),
            description: created.description ?? "",
            foodType: created.is_veg ? "veg" : "nonveg",
            isAvailable: created.is_available,
            imageUrl: created.image_url ?? null,
          };
          const items = [...prev.items, item];
          return {
            ...prev,
            items,
            categories: prev.categories.includes(draft.category)
              ? prev.categories
              : [...prev.categories, draft.category],
            categoryIds: {
              ...prev.categoryIds,
              [draft.category]: created.category_id,
            },
          };
        });
        setAddItemOpen(false);
        showToast?.("Item saved successfully.");
      } catch (err) {
        showToast?.(toUserMessage(err), "error");
      } finally {
        setBusyItemId(null);
      }
    },
    [branchId, requireCategoryId, showToast],
  );

  const handleUpdateItem = useCallback(
    async (draft: MenuItemVM) => {
      if (!branchId) return;
      setBusyItemId(draft.id);
      try {
        const categoryId = draft.category
          ? await requireCategoryId(branchId, draft.category)
          : draft.categoryId;
        const updated = await updateMenuItemApi(draft.id, {
          name: draft.name,
          description: draft.description,
          base_price: draft.price,
          image_url: draft.imageUrl,
          is_available: draft.isAvailable,
          is_veg: draft.foodType === "veg",
          category_id: categoryId,
        });
        applyItem({
          ...draft,
          categoryId: updated.category_id,
          name: updated.name,
          price: Number(updated.base_price),
          description: updated.description ?? "",
          foodType: updated.is_veg ? "veg" : "nonveg",
          isAvailable: updated.is_available,
          imageUrl: updated.image_url ?? null,
        });
        showToast?.("Item saved successfully.");
      } catch (err) {
        showToast?.(toUserMessage(err), "error");
        throw err;
      } finally {
        setBusyItemId(null);
      }
    },
    [branchId, requireCategoryId, applyItem, showToast],
  );

  const handleToggleItem = useCallback(
    async (id: string) => {
      const item = menu.items.find((i) => i.id === id);
      if (!item) return;
      const next = !item.isAvailable;
      // Optimistic: instant feedback
      applyItem({ ...item, isAvailable: next });
      try {
        const updated = await updateMenuItemApi(id, { is_available: next });
        applyItem({ ...item, isAvailable: updated.is_available });
        showToast?.(`${item.name} is now ${updated.is_available ? "available" : "off"}.`);
      } catch (err) {
        applyItem(item);
        showToast?.(toUserMessage(err), "error");
      }
    },
    [menu.items, applyItem, showToast],
  );

  const handlePriceUpdate = useCallback(
    async (id: string, price: number) => {
      const item = menu.items.find((i) => i.id === id);
      if (!item) return;
      try {
        const updated = await updateMenuItemApi(id, { base_price: price });
        applyItem({ ...item, price: Number(updated.base_price) });
        showToast?.("Price updated successfully.");
      } catch (err) {
        showToast?.(toUserMessage(err), "error");
      }
    },
    [menu.items, applyItem, showToast],
  );

  const handleRemoveItem = useCallback(
    async (id: string) => {
      const item = menu.items.find((i) => i.id === id);
      if (!item) return;
      try {
        await updateMenuItemApi(id, { is_available: false });
        applyItem({ ...item, isAvailable: false });
        showToast?.(`${item.name} removed from your menu.`);
      } catch (err) {
        showToast?.(toUserMessage(err), "error");
      }
    },
    [menu.items, applyItem, showToast],
  );

  return {
    menu,
    menuId,
    loading,
    refreshMenu,
    busyItemId,
    addItemOpen,
    setAddItemOpen,
    editItemData,
    setEditItemData,
    editItemOpen,
    setEditItemOpen,
    handleAddItem,
    handleUpdateItem,
    handleToggleItem,
    handlePriceUpdate,
    handleRemoveItem,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  };
}

export default useMenu;
