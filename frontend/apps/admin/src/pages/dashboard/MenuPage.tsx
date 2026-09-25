import { useEffect, useState, type FormEvent } from "react";
import {
  createBranchMenuApi,
  createCategoryApi,
  createMenuItemApi,
  getBranchMenuApi,
  toggleMenuItemAvailabilityApi,
  updateMenuItemApi,
  type Menu,
  type MenuItem,
} from "../../api/admin";
import { ApiError } from "../../api/client";
import MenuItemModal from "../../components/modals/MenuItemModal";
import BulkMenuImportModal from "../../components/modals/BulkMenuImportModal";
import MenuTab from "../../features/MenuTab";
import { useDashboard } from "../../context/DashboardContext";
import type { ItemFormData, ItemModalState } from "../../types/dashboard";

const EMPTY_ITEM_FORM: ItemFormData = {
  name: "",
  category_id: "",
  new_category_name: "",
  base_price: "",
  description: "",
  image_url: "",
  is_veg: true,
  is_available: true,
};

export default function MenuPage() {
  const { branches, selectedBranchId, setSelectedBranchId, showToast } = useDashboard();
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [selectedCatFilter, setSelectedCatFilter] = useState("ALL");
  const [itemToggling, setItemToggling] = useState<string | null>(null);
  const [itemModal, setItemModal] = useState<ItemModalState | null>(null);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [itemForm, setItemForm] = useState<ItemFormData>(EMPTY_ITEM_FORM);
  const [itemSaving, setItemSaving] = useState(false);

  const fetchMenu = async (branchId: string) => {
    if (!branchId) {
      setCurrentMenu(null);
      return;
    }
    setMenuLoading(true);
    try {
      setCurrentMenu(await getBranchMenuApi(branchId));
    } catch {
      setCurrentMenu(null);
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    void fetchMenu(selectedBranchId);
  }, [selectedBranchId]);

  async function initializeMenu() {
    if (!selectedBranchId) return;
    setMenuLoading(true);
    try {
      setCurrentMenu(await createBranchMenuApi(selectedBranchId, "Main Menu"));
      showToast("Menu initialized successfully! You can now add categories and dishes.", "success");
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Could not initialize menu.", "error");
    } finally {
      setMenuLoading(false);
    }
  }

  async function toggleItemAvailability(item: MenuItem) {
    setItemToggling(item.id);
    try {
      const updated = await toggleMenuItemAvailabilityApi(item.id, !item.is_available);
      setCurrentMenu(
        (menu) =>
          menu && {
            ...menu,
            categories: menu.categories.map((category) => ({
              ...category,
              items: category.items.map((entry) =>
                entry.id === item.id ? { ...entry, is_available: updated.is_available } : entry,
              ),
            })),
          },
      );
      showToast(
        `"${item.name}" marked ${updated.is_available ? "IN STOCK ✓" : "SOLD OUT ⊘"}.`,
        "success",
      );
    } catch (error) {
      showToast(
        error instanceof ApiError ? error.message : "Could not toggle availability.",
        "error",
      );
    } finally {
      setItemToggling(null);
    }
  }

  function openItemModal(mode: "create" | "edit", item?: MenuItem) {
    if (mode === "edit" && item) {
      setItemForm({
        name: item.name,
        category_id: item.category_id,
        new_category_name: "",
        base_price: String(item.base_price),
        description: item.description || "",
        image_url: item.image_url || "",
        is_veg: item.is_veg,
        is_available: item.is_available,
      });
      setItemModal({ open: true, mode: "edit", item });
      return;
    }
    setItemForm({ ...EMPTY_ITEM_FORM, category_id: currentMenu?.categories[0]?.id || "" });
    setItemModal({ open: true, mode: "create" });
  }

  async function saveItem(event: FormEvent) {
    event.preventDefault();
    if (!itemForm.name.trim()) return showToast("Item name is required.", "error");
    const price = Number.parseFloat(itemForm.base_price);
    if (Number.isNaN(price) || price < 0)
      return showToast("Valid price greater than or equal to 0 is required.", "error");
    setItemSaving(true);
    try {
      if (itemModal?.mode === "edit" && itemModal.item) {
        const updated = await updateMenuItemApi(itemModal.item.id, {
          name: itemForm.name.trim(),
          base_price: price,
          description: itemForm.description.trim() || null,
          image_url: itemForm.image_url.trim() || null,
          is_veg: itemForm.is_veg,
          is_available: itemForm.is_available,
          category_id: itemForm.category_id || undefined,
        });
        setCurrentMenu(
          (menu) =>
            menu && {
              ...menu,
              categories: menu.categories.map((category) => ({
                ...category,
                items: category.items.map((entry) =>
                  entry.id === updated.id ? { ...entry, ...updated } : entry,
                ),
              })),
            },
        );
        showToast(`Item "${updated.name}" updated successfully!`, "success");
      } else {
        let categoryId = itemForm.category_id;
        if (!categoryId && itemForm.new_category_name.trim()) {
          categoryId = (
            await createCategoryApi(selectedBranchId, itemForm.new_category_name.trim())
          ).id;
        }
        if (!categoryId)
          return showToast("Please select or create a category for this dish.", "error");
        await createMenuItemApi(selectedBranchId, {
          category_id: categoryId,
          name: itemForm.name.trim(),
          base_price: price,
          description: itemForm.description.trim() || undefined,
          image_url: itemForm.image_url.trim() || undefined,
          is_veg: itemForm.is_veg,
          is_available: itemForm.is_available,
        });
        await fetchMenu(selectedBranchId);
        showToast(`Dish "${itemForm.name}" added to menu!`, "success");
      }
      setItemModal(null);
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Failed to save item.", "error");
    } finally {
      setItemSaving(false);
    }
  }

  async function handleBulkImport(
    items: Array<{ name: string; price: number; categoryName: string; isVeg: boolean }>,
  ) {
    if (!selectedBranchId) return;
    if (!currentMenu) {
      await initializeMenu();
    }
    // Group items by category
    const catMap = new Map<string, string>();
    currentMenu?.categories.forEach((c) => catMap.set(c.name.toLowerCase(), c.id));

    let createdCount = 0;
    for (const item of items) {
      const lower = item.categoryName.toLowerCase();
      let catId = catMap.get(lower);
      if (!catId) {
        const newCat = await createCategoryApi(selectedBranchId, item.categoryName);
        catId = newCat.id;
        catMap.set(lower, catId);
      }
      await createMenuItemApi(selectedBranchId, {
        category_id: catId,
        name: item.name,
        base_price: item.price,
        is_veg: item.isVeg,
        is_available: true,
      });
      createdCount++;
    }

    await fetchMenu(selectedBranchId);
    showToast(`Successfully batch-imported ${createdCount} dishes!`, "success");
  }

  const selectedBranch = branches.find((branch) => branch.id === selectedBranchId);

  return (
    <>
      <MenuTab
        selectedBranch={selectedBranch}
        selectedBranchId={selectedBranchId}
        branches={branches}
        currentMenu={currentMenu}
        menuLoading={menuLoading}
        selectedCatFilter={selectedCatFilter}
        itemToggling={itemToggling}
        onSelectBranchId={setSelectedBranchId}
        onSelectCatFilter={setSelectedCatFilter}
        onInitializeMenu={initializeMenu}
        onOpenCreateItem={() => openItemModal("create")}
        onOpenEditItem={(item) => openItemModal("edit", item)}
        onToggleItemAvailability={toggleItemAvailability}
        onOpenBulkImport={() => setBulkImportOpen(true)}
      />
      {itemModal?.open && (
        <MenuItemModal
          modal={itemModal}
          form={itemForm}
          saving={itemSaving}
          categories={currentMenu?.categories}
          onClose={() => setItemModal(null)}
          onChangeForm={setItemForm}
          onSave={saveItem}
        />
      )}
      {bulkImportOpen && (
        <BulkMenuImportModal
          open={bulkImportOpen}
          onClose={() => setBulkImportOpen(false)}
          branchName={selectedBranch?.name || "Selected Outlet"}
          onImport={handleBulkImport}
        />
      )}
    </>
  );
}
