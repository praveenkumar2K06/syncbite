import { Input } from "../ui/input";
import React from "react";
import type { CredentialModalState } from "../../types/dashboard";
import { generateSecurePassword } from "../../utils/formatters";
import { RESTAURANT_PORTAL_URL } from "../../config";
import { formatDateTime } from "../../utils/format";

interface CredentialsModalProps {
  modal: CredentialModalState;
  saving: boolean;
  copiedField: string | null;
  onClose: () => void;
  onChangeModal: (updated: CredentialModalState) => void;
  onSave: (e: React.FormEvent) => void;
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
  onShowToast: (msg: string, type: "success" | "error") => void;
}

export default function CredentialsModal({
  modal,
  saving,
  copiedField,
  onClose,
  onChangeModal,
  onSave,
  onCopy,
  onDownloadTxt,
  onShowToast,
}: CredentialsModalProps) {
  const currentRole = modal.role || "BranchManager";

  const handleRoleChange = (targetRole: "BranchManager" | "MerchantOwner") => {
    onChangeModal({
      ...modal,
      role: targetRole,
      updatedResult: null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5 shadow-2xl animate-scale-up"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔑</span>
            <div>
              <h3 className="text-base font-bold text-white">{modal.branchName}</h3>
              <div className="text-xs text-slate-400">Branch Credentials & Manager Management</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Account Role Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">Target Account / Role</label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => handleRoleChange("BranchManager")}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                currentRole === "BranchManager"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>🍽️</span> Branch Manager
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("MerchantOwner")}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                currentRole === "MerchantOwner"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>🏢</span> Merchant Owner
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            {currentRole === "BranchManager"
              ? "Controls daily Restaurant Portal operations, order dispatch, and menu availability."
              : "Controls merchant legal identity, parent brand profiles, and banking settlements."}
          </p>
        </div>

        {/* Success state */}
        {modal.updatedResult ? (
          <div className="rounded-xl p-4 flex flex-col gap-3 bg-emerald-950/30 border border-emerald-800/60 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <span>✓</span> Credentials updated successfully in database!
            </div>
            <div className="rounded-lg p-3 bg-background flex flex-col gap-2 font-mono text-xs border border-emerald-900/40">
              <div className="flex justify-between items-center text-slate-400">
                <span>ROLE:</span>
                <span className="text-slate-200 font-bold">
                  {modal.updatedResult.role || currentRole}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>EMAIL:</span>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">{modal.updatedResult.email}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onCopy(modal.updatedResult!.email, "Email copied! ✓", "res_email")
                    }
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy email to clipboard"
                  >
                    {copiedField === "res_email" ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>PASSWORD:</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">{modal.updatedResult.password}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onCopy(modal.updatedResult!.password, "Password copied! ✓", "res_pass")
                    }
                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Copy password to clipboard"
                  >
                    {copiedField === "res_pass" ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() =>
                  onCopy(
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🍽️ ${modal.branchName} - Updated Credentials\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nRole       : ${modal.updatedResult!.role || currentRole}\nLogin Email: ${modal.updatedResult!.email}\nPassword   : ${modal.updatedResult!.password}\nPortal     : ${RESTAURANT_PORTAL_URL}\nUpdated On : ${formatDateTime(new Date())}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                    "Updated credentials copied to clipboard! ✓",
                  )
                }
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-emerald-950 transition-colors cursor-pointer"
              >
                📋 Copy Message
              </button>
              <button
                onClick={() =>
                  onDownloadTxt(
                    modal.branchName,
                    modal.updatedResult!.email,
                    modal.updatedResult!.password,
                    modal.branchId,
                    modal.updatedResult!.role || currentRole,
                  )
                }
                className="py-2 px-3 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                📥 Download (.txt)
              </button>
            </div>
          </div>
        ) : null}

        {/* Edit Form */}
        <form onSubmit={onSave} className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-400">
                {currentRole === "BranchManager" ? "Branch Manager Email" : "Merchant Owner Email"}
              </label>
              {modal.currentEmail && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <span>Current: {modal.currentEmail}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onCopy(modal.currentEmail, "Current email copied! ✓", "cred_curr_email")
                    }
                    className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                    title="Copy current email"
                  >
                    {copiedField === "cred_curr_email" ? "✓" : "📋"}
                  </button>
                </div>
              )}
            </div>
            <div className="relative flex items-center">
              <Input
                type="email"
                required={currentRole !== "MerchantOwner"}
                value={modal.newEmail}
                onChange={(e) => onChangeModal({ ...modal, newEmail: e.target.value })}
                placeholder={
                  currentRole === "BranchManager"
                    ? "e.g. manager@brand.com"
                    : "e.g. owner@brand.com"
                }
                className="w-full pl-4 pr-24 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-cyan-300 font-mono focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => onCopy(modal.newEmail, "Email copied! ✓", "cred_email")}
                disabled={!modal.newEmail}
                className="absolute right-2 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-input transition-colors disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                title="Copy email to clipboard"
              >
                <span>{copiedField === "cred_email" ? "✓" : "📋"}</span>
                <span>{copiedField === "cred_email" ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {!modal.passwordGenerated ? (
            <div className="rounded-xl p-4 bg-slate-900/60 border border-dashed border-input/80 flex flex-col items-center justify-center gap-3 text-center animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <div className="text-xs text-slate-300 font-medium">Password Field Hidden</div>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Click generate to create and display a secure password for this{" "}
                {currentRole === "BranchManager" ? "branch manager" : "merchant owner"}.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const generated = generateSecurePassword(
                      currentRole === "BranchManager" ? modal.branchName : "Owner",
                    );
                    onChangeModal({
                      ...modal,
                      newPassword: generated,
                      passwordGenerated: true,
                      showPassword: true,
                    });
                    onShowToast("Password generated! ✓", "success");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 flex items-center gap-1.5 shadow-md cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    boxShadow: "0 0 12px rgba(249,115,22,0.25)",
                  }}
                >
                  <span>🎲</span> Generate Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangeModal({
                      ...modal,
                      passwordGenerated: true,
                      showPassword: true,
                    });
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-200 underline transition-colors cursor-pointer"
                >
                  or enter manually
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col gap-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-400">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    const generated = generateSecurePassword(
                      currentRole === "BranchManager" ? modal.branchName : "Owner",
                    );
                    onChangeModal({
                      ...modal,
                      newPassword: generated,
                    });
                    onShowToast("New password generated! ✓", "success");
                  }}
                  className="text-[11px] font-medium transition-colors hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                  style={{ color: "#f97316" }}
                >
                  🎲 Regenerate
                </button>
              </div>
              <div className="relative flex items-center">
                <Input
                  type={modal.showPassword ? "text" : "password"}
                  required
                  value={modal.newPassword}
                  onChange={(e) => onChangeModal({ ...modal, newPassword: e.target.value })}
                  placeholder="Enter new password (min 8 chars)..."
                  className="w-full pl-4 pr-36 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-amber-300 font-mono focus:border-amber-500 transition-colors"
                />
                <div className="absolute right-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onCopy(modal.newPassword, "Password copied! ✓", "cred_pass")}
                    disabled={!modal.newPassword}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-input transition-colors disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                    title="Copy password to clipboard"
                  >
                    <span>{copiedField === "cred_pass" ? "✓" : "📋"}</span>
                    <span>{copiedField === "cred_pass" ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeModal({ ...modal, showPassword: !modal.showPassword })}
                    className="px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title={modal.showPassword ? "Hide password" : "Show password"}
                  >
                    {modal.showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving || !modal.passwordGenerated || !modal.newPassword.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              style={{
                background:
                  currentRole === "BranchManager"
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                boxShadow:
                  currentRole === "BranchManager"
                    ? "0 0 15px rgba(16,185,129,0.3)"
                    : "0 0 15px rgba(139,92,246,0.3)",
              }}
            >
              {saving
                ? "Updating..."
                : `💾 Save ${currentRole === "BranchManager" ? "Manager" : "Owner"} Credentials`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
