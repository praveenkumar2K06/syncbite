import { formatMoney } from "@/lib/portal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon } from "@hugeicons/core-free-icons";
import { getStatusBadge, type FinanceTransaction } from "./TransactionDetailsModal";

interface OrdersLedgerTableProps {
  transactions: FinanceTransaction[];
  onSelect: (tx: FinanceTransaction) => void;
}

export function OrdersLedgerTable({ transactions, onSelect }: OrdersLedgerTableProps) {
  return (
    <Card className="border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="text-xs h-9">Order Ref</TableHead>
            <TableHead className="text-xs h-9">Customer</TableHead>
            <TableHead className="text-xs h-9">Date & Time</TableHead>
            <TableHead className="text-xs h-9">Status</TableHead>
            <TableHead className="text-xs h-9 text-right">Order Gross</TableHead>
            <TableHead className="text-xs h-9 text-right">Platform Fee</TableHead>
            <TableHead className="text-xs h-9 text-right font-bold">Net Payout</TableHead>
            <TableHead className="text-xs h-9 text-center w-12">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-xs">
                No orders match your filter criteria.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-bold text-xs text-foreground">
                  {tx.displayId}
                </TableCell>
                <TableCell className="text-xs">{tx.customer}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{tx.date}</TableCell>
                <TableCell>{getStatusBadge(tx.status)}</TableCell>
                <TableCell className="text-xs text-right font-medium">
                  {formatMoney(tx.amount)}
                </TableCell>
                <TableCell className="text-xs text-right font-mono text-destructive">
                  -{formatMoney(tx.commission)}
                </TableCell>
                <TableCell className="text-xs text-right font-bold text-emerald-600">
                  {formatMoney(tx.net)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onSelect(tx)}
                    title="View Transaction Details"
                  >
                    <HugeiconsIcon icon={ViewIcon} className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
