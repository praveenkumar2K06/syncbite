import { useDashboard } from "../../context/DashboardContext";
import BrandsTab from "../../features/BrandsTab";

export default function BrandsPage() {
  const {
    brands,
    merchants,
    branches,
    branchesLoading,
    loadHierarchy,
    handleOpenCreateBrandModal,
    handleOpenEditBrand,
    handleRequestDelete,
    handleOpenMenuForBranch,
    handleOpenMerchantCredentialsModal,
    copyToClipboard,
  } = useDashboard();

  return (
    <BrandsTab
      brands={brands}
      merchants={merchants}
      branches={branches}
      loading={branchesLoading}
      onRefresh={loadHierarchy}
      onOpenCreateBrandModal={handleOpenCreateBrandModal}
      onEditBrand={handleOpenEditBrand}
      onDeleteBrand={(brand) => handleRequestDelete("brand", brand.id, brand.name)}
      onOpenMenuForBranch={handleOpenMenuForBranch}
      onManageMerchantCredentials={handleOpenMerchantCredentialsModal}
      onCopy={copyToClipboard}
    />
  );
}
