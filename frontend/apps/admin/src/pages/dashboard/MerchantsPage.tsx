import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../context/DashboardContext";
import MerchantsTab from "../../features/MerchantsTab";

export default function MerchantsPage() {
  const navigate = useNavigate();
  const {
    hierarchy,
    hierarchyLoading,
    loadHierarchy,
    handleOpenCreateBrandModal,
    handleOpenCreateBranchModal,
    handleOpenMenuForBranch,
    handleToggleBranch,
    togglingBranch,
    copyToClipboard,
    handleOpenEditMerchant,
    handleOpenEditBrand,
    handleOpenEditBranch,
    handleRequestDelete,
    handleOpenMerchantCredentialsModal,
  } = useDashboard();

  useEffect(() => {
    loadHierarchy();
  }, [loadHierarchy]);

  return (
    <MerchantsTab
      hierarchy={hierarchy}
      hierarchyLoading={hierarchyLoading}
      onRefresh={loadHierarchy}
      onOpenCreateBrandModal={handleOpenCreateBrandModal}
      onOpenCreateBranchModal={handleOpenCreateBranchModal}
      onNavigateToOnboard={() => navigate("/dashboard/onboard")}
      onOpenMenuForBranch={handleOpenMenuForBranch}
      onToggleBranch={handleToggleBranch}
      togglingBranch={togglingBranch}
      onCopy={copyToClipboard}
      onEditMerchant={handleOpenEditMerchant}
      onManageMerchantCredentials={handleOpenMerchantCredentialsModal}
      onEditBrand={handleOpenEditBrand}
      onEditBranch={handleOpenEditBranch}
      onDeleteBrand={(brand) => handleRequestDelete("brand", brand.id, brand.name)}
      onDeleteBranch={(branch) => handleRequestDelete("branch", branch.id, branch.name)}
    />
  );
}
