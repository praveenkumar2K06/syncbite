import type { Branch, Brand } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Toggle from "@/components/common/Toggle";

export interface BranchFormData {
  brand_id: string;
  name: string;
  address_text: string;
  latitude: string;
  longitude: string;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
}

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBranch: Branch | null;
  brands: Brand[];
  form: BranchFormData;
  onChange: (fields: Partial<BranchFormData>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
}

export function BranchDialog({
  open,
  onOpenChange,
  editingBranch,
  brands,
  form,
  onChange,
  onSubmit,
  submitting,
}: BranchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {editingBranch ? "Edit Branch" : "Add Physical Branch"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          {!editingBranch && (
            <div className="space-y-1.5">
              <Label className="text-xs">
                Parent Brand <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.brand_id}
                onValueChange={(val) => onChange({ brand_id: val ?? "" })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="text-xs">
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">
              Branch Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Vellore Branch, Chennai Main Campus"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              required
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">
              Full Physical Address <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Food Court #3, North Campus, Vellore"
              value={form.address_text}
              onChange={(e) => onChange({ address_text: e.target.value })}
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Opening Time</Label>
              <Input
                type="time"
                value={form.opening_time}
                onChange={(e) => onChange({ opening_time: e.target.value })}
                required
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Closing Time</Label>
              <Input
                type="time"
                value={form.closing_time}
                onChange={(e) => onChange({ closing_time: e.target.value })}
                required
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Latitude</Label>
              <Input
                type="number"
                step="any"
                placeholder="12.9716"
                value={form.latitude}
                onChange={(e) => onChange({ latitude: e.target.value })}
                className="text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Longitude</Label>
              <Input
                type="number"
                step="any"
                placeholder="79.1586"
                value={form.longitude}
                onChange={(e) => onChange({ longitude: e.target.value })}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <Label className="text-xs font-medium">Online Status</Label>
              <p className="text-[11px] text-muted-foreground">
                Accept student orders upon creation
              </p>
            </div>
            <Toggle on={form.is_active} onChange={(checked) => onChange({ is_active: checked })} />
          </div>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="font-bold">
              {submitting ? "Saving…" : editingBranch ? "Save Changes" : "Create Branch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
