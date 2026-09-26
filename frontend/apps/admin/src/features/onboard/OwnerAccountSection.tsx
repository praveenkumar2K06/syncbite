import type { OnboardFormData } from "../../types/dashboard";
import { generateSecurePassword } from "../../utils/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { FormLabel } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../../components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Refresh01Icon } from "@hugeicons/core-free-icons";

interface Props {
  onboardForm: OnboardFormData;
  onChangeForm: (updated: OnboardFormData) => void;
  copiedField: string | null;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
}

export default function OwnerAccountSection({
  onboardForm,
  onChangeForm,
  copiedField,
  onCopy,
}: Props) {
  return (
    <>
      {/* Section 4A: Legal Merchant Owner Credentials & Settlements */}
      <div className="flex flex-col gap-3.5 pb-5 border-b border-border/80">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
            Merchant Owner Account (Legal & Settlement Entity)
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-violet-950/80 border border-violet-800/60 text-violet-300">
            Role: MerchantOwner
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Initial Merchant Status *
            </FormLabel>
            <Select
              value={onboardForm.status ?? "PENDING_VERIFICATION"}
              onValueChange={(value) =>
                onChangeForm({ ...onboardForm, status: value ?? "PENDING_VERIFICATION" })
              }
            >
              <SelectTrigger className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-amber-300 font-semibold focus:border-ring focus:ring-1 focus:ring-ring transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING_VERIFICATION">
                  PENDING_VERIFICATION (Under Review)
                </SelectItem>
                <SelectItem value="APPROVED">APPROVED (Active Immediately)</SelectItem>
                <SelectItem value="DRAFT">DRAFT (Draft Registration)</SelectItem>
                <SelectItem value="SUSPENDED">SUSPENDED (Temporarily Inactive)</SelectItem>
                <SelectItem value="REJECTED">REJECTED (Application Rejected)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Owner Login Email */}
          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Owner Business Email *
            </FormLabel>
            <Input
              type="email"
              required
              value={onboardForm.email}
              onChange={(e) => onChangeForm({ ...onboardForm, email: e.target.value })}
              placeholder="outlet.owner@syncbite.com"
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-amber-300 font-mono"
            />
          </div>

          {/* Owner Password */}
          <div>
            <div className="flex min-h-5 items-center justify-between gap-3 mb-1.5">
              <FormLabel className="text-xs font-medium leading-none text-foreground">
                Owner Initial Password *
              </FormLabel>
              <button
                type="button"
                onClick={() =>
                  onChangeForm({
                    ...onboardForm,
                    password: generateSecurePassword(onboardForm.name || "Owner"),
                  })
                }
                className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium leading-none text-amber-400 hover:underline cursor-pointer"
              >
                <HugeiconsIcon icon={Refresh01Icon} size={13} /> Random
              </button>
            </div>
            <InputGroup>
              <InputGroupInput
                type="text"
                required
                value={onboardForm.password}
                onChange={(e) => onChangeForm({ ...onboardForm, password: e.target.value })}
                placeholder="Minimum 8 characters"
                className="text-sm text-amber-300 font-mono"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() =>
                    onCopy(onboardForm.password, "Owner password copied! ✓", "onboard_pass")
                  }
                  disabled={!onboardForm.password}
                  title="Copy owner password"
                >
                  <HugeiconsIcon icon={Copy01Icon} size={14} />
                  <span className="sr-only">
                    {copiedField === "onboard_pass" ? "Copied" : "Copy password"}
                  </span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Settlement Bank Account Number *
            </FormLabel>
            <Input
              type="text"
              required
              value={onboardForm.bank_account_number ?? ""}
              onChange={(e) =>
                onChangeForm({
                  ...onboardForm,
                  bank_account_number: e.target.value.replace(/\s+/g, ""),
                })
              }
              placeholder="e.g. 98765432101234"
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground font-mono focus:border-violet-500"
            />
          </div>

          <div>
            <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
              Bank IFSC Code *
            </FormLabel>
            <Input
              type="text"
              required
              maxLength={11}
              value={onboardForm.bank_ifsc_code ?? ""}
              onChange={(e) =>
                onChangeForm({
                  ...onboardForm,
                  bank_ifsc_code: e.target.value.toUpperCase().trim(),
                })
              }
              placeholder="e.g. HDFC0001234"
              className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground font-mono focus:border-violet-500"
            />
          </div>
        </div>
      </div>
    </>
  );
}
