import { MetricBlock } from "./MetricBlock";
import { formatMoney, type DashboardMetrics } from "@/lib/portal";
import {
  ShoppingBag01Icon,
  Money01Icon,
  Coins01Icon,
  UserGroupIcon,
  AlertCircleIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

interface MetricsOverviewGridProps {
  metrics: DashboardMetrics;
}

export function MetricsOverviewGrid({ metrics }: MetricsOverviewGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
      <MetricBlock
        label="Today's Orders"
        value={metrics.today}
        tone="blue"
        icon={ShoppingBag01Icon}
        subtext={`${metrics.pending} pending active`}
      />
      <MetricBlock
        label="Today's Revenue"
        value={formatMoney(metrics.todayRevenue)}
        tone="green"
        icon={Money01Icon}
        subtext="Earned today"
      />
      <MetricBlock
        label="Average Order Value"
        value={formatMoney(metrics.averageOrderValue)}
        tone="amber"
        icon={Coins01Icon}
        subtext="Avg spend / order"
      />
      <MetricBlock
        label="Total Customers"
        value={metrics.totalCustomers}
        tone="blue"
        icon={UserGroupIcon}
        subtext="Unique patrons"
      />
      <MetricBlock
        label="Out-of-Stock Items"
        value={metrics.unavailable}
        tone={metrics.unavailable > 0 ? "red" : undefined}
        icon={AlertCircleIcon}
        subtext={metrics.unavailable > 0 ? "Marked out of stock" : "Full menu in stock"}
      />
      <MetricBlock
        label="Available Dishes"
        value={metrics.available}
        tone="green"
        icon={Tick02Icon}
        subtext="Live on menu"
      />
    </div>
  );
}
