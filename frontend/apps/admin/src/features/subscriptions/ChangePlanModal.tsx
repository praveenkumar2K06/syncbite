import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { fmt } from "../../utils/formatters";
import type { SubscriptionPlan, MerchantSubscriptionItem } from "./types";

interface ChangePlanModalProps {
  open: boolean;
  subscription: MerchantSubscriptionItem | null;
  plans: SubscriptionPlan[];
  onClose: () => void;
  onConfirm: (
    subId: string,
    newPlanName: string,
    billingCycle: "MONTHLY" | "ANNUAL",
    options: { effectiveTiming: "IMMEDIATE" | "NEXT_CYCLE"; notes?: string },
  ) => void;
}

export default function ChangePlanModal({
  open,
  subscription,
  plans,
  onClose,
  onConfirm,
}: ChangePlanModalProps) {
  const [selectedPlanName, setSelectedPlanName] = useState<string>("");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [effectiveTiming, setEffectiveTiming] = useState<"IMMEDIATE" | "NEXT_CYCLE">("IMMEDIATE");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subscription) {
      setSelectedPlanName(subscription.plan_name);
      setBillingCycle(subscription.billing_cycle);
      setEffectiveTiming("IMMEDIATE");
      setNotes("");
      setIsSubmitting(false);
    }
  }, [subscription, open]);

  if (!open || !subscription || typeof document === "undefined") return null;

  const currentPlan = plans.find((p) => p.name === subscription.plan_name);
  const targetPlan = plans.find((p) => p.name === selectedPlanName) || currentPlan || plans[0];

  const targetPrice =
    billingCycle === "ANNUAL" ? (targetPlan?.price_annual ?? 0) : (targetPlan?.price_monthly ?? 0);

  const isCurrentSelection =
    selectedPlanName === subscription.plan_name && billingCycle === subscription.billing_cycle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPlan) return;
    setIsSubmitting(true);
    onConfirm(subscription.id, targetPlan.name, billingCycle, {
      effectiveTiming,
      notes: notes.trim() || undefined,
    });
    setIsSubmitting(false);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 shadow-2xl my-auto overflow-y-auto"
        style={{
          background: "#111827",
          border: "1px solid #1e2d45",
          maxHeight: "calc(100vh - 4rem)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🔄 Change Subscription Plan</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Update platform tier, take-rate, and billing frequency for merchant.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Merchant Summary Bar */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Merchant Entity
            </span>
            <span className="font-bold text-white text-sm">{subscription.merchant_name}</span>
            <span className="text-slate-500 text-[11px] block font-mono">
              {subscription.merchant_id}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Current Plan
            </span>
            <span className="text-violet-400 font-semibold">{subscription.plan_name}</span>
            <span className="text-slate-400 text-[11px] block font-mono">
              {subscription.billing_cycle} • {fmt(subscription.last_payment_amount)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Plan Selector */}
          <div>
            <label className="text-slate-300 font-semibold block mb-2">
              Select New Plan Tier *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {plans.map((p) => {
                const isSelected = selectedPlanName === p.name;
                const price = billingCycle === "ANNUAL" ? p.price_annual : p.price_monthly;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlanName(p.name)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "border-violet-500 bg-violet-950/40 shadow-sm shadow-violet-950/50"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-xs">{p.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-violet-400">✓ Active</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {p.commission_rate_pct}% Take-rate
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Up to {p.max_branches} branches
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                      <span className="font-bold text-white font-mono text-xs">{fmt(price)}</span>
                      <span className="text-[10px] text-slate-500">
                        {billingCycle === "ANNUAL" ? "/yr" : "/mo"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Billing Cycle Selector */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Billing Frequency</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setBillingCycle("MONTHLY")}
                className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-medium ${
                  billingCycle === "MONTHLY"
                    ? "border-violet-500 bg-violet-950/50 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("ANNUAL")}
                className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
                  billingCycle === "ANNUAL"
                    ? "border-violet-500 bg-violet-950/50 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/60">
                  Save ~17%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Comparison / Impact Summary */}
          {targetPlan && (
            <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-800/40 text-xs flex flex-col gap-2">
              <span className="text-[11px] font-bold text-violet-300">
                Plan Adjustment Summary:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Tier:</span>
                  <span className="text-white font-semibold">
                    {subscription.plan_name} ➔{" "}
                    <span className="text-violet-400">{targetPlan.name}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Billing Amount:</span>
                  <span className="text-white font-mono font-semibold">
                    {fmt(targetPrice)} / {billingCycle === "ANNUAL" ? "year" : "month"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Platform Take-rate:</span>
                  <span className="text-white font-semibold">
                    {targetPlan.commission_rate_pct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Max Outlet Branches:</span>
                  <span className="text-white font-semibold">
                    {targetPlan.max_branches} Outlets
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Effective Timing */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">Effective Date</label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-[11px] ${
                  effectiveTiming === "IMMEDIATE"
                    ? "border-slate-600 bg-slate-850 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="effectiveTiming"
                  checked={effectiveTiming === "IMMEDIATE"}
                  onChange={() => setEffectiveTiming("IMMEDIATE")}
                  className="accent-violet-500"
                />
                <div>
                  <span className="font-semibold block text-slate-200">Immediately</span>
                  <span className="text-[10px] text-slate-400">Prorated adjustment today</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-[11px] ${
                  effectiveTiming === "NEXT_CYCLE"
                    ? "border-slate-600 bg-slate-850 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="effectiveTiming"
                  checked={effectiveTiming === "NEXT_CYCLE"}
                  onChange={() => setEffectiveTiming("NEXT_CYCLE")}
                  className="accent-violet-500"
                />
                <div>
                  <span className="font-semibold block text-slate-200">Next Billing Cycle</span>
                  <span className="text-[10px] text-slate-400">Effective on next renewal</span>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-slate-400 font-medium block mb-1">
              Admin Notes / Reason (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Upgraded per merchant expansion request..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs outline-none resize-none"
              style={{ background: "#0a0f1a", border: "1px solid #1e2d45", color: "#e2e8f0" }}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isCurrentSelection}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isCurrentSelection
                  ? "opacity-50 cursor-not-allowed bg-slate-800 text-slate-400"
                  : "bg-violet-600 hover:bg-violet-500 text-white"
              }`}
            >
              <span>{isSubmitting ? "Saving..." : "Confirm Plan Change"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
