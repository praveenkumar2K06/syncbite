import { Input } from "../../components/ui/input";
import { fmt } from "../../utils/formatters";
import type { AdminOrderView } from "../OrdersTab";

export interface RefundModalState {
  open: boolean;
  order: AdminOrderView | null;
  amount: string;
  reason: string;
  submitting: boolean;
}

interface Props {
  refundModal: RefundModalState;
  onClose: () => void;
  onChangeAmount: (amount: string) => void;
  onChangeReason: (reason: string) => void;
  onProcess: () => void;
}

export default function RefundOverrideModal({
  refundModal,
  onClose,
  onChangeAmount,
  onChangeReason,
  onProcess,
}: Props) {
  return (
    <>
      {/* Admin Refund Override Modal */}
      {refundModal.open && refundModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
            style={{ background: "#111827", border: "1px solid #1e2d45" }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">↩️</span>
                <h3 className="text-base font-bold text-white">Admin Refund Override</h3>
              </div>
              <button
                onClick={() => onClose()}
                className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Super Admin authority allows manual issuance of full or partial refunds for order #
              {refundModal.order.id}.
            </p>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Refund Amount (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={refundModal.amount}
                  onChange={(e) => onChangeAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none font-mono"
                />
                <div className="text-[10px] text-slate-500 mt-1">
                  Total order value: {fmt(refundModal.order.total_amount)}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">
                  Reason for Admin Override
                </label>
                <textarea
                  rows={3}
                  value={refundModal.reason}
                  onChange={(e) => onChangeReason(e.target.value)}
                  placeholder="e.g. Food spilled, outlet closed, delayed delivery"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onProcess}
                disabled={refundModal.submitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer"
              >
                {refundModal.submitting ? "Processing…" : "Confirm Refund Override"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
