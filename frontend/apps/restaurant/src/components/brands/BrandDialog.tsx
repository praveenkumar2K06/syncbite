import type { Brand } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface BrandFormData {
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  cuisineInput: string;
}

interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBrand: Brand | null;
  form: BrandFormData;
  onChange: (fields: Partial<BrandFormData>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
}

export function BrandDialog({
  open,
  onOpenChange,
  editingBrand,
  form,
  onChange,
  onSubmit,
  submitting,
}: BrandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {editingBrand ? "Edit Brand Details" : "Create New Brand"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">
              Brand Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Pizza Hut, Coffee House"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              required
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Brand Story / Description</Label>
            <Textarea
              placeholder="Describe your brand cuisine, specialties and culinary heritage…"
              value={form.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={2}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">
              Cuisine Categories{" "}
              <span className="text-muted-foreground text-[10px]">(Comma separated)</span>
            </Label>
            <Input
              placeholder="e.g. Italian, Wood-fired Pizza, Beverages"
              value={form.cuisineInput}
              onChange={(e) => onChange({ cuisineInput: e.target.value })}
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Logo Image URL</Label>
              <Input
                placeholder="https://.../logo.png"
                value={form.logo_url}
                onChange={(e) => onChange({ logo_url: e.target.value })}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Banner Image URL</Label>
              <Input
                placeholder="https://.../banner.jpg"
                value={form.banner_url}
                onChange={(e) => onChange({ banner_url: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="font-bold">
              {submitting ? "Saving…" : editingBrand ? "Update Brand" : "Create Brand"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
