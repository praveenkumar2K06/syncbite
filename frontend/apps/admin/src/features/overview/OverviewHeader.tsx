import React, { useState, useEffect } from "react";
import {
  isPlatformFrozen,
  setPlatformFreeze as updatePlatformFreeze,
  subscribePlatformFreeze,
} from "@syncbite/shared";
import { getFeatureFlagsApi, toggleFeatureFlagApi } from "../../api/domains/flags";

interface OverviewHeaderProps {
  onNavigateToOnboard: () => void;
}

export default function OverviewHeader({ onNavigateToOnboard }: OverviewHeaderProps) {
  const [platformFreeze, setPlatformFreezeState] = useState(() => isPlatformFrozen());

  useEffect(() => {
    let mounted = true;
    getFeatureFlagsApi()
      .then((flags) => {
        if (!mounted) return;
        const freezeFlag = flags.find(
          (f) => f.flag_key === "EMERGENCY_MAINTENANCE_MODE" || f.flag_key === "maintenance_mode",
        );
        if (freezeFlag) {
          setPlatformFreezeState(freezeFlag.enabled);
          updatePlatformFreeze(freezeFlag.enabled);
        }
      })
      .catch(() => {});

    const unsubscribe = subscribePlatformFreeze(setPlatformFreezeState);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  async function toggleFreeze() {
    const next = !platformFreeze;
    setPlatformFreezeState(next);
    updatePlatformFreeze(next);

    try {
      await toggleFeatureFlagApi(
        "EMERGENCY_MAINTENANCE_MODE",
        next,
        next ? "EMERGENCY_FREEZE_ADMIN" : null,
      );
    } catch {
      setPlatformFreezeState(!next);
      updatePlatformFreeze(!next);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <span>Platform Overview</span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              platformFreeze
                ? "bg-rose-950/80 text-rose-400 border-rose-800/60 animate-pulse"
                : "bg-emerald-950/80 text-emerald-400 border-emerald-800/60"
            }`}
          >
            {platformFreeze ? "⚠ CAMPUS CHECKOUTS FROZEN" : "Live Production"}
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time platform KPIs, volume statistics, financial ledger, and campus operations.
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleFreeze}
          className={`text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer border flex items-center gap-1.5 ${
            platformFreeze
              ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-500 shadow-rose-900/30"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
          }`}
          title="Emergency pause for all student checkouts during weather alerts or power cuts"
        >
          <span>🛑</span>
          <span>{platformFreeze ? "Resume Platform" : "Emergency Freeze"}</span>
        </button>

        <button
          onClick={onNavigateToOnboard}
          className="text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          style={{ background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white" }}
        >
          <span>＋</span> Onboard Outlet
        </button>
      </div>
    </div>
  );
}
