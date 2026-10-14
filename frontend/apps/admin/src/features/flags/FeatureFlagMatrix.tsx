import React from "react";
import type { FeatureFlag } from "../../api/admin";

interface FeatureFlagMatrixProps {
  flagsLoading: boolean;
  flags: FeatureFlag[];
  onToggleFlag: (flag: FeatureFlag) => void;
}

export default function FeatureFlagMatrix({
  flagsLoading,
  flags,
  onToggleFlag,
}: FeatureFlagMatrixProps) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 border border-slate-800"
      style={{ background: "#111827" }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Feature Rollout Matrix</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Live toggle switches across campus apps, checkout funnels, and search engines.
          </p>
        </div>
      </div>

      {flagsLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : flags.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <span className="text-2xl">🚩</span>
          <p className="font-semibold text-slate-300">
            No feature flags currently configured in database.
          </p>
          <p className="text-[11px] text-slate-500">
            Feature switches deployed to the API gateway will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {flags.map((flag) => {
            const isMaintenance = flag.flag_key === "maintenance_mode";
            const isDanger = isMaintenance && flag.enabled;

            return (
              <div
                key={flag.flag_key}
                className="p-4 rounded-xl flex items-center justify-between gap-3 border transition-all"
                style={{
                  background: isDanger ? "rgba(244,63,94,0.08)" : "#0a0f1a",
                  borderColor: isDanger ? "rgba(244,63,94,0.4)" : "#1e2d45",
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{flag.flag_key}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        flag.enabled
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {flag.enabled ? "ON" : "OFF"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    Config:{" "}
                    <span className="font-mono text-slate-300">{flag.value || "default"}</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFlag(flag)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex-shrink-0"
                  style={{
                    background: flag.enabled ? "rgba(244,63,94,0.15)" : "rgba(16,185,129,0.15)",
                    color: flag.enabled ? "#f43f5e" : "#10b981",
                    border: `1px solid ${
                      flag.enabled ? "rgba(244,63,94,0.3)" : "rgba(16,185,129,0.3)"
                    }`,
                  }}
                >
                  {flag.enabled ? "Disable" : "Enable"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
