import React, { useState, useEffect, useCallback } from "react";
import type {
  Branch,
  BranchManagerResponse,
  BranchManagerCreateRequest,
  Brand,
  MerchantRecord,
} from "../../api/admin";
import { generateSecurePassword } from "../../utils/formatters";
import BranchLoginCreatedResult, {
  type CreatedManagerResult,
} from "./branch-login/BranchLoginCreatedResult";
import BranchAssignedManagersTable from "./branch-login/BranchAssignedManagersTable";
import BranchManagerCreateForm from "./branch-login/BranchManagerCreateForm";
import BranchManagerReassignForm from "./branch-login/BranchManagerReassignForm";
import BranchLoginDirectoryTab from "./branch-login/BranchLoginDirectoryTab";
import BranchLoginGlobalReassignTab from "./branch-login/BranchLoginGlobalReassignTab";
import ManagerCredentialPanel from "./branch-login/ManagerCredentialPanel";
import { AdminDialog } from "../ui/admin-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building02Icon,
  UserIcon,
  Key01Icon,
  Refresh01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

interface BranchLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch?: Branch | null;
  branches: Branch[];
  brands: Brand[];
  merchants: MerchantRecord[];
  branchManagers: BranchManagerResponse[];
  onCreateManager: (payload: BranchManagerCreateRequest) => Promise<BranchManagerResponse>;
  onAssignManager: (userId: string, branchId: string) => Promise<BranchManagerResponse>;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
  copiedField: string | null;
}

