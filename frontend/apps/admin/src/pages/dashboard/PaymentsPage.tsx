import { useDashboardActions, useDashboardData } from "../../context/DashboardContext";
import PaymentsTab from "../../features/PaymentsTab";

export default function PaymentsPage() {
  const { merchants } = useDashboardData();
  const { showToast } = useDashboardActions();

  return <PaymentsTab merchants={merchants} onShowToast={showToast} />;
}
