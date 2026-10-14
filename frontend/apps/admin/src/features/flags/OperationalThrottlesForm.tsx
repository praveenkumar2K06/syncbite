import { Input } from "../../components/ui/input";
import React from "react";

interface OperationalThrottlesFormProps {
  rateLimitThreshold: string;
  onRateLimitChange: (val: string) => void;
  maxCheckoutConcurrency: string;
  onConcurrencyChange: (val: string) => void;
  orderTimeoutMins: string;
  onTimeoutChange: (val: string) => void;
  throttlesSaved: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function OperationalThrottlesForm({
  rateLimitThreshold,
  onRateLimitChange,
  maxCheckoutConcurrency,
  onConcurrencyChange,
  orderTimeoutMins,
  onTimeoutChange,
  throttlesSaved,
  onSubmit,
}: OperationalThrottlesFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl p-6 flex flex-col gap-4 border border-slate-800"
      style={{ background: "#111827" }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">
            Operational Throttles & Threshold Controls
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Prevent server stampedes, enforce checkout concurrency ceilings, and regulate request
            throughput.
          </p>
        </div>
        {throttlesSaved && (
          <span className="text-xs text-emerald-400 font-semibold animate-fade-in">
            ✓ Thresholds applied live!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
          <label className="text-slate-300 font-medium">Rate Limit Ceiling (req/sec)</label>
          <Input
            type="number"
            value={rateLimitThreshold}
            onChange={(e) => onRateLimitChange(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs outline-none font-mono"
          />
          <span className="text-[10px] text-slate-500">
            Global API Gateway bucket throttle per IP
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
          <label className="text-slate-300 font-medium">Checkout Concurrency Cap</label>
          <Input
            type="number"
            value={maxCheckoutConcurrency}
            onChange={(e) => onConcurrencyChange(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs outline-none font-mono"
          />
          <span className="text-[10px] text-slate-500">Max concurrent database payment locks</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
          <label className="text-slate-300 font-medium">Auto-Cancel Timeout (mins)</label>
          <Input
            type="number"
            value={orderTimeoutMins}
            onChange={(e) => onTimeoutChange(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs outline-none font-mono"
          />
          <span className="text-[10px] text-slate-500">
            Unaccepted kitchen ticket auto-expiration
          </span>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-input cursor-pointer"
        >
          Apply Operational Thresholds
        </button>
      </div>
    </form>
  );
}