export default function BranchLoginModal({
  isOpen,
  onClose,
  branch,
  branches,
  brands,
  merchants,
  branchManagers,
  onCreateManager,
  onAssignManager,
  onCopy,
}: BranchLoginModalProps) {
  // Global Mode Tabs
  const [globalTab, setGlobalTab] = useState<"directory" | "reassign" | "create">("directory");

  // Branch Specific Sub-Mode ("create" vs "reassign_existing")
  const [branchSubMode, setBranchSubMode] = useState<"create" | "reassign_existing">("create");

  // Create manager form state
  const [targetBranchId, setTargetBranchId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateFormForBranch, setShowCreateFormForBranch] = useState(false);

  // Result state
  const [createdResult, setCreatedResult] = useState<CreatedManagerResult | null>(null);

  // Dedicated Reassign Tab state (Global view)
  const [reassignBrandId, setReassignBrandId] = useState<string>("");
  const [reassignSelectedUserId, setReassignSelectedUserId] = useState<string>("");
  const [reassignSelectedDestBranchId, setReassignSelectedDestBranchId] = useState<string>("");

  // Inline reassign state
  const [reassigningUserId, setReassigningUserId] = useState<string | null>(null);
  const [inlineDestBranchId, setInlineDestBranchId] = useState<string>("");
  const [reassigning, setReassigning] = useState(false);
  const [reassignSuccessMsg, setReassignSuccessMsg] = useState<string | null>(null);
  const [credentialManager, setCredentialManager] = useState<BranchManagerResponse | null>(null);
  const [showOwnerCredentials, setShowOwnerCredentials] = useState(false);

  // Search & Brand Filter in directory
  const [searchQuery, setSearchQuery] = useState("");
  const [directoryBrandFilter, setDirectoryBrandFilter] = useState<string>("ALL");

  // Helper to reliably find brand_id for any manager
  const getManagerBrandId = useCallback(
    (mgr: BranchManagerResponse): string | undefined => {
      if (mgr.brand_id) return mgr.brand_id;
      const b = branches.find((br) => br.id === mgr.branch_id);
      return b?.brand_id;
    },
    [branches],
  );

  // Determine active branch metadata
  const currentBranch = branch || branches.find((b) => b.id === targetBranchId);
  const currentBrandId = currentBranch?.brand_id || branch?.brand_id;
  const parentBrand = currentBrandId ? brands.find((b) => b.id === currentBrandId) : null;
  const parentMerchant = parentBrand
    ? merchants.find((m) => m.id === parentBrand.merchant_id)
    : null;

  // Sync state when modal opens or selected branch changes
  useEffect(() => {
    if (branch) {
      setTargetBranchId(branch.id);
      setPassword(generateSecurePassword(branch.name));
      setEmail("");
      setShowCreateFormForBranch(false);
      setBranchSubMode("create");
      setReassignBrandId(branch.brand_id);
    } else if (branches.length > 0) {
      setTargetBranchId(branches[0].id);
      setPassword(generateSecurePassword(branches[0].name));
      setEmail("");
      if (brands.length > 0 && !reassignBrandId) {
        setReassignBrandId(brands[0].id);
      }
    }
    setCreatedResult(null);
    setReassigningUserId(null);
    setReassignSuccessMsg(null);
    setCredentialManager(null);
    setShowOwnerCredentials(false);
  }, [branch, isOpen, branches, brands, reassignBrandId]);

  // Synchronize destination branch options when reassignBrandId changes
  useEffect(() => {
    if (reassignBrandId) {
      const brandBranches = branches.filter((b) => b.brand_id === reassignBrandId);
      if (brandBranches.length > 0) {
        setReassignSelectedDestBranchId(brandBranches[0].id);
      } else {
        setReassignSelectedDestBranchId("");
      }

      const brandMgrs = branchManagers.filter((m) => getManagerBrandId(m) === reassignBrandId);
      if (brandMgrs.length > 0) {
        setReassignSelectedUserId(brandMgrs[0].user_id);
      } else {
        setReassignSelectedUserId("");
      }
    }
  }, [reassignBrandId, branches, branchManagers, getManagerBrandId]);

  if (!isOpen) return null;

  // Managers assigned to this specific branch
  const assignedManagers = currentBranch
    ? branchManagers.filter((m) => m.branch_id === currentBranch.id)
    : [];

  // Branches belonging STRICTLY to the current brand
  const sameBrandBranches = currentBrandId
    ? branches.filter((b) => b.brand_id === currentBrandId)
    : [];

  // Managers belonging STRICTLY to the current brand
  const sameBrandManagers = currentBrandId
    ? branchManagers.filter((m) => getManagerBrandId(m) === currentBrandId)
    : [];

  // Other managers in the same brand not currently assigned to this specific branch
  const otherBrandManagers = currentBranch
    ? sameBrandManagers.filter((m) => m.branch_id !== currentBranch.id)
    : [];

  // Handlers
  const handleGeneratePassword = () => {
    const name = currentBranch?.name || "Manager";
    setPassword(generateSecurePassword(name));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bid = branch ? branch.id : targetBranchId;
    if (!bid || !email.trim() || !password.trim()) return;

    if (password.trim().length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    setCreating(true);
    try {
      const targetB = branches.find((b) => b.id === bid);
      const res = await onCreateManager({
        branch_id: bid,
        email: email.trim(),
        password: password.trim(),
      });

      setCreatedResult({
        email: res.email,
        password: password.trim(),
        branchName: targetB?.name || res.branch_name || "Branch Outlet",
        branchId: bid,
      });
      setEmail("");
      setShowCreateFormForBranch(false);
    } catch {
      // Handled by parent showToast
    } finally {
      setCreating(false);
    }
  };

  const handleInlineReassign = async (userId: string) => {
    if (!inlineDestBranchId) return;
    setReassigning(true);
    try {
      await onAssignManager(userId, inlineDestBranchId);
      setReassigningUserId(null);
      setInlineDestBranchId("");
      setReassignSuccessMsg("Manager reassigned successfully! ✓");
      setTimeout(() => setReassignSuccessMsg(null), 3500);
    } catch {
      // Handled by parent showToast
    } finally {
      setReassigning(false);
    }
  };

  const handleDedicatedReassignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignSelectedUserId || !reassignSelectedDestBranchId) return;
    setReassigning(true);
    try {
      await onAssignManager(reassignSelectedUserId, reassignSelectedDestBranchId);
      setReassignSuccessMsg("Manager reassigned successfully! ✓");
      setTimeout(() => setReassignSuccessMsg(null), 3500);
    } catch {
      // Handled by parent showToast
    } finally {
      setReassigning(false);
    }
  };

  const handleBranchReassignSubmit = async () => {
    if (!branch || !reassignSelectedUserId) return;
    setReassigning(true);
    try {
      await onAssignManager(reassignSelectedUserId, branch.id);
      setShowCreateFormForBranch(false);
      setReassignSuccessMsg("Manager assigned to this branch successfully! ✓");
      setTimeout(() => setReassignSuccessMsg(null), 3500);
    } finally {
      setReassigning(false);
    }
  };

  return (
    <AdminDialog open={isOpen} onClose={onClose} className="!max-w-5xl">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <HugeiconsIcon icon={branch ? Building02Icon : UserIcon} size={20} />
            </div>

            {currentBranch && parentMerchant && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2.5">
                <div>
                  <p className="text-xs font-medium text-violet-200">Merchant Owner Access</p>
                  <p className="text-[11px] text-violet-300/80">
                    Manage the owner account for {parentMerchant.business_name}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowOwnerCredentials((visible) => !visible);
                    setCredentialManager(null);
                  }}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-500/25"
                >
                  <HugeiconsIcon icon={Key01Icon} size={13} />
                  {showOwnerCredentials ? "Hide Credentials" : "Manage Credentials"}
                </button>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-foreground">
                  {branch ? "Branch Login Management" : "Platform Branch Managers"}
                </h3>
                {parentBrand && (
                  <span className="rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                    Brand: {parentBrand.name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {branch ? (
                  <span>
                    <strong className="text-foreground">{branch.name}</strong> •{" "}
                    {parentBrand ? parentBrand.name : "Direct Brand"} •{" "}
                    {branch.address_text || "Campus Location"}
                  </span>
                ) : (
                  <span>Directory and role assignment restricted strictly per brand_id.</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Global Success Notification */}
        {reassignSuccessMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300 animate-fade-in">
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/20">
              ✓
            </span>
            <span>{reassignSuccessMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BRANCH-SPECIFIC VIEW                                                      */}
        {/* ========================================================================= */}
        {branch ? (
          <div className="flex flex-col gap-5">
            {/* Newly Created Result Banner */}
            {createdResult && (
              <BranchLoginCreatedResult
                createdResult={createdResult}
                onDismiss={() => setCreatedResult(null)}
                onCopy={onCopy}
              />
            )}

            {/* Condition 1: Branch HAS assigned managers */}
            {assignedManagers.length > 0 ? (
              <div className="flex flex-col gap-4">
                <BranchAssignedManagersTable
                  branch={branch}
                  parentBrand={parentBrand}
                  assignedManagers={assignedManagers}
                  sameBrandBranches={sameBrandBranches}
                  reassigningUserId={reassigningUserId}
                  setReassigningUserId={setReassigningUserId}
                  inlineDestBranchId={inlineDestBranchId}
                  setInlineDestBranchId={setInlineDestBranchId}
                  reassigning={reassigning}
                  onInlineReassign={handleInlineReassign}
                  onManageCredentials={(manager) => {
                    setCredentialManager(manager);
                    setShowOwnerCredentials(false);
                  }}
                />

                {/* Sub-actions: Add Another Manager or Reassign an existing brand manager */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {!showCreateFormForBranch ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateFormForBranch(true);
                          setBranchSubMode("create");
                        }}
                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        <HugeiconsIcon icon={PlusSignIcon} size={14} /> Onboard Another Manager for{" "}
                        {branch.name}
                      </button>

                      {otherBrandManagers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateFormForBranch(true);
                            setBranchSubMode("reassign_existing");
                            setReassignSelectedUserId(otherBrandManagers[0].user_id);
                          }}
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-500/20"
                        >
                          <HugeiconsIcon icon={Refresh01Icon} size={14} /> Reassign Existing Manager
                          from {parentBrand?.name} ({otherBrandManagers.length})
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex w-full flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="text-xs font-semibold text-foreground">
                          {branchSubMode === "create"
                            ? `Onboard New Manager for ${branch.name}`
                            : `Reassign Existing ${parentBrand?.name} Manager to ${branch.name}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowCreateFormForBranch(false)}
                          className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                        >
                          ✕ Cancel
                        </button>
                      </div>

                      {branchSubMode === "create" ? (
                        <BranchManagerCreateForm
                          branch={branch}
                          email={email}
                          setEmail={setEmail}
                          password={password}
                          setPassword={setPassword}
                          showPassword={showPassword}
                          setShowPassword={setShowPassword}
                          creating={creating}
                          onGeneratePassword={handleGeneratePassword}
                          onSubmit={handleCreateSubmit}
                          onCancel={() => setShowCreateFormForBranch(false)}
                          variant="branch_inline"
                        />
                      ) : (
                        <BranchManagerReassignForm
                          branch={branch}
                          parentBrand={parentBrand}
                          otherBrandManagers={otherBrandManagers}
                          branches={branches}
                          reassignSelectedUserId={reassignSelectedUserId}
                          setReassignSelectedUserId={setReassignSelectedUserId}
                          reassigning={reassigning}
                          onReassign={handleBranchReassignSubmit}
                          onCancel={() => setShowCreateFormForBranch(false)}
                          isStandaloneCard={false}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Condition 2: Branch DOES NOT HAVE assigned managers */
              <div className="flex flex-col gap-4">
                {/* Fallback Notice */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <span>⚠️</span>
                    <span>No Dedicated Branch Manager Assigned Yet</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    This physical outlet does not have a dedicated store manager account.
                    {parentMerchant ? (
                      <span>
                        {" "}
                        Operational access currently falls back to the Merchant Owner account{" "}
                        <strong className="text-violet-300">
                          ({parentMerchant.business_name})
                        </strong>
                        .
                      </span>
                    ) : null}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Provision or reassign a <strong>BranchManager</strong> account strictly bound to{" "}
                    {parentBrand?.name || "this brand"} below.
                  </p>
                </div>

                {/* Sub-tabs if there are other managers in the same brand */}
                {otherBrandManagers.length > 0 && (
                  <div className="flex gap-1 rounded-xl border border-border bg-muted/50 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setBranchSubMode("create")}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        branchSubMode === "create"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      ＋ Onboard New Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBranchSubMode("reassign_existing");
                        if (!reassignSelectedUserId && otherBrandManagers.length > 0) {
                          setReassignSelectedUserId(otherBrandManagers[0].user_id);
                        }
                      }}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        branchSubMode === "reassign_existing"
                          ? "bg-cyan-500 text-white shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      🔄 Reassign from {parentBrand?.name} ({otherBrandManagers.length})
                    </button>
                  </div>
                )}

                {branchSubMode === "create" ? (
                  <BranchManagerCreateForm
                    branch={branch}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    creating={creating}
                    onGeneratePassword={handleGeneratePassword}
                    onSubmit={handleCreateSubmit}
                    onCancel={onClose}
                    variant="branch_empty"
                  />
                ) : (
                  <BranchManagerReassignForm
                    branch={branch}
                    parentBrand={parentBrand}
                    otherBrandManagers={otherBrandManagers}
                    branches={branches}
                    reassignSelectedUserId={reassignSelectedUserId}
                    setReassignSelectedUserId={setReassignSelectedUserId}
                    reassigning={reassigning}
                    onReassign={handleBranchReassignSubmit}
                    onCancel={onClose}
                    isStandaloneCard={true}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* GLOBAL VIEW (Opened from top toolbar)                                    */
          /* ========================================================================= */
          <div className="flex flex-col gap-4">
            {/* Tab switch */}
            <div className="flex gap-1 rounded-xl border border-border bg-muted/50 p-1 text-xs">
              <button
                onClick={() => setGlobalTab("directory")}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  globalTab === "directory"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span>📋</span> Directory ({branchManagers.length})
              </button>
              <button
                onClick={() => setGlobalTab("reassign")}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  globalTab === "reassign"
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <span>🔄</span> Reassign Branch Manager
              </button>
              <button
                onClick={() => setGlobalTab("create")}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  globalTab === "create"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>＋</span> Onboard Manager
              </button>
            </div>

            {/* TAB 1: DIRECTORY */}
            {globalTab === "directory" && (
              <BranchLoginDirectoryTab
                branchManagers={branchManagers}
                branches={branches}
                brands={brands}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                directoryBrandFilter={directoryBrandFilter}
                setDirectoryBrandFilter={setDirectoryBrandFilter}
                getManagerBrandId={getManagerBrandId}
                reassigningUserId={reassigningUserId}
                setReassigningUserId={setReassigningUserId}
                inlineDestBranchId={inlineDestBranchId}
                setInlineDestBranchId={setInlineDestBranchId}
                reassigning={reassigning}
                onInlineReassign={handleInlineReassign}
                onManageCredentials={(manager) => {
                  setCredentialManager(manager);
                  setShowOwnerCredentials(false);
                }}
              />
            )}

            {/* TAB 2: DEDICATED REASSIGN TAB (BRAND-SCOPED) */}
            {globalTab === "reassign" && (
              <BranchLoginGlobalReassignTab
                brands={brands}
                branches={branches}
                branchManagers={branchManagers}
                reassignBrandId={reassignBrandId}
                setReassignBrandId={setReassignBrandId}
                reassignSelectedUserId={reassignSelectedUserId}
                setReassignSelectedUserId={setReassignSelectedUserId}
                reassignSelectedDestBranchId={reassignSelectedDestBranchId}
                setReassignSelectedDestBranchId={setReassignSelectedDestBranchId}
                getManagerBrandId={getManagerBrandId}
                reassigning={reassigning}
                onSubmit={handleDedicatedReassignSubmit}
              />
            )}

            {/* TAB 3: GLOBAL ONBOARD */}
            {globalTab === "create" && (
              <BranchManagerCreateForm
                branches={branches}
                brands={brands}
                targetBranchId={targetBranchId}
                setTargetBranchId={setTargetBranchId}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                creating={creating}
                onGeneratePassword={handleGeneratePassword}
                onSubmit={handleCreateSubmit}
                onCancel={onClose}
                variant="global"
              />
            )}
          </div>
        )}
      </div>

      {showOwnerCredentials && parentMerchant && currentBranch && (
        <AdminDialog
          open
          onClose={() => setShowOwnerCredentials(false)}
          title="Merchant Owner Credentials"
          description="Reset the password for this account. Existing passwords cannot be retrieved."
          className="!max-w-lg"
        >
          <ManagerCredentialPanel
            ownerUserId={parentMerchant.owner_user_id}
            ownerEmail={parentMerchant.owner_email ?? undefined}
            accountLabel="Merchant Owner"
            merchantName={parentMerchant.business_name}
            branchName={currentBranch.name}
            onCopy={onCopy}
          />
        </AdminDialog>
      )}

      {credentialManager && (
        <AdminDialog
          open
          onClose={() => setCredentialManager(null)}
          title={`${credentialManager.role || "Branch Manager"} Credentials`}
          description="Reset the password for this account. Existing passwords cannot be retrieved."
          className="!max-w-lg"
        >
          <ManagerCredentialPanel
            manager={credentialManager}
            branchName={credentialManager.branch_name || currentBranch?.name || "Manager"}
            onCopy={onCopy}
          />
        </AdminDialog>
      )}
    </AdminDialog>
  );
}
