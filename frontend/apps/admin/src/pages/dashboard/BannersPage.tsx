import { useDashboardActions } from "../../context/DashboardContext";
import BannersTab from "../../features/BannersTab";

export default function BannersPage() {
  const { showToast } = useDashboardActions();
  return <BannersTab onShowToast={showToast} />;
}
