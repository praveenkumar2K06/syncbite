import { useState } from "react";
import { formatMoney, nextOrderAction, canCancelOrder, type OrderVM } from "@/lib/portal";
import Pill from "@/components/common/Pill";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatElapsedTime, getOrderUrgency, isOrderActive } from "@/lib/orderUtils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Clock01Icon,
  EyeIcon,
  Tick02Icon,
  FlameIcon,
  CheckmarkCircle02Icon,
  InboxIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

export interface OrderListViewProps {
  orders: OrderVM[];
  onSelect: (order: OrderVM) => void;
  onAdvance: (order: OrderVM) => void;
  onCancel: (order: OrderVM) => void;
  busyId: string | null;
}

type ActiveFilter = "all" | "new" | "preparing" | "ready";
type HistoryFilter = "all" | "completed" | "cancelled";

export default function OrderListView({
  orders,
  onSelect,
  onAdvance,
  onCancel,
  busyId,
}: OrderListViewProps) {
  const [tab, setTab] = useState<"active" | "history">("active");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [search, setSearch] = useState("");

  const activeOrders = orders.filter((o) => isOrderActive(o.status));
  const historyOrders = orders.filter((o) => o.status === "completed" || o.status === "cancelled");

  const newCount = orders.filter((o) => o.status === "new").length;
  const prepCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

  const filteredOrders = (tab === "active" ? activeOrders : historyOrders)
    .filter((o) => {
      if (tab === "active") {
        if (activeFilter === "new") return o.status === "new";
        if (activeFilter === "preparing") return o.status === "preparing";
        if (activeFilter === "ready") return o.status === "ready";
        return true;
      } else {
        if (historyFilter === "completed") return o.status === "completed";
        if (historyFilter === "cancelled") return o.status === "cancelled";
        return true;
      }
    })
    .filter((o) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        o.displayId.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    });

  const getActionTheme = (backendStatus: string) => {
    switch (backendStatus.toUpperCase()) {
      case "PLACED":
        return {
          className: "bg-emerald-600 hover:bg-emerald-700 text-white",
          icon: <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="w-3.5 h-3.5 mr-1" />,
        };
      case "ACCEPTED":
        return {
          className: "bg-amber-600 hover:bg-amber-700 text-white",
          icon: <HugeiconsIcon icon={FlameIcon} strokeWidth={2} className="w-3.5 h-3.5 mr-1" />,
        };
      case "PREPARING":
        return {
          className: "bg-emerald-600 hover:bg-emerald-700 text-white",
          icon: (
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              strokeWidth={2}
              className="w-3.5 h-3.5 mr-1"
            />
          ),
        };
      case "READY":
        return {
          className: "bg-blue-600 hover:bg-blue-700 text-white",
          icon: <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="w-3.5 h-3.5 mr-1" />,
        };
      default:
        return {
          className: "",
          icon: null,
        };
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background overflow-hidden">
      {/* Top Filter & Navigation Bar using shadcn Tabs */}
      <div className="border-b border-border bg-card px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as "active" | "history");
            setSearch("");
          }}
        >
          <TabsList className="h-8">
            <TabsTrigger value="active" className="text-xs font-semibold gap-1.5 px-3">
              <span>Active Orders</span>
              {activeOrders.length > 0 && (
                <Badge
                  variant={tab === "active" ? "default" : "secondary"}
                  className="h-4 px-1.5 text-[10px] font-bold"
                >
                  {activeOrders.length}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="history" className="text-xs font-semibold gap-1.5 px-3">
              <span>Order History</span>
              {historyOrders.length > 0 && (
                <Badge
                  variant={tab === "history" ? "default" : "secondary"}
                  className="h-4 px-1.5 text-[10px] font-bold"
                >
                  {historyOrders.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search order #, customer, item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-8 bg-background"
          />
        </div>
      </div>

      {/* Sub-Filter Tabs using shadcn Tabs */}
      <div className="border-b border-border/60 bg-muted/20 px-4 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0">
        {tab === "active" ? (
          <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as ActiveFilter)}>
            <TabsList className="h-7 p-0.5">
              <TabsTrigger value="all" className="text-xs px-2.5 py-0.5 font-medium">
                All ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="text-xs px-2.5 py-0.5 font-medium text-blue-600 dark:text-blue-400"
              >
                New ({newCount})
              </TabsTrigger>
              <TabsTrigger
                value="preparing"
                className="text-xs px-2.5 py-0.5 font-medium text-amber-600 dark:text-amber-400"
              >
                Preparing ({prepCount})
              </TabsTrigger>
              <TabsTrigger
                value="ready"
                className="text-xs px-2.5 py-0.5 font-medium text-emerald-600 dark:text-emerald-400"
              >
                Ready ({readyCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        ) : (
          <Tabs value={historyFilter} onValueChange={(v) => setHistoryFilter(v as HistoryFilter)}>
            <TabsList className="h-7 p-0.5">
              <TabsTrigger value="all" className="text-xs px-2.5 py-0.5 font-medium">
                All Past ({historyOrders.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="text-xs px-2.5 py-0.5 font-medium text-emerald-600 dark:text-emerald-400"
              >
                Completed ({orders.filter((o) => o.status === "completed").length})
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="text-xs px-2.5 py-0.5 font-medium text-red-600 dark:text-red-400"
              >
                Cancelled ({orders.filter((o) => o.status === "cancelled").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Orders List Stream */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <HugeiconsIcon
              icon={InboxIcon}
              strokeWidth={1.5}
              className="w-10 h-10 mb-2 opacity-50"
            />
            <p className="text-sm font-medium">No orders found</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {search
                ? "Try searching for a different keyword."
                : tab === "active"
                  ? "No active orders waiting in this stage."
                  : "No past orders recorded yet."}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const action = nextOrderAction(order.backendStatus);
            const cancellable = canCancelOrder(order.backendStatus);
            const isBusy = busyId === order.id;
            const elapsed = formatElapsedTime(order.createdAt);
            const urgency = getOrderUrgency(order.createdAt);
            const actionTheme = getActionTheme(order.backendStatus);

            const urgencyBadgeClass =
              urgency === "urgent"
                ? "bg-red-500/10 text-red-600 border-red-500/30"
                : urgency === "warning"
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                  : "bg-muted text-muted-foreground border-transparent";

            return (
              <div
                key={order.id}
                onClick={() => onSelect(order)}
                className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl hover:border-foreground/20 hover:shadow-2xs transition-all cursor-pointer"
              >
                {/* Left Section: Order details & items */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-bold text-base text-foreground tracking-tight">
                      {order.displayId}
                    </span>
                    <Pill status={order.status} />
                    {elapsed && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${urgencyBadgeClass}`}
                      >
                        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="w-3 h-3" />
                        {elapsed}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {order.time} · {order.customer}
                    </span>
                  </div>

                  {/* Order Note */}
                  {order.note && (
                    <div className="my-1.5 flex items-center gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300 w-fit">
                      <HugeiconsIcon
                        icon={AlertCircleIcon}
                        strokeWidth={2}
                        className="w-3.5 h-3.5 shrink-0"
                      />
                      <span>{order.note}</span>
                    </div>
                  )}

                  {/* Items Summary */}
                  <div className="mt-2 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-foreground">{item.qty}×</span>
                        <span className="font-medium text-foreground">{item.name}</span>
                        {item.note && (
                          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            ⚠️ {item.note}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Section: Price & Action buttons */}
                <div className="flex flex-row lg:flex-col lg:items-end justify-between items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/60 shrink-0">
                  <div className="text-right">
                    <span className="text-base font-bold text-foreground">
                      {formatMoney(order.total)}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {action && (
                      <Button
                        size="sm"
                        disabled={isBusy}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdvance(order);
                        }}
                        className={`h-9 px-4 text-xs font-semibold shadow-sm transition-transform active:scale-[0.98] ${actionTheme.className}`}
                      >
                        {actionTheme.icon}
                        {isBusy ? "Updating…" : action.label}
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(order);
                      }}
                      className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                      title="View details"
                    >
                      <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="w-3.5 h-3.5" />
                    </Button>

                    {cancellable && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isBusy}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancel(order);
                        }}
                        className="h-9 px-2 text-xs text-destructive hover:bg-destructive/10"
                        title="Cancel order"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
