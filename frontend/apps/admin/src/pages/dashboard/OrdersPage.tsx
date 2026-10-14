import { useDashboardActions, useDashboardData } from "../../context/DashboardContext";
import OrdersTab from "../../features/OrdersTab";

export default function OrdersPage() {
  const { branches, brands, merchants } = useDashboardData();
  const { showToast } = useDashboardActions();

  return (
    <OrdersTab branches={branches} brands={brands} merchants={merchants} onShowToast={showToast} />
  );
}
