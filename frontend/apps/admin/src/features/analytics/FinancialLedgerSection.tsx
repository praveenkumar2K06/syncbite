import React from "react";
import { fmt } from "../../utils/formatters";

interface FinancialLedgerSectionProps {
  gmv: number | string;
  netRevenue: number | string;
  platformCommission: number | string;
  restaurantPayout: number | string;
  subscriptionRev: number | string;
  refunds: number | string;
  discounts: number | string;
}

export default function FinancialLedgerSection({
  gmv,
  netRevenue,
  platformCommission,
  restaurantPayout,
  subscriptionRev,
  refunds,
  discounts,
}: FinancialLedgerSectionProps) {
  const renderVal = (v: number | string) => (typeof v === "number" ? fmt(v) : v);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        💰 Financial Ledger & Revenue Deep-Dive
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Gross GMV</div>
          <div className="text-lg font-bold text-white mt-1">{renderVal(gmv)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Campus gross sales</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Net Platform Revenue</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">{renderVal(netRevenue)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Order commission take</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Platform Commission</div>
          <div className="text-lg font-bold text-violet-400 mt-1">
            {renderVal(platformCommission)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Order take-rate fee</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Restaurant Payout</div>
          <div className="text-lg font-bold text-sky-400 mt-1">{renderVal(restaurantPayout)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Merchant net payout</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Subscription Revenue</div>
          <div className="text-lg font-bold text-indigo-400 mt-1">{renderVal(subscriptionRev)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {typeof subscriptionRev === "number" ? "Tiered SaaS billing" : "Unlinked in API"}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Refund Amount</div>
          <div className="text-lg font-bold text-rose-400 mt-1">{renderVal(refunds)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Settled refunds</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Platform Discounts</div>
          <div className="text-lg font-bold text-amber-400 mt-1">{renderVal(discounts)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Subsidized coupons</div>
        </div>
      </div>
    </div>
  );
}
