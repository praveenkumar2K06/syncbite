import { useDashboard } from "../../context/DashboardContext";
import BranchesTab from "../../features/BranchesTab";

export default function BranchesPage() {
  const {
    branches,
    brands,
    merchants,
    branchManagers,
    handleCreateBranchManager,
    handleAssignBranchManager,
    copyToClipboard,
    copiedField,
    branchesLoading,
    togglingBranch,
    loadBranches,
    handleOpenCreateBranchModal,
    handleOpenEditBranch,
    handleRequestDelete,
    handleToggleBranch,
    handleOpenMenuForBranch,
  } = useDashboard();

  return (
    <BranchesTab
      branches={branches}
      brands={brands}
      merchants={merchants}
      branchManagers={branchManagers}
      onCreateBranchManager={handleCreateBranchManager}
      onAssignBranchManager={handleAssignBranchManager}
      onCopy={copyToClipboard}
      copiedField={copiedField}
      loading={branchesLoading}
      togglingBranch={togglingBranch}
      onRefresh={loadBranches}
      onOpenCreateBranchModal={handleOpenCreateBranchModal}
      onEditBranch={handleOpenEditBranch}
      onDeleteBranch={(branch) => handleRequestDelete("branch", branch.id, branch.name)}
      onToggleBranch={handleToggleBranch}
      onOpenMenuForBranch={handleOpenMenuForBranch}
    />
  );
}
