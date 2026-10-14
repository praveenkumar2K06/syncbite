import React from "react";
import { fmt } from "../../utils/formatters";
import type { SubscriptionPlan } from "./types";

interface SubscriptionPlansGridProps {
  plans: SubscriptionPlan[];
  onViewSubscribers?: (planName: string) => void;
}

export default function SubscriptionPlansGrid({
  plans,
  onViewSubscribers,
}: SubscriptionPlansGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((p) => (
        <div
          key={p.id}
          className="p-5 rounded-2xl flex flex-col justify-between border border-slate-800 shadow-sm transition-all hover:border-slate-700"
          style={{ background: "#111827" }}
        >
          <div>
            {/* Top header row */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <span>{p.name}</span>
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 mt-1 inline-block border border-slate-700">
                  {p.code}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  p.is_active
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {p.is_active ? "ACTIVE TIER" : "INACTIVE"}
              </span>
            </div>

            {/* Price display */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white font-mono">
                  {fmt(p.price_monthly)}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                <span>
                  Annual:{" "}
                  <strong className="text-slate-200 font-mono">{fmt(p.price_annual)}</strong>/yr
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Save 2 months</span>
              </div>
            </div>

            {/* Key metrics box */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Take-rate Commission:</span>
                <span className="font-bold text-violet-400">{p.commission_rate_pct}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Max Outlets:</span>
                <span className="text-white font-medium">{p.max_branches} Branches</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Subscribed Merchants:</span>
                {onViewSubscribers && p.subscriber_count > 0 ? (
                  <button
                    type="button"
                    onClick={() => onViewSubscribers(p.name)}
                    className="font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer text-xs"
                    title={`View ${p.subscriber_count} merchants on ${p.name}`}
                  >
                    {p.subscriber_count} Merchants ➔
                  </button>
                ) : (
                  <span className="text-slate-400 font-semibold">
                    {p.subscriber_count} Merchants
                  </span>
                )}
              </div>
            </div>

            {/* Capabilities checklist */}
            <div className="mt-4">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Platform Capabilities ({p.features?.length || 0})
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(p.features || []).map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 text-sm leading-none mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
