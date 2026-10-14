import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  toggleBranchStatusApi,
  adminSetPasswordApi,
  getHierarchyApi,
  createBrandApi,
  createBranchApi,
  updateMerchantApi,
  updateMerchantStatusApi,
  approveMerchantApi,
  rejectMerchantApi,
  updateBrandApi,
  deleteBrandApi,
  updateBranchApi,
  deleteBranchApi,
  type Branch,
  type MerchantHierarchyItem,
  type Brand,
  type MerchantRecord,
  type MerchantStatus,
} from "../api/admin";
import { ApiError, clearTokens } from "../api/client";
import { useDashboardFeedback } from "./useDashboardFeedback";
import { getErrorMessage } from "../utils/errors";
import { useBranchManagers } from "./useBranchManagers";
import type {
  CreateBrandModalState,
  CreateBranchModalState,
  CredentialModalState,
} from "../types/dashboard";
import type { DashboardContextValue } from "../context/DashboardContext";

export function useDashboardEntities() {
  const navigate = useNavigate();
  const hierarchyRequestId = useRef(0);
  const { toast, setToast, copiedField, showToast, copyToClipboard, downloadCredentialsTxt } =
    useDashboardFeedback();
  const {
    branchManagers,
    branchManagersLoading,
    loadBranchManagers,
    handleCreateBranchManager,
    handleAssignBranchManager,
  } = useBranchManagers(showToast);

  // Data state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchSearch, setBranchSearch] = useState("");

  // Hierarchy & Brands/Merchants state
  const [hierarchyLoading, setHierarchyLoading] = useState(false);
  const [merchants, setMerchants] = useState<MerchantRecord[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Modals for Brand & Branch creation
  const [brandModal, setBrandModal] = useState<CreateBrandModalState>({ open: false });
  const [brandSaving, setBrandSaving] = useState(false);
  const [branchModal, setBranchModal] = useState<CreateBranchModalState>({ open: false });
  const [branchSaving, setBranchSaving] = useState(false);

  // Edit/Delete entity modals
  const [editMerchant, setEditMerchant] = useState<MerchantRecord | null>(null);
  const [editBrand, setEditBrand] = useState<Brand | null>(null);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [entitySaving, setEntitySaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: "brand" | "branch";
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // The selected branch is shared so branch lists can open its menu page.
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Modal: Credentials Management & Update
  const [credModal, setCredModal] = useState<CredentialModalState | null>(null);
  const [credSaving, setCredSaving] = useState(false);
  const [merchantCredModal, setMerchantCredModal] = useState<MerchantRecord | null>(null);

  // Loading state
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [togglingBranch, setTogglingBranch] = useState<string | null>(null);

  // ── Logout ────────────────────────────────────────────────────────────────

  function handleLogout() {
    clearTokens();
    navigate("/login", { replace: true });
  }

  // ── Data fetching ─────────────────────────────────────────────────────────

  const loadHierarchy = useCallback(() => {
    const requestId = ++hierarchyRequestId.current;
    setBranchesLoading(true);
    setHierarchyLoading(true);
    getHierarchyApi()
      .then((data) => {
        if (requestId !== hierarchyRequestId.current) return;
        setMerchants(data.merchants);
        setBrands(data.brands);
        setBranches(data.branches);
        setSelectedBranchId((current) => current || data.branches[0]?.id || "");
      })
      .catch(() => {
        if (requestId === hierarchyRequestId.current) {
          showToast("Could not load merchants, brands, and branches.", "error");
        }
      })
      .finally(() => {
        if (requestId === hierarchyRequestId.current) {
          setHierarchyLoading(false);
          setBranchesLoading(false);
        }
      });
  }, [showToast]);

  const loadBranches = useCallback(() => {
    loadHierarchy();
    void loadBranchManagers();
  }, [loadBranchManagers, loadHierarchy]);

  // Load shared entity data on mount
  useEffect(() => {
    loadHierarchy();
    void loadBranchManagers();
  }, [loadBranchManagers, loadHierarchy]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleToggleBranch = useCallback(
    async (branch: Branch) => {
      setTogglingBranch(branch.id);
      try {
        const updated = await toggleBranchStatusApi(branch.id, !branch.is_active);
        setBranches((prev) => prev.map((b) => (b.id === branch.id ? updated : b)));
        showToast(
          `"${branch.name}" is now ${updated.is_active ? "ONLINE ✓" : "OFFLINE ⊘"}.`,
          "success",
        );
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : "Toggle failed.", "error");
      } finally {
        setTogglingBranch(null);
      }
    },
    [showToast],
  );

  const handleOpenMenuForBranch = useCallback(
    (branchId: string) => {
      setSelectedBranchId(branchId);
      navigate("/dashboard/menu");
    },
    [navigate],
  );

  const handleOpenCredentialsModal = useCallback(
    (
      branch: Branch,
      role?: "BranchManager" | "MerchantOwner",
      initialEmail?: string,
      userId?: string,
    ) => {
      let resolvedEmail = initialEmail || "";
      let resolvedRole = role;

      if (!resolvedEmail) {
        const assigned = branchManagers.find((m) => m.branch_id === branch.id);
        if (assigned) {
          resolvedEmail = assigned.email;
          resolvedRole = resolvedRole || "BranchManager";
        }
      }

      resolvedRole = resolvedRole || "BranchManager";

      setCredModal({
        open: true,
        branchId: branch.id,
        branchName: branch.name,
        currentEmail: resolvedEmail,
        newEmail: resolvedEmail,
        newPassword: "",
        showPassword: true,
        passwordGenerated: false,
        role: resolvedRole,
        userId,
        updatedResult: null,
      });
    },
    [branchManagers],
  );

  async function handleSaveCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!credModal) return;
    if (!credModal.passwordGenerated || !credModal.newPassword.trim()) {
      showToast("Please generate or enter a password first.", "error");
      return;
    }
    if (credModal.newPassword.trim().length < 8) {
      showToast("Password must be at least 8 characters.", "error");
      return;
    }

    setCredSaving(true);
    try {
      const targetEmail = credModal.newEmail.trim() || credModal.currentEmail.trim();
      const assignedMgr = branchManagers.find((m) => m.branch_id === credModal.branchId);

      const res = await adminSetPasswordApi({
        user_id: credModal.userId || assignedMgr?.user_id || undefined,
        email: targetEmail || undefined,
        password: credModal.newPassword.trim(),
      });

      setCredModal((prev) =>
        prev
          ? {
              ...prev,
              currentEmail: res.email || targetEmail,
              newEmail: res.email || targetEmail,
              passwordGenerated: true,
              updatedResult: {
                email: res.email || targetEmail,
                password: credModal.newPassword.trim(),
                role: credModal.role || "BranchManager",
              },
            }
          : null,
      );

      showToast(
        `Credentials updated for "${credModal.branchName}" (${credModal.role || "BranchManager"})! ✓`,
        "success",
      );
    } catch (err: unknown) {
      showToast(getErrorMessage(err, "Failed to update credentials."), "error");
    } finally {
      setCredSaving(false);
    }
  }

  const handleOpenMerchantCredentialsModal = useCallback((merchant: MerchantRecord) => {
    setMerchantCredModal(merchant);
  }, []);

  const handleOpenCreateBrandModal = useCallback((merchantId?: string) => {
    setBrandModal({ open: true, merchantId });
  }, []);

  const handleOpenCreateBranchModal = useCallback((brandId?: string) => {
    setBranchModal({ open: true, brandId });
  }, []);

  const handleCreateBrand = useCallback(
    async (payload: {
      merchant_id: string;
      name: string;
      description?: string;
      cuisine_types?: string[];
    }) => {
      setBrandSaving(true);
      try {
        const newBrand = await createBrandApi(payload);
        showToast(`Brand "${newBrand.name}" created successfully! ✓`, "success");
        setBrandModal({ open: false });
        loadHierarchy();
      } catch (err: unknown) {
        showToast(err instanceof Error ? err.message : "Failed to create brand.", "error");
      } finally {
        setBrandSaving(false);
      }
    },
    [loadHierarchy, showToast],
  );

  const handleCreateBranch = useCallback(
    async (payload: {
      brand_id: string;
      name: string;
      address_text: string;
      opening_time?: string;
      closing_time?: string;
      is_active?: boolean;
    }) => {
      setBranchSaving(true);
      try {
        const newBranch = await createBranchApi(payload);
        showToast(`Branch "${newBranch.name}" created successfully! ✓`, "success");
        setBranchModal({ open: false });
        loadBranches();
      } catch (err: unknown) {
        showToast(err instanceof Error ? err.message : "Failed to create branch.", "error");
      } finally {
        setBranchSaving(false);
      }
    },
    [loadBranches, showToast],
  );

  const handleOpenEditMerchant = useCallback((merchant: MerchantRecord) => {
    setEditMerchant(merchant);
  }, []);

  const handleOpenEditBrand = useCallback((brand: Brand) => {
    setEditBrand(brand);
  }, []);

  const handleOpenEditBranch = useCallback((branch: Branch) => {
    setEditBranch(branch);
  }, []);

  const handleRequestDelete = useCallback((kind: "brand" | "branch", id: string, name: string) => {
    setDeleteTarget({ kind, id, name });
  }, []);

  async function handleUpdateMerchant(
    payload: Parameters<typeof updateMerchantApi>[1] & { status?: MerchantStatus },
  ) {
    if (!editMerchant) return;
    setEntitySaving(true);
    try {
      const { status: targetStatus, ...detailsPayload } = payload;
      await updateMerchantApi(editMerchant.id, detailsPayload);
      if (targetStatus && targetStatus !== editMerchant.status) {
        if (targetStatus === "APPROVED") {
          await approveMerchantApi(editMerchant.id).catch(() =>
            updateMerchantStatusApi(editMerchant.id, "APPROVED"),
          );
        } else if (targetStatus === "REJECTED") {
          await rejectMerchantApi(editMerchant.id, "Rejected by Admin").catch(() =>
            updateMerchantStatusApi(editMerchant.id, "REJECTED"),
          );
        } else {
          await updateMerchantStatusApi(editMerchant.id, targetStatus);
        }
      }
      showToast(`Merchant "${editMerchant.business_name}" updated successfully! ✓`, "success");
      setEditMerchant(null);
      loadHierarchy();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to update merchant.", "error");
    } finally {
      setEntitySaving(false);
    }
  }

  async function handleUpdateBrand(payload: Parameters<typeof updateBrandApi>[1]) {
    if (!editBrand) return;
    setEntitySaving(true);
    try {
      await updateBrandApi(editBrand.id, payload);
      showToast(`Brand "${editBrand.name}" updated successfully! ✓`, "success");
      setEditBrand(null);
      loadHierarchy();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to update brand.", "error");
    } finally {
      setEntitySaving(false);
    }
  }

  async function handleUpdateBranch(payload: Parameters<typeof updateBranchApi>[1]) {
    if (!editBranch) return;
    setEntitySaving(true);
    try {
      await updateBranchApi(editBranch.id, payload);
      showToast(`Branch "${editBranch.name}" updated successfully! ✓`, "success");
      setEditBranch(null);
      loadBranches();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Failed to update branch.", "error");
    } finally {
      setEntitySaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.kind === "brand") {
        await deleteBrandApi(deleteTarget.id);
        showToast(`Brand "${deleteTarget.name}" deleted.`, "success");
      } else {
        await deleteBranchApi(deleteTarget.id);
        showToast(`Branch "${deleteTarget.name}" deleted.`, "success");
      }
      setDeleteTarget(null);
      loadBranches();
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Delete failed.", "error");
    } finally {
      setDeleting(false);
    }
  }

  const getManagerEmail = useCallback(
    (branch: Branch): string => {
      const mgr = branchManagers.find((m) => m.branch_id === branch.id);
      return mgr?.email || "";
    },
    [branchManagers],
  );

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);
  const hierarchy = useMemo<MerchantHierarchyItem[]>(() => {
    const brandsByMerchant = new Map<string, Brand[]>();
    const branchesByBrand = new Map<string, Branch[]>();
    for (const brand of brands) {
      const items = brandsByMerchant.get(brand.merchant_id) ?? [];
      items.push(brand);
      brandsByMerchant.set(brand.merchant_id, items);
    }
    for (const branch of branches) {
      const items = branchesByBrand.get(branch.brand_id) ?? [];
      items.push(branch);
      branchesByBrand.set(branch.brand_id, items);
    }
    return merchants.map((merchant) => ({
      merchant,
      brands: (brandsByMerchant.get(merchant.id) ?? []).map((brand) => ({
        brand,
        branches: branchesByBrand.get(brand.id) ?? [],
      })),
    }));
  }, [branches, brands, merchants]);

  const contextValue: DashboardContextValue = useMemo(
    () => ({
      branches,
      branchesLoading,
      branchManagers,
      branchManagersLoading,
      loadBranchManagers,
      handleCreateBranchManager,
      handleAssignBranchManager,
      branchSearch,
      setBranchSearch,
      selectedBranchId,
      setSelectedBranchId,
      togglingBranch,
      copiedField,
      toast,
      showToast,
      copyToClipboard,
      downloadCredentialsTxt,
      loadBranches,
      handleToggleBranch,
      handleOpenMenuForBranch,
      handleOpenCredentialsModal,
      handleOpenMerchantCredentialsModal,
      getManagerEmail,
      hierarchy,
      hierarchyLoading,
      loadHierarchy,
      merchants,
      brands,
      handleOpenCreateBrandModal,
      handleOpenCreateBranchModal,
      handleCreateBrand,
      handleCreateBranch,
      handleOpenEditMerchant,
      handleOpenEditBrand,
      handleOpenEditBranch,
      handleRequestDelete,
    }),
    [
      branches,
      branchesLoading,
      branchManagers,
      branchManagersLoading,
      loadBranchManagers,
      handleCreateBranchManager,
      handleAssignBranchManager,
      branchSearch,
      selectedBranchId,
      togglingBranch,
      copiedField,
      toast,
      showToast,
      copyToClipboard,
      downloadCredentialsTxt,
      loadBranches,
      handleToggleBranch,
      handleOpenMenuForBranch,
      handleOpenCredentialsModal,
      handleOpenMerchantCredentialsModal,
      getManagerEmail,
      hierarchy,
      hierarchyLoading,
      loadHierarchy,
      merchants,
      brands,
      handleOpenCreateBrandModal,
      handleOpenCreateBranchModal,
      handleCreateBrand,
      handleCreateBranch,
      handleOpenEditMerchant,
      handleOpenEditBrand,
      handleOpenEditBranch,
      handleRequestDelete,
    ],
  );

  return {
    contextValue,
    selectedBranch,
    toast,
    setToast,
    handleLogout,
    // Modals state & handlers
    credModal,
    credSaving,
    merchantCredModal,
    setMerchantCredModal,
    handleOpenMerchantCredentialsModal,
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
  };
}
