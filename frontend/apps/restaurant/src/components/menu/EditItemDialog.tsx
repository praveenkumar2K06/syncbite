import { useState, useEffect } from "react";
import { DEFAULT_CATEGORY } from "@/constants";
import type { FoodType, MenuItemVM } from "@/lib/portal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Toggle from "../common/Toggle";
import CategoryInput from "./CategoryInput";
import FoodTypePicker from "./FoodTypePicker";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";

export interface EditItemDialogProps {
  item: MenuItemVM | null;
  open: boolean;
  onClose: () => void;
  onSave: (item: MenuItemVM) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  categories: string[];
  busy: boolean;
}

export default function EditItemDialog({
  item,
  open,
  onClose,
  onSave,
  onRemove,
  categories,
  busy,
}: EditItemDialogProps) {
  const [form, setForm] = useState<MenuItemVM | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({ ...item });
      setConfirmDel(false);
    }
  }, [item, open]);

  if (!form) return null;

  const f = (k: keyof MenuItemVM, v: string | number | FoodType | boolean) =>
    setForm((p) => (p ? { ...p, [k]: v } : null));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !form.name.trim() || form.price <= 0) return;
    await onSave({
      ...form,
      name: form.name.trim(),
      category: form.category.trim() || DEFAULT_CATEGORY,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Edit Dish</DialogTitle>
            <Badge
              variant={form.isAvailable ? "default" : "secondary"}
              className="text-[10px] h-5 px-1.5"
            >
              {form.isAvailable ? "In Stock" : "Sold Out"}
            </Badge>
          </div>
          <DialogDescription>
            Update pricing, category, food type, or student order availability.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">Dish Name</Label>
            <Input
              value={form.name}
              onChange={(e) => f("name", e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">Price (₹)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => f("price", Number(e.target.value))}
                min="1"
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">Category</Label>
              <CategoryInput
                value={form.category}
                onChange={(v) => f("category", v)}
                categories={categories}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">Dietary Type</Label>
            <FoodTypePicker value={form.foodType} onChange={(t) => f("foodType", t)} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">Description</Label>
            <Input
              value={form.description ?? ""}
              onChange={(e) => f("description", e.target.value)}
              placeholder="Optional notes or description"
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">Image URL</Label>
            <Input
              type="url"
              value={form.imageUrl ?? ""}
              onChange={(e) => f("imageUrl", e.target.value)}
              placeholder="https://images.unsplash.com/... (optional)"
              className="text-xs sm:text-sm"
            />
            {form.imageUrl?.trim() && (
              <div className="mt-2 flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/20">
                <img
                  src={form.imageUrl.trim()}
                  alt="Dish preview"
                  className="w-12 h-12 rounded object-cover border border-border bg-muted shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-[11px] text-muted-foreground truncate">Image preview</span>
              </div>
            )}
          </div>

          {/* Student Availability Toggle Card */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-muted/20">
            <div>
              <p className="text-xs font-semibold text-foreground m-0">Available for Ordering</p>
              <p className="text-[11px] text-muted-foreground m-0">
                {form.isAvailable
                  ? "Students can see and purchase this item"
                  : "Marked as sold out on student menus"}
              </p>
            </div>
            <Toggle on={form.isAvailable} onChange={(v) => f("isAvailable", v)} />
          </div>

          {/* Inline Delete Confirmation */}
          {confirmDel ? (
            <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 space-y-2">
              <div className="flex items-start gap-2 text-destructive">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  strokeWidth={2}
                  className="w-4 h-4 shrink-0 mt-0.5"
                />
                <p className="text-xs font-semibold m-0">
                  Permanently remove "{form.name}" from menu?
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground m-0">
                Students will no longer see this dish. You can also just toggle availability off
                instead.
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => setConfirmDel(false)}
                >
                  Keep Dish
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="xs"
                  disabled={busy}
                  onClick={async () => {
                    await onRemove(form.id);
                    onClose();
                  }}
                >
                  {busy ? "Removing…" : "Confirm Remove"}
                </Button>
              </div>
            </div>
          ) : (
            <DialogFooter className="mt-2 pt-2 flex flex-row items-center justify-between gap-2 sm:justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmDel(true)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5 text-xs h-8"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} className="w-3.5 h-3.5" />
                Remove
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={busy}
                  className="text-xs font-semibold h-8"
                >
                  {busy ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
