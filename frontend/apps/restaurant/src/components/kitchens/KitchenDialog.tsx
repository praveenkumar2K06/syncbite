import type { KitchenUnit } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Toggle from "@/components/common/Toggle";

export interface KitchenFormData {
  name: string;
  is_active: boolean;
}

export const SUGGESTED_STATIONS = [
  "Main Kitchen",
  "Bakery & Pastry",
  "Beverage Station",
  "Tandoor & Grill",
  "Salad & Cold Prep",
  "Packing & Dispatch",
];

interface KitchenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingKitchen: KitchenUnit | null;
  form: KitchenFormData;
  onChange: (fields: Partial<KitchenFormData>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
}

export function KitchenDialog({
  open,
  onOpenChange,
  editingKitchen,
  form,
  onChange,
  onSubmit,
  submitting,
}: KitchenDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {editingKitchen ? "Edit Kitchen Station" : "Create Kitchen Station"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">
              Station Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Main Kitchen, Bakery, Beverage Station"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              required
              className="text-xs"
            />
          </div>

          {!editingKitchen && (
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Quick Station Presets</Label>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_STATIONS.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => onChange({ name: preset })}
                    className="text-[11px] px-2 py-0.5 rounded border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div>
              <Label className="text-xs font-medium">Active Status</Label>
              <p className="text-[11px] text-muted-foreground">Receives prep tickets immediately</p>
            </div>
            <Toggle on={form.is_active} onChange={(checked) => onChange({ is_active: checked })} />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="font-bold">
              {submitting ? "Saving…" : editingKitchen ? "Save Station" : "Create Station"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
