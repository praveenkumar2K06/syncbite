import { useDashboardActions, useDashboardData } from "../../context/DashboardContext";
import SubscriptionsTab from "../../features/SubscriptionsTab";

export default function SubscriptionsPage() {
  const { merchants } = useDashboardData();
  const { showToast } = useDashboardActions();
  return <SubscriptionsTab merchants={merchants} onShowToast={showToast} />;
}
