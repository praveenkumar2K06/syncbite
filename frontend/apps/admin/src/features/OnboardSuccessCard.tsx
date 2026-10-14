import React from "react";
import type { OnboardSuccessState } from "../types/dashboard";
import { formatCredentialPacket } from "../utils/credentials";

interface OnboardSuccessCardProps {
  onboardSuccess: OnboardSuccessState | null;
  copiedField: string | null;
  onOpenMenuForBranch: (branchId: string) => void;
  onDismissSuccess: () => void;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
  onDownloadTxt: (
    name: string,
    email: string,
    pass: string,
    branchId?: string,
    role?: string,
    branchManagerEmail?: string,
    branchManagerPass?: string,
  ) => void;
}

export default function OnboardSuccessCard({
  onboardSuccess,
  copiedField,
  onOpenMenuForBranch,
  onDismissSuccess,
  onCopy,
  onDownloadTxt,
}: OnboardSuccessCardProps) {
  return (
    <>
      {/* Credentials Success Card */}
      {onboardSuccess && (
        <div
          className="rounded-2xl p-6 flex flex-col gap-4 animate-scale-up"
          style={{
            background:
              "linear-gradient(180deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)",
            border: "1px solid rgba(16,185,129,0.35)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold"
              style={{ background: "rgba(16,185,129,0.25)", color: "#10b981" }}
            >
              ✓
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Restaurant Onboarded & Credentials Ready!
              </h3>
              <p className="text-xs text-slate-300">
                New outlet provisioned via OpenAPI backend. Distinct credentials generated for
                Merchant Owner and Branch Manager.
              </p>
            </div>
          </div>

          {/* Copyable Box with dual credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono text-xs">
            {/* Box 1: Merchant Owner Credentials */}
            <div className="rounded-xl p-4 flex flex-col gap-2.5 bg-slate-950 border border-violet-900/60">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-violet-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <span>🏢</span> MERCHANT OWNER
                </span>
                <span className="text-[10px] bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/60">
                  {onboardSuccess.role || "MerchantOwner"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-400">
                <span>LOGIN EMAIL</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-violet-300 truncate max-w-[150px]">
                    {onboardSuccess.email}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onCopy(
                        onboardSuccess.email,
                        "Owner email copied! ✓",
                        "onboard_succ_owner_email",
                      )
                    }
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy owner email"
                  >
                    {copiedField === "onboard_succ_owner_email" ? "✓" : "📋"}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-400">
                <span>PASSWORD</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                    {onboardSuccess.password}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onCopy(
                        onboardSuccess.password,
                        "Owner password copied! ✓",
                        "onboard_succ_owner_pass",
                      )
                    }
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy owner password"
                  >
                    {copiedField === "onboard_succ_owner_pass" ? "✓" : "📋"}
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-sans">
                Access: Financial settlements, payout banking & legal entities.
              </div>
            </div>

            {/* Box 2: Branch Manager Credentials */}
            <div className="rounded-xl p-4 flex flex-col gap-2.5 bg-slate-950 border border-emerald-900/60">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <span>🍽️</span> BRANCH MANAGER
                </span>
                <span className="text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  {onboardSuccess.branch_manager_role || "BranchManager"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-400">
                <span>LOGIN EMAIL</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-300 truncate max-w-[150px]">
                    {onboardSuccess.branch_manager_email || onboardSuccess.email}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onCopy(
                        onboardSuccess.branch_manager_email || onboardSuccess.email,
                        "Manager email copied! ✓",
                        "onboard_succ_mgr_email",
                      )
                    }
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy manager email"
                  >
                    {copiedField === "onboard_succ_mgr_email" ? "✓" : "📋"}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-400">
                <span>PASSWORD</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                    {onboardSuccess.branch_manager_password || onboardSuccess.password}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onCopy(
                        onboardSuccess.branch_manager_password || onboardSuccess.password,
                        "Manager password copied! ✓",
                        "onboard_succ_mgr_pass",
                      )
                    }
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy manager password"
                  >
                    {copiedField === "onboard_succ_mgr_pass" ? "✓" : "📋"}
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-sans">
                Access: Restaurant Portal, live orders, kitchen ticket dispatch & menu toggles.
              </div>
            </div>
          </div>

          {/* Meta details */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400">
            <div>
              <span>OUTLET: </span>
              <span className="font-bold text-white">{onboardSuccess.branch_name}</span>
            </div>
            {onboardSuccess.branch_id && (
              <div>
                <span>BRANCH ID: </span>
                <span className="text-slate-300">{onboardSuccess.branch_id}</span>
              </div>
            )}
            {onboardSuccess.status && (
              <div>
                <span>STATUS: </span>
                <span className="text-emerald-400 font-bold">{onboardSuccess.status}</span>
              </div>
            )}
            {onboardSuccess.subscription_plan && (
              <div className="flex items-center gap-1.5">
                <span>PLAN: </span>
                <span className="px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 font-bold border border-violet-800">
                  {onboardSuccess.subscription_plan} (
                  {onboardSuccess.subscription_cycle || "MONTHLY"})
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() =>
                onCopy(
                  formatCredentialPacket({
                    name: onboardSuccess.branch_name,
                    email: onboardSuccess.email,
                    password: onboardSuccess.password,
                    branchId: onboardSuccess.branch_id,
                    role: onboardSuccess.role,
                    branchManagerEmail: onboardSuccess.branch_manager_email,
                    branchManagerPassword: onboardSuccess.branch_manager_password,
                    branchManagerRole: onboardSuccess.branch_manager_role,
                  }),
                  "Full credentials packet copied to clipboard! ✓",
                )
              }
              className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer shadow-md"
              style={{ background: "#10b981", color: "#064e3b" }}
            >
              <span>📋</span> Copy Full Credentials Packet
            </button>

            <button
              onClick={() =>
                onDownloadTxt(
                  onboardSuccess.branch_name,
                  onboardSuccess.email,
                  onboardSuccess.password,
                  onboardSuccess.branch_id,
                  onboardSuccess.role || "MerchantOwner",
                  onboardSuccess.branch_manager_email,
                  onboardSuccess.branch_manager_password,
                )
              }
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 transition-all hover:bg-slate-800 cursor-pointer"
              style={{ background: "#1a2235", border: "1px solid #1e2d45" }}
            >
              <span>📥</span> Download (.txt)
            </button>

            {onboardSuccess.branch_id && (
              <button
                onClick={() => onOpenMenuForBranch(onboardSuccess.branch_id!)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: "rgba(249,115,22,0.15)",
                  color: "#f97316",
                  border: "1px solid rgba(249,115,22,0.3)",
                }}
              >
                <span>🍽</span> Menu Editor →
              </button>
            )}

            <button
              onClick={onDismissSuccess}
              className="ml-auto px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              ＋ Onboard Another Outlet
            </button>
          </div>
        </div>
      )}
    </>
  );
}
