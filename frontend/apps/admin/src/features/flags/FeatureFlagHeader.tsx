import React from "react";
import type { FeatureFlag } from "../../api/admin";

interface FeatureFlagHeaderProps {
  maintenanceFlag?: FeatureFlag;
  onEmergencyDisable: () => void;
}

export default function FeatureFlagHeader({
  maintenanceFlag,
  onEmergencyDisable,
}: FeatureFlagHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span>⚑ System Feature Flags & Operational Throttles</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              maintenanceFlag?.enabled
                ? "bg-rose-950/80 text-rose-400 border-rose-800/60"
                : "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
            }`}
          >
            {maintenanceFlag?.enabled ? "⚠️ Maintenance Active" : "Normal Operations"}
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Control live platform switches, feature rollouts, API rate limits, and emergency
          kill-switches.
        </p>
      </div>

      <button
        onClick={onEmergencyDisable}
        className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        style={{ background: "linear-gradient(135deg, #f43f5e, #be123c)", color: "#ffffff" }}
        title="Turn on Maintenance Mode immediately"
      >
        <span>🛑</span> Emergency Kill-Switch
      </button>
    </div>
  );
}
