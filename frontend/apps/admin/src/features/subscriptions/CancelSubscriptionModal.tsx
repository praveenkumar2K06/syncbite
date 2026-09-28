import React, { useState, useEffect } from "react";
import { formatDate } from "../../utils/format";
import { createPortal } from "react-dom";
import type { MerchantSubscriptionItem } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface CancelSubscriptionModalProps {
  open: boolean;
  subscription: MerchantSubscriptionItem | null;
  onClose: () => void;
  onConfirm: (
    subId: string,
    reason: string,
    timing: "IMMEDIATE" | "PERIOD_END",
    notes?: string,
  ) => void;
}

const CANCELLATION_REASONS = [
  "Merchant voluntary cancellation request",
  "Non-payment / Unsettled platform invoices",
  "Campus outlet closure / Inactive merchant",
  "Terms of service violation",
  "Migrated to custom enterprise offline contract",
  "Other administrative reason",
];

export default function CancelSubscriptionModal({
  open,
  subscription,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(CANCELLATION_REASONS[0]);
  const [timing, setTiming] = useState<"IMMEDIATE" | "PERIOD_END">("PERIOD_END");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedReason(CANCELLATION_REASONS[0]);
      setTiming("PERIOD_END");
      setNotes("");
      setIsSubmitting(false);
    }
  }, [open, subscription]);

  if (!open || !subscription || typeof document === "undefined") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onConfirm(subscription.id, selectedReason, timing, notes.trim() || undefined);
    setIsSubmitting(false);
    onClose();
  };

  const formattedPeriodEnd = (() => {
    try {
      return formatDate(subscription.current_period_end);
    } catch {
      return subscription.current_period_end;
    }
  })();

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
              <span className="text-rose-400">⚠️</span>
              <span>Cancel Merchant Subscription</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Confirm cancellation of active SaaS billing and platform privileges.
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

        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/50 flex items-start gap-2.5 text-xs text-rose-200">
          <span className="text-rose-400 text-sm leading-none mt-0.5">✕</span>
          <div>
            <span className="font-bold text-rose-300 block">Subscription Termination Notice</span>
            Cancelling this subscription will mark the merchant ledger as cancelled, revert any
            discounted take-rates to standard rates, and discontinue renewal invoicing.
          </div>
        </div>

        {/* Target Merchant Details */}
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
              Active Plan
            </span>
            <span className="text-violet-400 font-semibold">{subscription.plan_name}</span>
            <span className="text-slate-400 text-[11px] block">
              Cycle End: <span className="text-slate-300">{formattedPeriodEnd}</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Cancellation Timing */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Cancellation Effective Timing *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  timing === "PERIOD_END"
                    ? "border-amber-500/80 bg-amber-950/20 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="timing"
                  checked={timing === "PERIOD_END"}
                  onChange={() => setTiming("PERIOD_END")}
                  className="accent-amber-500 mt-0.5"
                />
                <div>
                  <span className="font-semibold block text-slate-200">End of Current Cycle</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Maintain access until {formattedPeriodEnd}.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  timing === "IMMEDIATE"
                    ? "border-rose-500/80 bg-rose-950/20 text-white"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="timing"
                  checked={timing === "IMMEDIATE"}
                  onChange={() => setTiming("IMMEDIATE")}
                  className="accent-rose-500 mt-0.5"
                />
                <div>
                  <span className="font-semibold block text-slate-200">Immediate Cancellation</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Cancel subscription immediately today.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Primary Reason for Cancellation *
            </label>
            <Select
              value={selectedReason}
              onValueChange={(value) => setSelectedReason(value ?? "")}
            >
              <SelectTrigger className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none bg-slate-900 border border-slate-800 text-slate-200 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-slate-400 font-medium block mb-1">
              Internal Admin Notes / Documentation
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Discussed with merchant director; confirmed termination request..."
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
              Keep Subscription
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span>{isSubmitting ? "Processing..." : "Confirm Cancellation"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
