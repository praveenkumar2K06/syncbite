import type { MenuItemVM } from "@/lib/portal";
import type { NewMenuItemDraft } from "@/types";
import AddItemDialog from "./AddItemDialog";
import EditItemDialog from "./EditItemDialog";

export interface MenuModalsProps {
  addItemOpen: boolean;
  onCloseAddItem: () => void;
  onAddItem: (item: NewMenuItemDraft) => Promise<void>;
  editItemOpen: boolean;
  editItemData: MenuItemVM | null;
  onCloseEditItem: () => void;
  onSaveItem: (item: MenuItemVM) => Promise<void>;
  onRemoveItem: (id: string) => Promise<void>;
  categories: string[];
  busyItemId: string | null;
}

export default function MenuModals({
  addItemOpen,
  onCloseAddItem,
  onAddItem,
  editItemOpen,
  editItemData,
  onCloseEditItem,
  onSaveItem,
  onRemoveItem,
  categories,
  busyItemId,
}: MenuModalsProps) {
  return (
    <>
      <AddItemDialog
        open={addItemOpen}
        onClose={onCloseAddItem}
        categories={categories}
        busy={busyItemId === "new"}
        onAdd={onAddItem}
      />

      <EditItemDialog
        item={editItemData}
        open={editItemOpen}
        onClose={onCloseEditItem}
        categories={categories}
        busy={busyItemId === editItemData?.id}
        onSave={onSaveItem}
        onRemove={onRemoveItem}
      />
    </>
  );
}
