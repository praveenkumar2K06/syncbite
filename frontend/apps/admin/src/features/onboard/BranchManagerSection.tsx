import type { OnboardFormData } from "../../types/dashboard";
import { generateSecurePassword } from "../../utils/formatters";
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

export default function BranchManagerSection({
  onboardForm,
  onChangeForm,
  copiedField,
  onCopy,
}: Props) {
  const hasBranchManager = onboardForm.has_separate_branch_manager ?? true;
  return (
    <>
      {/* Section 4B: Branch Manager Management & Account */}
      <div className="flex flex-col gap-3.5 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            Branch Manager Management & Account (Store Operations)
          </h3>
          <FormLabel className="flex items-center gap-2 cursor-pointer select-none">
            <Input
              type="checkbox"
              checked={hasBranchManager}
              onChange={(e) =>
                onChangeForm({
                  ...onboardForm,
                  has_separate_branch_manager: e.target.checked,
                  branch_manager_email: e.target.checked
                    ? onboardForm.branch_manager_email || ""
                    : "",
                })
              }
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
            />
            <span className="text-xs font-semibold text-slate-200">
              Provision Separate Branch Manager
            </span>
          </FormLabel>
        </div>

        {hasBranchManager ? (
          <div className="p-4 rounded-xl bg-background/70 border border-emerald-900/40 flex flex-col gap-3.5">
            <div className="text-[11px] text-emerald-300/80 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40 flex items-center gap-2">
              <span>ℹ️</span>
              <span>
                A dedicated <strong>BranchManager</strong> account gives the physical outlet staff
                daily access to the Restaurant Portal for live kitchen tickets, order dispatch, and
                menu toggles without sharing legal owner credentials.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
                  Manager Contact Name (Optional)
                </FormLabel>
                <Input
                  type="text"
                  value={onboardForm.branch_manager_name ?? ""}
                  onChange={(e) =>
                    onChangeForm({ ...onboardForm, branch_manager_name: e.target.value })
                  }
                  placeholder="e.g. Ramesh Kumar (Store Lead)"
                  className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground"
                />
              </div>

              <div>
                <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
                  Manager Phone (Optional)
                </FormLabel>
                <Input
                  type="text"
                  value={onboardForm.branch_manager_phone ?? ""}
                  onChange={(e) =>
                    onChangeForm({ ...onboardForm, branch_manager_phone: e.target.value })
                  }
                  placeholder="e.g. +91 98765 43210"
                  className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground font-mono"
                />
              </div>

              <div>
                <FormLabel className="block text-xs font-medium text-foreground mb-1.5">
                  Branch Manager Login Email *
                </FormLabel>
                <Input
                  type="email"
                  required={hasBranchManager}
                  value={onboardForm.branch_manager_email ?? ""}
                  onChange={(e) =>
                    onChangeForm({ ...onboardForm, branch_manager_email: e.target.value })
                  }
                  placeholder="outlet.manager@syncbite.com"
                  className="h-auto rounded-xl px-4 py-2.5 text-sm text-foreground font-mono"
                />
              </div>

              <div>
                <div className="flex min-h-5 items-center justify-between gap-3 mb-1.5">
                  <FormLabel className="text-xs font-medium leading-none text-foreground">
                    Manager Initial Password *
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() =>
                      onChangeForm({
                        ...onboardForm,
                        branch_manager_password: generateSecurePassword(
                          onboardForm.name || "Manager",
                        ),
                      })
                    }
                    className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium leading-none text-emerald-400 hover:underline cursor-pointer"
                  >
                    <HugeiconsIcon icon={Refresh01Icon} size={13} /> Random
                  </button>
                </div>
                <InputGroup>
                  <InputGroupInput
                    type="text"
                    required={hasBranchManager}
                    value={onboardForm.branch_manager_password ?? ""}
                    onChange={(e) =>
                      onChangeForm({ ...onboardForm, branch_manager_password: e.target.value })
                    }
                    placeholder="Minimum 8 characters"
                    className="text-sm text-amber-300 font-mono"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() =>
                        onCopy(
                          onboardForm.branch_manager_password ?? "",
                          "Branch manager password copied! ✓",
                          "onboard_bm_pass",
                        )
                      }
                      disabled={!onboardForm.branch_manager_password}
                      title="Copy manager password"
                    >
                      <HugeiconsIcon icon={Copy01Icon} size={14} />
                      <span className="sr-only">
                        {copiedField === "onboard_bm_pass" ? "Copied" : "Copy password"}
                      </span>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-background/40 border border-dashed border-border text-muted-foreground text-xs flex items-center gap-2">
            <span>ℹ️</span>
            <span>
              Single-account mode: The <strong>MerchantOwner</strong> credentials above will be used
              for both legal entity ownership and direct Restaurant Portal operations.
            </span>
          </div>
        )}
      </div>
    </>
  );
}
