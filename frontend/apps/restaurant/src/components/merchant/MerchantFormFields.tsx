import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface MerchantFormData {
  business_name: string;
  legal_entity_name: string;
  fssai_license_number: string;
  gstin: string;
  bank_account_number: string;
  bank_ifsc_code: string;
}

interface MerchantFormFieldsProps {
  form: MerchantFormData;
  onChange: (fields: Partial<MerchantFormData>) => void;
}

export function MerchantFormFields({ form, onChange }: MerchantFormFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-xs">Business Name</Label>
        <Input
          value={form.business_name}
          onChange={(e) => onChange({ business_name: e.target.value })}
          required
          className="text-xs"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Legal Entity Name</Label>
        <Input
          value={form.legal_entity_name}
          onChange={(e) => onChange({ legal_entity_name: e.target.value })}
          required
          className="text-xs"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">FSSAI License Number</Label>
        <Input
          value={form.fssai_license_number}
          onChange={(e) => onChange({ fssai_license_number: e.target.value })}
          required
          className="text-xs font-mono"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">GSTIN</Label>
        <Input
          value={form.gstin}
          onChange={(e) => onChange({ gstin: e.target.value.toUpperCase() })}
          className="text-xs font-mono"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Bank Account Number</Label>
          <Input
            value={form.bank_account_number}
            onChange={(e) => onChange({ bank_account_number: e.target.value })}
            className="text-xs font-mono"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">IFSC Code</Label>
          <Input
            value={form.bank_ifsc_code}
            onChange={(e) => onChange({ bank_ifsc_code: e.target.value.toUpperCase() })}
            className="text-xs font-mono"
          />
        </div>
      </div>
    </>
  );
}
