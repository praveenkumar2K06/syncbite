import React from "react";
import type { MerchantRecord } from "../../api/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";

interface PaymentFiltersProps {
  activeModule: "TRANSACTIONS" | "REFUND_MANAGEMENT";
  onSelectModule: (mod: "TRANSACTIONS" | "REFUND_MANAGEMENT") => void;
  totalTransactionsCount: number;
  refundsCount: number;
  search: string;
  onSearchChange: (search: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  merchantFilter: string;
  onMerchantFilterChange: (val: string) => void;
  merchants: MerchantRecord[];
  filteredCount: number;
}

export default function PaymentFilters({
  activeModule,
  onSelectModule,
  totalTransactionsCount,
  refundsCount,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  merchantFilter,
  onMerchantFilterChange,
  merchants,
  filteredCount,
}: PaymentFiltersProps) {
  return (
    <>
      {/* Module Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => onSelectModule("TRANSACTIONS")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeModule === "TRANSACTIONS"
              ? "bg-slate-800 text-white shadow-sm border border-input"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>📊 All Payment Transactions</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 font-mono text-slate-400">
            {totalTransactionsCount}
          </span>
        </button>

        <button
          onClick={() => onSelectModule("REFUND_MANAGEMENT")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeModule === "REFUND_MANAGEMENT"
              ? "bg-rose-950/50 text-rose-400 shadow-sm border border-rose-800/60"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>↩️ Refund Management & History</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-950 font-mono text-rose-400">
            {refundsCount}
          </span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div
        className="p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tx ID, order, gateway ref…"
              className="w-full px-3.5 py-2 rounded-xl text-xs outline-none pl-8"
            />
            <span className="absolute left-2.5 top-2 text-xs text-slate-500">🔍</span>
          </div>

          {/* Type filter */}
          {activeModule === "TRANSACTIONS" && (
            <Select value={typeFilter} onValueChange={(value) => onTypeFilterChange(value ?? "")}>
              <SelectTrigger className="px-3 py-2 rounded-xl text-xs outline-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="PAYMENT">Payments</SelectItem>
                <SelectItem value="REFUND">Full Refunds</SelectItem>
                <SelectItem value="PARTIAL_REFUND">Partial Refunds</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value ?? "")}>
            <SelectTrigger className="px-3 py-2 rounded-xl text-xs outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Merchant filter */}
          <Select
            value={merchantFilter}
            onValueChange={(value) => onMerchantFilterChange(value ?? "")}
          >
            <SelectTrigger className="px-3 py-2 rounded-xl text-xs outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Merchants</SelectItem>
              {merchants.map((m) => (
                <SelectItem key={m.id} value={m.business_name}>
                  {m.business_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-slate-400 font-mono self-end md:self-center">
          Showing {filteredCount} records
        </div>
      </div>
    </>
  );
}
