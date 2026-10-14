import React from "react";
import { fmt } from "../../utils/formatters";
import type { BranchPerformanceItem } from "./types";

interface OutletDistributionSectionProps {
  totalMerchants: number;
  activeBranches: number;
  inactiveBranches: number;
  branchPerformance: BranchPerformanceItem[];
}

export default function OutletDistributionSection({
  totalMerchants,
  activeBranches,
  inactiveBranches,
  branchPerformance,
}: OutletDistributionSectionProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          🍽️ Restaurant & Outlet Distribution
        </h3>
        <span className="text-xs font-mono text-emerald-400">{activeBranches} Active</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-base font-bold text-white">{totalMerchants}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total Merchants</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-base font-bold text-emerald-400">{activeBranches}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Active Outlets</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="text-base font-bold text-rose-400">{inactiveBranches}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Inactive Outlets</div>
        </div>
      </div>

      <div>
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Top Performing Outlets
        </div>
        {branchPerformance.length === 0 ? (
          <div className="p-4 text-center rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 text-xs">
            No outlets registered in database.
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {branchPerformance.slice(0, 4).map((b, i) => (
              <div
                key={b.id}
                className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-500">#{i + 1}</span>
                  <span className="font-medium text-white">{b.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-400 font-semibold">{fmt(b.volume)}</span>
                  <span className="text-[10px] text-slate-500 ml-2 font-mono">
                    ({b.orderCount} orders)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
