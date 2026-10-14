import { useState, useEffect } from "react";
import { DEFAULT_CATEGORY } from "@/constants";
import type { FoodType } from "@/lib/portal";
import type { NewMenuItemDraft } from "@/types";
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
import CategoryInput from "./CategoryInput";
import FoodTypePicker from "./FoodTypePicker";

export interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: NewMenuItemDraft) => Promise<void>;
  categories: string[];
  busy: boolean;
}

export default function AddItemDialog({
  open,
  onClose,
  onAdd,
  categories,
  busy,
}: AddItemDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState(categories[0] ?? DEFAULT_CATEGORY);
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [foodType, setFoodType] = useState<FoodType>("veg");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      setCat((prev) => prev || categories[0] || DEFAULT_CATEGORY);
    }
  }, [open, categories]);

  const reset = () => {
    setName("");
    setPrice("");
    setCat(categories[0] ?? DEFAULT_CATEGORY);
    setDesc("");
    setImageUrl("");
    setFoodType("veg");
    setErrors({});
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    if (!name.trim()) errs.name = true;
    if (!price || Number(price) <= 0) errs.price = true;
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    await onAdd({
      name: name.trim(),
      price: Number(price),
      category: cat.trim() || DEFAULT_CATEGORY,
      description: desc.trim(),
      foodType,
      image_url: imageUrl.trim() || null,
    });
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) close();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Dish</DialogTitle>
          <DialogDescription>
            Add a new item to your menu. It will immediately be available for students to order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">
              Dish Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
              }}
              placeholder="e.g. Paneer Butter Masala"
              aria-invalid={Boolean(errors.name)}
              autoFocus
              className="text-xs sm:text-sm"
            />
            {errors.name && <p className="text-[11px] text-destructive m-0">Name is required.</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">
                Price (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: false }));
                }}
                placeholder="0"
                min="1"
                aria-invalid={Boolean(errors.price)}
                className="text-xs sm:text-sm"
              />
              {errors.price && (
                <p className="text-[11px] text-destructive m-0">Enter a valid price.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">Category</Label>
              <CategoryInput
                value={cat}
                onChange={setCat}
                categories={categories}
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">Dietary Type</Label>
            <FoodTypePicker value={foodType} onChange={setFoodType} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">Description</Label>
            <Input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Served with butter roti or steamed rice (optional)"
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-medium">Image URL</Label>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... (optional)"
              className="text-xs sm:text-sm"
            />
            {imageUrl.trim() && (
              <div className="mt-2 flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/20">
                <img
                  src={imageUrl.trim()}
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

          <DialogFooter className="mt-2 pt-2">
            <Button type="button" variant="outline" onClick={close} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={busy} className="text-xs font-semibold">
              {busy ? "Saving…" : "Add Dish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
