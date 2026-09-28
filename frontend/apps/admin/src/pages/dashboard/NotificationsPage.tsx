import { useDashboardActions } from "../../context/DashboardContext";
import NotificationsTab from "../../features/NotificationsTab";

export default function NotificationsPage() {
  const { showToast } = useDashboardActions();
  return <NotificationsTab onShowToast={showToast} />;
}
