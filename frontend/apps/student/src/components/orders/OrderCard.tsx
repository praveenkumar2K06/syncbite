import React from "react";
import type { Order } from "@/types";
import { ClockIcon, RepeatIcon } from "@/components/icons";
import { formatCurrency } from "@syncbite/shared";

export const ORDER_STATUS_CONFIG: Record<
  Order["status"],
  { label: string; bg: string; text: string }
> = {
  scheduled: { label: "In Game · Scheduled", bg: "bg-golden", text: "text-navy" },
  placed: { label: "Placed", bg: "bg-navy/15", text: "text-navy" },
  accepted: { label: "Accepted", bg: "bg-peach", text: "text-navy" },
  preparing: { label: "Preparing", bg: "bg-golden", text: "text-navy" },
  ready: { label: "Ready", bg: "bg-sage", text: "text-white" },
  completed: { label: "Done", bg: "bg-navy/10", text: "text-navy/50" },
  cancelled: { label: "Cancelled", bg: "bg-raspberry/15", text: "text-raspberry" },
};

interface OrderCardProps {
  order: Order;
  onReorder: () => void;
}

export function OrderCard({ order, onReorder }: OrderCardProps) {
  const { label, bg, text } = ORDER_STATUS_CONFIG[order.status] ?? ORDER_STATUS_CONFIG.placed;
  const itemNames = order.items.map((ci) => ci.menuItem.name).join(", ");

  return (
    <div className="border-2 border-navy overflow-hidden shadow-[3px_3px_0_#17232B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#17232B] transition-all duration-75">
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-navy bg-cream-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-impact text-lg uppercase text-navy leading-none">
              {order.restaurantName}
            </p>
            {order.fulfillmentMode && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-navy bg-cream text-navy">
                {order.fulfillmentMode === "DINE_IN" ? "🍽️ Dine-In" : "🥡 Takeaway"}
              </span>
            )}
            {order.gameTicketCode && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-navy bg-navy text-golden">
                🎮 {order.gameTicketCode}
              </span>
            )}
          </div>
          <p className="font-mono text-navy/40 text-[10px] mt-0.5 tracking-wider">{order.id}</p>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider ${bg} ${text}`}
        >
          {label}
        </span>
      </div>

      <div className="px-4 py-3 bg-cream flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-navy/60 text-xs mb-1 truncate">{itemNames}</p>
          {order.gameTicketCode && (
            <p className="text-[10px] font-bold text-raspberry uppercase tracking-wider mb-1">
              {order.status === "scheduled"
                ? `⏳ Auto-pushes to restaurant when ${order.gamePlatformName || "game"} session ends`
                : `⚡ Auto-pushed after ${order.gamePlatformName || "game"} session`}
            </p>
          )}
          <div className="flex items-center gap-3 text-[11px] text-navy/40">
            <span className="flex items-center gap-1">
              <ClockIcon size={10} />
              {order.date} · {order.pickupTime}
            </span>
            <span className="font-impact text-navy text-sm">{formatCurrency(order.total)}</span>
          </div>
        </div>
        {(order.status === "completed" || order.status === "cancelled") && (
          <button
            onClick={onReorder}
            className="flex-shrink-0 flex items-center gap-1.5 bg-raspberry text-cream text-[10px] font-bold uppercase tracking-wider px-3 py-2 border-2 border-navy hover:bg-navy transition-colors duration-75 cursor-pointer"
          >
            <RepeatIcon size={11} />
            Reorder
          </button>
        )}
      </div>
    </div>
  );
}

interface OrdersHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export function OrdersHeader({ refreshing, onRefresh }: OrdersHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="font-impact text-5xl uppercase text-navy leading-none">My Orders</h1>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-navy bg-cream text-xs font-bold uppercase tracking-wider hover:bg-cream-100 transition-colors shadow-[2px_2px_0_#17232B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
      >
        <span className={`inline-block ${refreshing ? "animate-spin" : ""}`}>↻</span>
        <span>{refreshing ? "Updating…" : "Refresh"}</span>
      </button>
    </div>
  );
}

export function OrdersEmptyState() {
  return (
    <div className="text-center py-24 border-2 border-dashed border-navy/20">
      <h2 className="font-impact text-3xl uppercase text-navy/30 mb-2">No orders yet</h2>
      <p className="text-navy/40 text-sm">Your next meal is just a few taps away.</p>
    </div>
  );
}
