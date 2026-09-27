import type { Branch, PlatformAnalytics } from "../api/admin";
import OverviewHeader from "./overview/OverviewHeader";
import OverviewKpiGrid from "./overview/OverviewKpiGrid";

interface OverviewTabProps {
  branches: Branch[];
  analytics: PlatformAnalytics | null;
  analyticsLoading: boolean;
  branchesLoading: boolean;
  merchantsCount?: number;
  brandsCount?: number;
  pendingApprovalsCount?: number;
  onNavigateToOnboard: () => void;
}

export default function OverviewTab({
  branches,
  analytics,
  analyticsLoading,
  branchesLoading,
  merchantsCount = 0,
  brandsCount = 0,
  pendingApprovalsCount = 0,
  onNavigateToOnboard,
}: OverviewTabProps) {
  const totalOrders = analytics?.total_orders ?? 0;
  const grossRev = analytics?.gross_revenue ?? 0;
  const commissions = analytics?.platform_commissions ?? 0;
  const totalCust = analytics?.total_customers ?? 0;
  const activeBranches = branches.filter((b) => b.is_active).length;
  const todayOrders = "—";
  const todayRevenue = "—";
  const monthlyRevenue = grossRev;
  const refundAmount = "—";
  const activeSubscriptions = "—";
  const pendingIssues = "—";

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <OverviewHeader onNavigateToOnboard={onNavigateToOnboard} />

      <OverviewKpiGrid
        loading={analyticsLoading && branchesLoading}
        totalCustomers={totalCust}
        merchantsCount={merchantsCount || analytics?.total_merchants || 0}
        brandsCount={brandsCount}
        branchesCount={branches.length}
        activeBranches={activeBranches}
        totalOrders={totalOrders}
        todayOrders={todayOrders}
        todayRevenue={todayRevenue}
        monthlyRevenue={monthlyRevenue}
        commissions={commissions}
        refundAmount={refundAmount}
        activeSubscriptions={activeSubscriptions}
        pendingApprovalsCount={pendingApprovalsCount}
        pendingIssues={pendingIssues}
      />
    </div>
  );
}
