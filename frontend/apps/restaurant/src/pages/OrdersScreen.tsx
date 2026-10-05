import { useState } from "react";
import type { OrderVM } from "@/lib/portal";
import { useOrderViewMode, type OrderViewMode } from "@/lib/orderViewSettings";
import OrderKanbanBoard from "@/components/orders/OrderKanbanBoard";
import OrderListView from "@/components/orders/OrderListView";
import OrderDetailSheet from "@/components/orders/OrderDetailSheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isOrderActive } from "@/lib/orderUtils";
import { useKitchenSound } from "@/lib/kitchenAudio";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  RefreshCwIcon,
  Layout3ColumnIcon,
  ListFilterIcon,
  VolumeHighIcon,
  VolumeOffIcon,
} from "@hugeicons/core-free-icons";

export interface OrdersScreenProps {
  orders: OrderVM[];
  onAdvance: (order: OrderVM) => void;
  onCancel: (order: OrderVM) => void;
  onRefresh: () => void;
  busyId: string | null;
}

export default function OrdersScreen({
  orders,
  onAdvance,
  onCancel,
  onRefresh,
  busyId,
}: OrdersScreenProps) {
  const [viewMode, setViewMode] = useOrderViewMode();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { soundEnabled, toggleSound } = useKitchenSound();

  const activeOrdersCount = orders.filter((o) => isOrderActive(o.status)).length;
  const selectedOrder = selectedId ? (orders.find((o) => o.id === selectedId) ?? null) : null;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-background">
      {/* Top Main Navigation Header */}
      <header className="border-b border-border bg-card px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold text-foreground tracking-tight m-0">Orders</h1>
          {activeOrdersCount > 0 ? (
            <Badge
              variant="default"
              className="bg-primary/90 text-primary-foreground font-semibold px-2 py-0.5 text-xs"
            >
              {activeOrdersCount} Active
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground text-xs font-normal">
              Idle
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Layout View Switcher using shadcn Tabs */}
          <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as OrderViewMode)}>
            <TabsList className="h-8">
              <TabsTrigger
                value="kanban"
                className="text-xs font-semibold gap-1.5 px-2.5 h-7"
                title="Kitchen Kanban Board (Columns)"
              >
                <HugeiconsIcon icon={Layout3ColumnIcon} strokeWidth={2} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Board</span>
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="text-xs font-semibold gap-1.5 px-2.5 h-7"
                title="Enhanced List (Stream)"
              >
                <HugeiconsIcon icon={ListFilterIcon} strokeWidth={2} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sound Notification Alert Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSound}
            className={`h-8 gap-1.5 text-xs ${
              soundEnabled
                ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-500/10 border border-emerald-500/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={soundEnabled ? "Audio Alert Active (Mute)" : "Audio Alert Muted (Unmute)"}
          >
            <HugeiconsIcon
              icon={soundEnabled ? VolumeHighIcon : VolumeOffIcon}
              strokeWidth={2}
              className="w-3.5 h-3.5"
            />
            <span className="hidden md:inline">{soundEnabled ? "Chime On" : "Chime Off"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={RefreshCwIcon} strokeWidth={2} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </header>

      {/* Main View: Option A (Kanban Board) vs Option B (List View) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {viewMode === "kanban" ? (
          <OrderKanbanBoard
            orders={orders}
            onSelect={(o) => setSelectedId(o.id)}
            onAdvance={onAdvance}
            onCancel={onCancel}
            busyId={busyId}
          />
        ) : (
          <OrderListView
            orders={orders}
            onSelect={(o) => setSelectedId(o.id)}
            onAdvance={onAdvance}
            onCancel={onCancel}
            busyId={busyId}
          />
        )}
      </div>

      {/* Shared Order Detail Sheet */}
      <OrderDetailSheet
        order={selectedOrder}
        onClose={() => setSelectedId(null)}
        onAdvance={onAdvance}
        onCancel={onCancel}
        busyId={busyId}
      />
    </div>
  );
}
