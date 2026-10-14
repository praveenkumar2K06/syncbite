import React from "react";

interface PaymentHeaderProps {
  onOpenOverrideModal: () => void;
  onRefresh: () => void;
}

export default function PaymentHeader({ onOpenOverrideModal, onRefresh }: PaymentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span>💳 Payments & Refunds Management</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-950/70 border border-emerald-800/60 text-emerald-400">
            Gateway Connected
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Reconciliation ledger, dispute tracking, partial returns, and authoritative Admin Refund
          Overrides.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenOverrideModal}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          style={{ background: "linear-gradient(135deg, #f43f5e, #e11d48)", color: "#ffffff" }}
        >
          <span>⚡</span> Admin Refund Override
        </button>
        <button
          onClick={onRefresh}
          className="px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          style={{ background: "#1a2235", color: "#94a3b8", border: "1px solid #1e2d45" }}
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  );
}
