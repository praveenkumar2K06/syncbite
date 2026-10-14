import React from "react";
import { fmt, relTime } from "../../utils/formatters";
import type { PaymentTransactionRecord } from "./types";

interface PaymentTransactionsTableProps {
  loading: boolean;
  transactions: PaymentTransactionRecord[];
  totalTransactionsCount: number;
  onSelectTx: (tx: PaymentTransactionRecord) => void;
}

export default function PaymentTransactionsTable({
  loading,
  transactions,
  totalTransactionsCount,
  onSelectTx,
}: PaymentTransactionsTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div
        className="p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <span className="text-3xl">💳</span>
        <div className="text-sm font-semibold text-white">
          {totalTransactionsCount === 0
            ? "No payment transactions found in database"
            : "No transactions matching filter"}
        </div>
        <div className="text-xs text-slate-400 max-w-sm">
          {totalTransactionsCount === 0
            ? "Payment records and gateway reconciliation logs will appear here as orders are placed."
            : "Try adjusting your search criteria or resetting status filter."}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden border border-slate-800"
      style={{ background: "#111827" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "#0f1724" }}>
            {[
              "Status",
              "Transaction Ref",
              "Order & Customer",
              "Merchant",
              "Amount",
              "Method",
              "Date",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                style={{ borderBottom: "1px solid #1e2d45" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr
              key={tx.id}
              style={{ background: i % 2 === 0 ? "#111827" : "rgba(26,34,53,0.4)" }}
              className="border-t border-slate-800/60 hover:bg-slate-800/40 transition-colors"
            >
              {/* Status & Type */}
              <td className="px-5 py-4">
                <div className="flex flex-col gap-1 items-start">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                      tx.status === "SUCCESS"
                        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                        : tx.status === "FAILED"
                          ? "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                          : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                    }`}
                  >
                    {tx.status}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{tx.type}</span>
                </div>
              </td>

              {/* Transaction Ref */}
              <td className="px-5 py-4">
                <div className="font-mono text-xs font-semibold text-white">{tx.gateway_ref}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{tx.id}</div>
              </td>

              {/* Order & Customer */}
              <td className="px-5 py-4">
                <div className="text-white text-xs font-medium">{tx.customer_name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">#{tx.order_id}</div>
              </td>

              {/* Merchant */}
              <td className="px-5 py-4 text-xs text-slate-300">{tx.merchant_name}</td>

              {/* Amount */}
              <td className="px-5 py-4">
                <div
                  className={`font-bold text-sm ${
                    tx.type.includes("REFUND") ? "text-rose-400" : "text-emerald-400"
                  }`}
                >
                  {tx.type.includes("REFUND") ? `- ${fmt(tx.amount)}` : fmt(tx.amount)}
                </div>
              </td>

              {/* Provider */}
              <td className="px-5 py-4 text-xs text-slate-400 font-mono">{tx.provider}</td>

              {/* Date */}
              <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                {relTime(tx.created_at)}
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <button
                  onClick={() => onSelectTx(tx)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                >
                  Audit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
