import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import {
  getOrdersApi,
  updateOrderStatusApi,
  cancelOrderApi,
  type OrderStatus,
  issueRefundOverrideApi,
  type Branch,
  type Brand,
  type MerchantRecord,
} from "../api/admin";
import { fmt, relTime } from "../utils/formatters";
import OrderDetailsDrawer from "./orders/OrderDetailsDrawer";
import RefundOverrideModal, { type RefundModalState } from "./orders/RefundOverrideModal";

interface OrdersTabProps {
  branches: Branch[];
  brands: Brand[];
  merchants: MerchantRecord[];
  onShowToast: (msg: string, type: "success" | "error") => void;
}

export interface AdminOrderView {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  branch_id: string;
  branch_name: string;
  brand_name?: string;
  merchant_name?: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  payment_id: string;
  payment_status: "SUCCESS" | "PENDING" | "REFUNDED" | "FAILED" | "—";
  delivery_hostel: string;
  created_at: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    modifiers?: string[];
  }>;
  status_history: Array<{
    status: string;
    changed_at: string;
    note?: string;
  }>;
}

export default function OrdersTab({ branches, brands, merchants, onShowToast }: OrdersTabProps) {
  const [orders, setOrders] = useState<AdminOrderView[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderView | null>(null);
  const loadRequestId = useRef(0);

  // Refund Modal State
  const [refundModal, setRefundModal] = useState<RefundModalState>({
    open: false,
    order: null,
    amount: "",
    reason: "Order dispute / delayed campus delivery",
    submitting: false,
  });

  // Fetch live orders
  const loadOrders = useCallback(async () => {
    const requestId = ++loadRequestId.current;
    setLoading(true);
    try {
      const data = await getOrdersApi();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: AdminOrderView[] = data.map((d) => {
          const branch = branches.find((b) => b.id === d.branch_id);
          const brand = branch ? brands.find((br) => br.id === branch.brand_id) : null;
          const merchant = brand ? merchants.find((m) => m.id === brand.merchant_id) : null;

          return {
            id: d.id,
            customer_name:
              d.delivery_address_snapshot?.full_name || d.delivery_address_snapshot?.name || "—",
            customer_email: d.delivery_address_snapshot?.email || "—",
            customer_phone: d.delivery_address_snapshot?.phone_number || undefined,
            branch_id: d.branch_id,
            branch_name: branch?.name || "—",
            brand_name: brand?.name,
            merchant_name: merchant?.business_name,
            total_amount: Number(d.total_amount),
            status: d.status,
            payment_method: d.payment_method || "—",
            payment_id: d.payment_id || "—",
            payment_status:
              (d.payment_status as any) || (d.status === "CANCELLED" ? "REFUNDED" : "—"),
            delivery_hostel: d.delivery_address_snapshot?.address_text || "—",
            created_at: d.created_at,
            items: Array.isArray(d.items)
              ? d.items.map((it) => ({
                  name: it.item_name_snapshot || it.name || "Menu Item",
                  quantity: it.quantity || 1,
                  price: Number(it.price_snapshot ?? it.unit_price_snapshot ?? 0),
                }))
              : [],
            status_history: Array.isArray(d.status_logs)
              ? d.status_logs.map((sl) => ({
                  status: (sl.status || sl.new_status || d.status) as string,
                  changed_at: sl.created_at,
                }))
              : [{ status: d.status, changed_at: d.created_at }],
          };
        });
        if (requestId === loadRequestId.current) setOrders(mapped);
      } else {
        if (requestId === loadRequestId.current) setOrders([]);
      }
    } catch {
      if (requestId === loadRequestId.current) onShowToast("Could not load orders.", "error");
    } finally {
      if (requestId === loadRequestId.current) setLoading(false);
    }
  }, [branches, brands, merchants, onShowToast]);

  useEffect(() => {
    loadOrders();
    return () => {
      loadRequestId.current += 1;
    };
  }, [loadOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (statusTab !== "ALL" && ord.status !== statusTab) return false;
      if (selectedBranchFilter !== "ALL" && ord.branch_id && ord.branch_id !== selectedBranchFilter)
        return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        ord.id.toLowerCase().includes(q) ||
        ord.customer_name.toLowerCase().includes(q) ||
        ord.customer_email.toLowerCase().includes(q) ||
        ord.branch_name.toLowerCase().includes(q) ||
        ord.delivery_hostel.toLowerCase().includes(q)
      );
    });
  }, [orders, statusTab, selectedBranchFilter, search]);

  // Status progression action
  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await updateOrderStatusApi(orderId, nextStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: nextStatus,
                status_history: [
                  ...o.status_history,
                  {
                    status: nextStatus,
                    changed_at: new Date().toISOString(),
                    note: "Updated by Admin",
                  },
                ],
              }
            : o,
        ),
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                status: nextStatus,
                status_history: [
                  ...prev.status_history,
                  {
                    status: nextStatus,
                    changed_at: new Date().toISOString(),
                    note: "Updated by Admin",
                  },
                ],
              }
            : null,
        );
      }
      onShowToast(`Order #${orderId} marked as ${nextStatus}!`, "success");
    } catch {
      onShowToast("Could not update order status.", "error");
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrderApi(orderId);
      await loadOrders();
      onShowToast(`Order #${orderId} cancelled.`, "success");
    } catch {
      onShowToast("Failed to cancel order.", "error");
    }
  };

  // Process Refund Override
  const handleProcessRefundOverride = async () => {
    if (!refundModal.order) return;
    const amountNum = parseFloat(refundModal.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      onShowToast("Enter a valid refund amount.", "error");
      return;
    }

    setRefundModal((prev) => ({ ...prev, submitting: true }));
    try {
      // Call backend admin refund override endpoint
      await issueRefundOverrideApi({
        payment_id: "00000000-0000-0000-0000-000000000001",
        amount: amountNum,
        reason: refundModal.reason,
      });

      // Mark order as refunded
      setOrders((prev) =>
        prev.map((o) =>
          o.id === refundModal.order?.id
            ? {
                ...o,
                payment_status: "REFUNDED",
                status: "CANCELLED",
                status_history: [
                  ...o.status_history,
                  {
                    status: "CANCELLED",
                    changed_at: new Date().toISOString(),
                    note: `Admin issued refund of ${fmt(amountNum)} (${refundModal.reason})`,
                  },
                ],
              }
            : o,
        ),
      );

      onShowToast(`Refund override of ${fmt(amountNum)} authorized successfully! ✓`, "success");
      setRefundModal({ open: false, order: null, amount: "", reason: "", submitting: false });
    } catch {
      onShowToast("Refund override failed.", "error");
      setRefundModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const STATUS_TABS = [
    { key: "ALL", label: "All Orders", count: orders.length },
    { key: "PLACED", label: "Pending", count: orders.filter((o) => o.status === "PLACED").length },
    {
      key: "ACCEPTED",
      label: "Accepted",
      count: orders.filter((o) => o.status === "ACCEPTED").length,
    },
    {
      key: "PREPARING",
      label: "Preparing",
      count: orders.filter((o) => o.status === "PREPARING").length,
    },
    { key: "READY", label: "Ready", count: orders.filter((o) => o.status === "READY").length },
    {
      key: "COMPLETED",
      label: "Completed",
      count: orders.filter((o) => o.status === "COMPLETED").length,
    },
    {
      key: "CANCELLED",
      label: "Cancelled",
      count: orders.filter((o) => o.status === "CANCELLED").length,
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span>📦 Global Order Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-950/70 border border-amber-800/60 text-amber-400">
              {orders.length} Live Orders
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Platform-wide real-time tracking, kitchen ticket progression, dispute resolution, and
            admin refund overrides.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          style={{ background: "#1a2235", color: "#94a3b8", border: "1px solid #1e2d45" }}
        >
          ↻ Refresh Orders
        </button>
      </div>

      {/* Status progression tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatusTab(t.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              statusTab === t.key
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusTab === t.key
                  ? "bg-amber-500/30 text-amber-300"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div
        className="p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, student, restaurant…"
              className="w-full px-3.5 py-2 rounded-xl text-xs outline-none pl-8"
            />
            <span className="absolute left-2.5 top-2 text-xs text-slate-500">🔍</span>
          </div>

          <Select
            value={selectedBranchFilter}
            onValueChange={(value) => setSelectedBranchFilter(value ?? "")}
          >
            <SelectTrigger className="px-3 py-2 rounded-xl text-xs outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Campus Outlets</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-slate-400 font-mono self-end md:self-center">
          Showing {filteredOrders.length} orders
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div
          className="p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3"
          style={{ background: "#111827", border: "1px solid #1e2d45" }}
        >
          <span className="text-3xl">📦</span>
          <div className="text-sm font-semibold text-white">
            {orders.length === 0 ? "No orders found in database" : "No orders matching criteria"}
          </div>
          <div className="text-xs text-slate-400 max-w-sm">
            {orders.length === 0
              ? "No student orders have been placed on the platform yet. Live orders will populate here automatically in real time."
              : "Try switching status tabs or clearing your search filters."}
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden border border-slate-800"
          style={{ background: "#111827" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#0f1724" }}>
                {[
                  "Status",
                  "Order ID & Time",
                  "Student Customer",
                  "Outlet / Brand",
                  "Items",
                  "Amount",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    style={{ borderBottom: "1px solid #1e2d45" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord, i) => (
                <tr
                  key={ord.id}
                  style={{ background: i % 2 === 0 ? "#111827" : "rgba(26,34,53,0.4)" }}
                  className="border-t border-slate-800/60 hover:bg-slate-800/40 transition-colors"
                >
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 w-fit ${
                        ord.status === "COMPLETED"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                          : ord.status === "READY"
                            ? "bg-cyan-950/80 text-cyan-400 border border-cyan-800/60"
                            : ord.status === "PREPARING"
                              ? "bg-purple-950/80 text-purple-400 border border-purple-800/60"
                              : ord.status === "ACCEPTED"
                                ? "bg-blue-950/80 text-blue-400 border border-blue-800/60"
                                : ord.status === "PLACED"
                                  ? "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                                  : "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ord.status === "COMPLETED"
                            ? "bg-emerald-400"
                            : ord.status === "READY"
                              ? "bg-cyan-400"
                              : ord.status === "PREPARING"
                                ? "bg-purple-400"
                                : ord.status === "ACCEPTED"
                                  ? "bg-blue-400"
                                  : ord.status === "PLACED"
                                    ? "bg-amber-400 animate-pulse"
                                    : "bg-rose-400"
                        }`}
                      />
                      {ord.status}
                    </span>
                  </td>

                  {/* Order ID & Time */}
                  <td className="px-5 py-4">
                    <div className="font-mono text-xs font-semibold text-white">{ord.id}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {relTime(ord.created_at)}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="font-medium text-white text-xs">{ord.customer_name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                      {ord.delivery_hostel}
                    </div>
                  </td>

                  {/* Outlet */}
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-200 text-xs">{ord.branch_name}</div>
                    <div className="text-[11px] text-slate-500">
                      {ord.merchant_name || "Campus Direct"}
                    </div>
                  </td>

                  {/* Items summary */}
                  <td className="px-5 py-4 text-xs text-slate-300">
                    <div>{ord.items.length} items</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                      {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <div className="font-bold text-white text-sm">{fmt(ord.total_amount)}</div>
                    <div
                      className={`text-[10px] font-mono mt-0.5 ${
                        ord.payment_status === "REFUNDED" ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {ord.payment_status}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
                      >
                        Details
                      </button>

                      {/* Refund Override Button */}
                      {ord.status !== "CANCELLED" && (
                        <button
                          onClick={() =>
                            setRefundModal({
                              open: true,
                              order: ord,
                              amount: String(ord.total_amount),
                              reason: "Admin dispute override",
                              submitting: false,
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-all cursor-pointer"
                          title="Authorize Refund Override"
                        >
                          ↩️ Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OrderDetailsDrawer
        selectedOrder={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
        onCancelOrder={handleCancelOrder}
      />

      <RefundOverrideModal
        refundModal={refundModal}
        onClose={() =>
          setRefundModal({ open: false, order: null, amount: "", reason: "", submitting: false })
        }
        onChangeAmount={(amount) => setRefundModal((prev) => ({ ...prev, amount }))}
        onChangeReason={(reason) => setRefundModal((prev) => ({ ...prev, reason }))}
        onProcess={handleProcessRefundOverride}
      />
    </div>
  );
}
