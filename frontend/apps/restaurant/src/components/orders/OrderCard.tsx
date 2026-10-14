import { formatMoney, nextOrderAction, canCancelOrder, type OrderVM } from "@/lib/portal";
import Pill from "@/components/common/Pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatElapsedTime, getOrderUrgency } from "@/lib/orderUtils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  EyeIcon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  FlameIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

export interface OrderCardProps {
  order: OrderVM;
  onSelect: (order: OrderVM) => void;
  onAdvance: (order: OrderVM) => void;
  onCancel: (order: OrderVM) => void;
  isBusy: boolean;
}

export default function OrderCard({
  order,
  onSelect,
  onAdvance,
  onCancel,
  isBusy,
}: OrderCardProps) {
  const action = nextOrderAction(order.backendStatus);
  const cancellable = canCancelOrder(order.backendStatus);
  const elapsed = formatElapsedTime(order.createdAt);
  const urgency = getOrderUrgency(order.createdAt);

  const urgencyBadgeClass =
    urgency === "urgent"
      ? "bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-950/50 dark:text-red-400"
      : urgency === "warning"
        ? "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-400"
        : "bg-muted text-muted-foreground border-transparent";

  const getActionTheme = () => {
    switch (order.backendStatus.toUpperCase()) {
      case "SCHEDULED":
        return {
          className: "bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-sm",
          icon: <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="w-3.5 h-3.5 mr-1" />,
        };
      case "PLACED":
        return {
          className: "bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm",
          icon: <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="w-3.5 h-3.5 mr-1" />,
        };
      case "ACCEPTED":
        return {
          className: "bg-amber-600 hover:bg-amber-700 text-white border-0 shadow-sm",
          icon: <HugeiconsIcon icon={FlameIcon} strokeWidth={2} className="w-3.5 h-3.5 mr-1" />,
        };
      case "PREPARING":
        return {
          className: "bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm",
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
          className: "bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm",
          icon: <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="w-3.5 h-3.5 mr-1" />,
        };
      default:
        return {
          className: "",
          icon: null,
        };
    }
  };

  const actionTheme = getActionTheme();

  return (
    <Card
      onClick={() => onSelect(order)}
      className="group relative flex flex-col justify-between overflow-hidden border-border bg-card transition-all hover:border-foreground/20 hover:shadow-sm cursor-pointer p-0"
    >
      {/* Top Banner / Header */}
      <div className="border-b border-border/60 bg-muted/20 px-3.5 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold tracking-tight text-foreground">
            {order.displayId}
          </span>
          <Pill status={order.status} />
          {order.fulfillmentMode && (
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                order.fulfillmentMode === "DINE_IN"
                  ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300"
                  : "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-300"
              }`}
            >
              {order.fulfillmentMode === "DINE_IN" ? "🍽️ Dine-In" : "🥡 Takeaway"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {elapsed && (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${urgencyBadgeClass}`}
            >
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="w-3 h-3" />
              {elapsed}
            </span>
          )}
        </div>
      </div>

      {/* Game Platform Auto-Push Status Banner */}
      {order.isGameOrder && (
        <div
          className={`mx-3.5 mt-2 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold flex items-center justify-between gap-2 ${
            order.backendStatus.toUpperCase() === "SCHEDULED"
              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
          }`}
        >
          <span>
            🎮 {order.gameTicketCode || "Game Ticket"}
            {order.stationLabel ? ` (${order.stationLabel})` : ""} ·{" "}
            {order.gamePlatformName || "Game Arena"}
          </span>
          <span className="uppercase text-[10px] font-bold">
            {order.backendStatus.toUpperCase() === "SCHEDULED"
              ? `⏳ In ${order.gameDurationHours ?? 2}h Game`
              : "⚡ Auto-Pushed"}
          </span>
        </div>
      )}

      {/* Customer & Time Info */}
      <div className="px-3.5 pt-2 pb-1.5 flex items-center justify-between text-xs text-muted-foreground">
        <span>{order.customer}</span>
        <span>{order.time}</span>
      </div>

      {/* Order Level Special Note */}
      {order.note && (
        <div className="mx-3.5 my-1.5 flex items-start gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-300">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            strokeWidth={2}
            className="w-3.5 h-3.5 shrink-0 mt-0.5"
          />
          <span className="font-medium leading-tight">{order.note}</span>
        </div>
      )}

      {/* Line Items List */}
      <div className="px-3.5 py-2 flex-1 space-y-1.5 divide-y divide-border/40">
        {order.items.map((item, idx) => (
          <div key={idx} className="pt-1.5 first:pt-0">
            <div className="flex items-baseline justify-between text-xs">
              <div className="flex items-baseline min-w-0 pr-2">
                <span className="font-bold text-foreground mr-1.5 shrink-0">{item.qty}×</span>
                <span className="font-medium text-foreground truncate">{item.name}</span>
              </div>
              <span className="text-[11px] text-muted-foreground shrink-0 font-medium">
                {formatMoney(item.unitPrice * item.qty)}
              </span>
            </div>

            {/* Customization / Line Item Cooking Note */}
            {item.note && (
              <div className="mt-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded w-fit">
                ⚠️ {item.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer / Action Row */}
      <div className="mt-2 border-t border-border/80 bg-muted/10 p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </span>
          <span className="text-sm font-bold text-foreground">{formatMoney(order.total)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          {action ? (
            <Button
              size="sm"
              disabled={isBusy}
              onClick={(e) => {
                e.stopPropagation();
                onAdvance(order);
              }}
              className={`flex-1 font-semibold text-xs h-9 transition-transform active:scale-[0.98] ${actionTheme.className}`}
            >
              {actionTheme.icon}
              {isBusy ? "Updating…" : action.label}
            </Button>
          ) : (
            <div className="flex-1 text-center py-1 text-xs text-muted-foreground font-medium">
              {order.backendStatus === "CANCELLED" ? "Cancelled" : "Completed"}
            </div>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(order);
            }}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
            title="View details & receipt"
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
              className="h-9 px-2 text-xs text-destructive hover:bg-destructive/10 shrink-0"
              title="Cancel Order"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
