import { formatMoney, canCancelOrder, nextOrderAction, type OrderVM } from "@/lib/portal";
import Pill from "@/components/common/Pill";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatElapsedTime } from "@/lib/orderUtils";

export interface OrderDetailSheetProps {
  order: OrderVM | null;
  onClose: () => void;
  onAdvance: (order: OrderVM) => void;
  onCancel: (order: OrderVM) => void;
  busyId: string | null;
}

export default function OrderDetailSheet({
  order,
  onClose,
  onAdvance,
  onCancel,
  busyId,
}: OrderDetailSheetProps) {
  if (!order) {
    return (
      <Sheet open={false} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="bottom" />
      </Sheet>
    );
  }

  const action = nextOrderAction(order.backendStatus);
  const cancellable = canCancelOrder(order.backendStatus);
  const isBusy = busyId === order.id;
  const elapsed = formatElapsedTime(order.createdAt);

  return (
    <Sheet open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[88vh] max-w-[540px] rounded-t-2xl p-0 flex flex-col gap-0 border-t bg-card text-card-foreground shadow-2xl"
      >
        <div className="mx-auto mt-2.5 h-1 w-9 shrink-0 rounded-full bg-muted-foreground/30" />

        <SheetHeader className="border-b px-5 py-3.5 pr-12 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <SheetTitle className="text-[16px] font-bold text-foreground">
              Order {order.displayId}
            </SheetTitle>
            <Pill status={order.status} />
            {order.fulfillmentMode && (
              <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                {order.fulfillmentMode === "DINE_IN" ? "🍽️ Dine-In" : "🥡 Takeaway"}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {order.time} {elapsed ? `(${elapsed})` : ""} · {order.customer}
          </p>
          {order.isGameOrder && (
            <div className="mt-2 rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1.5 text-xs text-indigo-700 dark:text-indigo-300">
              <span className="font-semibold">🎮 Linked Game Ticket: </span>
              {order.gameTicketCode || "Game Session"} ({order.gamePlatformName || "Campus Arena"}) ·{" "}
              {order.backendStatus.toUpperCase() === "SCHEDULED"
                ? `Scheduled — auto-pushes after ${order.gameDurationHours ?? 2}h game`
                : "Auto-pushed to kitchen at end of game session"}
            </div>
          )}
          {order.note && (
            <div className="mt-2 rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-300">
              <span className="font-semibold">Order Note: </span>
              {order.note}
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs h-8">Item</TableHead>
                <TableHead className="text-xs h-8 text-right">Qty</TableHead>
                <TableHead className="text-xs h-8 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="py-2.5 font-medium text-foreground">
                    <div>{item.name}</div>
                    {item.note && (
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                        Note: {item.note}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 text-right font-semibold text-muted-foreground">
                    {item.qty}
                  </TableCell>
                  <TableCell className="py-2.5 text-right font-medium text-foreground">
                    {formatMoney(item.unitPrice * item.qty)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center py-3 border-t border-b border-border my-3">
            <span className="text-sm font-semibold text-muted-foreground">Total Amount</span>
            <span className="text-lg font-bold text-foreground">{formatMoney(order.total)}</span>
          </div>
        </div>

        <div className="border-t p-4 px-5 flex flex-col gap-2 shrink-0 bg-muted/20">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="w-full text-xs gap-1.5 h-9"
              title="Print Kitchen Order Ticket (KOT) for thermal printer"
            >
              <span>🖨️</span> Print KOT Ticket
            </Button>
          </div>

          {action ? (
            <Button
              size="lg"
              disabled={isBusy}
              onClick={() => onAdvance(order)}
              className="w-full h-11 text-base font-bold transition-all shadow-sm"
            >
              {isBusy ? "Updating…" : action.label}
            </Button>
          ) : (
            <p className="text-[13px] text-muted-foreground text-center my-1">
              {order.backendStatus === "CANCELLED"
                ? "This order was cancelled."
                : "This order is complete."}
            </p>
          )}

          {cancellable && (
            <Button
              variant="outline"
              disabled={isBusy}
              onClick={() => onCancel(order)}
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Cancel Order
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
