import type { AdminOrderView } from "../OrdersTab";
import type { OrderStatus } from "../../api/admin";
import { fmt, relTime } from "../../utils/formatters";

interface Props {
  selectedOrder: AdminOrderView | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onCancelOrder: (orderId: string) => void;
}

export default function OrderDetailsDrawer({
  selectedOrder,
  onClose,
  onUpdateStatus,
  onCancelOrder,
}: Props) {
  return (
    <>
      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-2xl rounded-2xl p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: "#111827", border: "1px solid #1e2d45" }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📦</span>
                <div>
                  <h3 className="text-base font-bold text-white">Order #{selectedOrder.id}</h3>
                  <div className="text-xs text-slate-400">
                    Placed {relTime(selectedOrder.created_at)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onClose()}
                className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Status change progression */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-slate-400 font-medium">Lifecycle Override:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["ACCEPTED", "PREPARING", "READY", "COMPLETED"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(selectedOrder.id, st)}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] cursor-pointer ${
                      selectedOrder.status === st
                        ? "bg-amber-500 text-black"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    → {st}
                  </button>
                ))}
                {selectedOrder.status !== "CANCELLED" && (
                  <button
                    onClick={() => onCancelOrder(selectedOrder.id)}
                    className="px-2.5 py-1 rounded-lg font-semibold text-[11px] text-rose-400 bg-rose-950/50 hover:bg-rose-900 border border-rose-800/60 cursor-pointer"
                  >
                    ✕ Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Customer & Restaurant info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mb-2">
                  Customer & Delivery
                </div>
                <div className="text-white font-medium">{selectedOrder.customer_name}</div>
                <div className="text-slate-400 mt-0.5">{selectedOrder.customer_email}</div>
                <div className="text-slate-400 font-mono mt-0.5">
                  {selectedOrder.customer_phone}
                </div>
                <div className="text-slate-300 mt-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  📍 {selectedOrder.delivery_hostel}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mb-2">
                  Outlet & Payment
                </div>
                <div className="text-white font-medium">{selectedOrder.branch_name}</div>
                <div className="text-slate-400 mt-0.5">Merchant: {selectedOrder.merchant_name}</div>
                <div className="mt-2 text-slate-300">Method: {selectedOrder.payment_method}</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Ref: {selectedOrder.payment_id}
                </div>
                <div className="mt-1 font-bold text-white text-sm">
                  Total: {fmt(selectedOrder.total_amount)}
                </div>
              </div>
            </div>

            {/* Item list */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mb-2">
                Order Items ({selectedOrder.items.length})
              </div>
              <div className="flex flex-col gap-1.5">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60"
                  >
                    <span className="text-slate-200">
                      {it.quantity}x {it.name}
                    </span>
                    <span className="text-white font-mono font-medium">
                      {fmt(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History Logs */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mb-2">
                Audit Timeline & Status History
              </div>
              <div className="flex flex-col gap-2">
                {selectedOrder.status_history.map((h, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">{h.status}</span>
                      {h.note && <div className="text-[11px] text-slate-400">{h.note}</div>}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {relTime(h.changed_at)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
