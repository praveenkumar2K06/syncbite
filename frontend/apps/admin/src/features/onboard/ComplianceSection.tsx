import type { OnboardFormData } from "../../types/dashboard";
import { FormLabel } from "../../components/ui/form";
import { Input } from "../../components/ui/input";

interface Props {
  onboardForm: OnboardFormData;
  onChangeForm: (updated: OnboardFormData) => void;
  copiedField: string | null;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
}

export default function ComplianceSection({
  onboardForm,
  onChangeForm,
  copiedField: _copiedField,
  onCopy: _onCopy,
}: Props) {
  return (
    <>
      {/* Section 2: Food Safety & Tax Compliance */}
      <div className="flex flex-col gap-3.5 pb-5 border-b border-border/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <span>📜</span> Regulatory & Tax Compliance (Required)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1">
              14-Digit FSSAI License Number *
            </FormLabel>
            <span className="block text-[11px] text-muted-foreground mb-1.5">
              Mandatory for campus food safety
            </span>
            <Input
              type="text"
              required
              maxLength={14}
              value={onboardForm.fssai_license_number}
              onChange={(e) =>
                onChangeForm({
                  ...onboardForm,
                  fssai_license_number: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="e.g. 12423008000001"
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-cyan-300 font-mono"
            />
          </div>

          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1">
              15-Character GSTIN Tax Identifier *
            </FormLabel>
            <span className="block text-[11px] text-muted-foreground mb-1.5">
              State code + PAN + entity + Z + check digit
            </span>
            <Input
              type="text"
              required
              maxLength={15}
              value={onboardForm.gstin}
              onChange={(e) =>
                onChangeForm({
                  ...onboardForm,
                  gstin: e.target.value.toUpperCase().trim(),
                })
              }
              placeholder="e.g. 33AAAAA0000A1Z5"
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-cyan-300 font-mono"
            />
          </div>
        </div>
      </div>
    </>
  );
}
