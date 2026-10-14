import React from "react";
import { fmt } from "../../utils/formatters";

interface OrderVelocitySectionProps {
  ordersDay: number;
  ordersWeek: number;
  ordersMonth: number;
  aov: number;
  completionRate: number;
  cancellationRate: number;
}

export default function OrderVelocitySection({
  ordersDay,
  ordersWeek,
  ordersMonth,
  aov,
  completionRate,
  cancellationRate,
}: OrderVelocitySectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        📦 Order Velocity & Reliability
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Orders / Day</div>
          <div className="text-lg font-bold text-white mt-1">{ordersDay}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Last 24 hours</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Orders / Week</div>
          <div className="text-lg font-bold text-white mt-1">{ordersWeek}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Last 7 days</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Orders / Month</div>
          <div className="text-lg font-bold text-white mt-1">{ordersMonth}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Last 30 days</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Average Order Value</div>
          <div className="text-lg font-bold text-white mt-1">{fmt(aov)}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Per student ticket</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Completion Rate</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">{completionRate}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Successful pickup</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Cancellation Rate</div>
          <div className="text-lg font-bold text-rose-400 mt-1">{cancellationRate}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Platform total</div>
        </div>
      </div>
    </div>
  );
}
