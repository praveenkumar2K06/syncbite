import { useState, useEffect, useMemo, useCallback } from "react";
import { getMerchantCommissionsApi, toUserMessage, type PlatformCommission } from "@/api";
import { usePortal } from "@/context/PortalContext";
import { useOptionalOrdersContext } from "@/context/OrdersContext";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Coins01Icon,
  RefreshCwIcon,
  Search01Icon,
  Invoice01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import { FinanceKpiCards, type FinanceMetricsData } from "@/components/finances/FinanceKpiCards";
import { OrdersLedgerTable } from "@/components/finances/OrdersLedgerTable";
import { CommissionLedgerTable } from "@/components/finances/CommissionLedgerTable";
import {
  TransactionDetailsModal,
  type FinanceTransaction,
} from "@/components/finances/TransactionDetailsModal";

export default function FinancesScreen() {
  const { branchId, showToast } = usePortal();
  const ordersCtx = useOptionalOrdersContext();
  const fallback = useOrders({ branchId: ordersCtx ? null : branchId, showToast, autoPoll: false });
  const orders = ordersCtx ? ordersCtx.orders : fallback.orders;
  const [commissions, setCommissions] = useState<PlatformCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "refunded" | "pending">("all");
  const [selectedTx, setSelectedTx] = useState<FinanceTransaction | null>(null);
  const [now] = useState(() => new Date());

  const loadCommissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMerchantCommissionsApi();
      setCommissions(data);
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadCommissions();
  }, [loadCommissions]);

  // Build unified transactions from orders and commission records
  const transactions = useMemo((): FinanceTransaction[] => {
    const commissionByOrder = new Map<string, PlatformCommission>();
    for (const c of commissions) {
      commissionByOrder.set(c.order_id, c);
    }

    return orders.map((o) => {
      const comm = commissionByOrder.get(o.id);
      const isCancelled = o.backendStatus === "CANCELLED";
      const isCompleted = o.backendStatus === "COMPLETED";
      const status = isCancelled ? "REFUNDED" : isCompleted ? "PAID" : "PENDING";

      const fee = comm ? comm.commission_amount : Number((o.total * 0.05).toFixed(2));

      const net = comm ? comm.merchant_net_payout : Number((o.total - fee).toFixed(2));

      return {
        id: comm?.id || `tx-${o.id}`,
        orderId: o.id,
        displayId: o.displayId,
        customer: o.customer,
        date: o.time,
        rawDate: o.createdAt,
        amount: o.total,
        status,
        paymentMethod: "UPI / Online",
        commission: fee,
        net: isCancelled ? 0 : net,
        itemsCount: o.items.reduce((acc, i) => acc + i.qty, 0),
      };
    });
  }, [orders, commissions]);

  // Revenue metrics calculations
  const metrics = useMemo((): FinanceMetricsData => {
    const todayStr = now.toDateString();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let todayRev = 0;
    let weeklyRev = 0;
    let monthlyRev = 0;
    let grossSales = 0;
    let platformFees = 0;
    let netEarnings = 0;
    let totalRefunds = 0;

    for (const tx of transactions) {
      const d = tx.rawDate ? new Date(tx.rawDate) : now;

      if (tx.status === "REFUNDED") {
        totalRefunds += tx.amount;
        continue;
      }

      if (tx.status === "PAID") {
        grossSales += tx.amount;
        platformFees += tx.commission;
        netEarnings += tx.net;

        if (d.toDateString() === todayStr) {
          todayRev += tx.amount;
        }
        if (d >= oneWeekAgo) {
          weeklyRev += tx.amount;
        }
        if (d >= oneMonthAgo) {
          monthlyRev += tx.amount;
        }
      }
    }

    return {
      todayRev,
      weeklyRev,
      monthlyRev,
      grossSales,
      platformFees,
      netEarnings,
      totalRefunds,
    };
  }, [transactions, now]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter === "paid" && tx.status !== "PAID") return false;
      if (statusFilter === "refunded" && tx.status !== "REFUNDED") return false;
      if (statusFilter === "pending" && tx.status !== "PENDING") return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          tx.displayId.toLowerCase().includes(q) ||
          tx.customer.toLowerCase().includes(q) ||
          tx.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, statusFilter, search]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Coins01Icon} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Payments & Financials
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Order revenue, platform commissions, net settlements and payout transaction history
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadCommissions}
              className="gap-1.5 text-xs"
            >
              <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5" />
              Sync Ledger
            </Button>
          </div>
        </div>

        {/* Revenue KPI Cards */}
        <FinanceKpiCards metrics={metrics} />

        {/* Ledger View Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <TabsList className="h-9">
              <TabsTrigger value="orders" className="text-xs font-semibold gap-1.5 px-3">
                <HugeiconsIcon icon={Invoice01Icon} className="w-3.5 h-3.5" />
                Customer Order Settlements
              </TabsTrigger>
              <TabsTrigger value="commissions" className="text-xs font-semibold gap-1.5 px-3">
                <HugeiconsIcon icon={CreditCardIcon} className="w-3.5 h-3.5" />
                Commission Ledger ({commissions.length})
              </TabsTrigger>
            </TabsList>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground"
                />
                <Input
                  placeholder="Search orders or customer…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 text-xs h-8 w-48 sm:w-60"
                />
              </div>

              <div className="flex rounded-md border border-border p-0.5 bg-muted/40 text-xs">
                {(["all", "paid", "refunded"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setStatusFilter(m)}
                    className={`px-2.5 py-0.5 rounded text-[11px] capitalize transition-colors ${
                      statusFilter === m
                        ? "bg-card text-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders Ledger Tab */}
          <TabsContent value="orders" className="m-0">
            <OrdersLedgerTable transactions={filteredTransactions} onSelect={setSelectedTx} />
          </TabsContent>

          {/* Commission Ledger Tab */}
          <TabsContent value="commissions" className="m-0">
            <CommissionLedgerTable commissions={commissions} loading={loading} />
          </TabsContent>
        </Tabs>

        {/* Transaction Details Modal */}
        <TransactionDetailsModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      </div>
    </div>
  );
}
