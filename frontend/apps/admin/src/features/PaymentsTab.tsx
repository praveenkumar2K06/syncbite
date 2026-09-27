import { useState, useEffect, useMemo, useCallback, type FormEvent } from "react";
import { getOrdersApi, issueRefundOverrideApi, type MerchantRecord } from "../api/admin";
import { fmt } from "../utils/formatters";
import type { PaymentTransactionRecord, AdminOverrideModalState } from "./payments/types";
import PaymentHeader from "./payments/PaymentHeader";
import PaymentFilters from "./payments/PaymentFilters";
import PaymentTransactionsTable from "./payments/PaymentTransactionsTable";
import PaymentDetailDrawer from "./payments/PaymentDetailDrawer";
import AdminRefundOverrideModal from "./payments/AdminRefundOverrideModal";

export type { PaymentTransactionRecord };

interface PaymentsTabProps {
  merchants: MerchantRecord[];
  onShowToast: (msg: string, type: "success" | "error") => void;
}

export default function PaymentsTab({ merchants, onShowToast }: PaymentsTabProps) {
  const [activeModule, setActiveModule] = useState<"TRANSACTIONS" | "REFUND_MANAGEMENT">(
    "TRANSACTIONS",
  );
  const [transactions, setTransactions] = useState<PaymentTransactionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [merchantFilter, setMerchantFilter] = useState<string>("ALL");

  // Admin Override Modal
  const [overrideModal, setOverrideModal] = useState<AdminOverrideModalState>({
    open: false,
    paymentId: "",
    amount: "",
    reason: "",
    submitting: false,
  });

  // Selected Transaction for Drawer
  const [selectedTx, setSelectedTx] = useState<PaymentTransactionRecord | null>(null);

  // Derive transactions from real orders
  const loadTransactionsFromOrders = useCallback(async () => {
    setLoading(true);
    try {
      const liveOrders = await getOrdersApi();
      if (Array.isArray(liveOrders) && liveOrders.length > 0) {
        const txList: PaymentTransactionRecord[] = liveOrders.map((ord) => {
          const isCancelled = ord.status === "CANCELLED";
          const isFailed = ord.status === "FAILED";

          return {
            id: ord.payment_id || `ord_${ord.id}`,
            order_id: ord.id,
            merchant_name: "—",
            customer_name:
              ord.delivery_address_snapshot?.full_name ||
              ord.delivery_address_snapshot?.name ||
              "—",
            amount: Number(ord.total_amount || 0),
            type: isCancelled ? "REFUND" : "PAYMENT",
            status: isFailed
              ? "FAILED"
              : isCancelled
                ? "SUCCESS"
                : (ord.payment_status as any) || "SUCCESS",
            provider: ord.payment_method || "—",
            gateway_ref: ord.payment_id || "—",
            created_at: ord.created_at,
            refund_reason: isCancelled ? "Order cancelled" : undefined,
          };
        });
        setTransactions(txList);
      } else {
        setTransactions([]);
      }
    } catch {
      onShowToast("Could not load payment activity.", "error");
    } finally {
      setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    loadTransactionsFromOrders();
  }, [loadTransactionsFromOrders]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (activeModule === "REFUND_MANAGEMENT" && tx.type === "PAYMENT") return false;
      if (statusFilter !== "ALL" && tx.status !== statusFilter) return false;
      if (typeFilter !== "ALL" && tx.type !== typeFilter) return false;
      if (merchantFilter !== "ALL" && tx.merchant_name !== merchantFilter) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        tx.id.toLowerCase().includes(q) ||
        tx.order_id.toLowerCase().includes(q) ||
        tx.gateway_ref.toLowerCase().includes(q) ||
        tx.customer_name.toLowerCase().includes(q) ||
        tx.merchant_name.toLowerCase().includes(q)
      );
    });
  }, [transactions, activeModule, statusFilter, typeFilter, merchantFilter, search]);

  // Handle Admin Override execution
  const handleExecuteOverride = async (e: FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(overrideModal.amount);
    if (isNaN(amt) || amt <= 0) {
      onShowToast("Enter a valid refund amount.", "error");
      return;
    }
    if (!overrideModal.reason.trim()) {
      onShowToast("Refund reason is mandatory.", "error");
      return;
    }
    if (!overrideModal.paymentId.trim()) {
      onShowToast("Payment ID or Order ID is required for refund override.", "error");
      return;
    }

    setOverrideModal((prev) => ({ ...prev, submitting: true }));
    try {
      const res = await issueRefundOverrideApi({
        payment_id: overrideModal.paymentId.trim(),
        amount: amt,
        reason: overrideModal.reason.trim(),
      });

      const newTx: PaymentTransactionRecord = {
        id: res.refund_transaction_id || `rfnd_${Date.now()}`,
        order_id: overrideModal.paymentId,
        merchant_name: "—",
        customer_name: "—",
        amount: amt,
        type: "REFUND",
        status: (res.status as any) || "SUCCESS",
        provider: "—",
        gateway_ref: res.refund_transaction_id || "—",
        created_at: res.processed_at || new Date().toISOString(),
        refund_reason: `Admin Override: ${overrideModal.reason}`,
      };

      setTransactions((prev) => [newTx, ...prev]);
      onShowToast(`Manual refund override of ${fmt(amt)} processed successfully! ✓`, "success");
      setOverrideModal({ open: false, paymentId: "", amount: "", reason: "", submitting: false });
    } catch {
      onShowToast("Failed to process refund override.", "error");
      setOverrideModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleModalFieldChange = <K extends keyof AdminOverrideModalState>(
    key: K,
    value: AdminOverrideModalState[K],
  ) => {
    setOverrideModal((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PaymentHeader
        onOpenOverrideModal={() =>
          setOverrideModal({ open: true, paymentId: "", amount: "", reason: "", submitting: false })
        }
        onRefresh={loadTransactionsFromOrders}
      />

      <PaymentFilters
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          setTypeFilter("ALL");
        }}
        totalTransactionsCount={transactions.length}
        refundsCount={transactions.filter((t) => t.type !== "PAYMENT").length}
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        merchantFilter={merchantFilter}
        onMerchantFilterChange={setMerchantFilter}
        merchants={merchants}
        filteredCount={filtered.length}
      />

      <PaymentTransactionsTable
        loading={loading}
        transactions={filtered}
        totalTransactionsCount={transactions.length}
        onSelectTx={setSelectedTx}
      />

      <PaymentDetailDrawer selectedTx={selectedTx} onClose={() => setSelectedTx(null)} />

      <AdminRefundOverrideModal
        modal={overrideModal}
        onClose={() =>
          setOverrideModal({
            open: false,
            paymentId: "",
            amount: "",
            reason: "",
            submitting: false,
          })
        }
        onChangeField={handleModalFieldChange}
        onSubmit={handleExecuteOverride}
      />
    </div>
  );
}
