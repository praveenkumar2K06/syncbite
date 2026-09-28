import React from "react";
import { fmt } from "../../utils/formatters";
import type { MerchantSubscriptionItem, SubscriptionPlan } from "./types";

interface SubscriptionSummaryCardsProps {
  subs: MerchantSubscriptionItem[];
  plans: SubscriptionPlan[];
  totalSubRevenue: number;
  totalCommissionsEarned: number;
}

export default function SubscriptionSummaryCards({
  subs,
  plans,
  totalSubRevenue,
  totalCommissionsEarned,
}: SubscriptionSummaryCardsProps) {
  const activeSubsCount = subs.filter((s) => s.status === "ACTIVE").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="text-slate-400 text-xs font-medium">Active Subscriptions</div>
        <div className="text-xl font-bold text-white mt-1">{activeSubsCount} Merchants</div>
        <div className="text-[11px] text-emerald-400 mt-0.5">100% On-time renewal</div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="text-slate-400 text-xs font-medium">Subscription MRR</div>
        <div className="text-xl font-bold text-white mt-1">{fmt(totalSubRevenue)}</div>
        <div className="text-[11px] text-violet-400 mt-0.5">Recurring SaaS fee</div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="text-slate-400 text-xs font-medium">Platform Commission Ledger</div>
        <div className="text-xl font-bold text-white mt-1">{fmt(totalCommissionsEarned)}</div>
        <div className="text-[11px] text-pink-400 mt-0.5">Gross order commission</div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="text-slate-400 text-xs font-medium">Active Plan Tiers</div>
        <div className="text-xl font-bold text-white mt-1">{plans.length} Tiers</div>
        <div className="text-[11px] text-slate-400 mt-0.5">Tiered campus take-rates</div>
      </div>
    </div>
  );
}
