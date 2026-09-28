import { Input } from "../../components/ui/input";
import React, { useState, useMemo } from "react";
import { fmt } from "../../utils/formatters";
import type { MerchantSubscriptionItem } from "./types";
import MerchantSubscriptionHistorySheet from "./MerchantSubscriptionHistorySheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";

interface MerchantSubscriptionsTableProps {
  statusFilter: string;
  onStatusFilterChange: (status: "ALL" | "ACTIVE" | "CANCELLED" | "EXPIRED") => void;
  subs: MerchantSubscriptionItem[];
  onChangePlan: (sub: MerchantSubscriptionItem) => void;
  onCancel: (sub: MerchantSubscriptionItem) => void;
  onReactivate?: (subId: string) => void;
}

function getExpiryInfo(sub: MerchantSubscriptionItem) {
  const expiryDateStr = sub.valid_until || sub.current_period_end;
  if (!expiryDateStr) {
    return { label: "Indefinite", diffDays: null, isExpired: false, isNear: false };
  }
  const expiryDate = new Date(expiryDateStr);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;
  const isNear = diffDays > 0 && diffDays <= 7;

  const formattedDate = expiryDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    label: formattedDate,
    diffDays,
    isExpired,
    isNear,
  };
}

export default function MerchantSubscriptionsTable({
  statusFilter,
  onStatusFilterChange,
  subs,
  onChangePlan,
  onCancel,
  onReactivate,
}: MerchantSubscriptionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [historyTarget, setHistoryTarget] = useState<{
    merchantId: string;
    merchantName: string;
  } | null>(null);

  const filteredSubs = useMemo(() => {
    let result = subs;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.merchant_name.toLowerCase().includes(q) ||
          s.plan_name.toLowerCase().includes(q) ||
          s.invoice_id.toLowerCase().includes(q) ||
          s.merchant_id.toLowerCase().includes(q),
      );
    }
    return result;
  }, [subs, searchTerm]);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
          {(["ALL", "ACTIVE", "CANCELLED", "EXPIRED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => onStatusFilterChange(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === st
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Input
            type="text"
            placeholder="Search merchant, plan, invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:border-input"
          />
          <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1.5 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div
        className="rounded-2xl overflow-hidden border border-slate-800 shadow-sm"
        style={{ background: "#111827" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f1724" }}>
                {[
                  "Merchant Entity",
                  "Current Plan",
                  "Status",
                  "Cycle",
                  "Expiry / Renewal",
                  "Last Fee",
                  "Commission Ledger",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                      h === "Actions" ? "text-right" : "text-left"
                    }`}
                    style={{ borderBottom: "1px solid #1e2d45" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-xs">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <span className="text-2xl">📋</span>
                      <p className="font-semibold text-slate-300">
                        {searchTerm
                          ? "No subscriptions match your search filter."
                          : "No merchant subscriptions found."}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {searchTerm
                          ? "Try clearing the search query or changing status filters."
                          : "Registered merchants will automatically appear in this subscription ledger."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubs.map((s, i) => {
                  const expiry = getExpiryInfo(s);

                  return (
                    <tr
                      key={s.id}
                      style={{ background: i % 2 === 0 ? "#111827" : "rgba(26,34,53,0.4)" }}
                      className="border-t border-slate-800/60 hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Merchant Entity */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white text-xs">{s.merchant_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {s.merchant_id}
                        </div>
                      </td>

                      {/* Subscribed Plan */}
                      <td className="px-5 py-4">
                        <span className="text-xs text-violet-300 font-semibold bg-violet-950/40 border border-violet-800/40 px-2 py-0.5 rounded">
                          {s.plan_name}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.status === "ACTIVE"
                                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                                : s.status === "CANCELLED"
                                  ? "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                                  : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                            }`}
                          >
                            {s.status}
                          </span>
                          {s.status === "CANCELLED" && s.cancel_reason && (
                            <span
                              className="text-[10px] text-rose-300/80 max-w-[140px] truncate"
                              title={s.cancel_reason}
                            >
                              {s.cancel_reason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Billing Cycle */}
                      <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                        {s.billing_cycle}
                      </td>

                      {/* Expiry / Renewal Info */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-xs text-slate-200 font-medium font-mono">
                            {expiry.label}
                          </span>
                          {expiry.diffDays !== null && (
                            <span
                              className={`text-[10px] font-medium ${
                                expiry.isExpired
                                  ? "text-rose-400"
                                  : expiry.isNear
                                    ? "text-amber-400"
                                    : "text-slate-400"
                              }`}
                            >
                              {expiry.isExpired
                                ? `Expired ${Math.abs(expiry.diffDays)}d ago`
                                : `Expires in ${expiry.diffDays}d`}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Last Fee */}
                      <td className="px-5 py-4 font-mono text-xs font-bold text-white">
                        {fmt(s.last_payment_amount)}
                      </td>

                      {/* Commission Ledger */}
                      <td className="px-5 py-4 font-mono text-xs text-emerald-400">
                        {fmt(s.commission_earned)}
                      </td>

                      {/* Actions Column (Dropdown) */}
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
                            aria-label="Open actions menu"
                          >
                            <span className="text-base font-bold leading-none px-1">⋮</span>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            sideOffset={4}
                            className="w-48 bg-slate-900 border border-slate-800 text-slate-200 shadow-xl rounded-xl p-1 z-50"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                setHistoryTarget({
                                  merchantId: s.merchant_id,
                                  merchantName: s.merchant_name,
                                })
                              }
                              className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-800 cursor-pointer text-slate-200"
                            >
                              <span>📜</span>
                              <span>View History</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => onChangePlan(s)}
                              className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-violet-950/60 hover:text-violet-300 cursor-pointer text-slate-200"
                            >
                              <span>🔄</span>
                              <span>Change Plan</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-slate-800 my-1" />

                            {s.status === "ACTIVE" ? (
                              <DropdownMenuItem
                                onClick={() => onCancel(s)}
                                className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-rose-950/60 hover:text-rose-400 cursor-pointer text-rose-400"
                              >
                                <span>✕</span>
                                <span>Cancel Subscription</span>
                              </DropdownMenuItem>
                            ) : s.status === "CANCELLED" ? (
                              <DropdownMenuItem
                                onClick={() => onReactivate && onReactivate(s.id)}
                                className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-emerald-950/60 hover:text-emerald-300 cursor-pointer text-emerald-400"
                              >
                                <span>↺</span>
                                <span>Reactivate</span>
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Sheet */}
      <MerchantSubscriptionHistorySheet
        open={Boolean(historyTarget)}
        onClose={() => setHistoryTarget(null)}
        merchantId={historyTarget?.merchantId ?? null}
        merchantName={historyTarget?.merchantName ?? ""}
      />
    </div>
  );
}
