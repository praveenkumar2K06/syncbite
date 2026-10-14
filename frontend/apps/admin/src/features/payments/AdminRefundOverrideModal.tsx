import { Input } from "../../components/ui/input";
import React from "react";
import type { AdminOverrideModalState } from "./types";

interface AdminRefundOverrideModalProps {
  modal: AdminOverrideModalState;
  onClose: () => void;
  onChangeField: <K extends keyof AdminOverrideModalState>(
    key: K,
    value: AdminOverrideModalState[K],
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminRefundOverrideModal({
  modal,
  onClose,
  onChangeField,
  onSubmit,
}: AdminRefundOverrideModalProps) {
  if (!modal.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-base font-bold text-white">Issue Admin Refund Override</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Directly authorizes backend endpoint{" "}
          <code className="text-pink-400">POST /admin/refunds/override</code> to issue refund
          transactions without requiring merchant manual approval.
        </p>

        <div className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-medium block mb-1">
              Target Payment / Order ID
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. ord-9021-vit or pay_uuid"
              value={modal.paymentId}
              onChange={(e) => onChangeField("paymentId", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Override Amount (₹)</label>
            <Input
              type="number"
              step="0.01"
              required
              placeholder="e.g. 250"
              value={modal.amount}
              onChange={(e) => onChangeField("amount", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Admin Audit Reason</label>
            <textarea
              rows={3}
              required
              placeholder="Reason for overriding standard merchant approval cap…"
              value={modal.reason}
              onChange={(e) => onChangeField("reason", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={modal.submitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer"
          >
            {modal.submitting ? "Processing…" : "Execute Refund Override"}
          </button>
        </div>
      </form>
    </div>
  );
}
