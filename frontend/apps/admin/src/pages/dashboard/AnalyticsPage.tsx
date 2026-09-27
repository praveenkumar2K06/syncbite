import { getAnalyticsApi, type PlatformAnalytics } from "../../api/admin";
import { useDashboardActions, useDashboardData } from "../../context/DashboardContext";
import AnalyticsTab from "../../features/AnalyticsTab";
import { useAsyncData } from "../../hooks/useAsyncData";

export default function AnalyticsPage() {
  const { branches, brands, merchants } = useDashboardData();
  const { showToast } = useDashboardActions();
  const { data: analytics, loading } = useAsyncData<PlatformAnalytics>(getAnalyticsApi, () =>
    showToast("Could not load analytics overview.", "error"),
  );

  return (
    <AnalyticsTab
      analytics={analytics}
      branches={branches}
      brands={brands}
      merchants={merchants}
      onShowToast={showToast}
      loading={loading}
    />
  );
}
