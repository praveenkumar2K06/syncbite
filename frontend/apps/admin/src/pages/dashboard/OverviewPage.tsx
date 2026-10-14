import { useNavigate } from "react-router-dom";
import { getAnalyticsApi, type PlatformAnalytics } from "../../api/admin";
import { useDashboardActions, useDashboardData } from "../../context/DashboardContext";
import OverviewTab from "../../features/OverviewTab";
import { useAsyncData } from "../../hooks/useAsyncData";

export default function OverviewPage() {
  const navigate = useNavigate();
  const { branches, brands, merchants, branchesLoading } = useDashboardData();
  const { showToast } = useDashboardActions();
  const { data: analytics, loading: analyticsLoading } = useAsyncData<PlatformAnalytics>(
    getAnalyticsApi,
    () => showToast("Could not load analytics overview.", "error"),
  );

  const pendingApprovalsCount = merchants.filter((m) => m.status === "PENDING_VERIFICATION").length;

  return (
    <OverviewTab
      branches={branches}
      analytics={analytics}
      analyticsLoading={analyticsLoading}
      branchesLoading={branchesLoading}
      merchantsCount={merchants.length || analytics?.total_merchants || 0}
      brandsCount={brands.length}
      pendingApprovalsCount={pendingApprovalsCount}
      onNavigateToOnboard={() => navigate("/dashboard/onboard")}
    />
  );
}
