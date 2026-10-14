import React from "react";
import { fmt } from "../../utils/formatters";
import { formatDateTime } from "../../utils/format";
import type { PaymentTransactionRecord } from "./types";

interface PaymentDetailDrawerProps {
  selectedTx: PaymentTransactionRecord | null;
  onClose: () => void;
}

export default function PaymentDetailDrawer({ selectedTx, onClose }: PaymentDetailDrawerProps) {
  if (!selectedTx) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <div>
              <h3 className="text-base font-bold text-white">Transaction Audit</h3>
              <div className="text-xs text-slate-400 font-mono">{selectedTx.gateway_ref}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2.5 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-medium">Amount</div>
              <div className="text-white font-bold text-base mt-1">{fmt(selectedTx.amount)}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-medium">Status & Type</div>
              <div className="text-emerald-400 font-bold mt-1">
                {selectedTx.status} ({selectedTx.type})
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Order ID:</span>
              <span className="text-white font-mono">{selectedTx.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Merchant Entity:</span>
              <span className="text-white">{selectedTx.merchant_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Student Customer:</span>
              <span className="text-white">{selectedTx.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Gateway:</span>
              <span className="text-white font-mono">{selectedTx.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Processed At:</span>
              <span className="text-white font-mono">{formatDateTime(selectedTx.created_at)}</span>
            </div>
          </div>

          {selectedTx.refund_reason && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs">
              <div className="text-rose-400 font-semibold mb-1">Refund Justification:</div>
              <div className="text-rose-200">{selectedTx.refund_reason}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
