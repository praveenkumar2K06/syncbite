import type { OnboardFormData } from "../../types/dashboard";
import { FormLabel } from "../../components/ui/form";
import { Input } from "../../components/ui/input";

interface Props {
  onboardForm: OnboardFormData;
  onChangeForm: (updated: OnboardFormData) => void;
  copiedField: string | null;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
}

export default function HoursCuisineSection({
  onboardForm,
  onChangeForm,
  copiedField: _copiedField,
  onCopy: _onCopy,
}: Props) {
  return (
    <>
      {/* Section 3: Cuisines & Operating Hours */}
      <div className="flex flex-col gap-3.5 pb-5 border-b border-border/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <span>🕒</span> Cuisines & Operating Hours
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Cuisine Types * (Comma-separated)
            </FormLabel>
            <Input
              type="text"
              required
              value={onboardForm.cuisine_types ?? ""}
              onChange={(e) => onChangeForm({ ...onboardForm, cuisine_types: e.target.value })}
              placeholder="e.g. Fast Food, Beverages, North Indian, Snacks"
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-emerald-500"
            />
          </div>

          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Opening Time *
            </FormLabel>
            <Input
              type="time"
              required
              value={onboardForm.opening_time ?? "08:00"}
              onChange={(e) => onChangeForm({ ...onboardForm, opening_time: e.target.value })}
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground font-mono focus:border-emerald-500"
            />
          </div>

          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Closing Time *
            </FormLabel>
            <Input
              type="time"
              required
              value={onboardForm.closing_time ?? "23:00"}
              onChange={(e) => onChangeForm({ ...onboardForm, closing_time: e.target.value })}
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground font-mono focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </>
  );
}
