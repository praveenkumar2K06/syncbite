import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../components/ui/sheet";
import {
  getMerchantSubscriptionHistoryApi,
  type AdminSubscriptionResponse,
} from "../../api/domains/subscriptions";

interface MerchantSubscriptionHistorySheetProps {
  open: boolean;
  onClose: () => void;
  merchantId: string | null;
  merchantName: string;
}

export default function MerchantSubscriptionHistorySheet({
  open,
  onClose,
  merchantId,
  merchantName,
}: MerchantSubscriptionHistorySheetProps) {
  const [history, setHistory] = useState<AdminSubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !merchantId) {
      setHistory([]);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    getMerchantSubscriptionHistoryApi(merchantId)
      .then((data) => {
        if (!isMounted) return;
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch merchant subscription history:", err);
        setError("Unable to load subscription history from the server.");
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [open, merchantId]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl bg-slate-950 border-l border-slate-800 text-slate-100 flex flex-col p-0 overflow-hidden"
      >
        <SheetHeader className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <SheetTitle className="text-lg font-bold text-white">Subscription History</SheetTitle>
          </div>
          <SheetDescription className="text-xs text-slate-400 mt-1">
            Historical records, plan changes, and status transitions for{" "}
            <span className="text-violet-400 font-semibold">{merchantName}</span>.
          </SheetDescription>
          {merchantId && (
            <div className="mt-2 text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded w-fit border border-slate-800">
              ID: {merchantId}
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Fetching subscription history...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
              <p className="font-semibold mb-1">Failed to Load</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center justify-center gap-2">
              <span className="text-3xl">📭</span>
              <p className="text-sm font-semibold text-slate-300">No Historical Records</p>
              <p className="text-xs text-slate-500 max-w-xs">
                No prior subscription changes or archived plans found for this merchant.
              </p>
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Timeline ({history.length} records)
              </div>
              {history.map((record, index) => {
                const isActive = record.status === "ACTIVE";
                const isCancelled = record.status === "CANCELLED";
                const dateStr = record.created_at
                  ? new Date(record.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "N/A";
                const validUntilStr = record.valid_until
                  ? new Date(record.valid_until).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })
                  : "Indefinite";

                return (
                  <div
                    key={record.id || index}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-violet-950/80 border border-violet-800/60 text-violet-300">
                          {record.plan_tier || "UNKNOWN"}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {record.billing_cycle || "MONTHLY"}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isActive
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                            : isCancelled
                              ? "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                              : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                        }`}
                      >
                        {record.status || "UNKNOWN"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/60">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Effective Since</span>
                        <span className="text-slate-300 font-medium">{dateStr}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Valid Until</span>
                        <span className="text-slate-300 font-medium">{validUntilStr}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">
                          Take-Rate / Commission
                        </span>
                        <span className="text-emerald-400 font-mono font-medium">
                          {record.commission_rate_percentage !== undefined &&
                          record.commission_rate_percentage !== null
                            ? `${record.commission_rate_percentage}%`
                            : "Standard"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Max Branches</span>
                        <span className="text-slate-300 font-mono font-medium">
                          {record.max_branches ?? "Unlimited"}
                        </span>
                      </div>
                    </div>

                    {record.reason && (
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                        <span className="text-slate-500 font-semibold block text-[10px] mb-0.5">
                          Change Note / Reason:
                        </span>
                        {record.reason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
