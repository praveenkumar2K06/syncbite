import type { OnboardFormData } from "../../types/dashboard";
import { FormLabel } from "../../components/ui/form";
import { Input } from "../../components/ui/input";

interface Props {
  onboardForm: OnboardFormData;
  onChangeForm: (updated: OnboardFormData) => void;
  copiedField: string | null;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
}

export default function OutletLegalSection({
  onboardForm,
  onChangeForm,
  copiedField: _copiedField,
  onCopy: _onCopy,
}: Props) {
  return (
    <>
      {/* Section 1: Outlet & Legal Entity Information */}
      <div className="flex flex-col gap-3.5 pb-5 border-b border-border/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <span>🏢</span> Outlet & Legal Entity Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Restaurant / Outlet Trading Name *
            </FormLabel>
            <Input
              type="text"
              required
              value={onboardForm.name}
              onChange={(e) => {
                const newName = e.target.value;
                onChangeForm({
                  ...onboardForm,
                  name: newName,
                });
              }}
              onBlur={() => {
                if (!onboardForm.legal_entity_name.trim() && onboardForm.name.trim()) {
                  onChangeForm({
                    ...onboardForm,
                    legal_entity_name: `${onboardForm.name.trim()} Hospitality Pvt Ltd`,
                    description: onboardForm.description?.trim()
                      ? onboardForm.description
                      : `${onboardForm.name.trim()} campus outlet serving students and faculty at VIT Vellore.`,
                  });
                }
              }}
              placeholder="e.g. Kathi Express, Chai Galli..."
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <FormLabel className="text-xs font-medium text-foreground">
                Registered Legal Entity Name *
              </FormLabel>
              {onboardForm.name.trim() && (
                <button
                  type="button"
                  onClick={() =>
                    onChangeForm({
                      ...onboardForm,
                      legal_entity_name: `${onboardForm.name.trim()} Hospitality Pvt Ltd`,
                    })
                  }
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Autofill Pvt Ltd
                </button>
              )}
            </div>
            <Input
              type="text"
              required
              value={onboardForm.legal_entity_name}
              onChange={(e) => onChangeForm({ ...onboardForm, legal_entity_name: e.target.value })}
              placeholder="e.g. Kathi Express Food Services Pvt Ltd"
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Campus Location / Physical Address *
            </FormLabel>
            <Input
              type="text"
              required
              value={onboardForm.address}
              onChange={(e) => onChangeForm({ ...onboardForm, address: e.target.value })}
              placeholder="e.g. Food Street, Near TT Ground Floor, VIT Vellore Campus"
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-amber-500"
            />
          </div>

          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Outlet Story & Description *
            </FormLabel>
            <Input
              type="text"
              required
              value={onboardForm.description ?? ""}
              onChange={(e) => onChangeForm({ ...onboardForm, description: e.target.value })}
              placeholder="Brief description of the restaurant, specialties, and campus location story..."
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </>
  );
}
