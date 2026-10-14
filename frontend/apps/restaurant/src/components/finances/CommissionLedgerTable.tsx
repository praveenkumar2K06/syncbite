import type { PlatformCommission } from "@/api";
import { formatMoney } from "@/lib/portal";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshCwIcon } from "@hugeicons/core-free-icons";

interface CommissionLedgerTableProps {
  commissions: PlatformCommission[];
  loading: boolean;
}

export function CommissionLedgerTable({ commissions, loading }: CommissionLedgerTableProps) {
  return (
    <Card className="border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="text-xs h-9">Ledger ID</TableHead>
            <TableHead className="text-xs h-9">Order ID</TableHead>
            <TableHead className="text-xs h-9">Created At</TableHead>
            <TableHead className="text-xs h-9 text-right">Gross Order</TableHead>
            <TableHead className="text-xs h-9 text-right">Rate (%)</TableHead>
            <TableHead className="text-xs h-9 text-right">Platform Fee</TableHead>
            <TableHead className="text-xs h-9 text-right font-bold">Net Payout</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                <HugeiconsIcon
                  icon={RefreshCwIcon}
                  className="w-4 h-4 animate-spin inline-block mr-2"
                />
                Fetching commission ledger…
              </TableCell>
            </TableRow>
          ) : commissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                No platform commission entries recorded yet.
              </TableCell>
            </TableRow>
          ) : (
            commissions.map((comm) => (
              <TableRow key={comm.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {comm.id.slice(0, 8)}…
                </TableCell>
                <TableCell className="font-mono font-semibold text-xs">
                  {comm.order_id.slice(0, 8)}…
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(comm.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-xs text-right font-medium">
                  {formatMoney(comm.gross_order_amount)}
                </TableCell>
                <TableCell className="text-xs text-right font-mono text-muted-foreground">
                  {comm.commission_rate_percentage}%
                </TableCell>
                <TableCell className="text-xs text-right font-mono text-destructive">
                  -{formatMoney(comm.commission_amount)}
                </TableCell>
                <TableCell className="text-xs text-right font-bold text-emerald-600">
                  {formatMoney(comm.merchant_net_payout)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
