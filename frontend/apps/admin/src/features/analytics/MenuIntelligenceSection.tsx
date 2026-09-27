import React from "react";
import { fmt } from "../../utils/formatters";
import type { DishVelocityItem, CategoryVelocityItem } from "./types";

interface MenuIntelligenceSectionProps {
  ordersLoading: boolean;
  topDishes: DishVelocityItem[];
  topCategories: CategoryVelocityItem[];
}

export default function MenuIntelligenceSection({
  ordersLoading,
  topDishes,
  topCategories,
}: MenuIntelligenceSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top dishes */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          🍲 Top Dishes by Order Volume
        </h3>
        {ordersLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : topDishes.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs flex flex-col items-center justify-center gap-1.5">
            <span className="text-xl">🍲</span>
            <p className="font-semibold text-slate-300">No dish sales recorded in database yet.</p>
            <p className="text-[11px] text-slate-500">
              Order item velocity will automatically populate here as students order.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {topDishes.map((dish, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{dish.name}</div>
                  <div className="text-[11px] text-slate-400">{dish.outlet}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">{dish.orders} Orders</div>
                  <div className="text-[11px] text-emerald-400 font-mono">{fmt(dish.volume)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Most ordered categories */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          📊 Most Ordered Categories & Cuisines
        </h3>
        {topCategories.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs flex flex-col items-center justify-center gap-1.5">
            <span className="text-xl">📊</span>
            <p className="font-semibold text-slate-300">No brand cuisine categories registered.</p>
            <p className="text-[11px] text-slate-500">
              Configure brand cuisine tags to display category market share.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {topCategories.map((cat, i) => (
              <div key={i} className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-200">{cat.name}</span>
                  <span className="text-slate-400 font-mono">
                    {cat.count} brands ({cat.sharePct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.sharePct}%`,
                      background:
                        i === 0 ? "#8b5cf6" : i === 1 ? "#ec4899" : i === 2 ? "#0ea5e9" : "#10b981",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
