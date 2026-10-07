import { formatMoney } from "@/lib/portal";
import { Card, CardContent } from "@/components/ui/card";

export interface FinanceMetricsData {
  todayRev: number;
  weeklyRev: number;
  monthlyRev: number;
  grossSales: number;
  platformFees: number;
  netEarnings: number;
  totalRefunds: number;
}

interface FinanceKpiCardsProps {
  metrics: FinanceMetricsData;
}

export function FinanceKpiCards({ metrics }: FinanceKpiCardsProps) {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Today's Revenue</span>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatMoney(metrics.todayRev)}
            </p>
            <span className="text-[10px] text-muted-foreground">From settled orders</span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Last 7 Days</span>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatMoney(metrics.weeklyRev)}
            </p>
            <span className="text-[10px] text-muted-foreground">Weekly run-rate</span>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <span className="text-xs text-muted-foreground font-medium">Last 30 Days</span>
            <p className="text-2xl font-bold text-foreground mt-1">
              {formatMoney(metrics.monthlyRev)}
            </p>
            <span className="text-[10px] text-muted-foreground">Monthly volume</span>
          </CardContent>
        </Card>
        <Card className="border-border bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Net Settled to Bank
            </span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatMoney(metrics.netEarnings)}
            </p>
            <span className="text-[10px] text-muted-foreground">After commission deductions</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-lg border border-border bg-card flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Gross Sales Volume</p>
            <p className="text-lg font-bold text-foreground mt-0.5">
              {formatMoney(metrics.grossSales)}
            </p>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">
            100% of order totals
          </span>
        </div>
        <div className="p-3.5 rounded-lg border border-border bg-card flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Platform Commissions Retained</p>
            <p className="text-lg font-bold text-destructive mt-0.5">
              -{formatMoney(metrics.platformFees)}
            </p>
          </div>
          <span className="text-[10px] font-medium text-destructive">Platform share</span>
        </div>
        <div className="p-3.5 rounded-lg border border-border bg-card flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Refunds & Reversals</p>
            <p className="text-lg font-bold text-muted-foreground mt-0.5">
              {formatMoney(metrics.totalRefunds)}
            </p>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">Cancelled tickets</span>
        </div>
      </div>
    </>
  );
}
