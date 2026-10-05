import { useState } from "react";
import type { OrderVM } from "@/lib/portal";
import OrderCard from "./OrderCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Pill from "@/components/common/Pill";
import { formatMoney } from "@/lib/portal";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  FlameIcon,
  BellIcon,
  CheckmarkCircle02Icon,
  HistoryIcon,
  InboxIcon,
} from "@hugeicons/core-free-icons";

export interface OrderKanbanBoardProps {
  orders: OrderVM[];
  onSelect: (order: OrderVM) => void;
  onAdvance: (order: OrderVM) => void;
  onCancel: (order: OrderVM) => void;
  busyId: string | null;
}

type MobileFilter = "all" | "new" | "preparing" | "ready";

export default function OrderKanbanBoard({
  orders,
  onSelect,
  onAdvance,
  onCancel,
  busyId,
}: OrderKanbanBoardProps) {
  const [boardSection, setBoardSection] = useState<"active" | "history">("active");
  const [mobileFilter, setMobileFilter] = useState<MobileFilter>("all");
  const [historySearch, setHistorySearch] = useState("");

  const newOrders = orders.filter((o) => o.status === "new");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");
  const pastOrders = orders.filter((o) => o.status === "completed" || o.status === "cancelled");

  const activeCount = newOrders.length + preparingOrders.length + readyOrders.length;

  const filteredHistory = pastOrders.filter((o) => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    return (
      o.displayId.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background overflow-hidden">
      <Tabs
        value={boardSection}
        onValueChange={(val) => setBoardSection(val as "active" | "history")}
        className="flex-1 min-h-0 flex flex-col gap-0"
      >
        {/* Sub-header: Active Board vs History toggle using shadcn Tabs */}
        <div className="border-b border-border bg-card/60 px-4 py-2 flex items-center justify-between shrink-0">
          <TabsList className="h-8">
            <TabsTrigger value="active" className="text-xs font-semibold gap-1.5 px-3">
              <span>Live Kitchen Board</span>
              {activeCount > 0 && (
                <Badge
                  variant={boardSection === "active" ? "default" : "secondary"}
                  className="h-4 px-1.5 text-[10px] font-bold"
                >
                  {activeCount}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="history" className="text-xs font-semibold gap-1.5 px-3">
              <HugeiconsIcon icon={HistoryIcon} strokeWidth={2} className="w-3.5 h-3.5" />
              <span>Past Orders</span>
              {pastOrders.length > 0 && (
                <Badge
                  variant={boardSection === "history" ? "default" : "secondary"}
                  className="h-4 px-1.5 text-[10px] font-bold"
                >
                  {pastOrders.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Mobile filter pills when in active mode using shadcn Tabs */}
          {boardSection === "active" && (
            <div className="flex md:hidden items-center">
              <Tabs
                value={mobileFilter}
                onValueChange={(val) => setMobileFilter(val as MobileFilter)}
              >
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="all" className="text-[11px] px-2 py-0.5">
                    All ({activeCount})
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="text-[11px] px-2 py-0.5 text-blue-600 dark:text-blue-400"
                  >
                    New ({newOrders.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="preparing"
                    className="text-[11px] px-2 py-0.5 text-amber-600 dark:text-amber-400"
                  >
                    Prep ({preparingOrders.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="ready"
                    className="text-[11px] px-2 py-0.5 text-emerald-600 dark:text-emerald-400"
                  >
                    Ready ({readyOrders.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {/* Main Board Content */}
        <TabsContent value="active" className="flex-1 min-h-0 p-3 md:p-4 overflow-hidden mt-0">
          {/* Desktop 3-column layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 h-full min-h-0">
            {/* Column 1: New Orders */}
            <div className="flex flex-col h-full min-h-0 bg-muted/30 rounded-xl border border-border p-3 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    {newOrders.length > 0 && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    )}
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                  </span>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <HugeiconsIcon
                      icon={BellIcon}
                      strokeWidth={2}
                      className="w-3.5 h-3.5 text-blue-500"
                    />
                    New Orders
                  </h3>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold px-2 text-xs"
                >
                  {newOrders.length}
                </Badge>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pt-3 pr-1">
                {newOrders.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                    <HugeiconsIcon
                      icon={InboxIcon}
                      strokeWidth={1.5}
                      className="w-8 h-8 mb-2 opacity-50"
                    />
                    <p className="text-xs">No new orders waiting</p>
                  </div>
                ) : (
                  newOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onSelect={onSelect}
                      onAdvance={onAdvance}
                      onCancel={onCancel}
                      isBusy={busyId === order.id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Column 2: In Kitchen / Preparing */}
            <div className="flex flex-col h-full min-h-0 bg-muted/30 rounded-xl border border-border p-3 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <HugeiconsIcon
                      icon={FlameIcon}
                      strokeWidth={2}
                      className="w-3.5 h-3.5 text-amber-500"
                    />
                    In Kitchen
                  </h3>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold px-2 text-xs"
                >
                  {preparingOrders.length}
                </Badge>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pt-3 pr-1">
                {preparingOrders.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                    <HugeiconsIcon
                      icon={InboxIcon}
                      strokeWidth={1.5}
                      className="w-8 h-8 mb-2 opacity-50"
                    />
                    <p className="text-xs">No orders cooking</p>
                  </div>
                ) : (
                  preparingOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onSelect={onSelect}
                      onAdvance={onAdvance}
                      onCancel={onCancel}
                      isBusy={busyId === order.id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Column 3: Ready for Pickup */}
            <div className="flex flex-col h-full min-h-0 bg-muted/30 rounded-xl border border-border p-3 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      strokeWidth={2}
                      className="w-3.5 h-3.5 text-emerald-500"
                    />
                    Ready for Pickup
                  </h3>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold px-2 text-xs"
                >
                  {readyOrders.length}
                </Badge>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pt-3 pr-1">
                {readyOrders.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                    <HugeiconsIcon
                      icon={InboxIcon}
                      strokeWidth={1.5}
                      className="w-8 h-8 mb-2 opacity-50"
                    />
                    <p className="text-xs">No orders waiting for pickup</p>
                  </div>
                ) : (
                  readyOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onSelect={onSelect}
                      onAdvance={onAdvance}
                      onCancel={onCancel}
                      isBusy={busyId === order.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Mobile Single Column Feed */}
          <div className="flex md:hidden flex-col h-full min-h-0 overflow-y-auto space-y-3">
            {activeCount === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                <HugeiconsIcon
                  icon={InboxIcon}
                  strokeWidth={1.5}
                  className="w-10 h-10 mb-2 opacity-50"
                />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-0.5">No active orders right now.</p>
              </div>
            ) : (
              orders
                .filter((o) => {
                  if (mobileFilter === "new") return o.status === "new";
                  if (mobileFilter === "preparing") return o.status === "preparing";
                  if (mobileFilter === "ready") return o.status === "ready";
                  return o.status === "new" || o.status === "preparing" || o.status === "ready";
                })
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onSelect={onSelect}
                    onAdvance={onAdvance}
                    onCancel={onCancel}
                    isBusy={busyId === order.id}
                  />
                ))
            )}
          </div>
        </TabsContent>

        {/* Past Orders Content */}
        <TabsContent
          value="history"
          className="flex-1 min-h-0 flex flex-col p-4 overflow-hidden mt-0"
        >
          <div className="mb-3 max-w-sm">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                strokeWidth={2}
                className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search past orders by ID, user or item..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-8 text-xs h-9 bg-card"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
            {filteredHistory.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-center text-muted-foreground">
                <p className="text-xs">No past orders match your search.</p>
              </div>
            ) : (
              filteredHistory.map((order) => (
                <div
                  key={order.id}
                  onClick={() => onSelect(order)}
                  className="flex items-center justify-between p-3.5 bg-card border border-border rounded-lg hover:border-foreground/20 cursor-pointer transition-all"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{order.displayId}</span>
                      <Pill status={order.status} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {order.time} · {order.customer} · {order.items.length} items
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {formatMoney(order.total)}
                    </span>
                    <Button size="sm" variant="outline" className="h-8 text-xs px-2.5">
                      Receipt
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
