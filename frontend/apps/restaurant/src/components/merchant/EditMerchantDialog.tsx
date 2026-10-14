import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MerchantFormFields, type MerchantFormData } from "./MerchantFormFields";

interface EditMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: MerchantFormData;
  onChange: (fields: Partial<MerchantFormData>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
}

export function EditMerchantDialog({
  open,
  onOpenChange,
  form,
  onChange,
  onSubmit,
  submitting,
}: EditMerchantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Edit Merchant Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <MerchantFormFields form={form} onChange={onChange} />
          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="font-bold">
              {submitting ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
