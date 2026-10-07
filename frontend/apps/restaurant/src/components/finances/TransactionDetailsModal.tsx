import { formatMoney } from "@/lib/portal";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface FinanceTransaction {
  id: string;
  orderId: string;
  displayId: string;
  customer: string;
  date: string;
  rawDate?: string;
  amount: number;
  status: string;
  paymentMethod: string;
  commission: number;
  net: number;
  itemsCount: number;
}

interface TransactionDetailsModalProps {
  transaction: FinanceTransaction | null;
  onClose: () => void;
}

export function getStatusBadge(st: string) {
  if (st === "PAID") {
    return (
      <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30 text-[10px]">
        ● Paid
      </Badge>
    );
  }
  if (st === "REFUNDED") {
    return (
      <Badge variant="destructive" className="text-[10px]">
        Refunded
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">
      Pending
    </Badge>
  );
}

export function TransactionDetailsModal({ transaction, onClose }: TransactionDetailsModalProps) {
  return (
    <Dialog open={Boolean(transaction)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center justify-between">
            <span>Transaction Breakdown</span>
            {transaction && getStatusBadge(transaction.status)}
          </DialogTitle>
        </DialogHeader>
        {transaction && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="bg-muted/30 p-3 rounded-lg border border-border/50 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Ref:</span>
                <span className="font-mono font-bold text-foreground">{transaction.displayId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium text-foreground">{transaction.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span>{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">{transaction.paymentMethod}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Order Subtotal ({transaction.itemsCount} items)</span>
                <span className="font-medium text-foreground">
                  {formatMoney(transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Platform Commission Deduction</span>
                <span className="text-destructive font-mono">
                  -{formatMoney(transaction.commission)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border font-bold text-sm">
                <span className="text-foreground">Net Payout to Merchant</span>
                <span className="text-emerald-600">{formatMoney(transaction.net)}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
