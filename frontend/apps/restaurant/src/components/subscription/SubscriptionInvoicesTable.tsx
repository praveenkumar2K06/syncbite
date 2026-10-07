import type { SubscriptionInvoice } from "@/api";
import { formatMoney } from "@/lib/portal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface SubscriptionInvoicesTableProps {
  invoices: SubscriptionInvoice[];
}

export function SubscriptionInvoicesTable({ invoices }: SubscriptionInvoicesTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Billing Receipts & Invoices</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit history of your subscription charges, renewals, and platform payments
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {invoices.length} Invoices
        </Badge>
      </div>

      <Card className="border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs h-9">Invoice #</TableHead>
              <TableHead className="text-xs h-9">Plan Tier</TableHead>
              <TableHead className="text-xs h-9">Billing Cycle</TableHead>
              <TableHead className="text-xs h-9">Issued Date</TableHead>
              <TableHead className="text-xs h-9">Valid Until</TableHead>
              <TableHead className="text-xs h-9 text-right font-bold pr-6">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                  No billing invoices generated yet.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.invoice_number} className="hover:bg-muted/30">
                  <TableCell className="font-mono font-bold text-xs text-foreground">
                    {inv.invoice_number}
                  </TableCell>
                  <TableCell className="text-xs font-semibold">
                    <Badge variant="secondary" className="text-[10px]">
                      {inv.plan_tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground capitalize">
                    {inv.billing_cycle.toLowerCase()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(inv.issued_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(inv.valid_until).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-right font-bold text-foreground pr-6">
                    {formatMoney(inv.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
