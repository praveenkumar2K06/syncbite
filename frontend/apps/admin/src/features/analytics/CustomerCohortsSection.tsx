import React from "react";
import type { CustomerStats } from "./types";

interface CustomerCohortsSectionProps {
  customerStats: CustomerStats;
}

export default function CustomerCohortsSection({ customerStats }: CustomerCohortsSectionProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          👥 Customer Cohorts & Retention
        </h3>
        <span className="text-xs font-mono text-sky-400">
          {customerStats.retentionRate}% Retention
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-base font-bold text-white">{customerStats.newStudents}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total Customers</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-base font-bold text-sky-400">{customerStats.activeCustomers}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active Customers</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-base font-bold text-emerald-400">
            {customerStats.repeatCustomers}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Repeat Customers</div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Repeat Order Rate:</span>
          <span className="text-emerald-400 font-bold">{customerStats.repeatRate}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all"
            style={{ width: `${Math.min(customerStats.repeatRate, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs mt-2">
          <span className="text-slate-400">30-Day Campus Retention:</span>
          <span className="text-sky-400 font-bold">{customerStats.retentionRate}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-sky-500 h-full rounded-full transition-all"
            style={{ width: `${Math.min(customerStats.retentionRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
