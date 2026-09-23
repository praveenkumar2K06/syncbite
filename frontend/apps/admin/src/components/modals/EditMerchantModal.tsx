import { Input } from "../ui/input";
import React, { useState, useEffect } from "react";
import type { MerchantRecord, MerchantStatus } from "../../api/admin";
import { AdminDialog } from "../ui/admin-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const MERCHANT_STATUSES: MerchantStatus[] = [
  "PENDING_VERIFICATION",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
  "DEACTIVATED",
  "INACTIVE",
];

function isMerchantStatus(value: string): value is MerchantStatus {
  return MERCHANT_STATUSES.includes(value as MerchantStatus);
}

interface EditMerchantModalProps {
  merchant: MerchantRecord | null;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: {
    business_name?: string;
    legal_entity_name?: string;
    fssai_license_number?: string;
    gstin?: string | null;
    bank_account_number?: string | null;
    bank_ifsc_code?: string | null;
    status?: MerchantStatus;
  }) => Promise<void>;
}

export default function EditMerchantModal({
  merchant,
  saving,
  onClose,
  onSave,
}: EditMerchantModalProps) {
  const [businessName, setBusinessName] = useState("");
  const [legalEntityName, setLegalEntityName] = useState("");
  const [fssai, setFssai] = useState("");
  const [gstin, setGstin] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [status, setStatus] = useState<MerchantStatus>("PENDING_VERIFICATION");

  useEffect(() => {
    if (merchant) {
      setBusinessName(merchant.business_name || "");
      setLegalEntityName(merchant.legal_entity_name || "");
      setFssai(merchant.fssai_license_number || "");
      setGstin(merchant.gstin || "");
      setBankAccount(merchant.bank_account_number || "");
      setBankIfsc(merchant.bank_ifsc_code || "");
      setStatus(isMerchantStatus(merchant.status) ? merchant.status : "PENDING_VERIFICATION");
    }
  }, [merchant]);

  if (!merchant) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave({
      business_name: businessName.trim() || undefined,
      legal_entity_name: legalEntityName.trim() || undefined,
      fssai_license_number: fssai.trim() || undefined,
      gstin: gstin.trim() || null,
      bank_account_number: bankAccount.trim() || null,
      bank_ifsc_code: bankIfsc.trim() || null,
      status: status || undefined,
    });
  }

  return (
    <AdminDialog
      onClose={onClose}
      title="Update Merchant"
      description="Edit legal entity profile and lifecycle status"
      className="sm:max-w-lg"
    >
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Business / Trading Name *
            </label>
            <Input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Legal Entity Name *
              </label>
              <Input
                type="text"
                required
                value={legalEntityName}
                onChange={(e) => setLegalEntityName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Merchant Lifecycle Status
              </label>
              <Select
                value={status}
                onValueChange={(value) => {
                  if (value && isMerchantStatus(value)) setStatus(value);
                }}
              >
                <SelectTrigger className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground focus:border-amber-500 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING_VERIFICATION">⏳ PENDING_VERIFICATION</SelectItem>
                  <SelectItem value="APPROVED">✅ APPROVED</SelectItem>
                  <SelectItem value="DRAFT">📝 DRAFT</SelectItem>
                  <SelectItem value="SUSPENDED">⏸️ SUSPENDED</SelectItem>
                  <SelectItem value="REJECTED">❌ REJECTED</SelectItem>
                  <SelectItem value="DEACTIVATED">🛑 DEACTIVATED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                FSSAI License (14 Digits)
              </label>
              <Input
                type="text"
                value={fssai}
                onChange={(e) => setFssai(e.target.value.replace(/\D/g, ""))}
                maxLength={14}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-cyan-300 font-mono text-xs focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                GSTIN (15 Characters)
              </label>
              <Input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase().trim())}
                maxLength={15}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-cyan-300 font-mono text-xs focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Bank Account
              </label>
              <Input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value.replace(/\s+/g, ""))}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Bank IFSC</label>
              <Input
                type="text"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value.toUpperCase().trim())}
                maxLength={11}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-40 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 15px rgba(249,115,22,0.3)",
              }}
            >
              {saving ? "Saving..." : "Save Merchant"}
            </button>
          </div>
        </form>
      </div>
    </AdminDialog>
  );
}
