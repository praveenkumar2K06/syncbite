import { Outlet } from "react-router-dom";
import { Suspense, useMemo } from "react";
import Toast from "../components/common/Toast";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminTopBar from "../components/layout/AdminTopBar";
import DashboardModals from "../components/modals/DashboardModals";
import {
  DashboardActionsContext,
  DashboardDataContext,
  type DashboardDataContextValue,
  type DashboardActionsContextValue,
} from "../context/DashboardContext";
import { useDashboardEntities } from "../hooks/useDashboardEntities";

export default function DashboardProvider() {
  const {
    contextValue,
    selectedBranch,
    toast,
    setToast,
    handleLogout,
    credModal,
    credSaving,
    merchantCredModal,
    setMerchantCredModal,
    copiedField,
    setCredModal,
    handleSaveCredentials,
    copyToClipboard,
    downloadCredentialsTxt,
    showToast,
    brandModal,
    brandSaving,
    setBrandModal,
    handleCreateBrand,
    branchModal,
    branchSaving,
    setBranchModal,
    handleCreateBranch,
    editMerchant,
    editBrand,
    editBranch,
    entitySaving,
    setEditMerchant,
    setEditBrand,
    setEditBranch,
    handleUpdateMerchant,
    handleUpdateBrand,
    handleUpdateBranch,
    deleteTarget,
    deleting,
    setDeleteTarget,
    handleConfirmDelete,
  } = useDashboardEntities();

  const dashboardData = useMemo<DashboardDataContextValue>(
    () => ({
      branches: contextValue.branches,
      branchesLoading: contextValue.branchesLoading,
      branchManagers: contextValue.branchManagers,
      branchManagersLoading: contextValue.branchManagersLoading,
      branchSearch: contextValue.branchSearch,
      selectedBranchId: contextValue.selectedBranchId,
      togglingBranch: contextValue.togglingBranch,
      copiedField: contextValue.copiedField,
      toast: contextValue.toast,
      hierarchy: contextValue.hierarchy,
      hierarchyLoading: contextValue.hierarchyLoading,
      merchants: contextValue.merchants,
      brands: contextValue.brands,
    }),
    [
      contextValue.branches,
      contextValue.branchesLoading,
      contextValue.branchManagers,
      contextValue.branchManagersLoading,
      contextValue.branchSearch,
      contextValue.selectedBranchId,
      contextValue.togglingBranch,
      contextValue.copiedField,
      contextValue.toast,
      contextValue.hierarchy,
      contextValue.hierarchyLoading,
      contextValue.merchants,
      contextValue.brands,
    ],
  );

  const dashboardActions = useMemo<DashboardActionsContextValue>(
    () => ({
      loadBranchManagers: contextValue.loadBranchManagers,
      handleCreateBranchManager: contextValue.handleCreateBranchManager,
      handleAssignBranchManager: contextValue.handleAssignBranchManager,
      setBranchSearch: contextValue.setBranchSearch,
      setSelectedBranchId: contextValue.setSelectedBranchId,
      showToast: contextValue.showToast,
      copyToClipboard: contextValue.copyToClipboard,
      downloadCredentialsTxt: contextValue.downloadCredentialsTxt,
      loadBranches: contextValue.loadBranches,
      handleToggleBranch: contextValue.handleToggleBranch,
      handleOpenMenuForBranch: contextValue.handleOpenMenuForBranch,
      handleOpenCredentialsModal: contextValue.handleOpenCredentialsModal,
      handleOpenMerchantCredentialsModal: contextValue.handleOpenMerchantCredentialsModal,
      getManagerEmail: contextValue.getManagerEmail,
      loadHierarchy: contextValue.loadHierarchy,
      handleOpenCreateBrandModal: contextValue.handleOpenCreateBrandModal,
      handleOpenCreateBranchModal: contextValue.handleOpenCreateBranchModal,
      handleCreateBrand: contextValue.handleCreateBrand,
      handleCreateBranch: contextValue.handleCreateBranch,
      handleOpenEditMerchant: contextValue.handleOpenEditMerchant,
      handleOpenEditBrand: contextValue.handleOpenEditBrand,
      handleOpenEditBranch: contextValue.handleOpenEditBranch,
      handleRequestDelete: contextValue.handleRequestDelete,
    }),
    [
      contextValue.loadBranchManagers,
      contextValue.handleCreateBranchManager,
      contextValue.handleAssignBranchManager,
      contextValue.setBranchSearch,
      contextValue.setSelectedBranchId,
      contextValue.showToast,
      contextValue.copyToClipboard,
      contextValue.downloadCredentialsTxt,
      contextValue.loadBranches,
      contextValue.handleToggleBranch,
      contextValue.handleOpenMenuForBranch,
      contextValue.handleOpenCredentialsModal,
      contextValue.handleOpenMerchantCredentialsModal,
      contextValue.getManagerEmail,
      contextValue.loadHierarchy,
      contextValue.handleOpenCreateBrandModal,
      contextValue.handleOpenCreateBranchModal,
      contextValue.handleCreateBrand,
      contextValue.handleCreateBranch,
      contextValue.handleOpenEditMerchant,
      contextValue.handleOpenEditBrand,
      contextValue.handleOpenEditBranch,
      contextValue.handleRequestDelete,
    ],
  );

  return (
    <DashboardDataContext.Provider value={dashboardData}>
      <DashboardActionsContext.Provider value={dashboardActions}>
        <div className="min-h-screen flex bg-background text-foreground font-sans">
          {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

          {/* ── Sidebar ── */}
          <AdminSidebar restaurantCount={contextValue.branches.length} onLogout={handleLogout} />

          {/* ── Main content ── */}
          <main className="flex-1 overflow-auto">
            {/* Top bar */}
            <AdminTopBar selectedBranchName={selectedBranch?.name} />

            <div className="p-8">
              {/* Nested route tab content rendered here */}
              <Suspense
                fallback={
                  <div className="p-8 flex items-center justify-center min-h-[300px]">
                    <p className="text-xs text-muted-foreground animate-pulse">Loading view…</p>
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </div>
          </main>

          {/* ── Modals ── */}
          <DashboardModals
            credentials={{
              credModal,
              credSaving,
              copiedField,
              onCloseCredModal: () => setCredModal(null),
              onChangeCredModal: setCredModal,
              onSaveCredentials: handleSaveCredentials,
              onCopy: copyToClipboard,
              onDownloadTxt: downloadCredentialsTxt,
              onShowToast: showToast,
            }}
            createBrand={{
              brandModal,
              brandSaving,
              merchants: contextValue.merchants,
              onCloseBrandModal: () => setBrandModal({ open: false }),
              onCreateBrand: handleCreateBrand,
            }}
            createBranch={{
              branchModal,
              branchSaving,
              brands: contextValue.brands,
              onCloseBranchModal: () => setBranchModal({ open: false }),
              onCreateBranch: handleCreateBranch,
            }}
            editEntities={{
              editMerchant,
              editBrand,
              editBranch,
              entitySaving,
              onCloseEditMerchant: () => setEditMerchant(null),
              onUpdateMerchant: handleUpdateMerchant,
              onCloseEditBrand: () => setEditBrand(null),
              onUpdateBrand: handleUpdateBrand,
              onCloseEditBranch: () => setEditBranch(null),
              onUpdateBranch: handleUpdateBranch,
            }}
            deletion={{
              deleteTarget,
              deleting,
              onCancelDelete: () => setDeleteTarget(null),
              onConfirmDelete: handleConfirmDelete,
            }}
            merchantCredentials={{
              merchant: merchantCredModal,
              onClose: () => setMerchantCredModal(null),
              onCopy: copyToClipboard,
            }}
          />
        </div>
      </DashboardActionsContext.Provider>
    </DashboardDataContext.Provider>
  );
}
