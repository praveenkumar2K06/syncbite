import CustomersTab from "../../features/CustomersTab";
import { useDashboardActions } from "../../context/DashboardContext";

export default function CustomersPage() {
  const { showToast } = useDashboardActions();
  return <CustomersTab onShowToast={showToast} />;
}
