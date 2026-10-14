import { useState, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon, CancelCircleIcon } from "@hugeicons/core-free-icons";
import type {
  Branch,
  Brand,
  MerchantRecord,
  BranchManagerResponse,
  BranchManagerCreateRequest,
} from "../api/admin";
import BranchLoginModal from "../components/modals/BranchLoginModal";
import BranchHeader from "./branches/BranchHeader";
import BranchFilters from "./branches/BranchFilters";
import BranchTable from "./branches/BranchTable";
import BranchCardGrid from "./branches/BranchCardGrid";
import { Button } from "../components/ui/button";
import { matchesBranchQuery } from "../utils/entitySearch";

interface BranchesTabProps {
  branches: Branch[];
  brands: Brand[];
  merchants: MerchantRecord[];
  branchManagers?: BranchManagerResponse[];
  onCreateBranchManager: (payload: BranchManagerCreateRequest) => Promise<BranchManagerResponse>;
  onAssignBranchManager: (userId: string, branchId: string) => Promise<BranchManagerResponse>;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
  copiedField?: string | null;
  loading?: boolean;
  togglingBranch: string | null;
  onRefresh: () => void;
  onOpenCreateBranchModal: (brandId?: string) => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branch: Branch) => void;
  onToggleBranch: (branch: Branch) => void;
  onOpenMenuForBranch: (branchId: string) => void;
}

export default function BranchesTab({
  branches,
  brands,
  merchants,
  branchManagers = [],
  onCreateBranchManager,
  onAssignBranchManager,
  onCopy,
  copiedField = null,
  loading = false,
  togglingBranch,
  onRefresh,
  onOpenCreateBranchModal,
  onEditBranch,
  onDeleteBranch,
  onToggleBranch,
  onOpenMenuForBranch,
}: BranchesTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [brandFilter, setBrandFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Multi-select bulk state
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  // Branch Login Management Dialog State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalBranch, setLoginModalBranch] = useState<Branch | null | undefined>(undefined);

  const brandMap = useMemo(() => {
    const map = new Map<string, Brand>();
    brands.forEach((b) => map.set(b.id, b));
    return map;
  }, [brands]);

  const merchantMap = useMemo(() => {
    const map = new Map<string, MerchantRecord>();
    merchants.forEach((m) => map.set(m.id, m));
    return map;
  }, [merchants]);

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      if (statusFilter === "ACTIVE" && !branch.is_active) return false;
      if (statusFilter === "INACTIVE" && branch.is_active) return false;
      if (brandFilter !== "ALL" && branch.brand_id !== brandFilter) return false;

      return matchesBranchQuery(branch, search, brandMap, merchantMap);
    });
  }, [branches, statusFilter, brandFilter, search, brandMap, merchantMap]);

  // Bulk actions handlers
  const handleToggleSelectBranch = (branchId: string) => {
    setSelectedBranchIds((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId],
    );
  };

  const handleSelectAllBranches = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedBranchIds(filteredBranches.map((b) => b.id));
    } else {
      setSelectedBranchIds([]);
    }
  };

  const handleBulkToggleActive = async (targetActive: boolean) => {
    const targetBranches = branches.filter(
      (b) => selectedBranchIds.includes(b.id) && b.is_active !== targetActive,
    );
    if (targetBranches.length === 0) return;

    setBulkProcessing(true);
    try {
      for (const branch of targetBranches) {
        await onToggleBranch(branch);
      }
      setSelectedBranchIds([]);
    } finally {
      setBulkProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <BranchHeader
        branchesCount={branches.length}
        managersCount={branchManagers.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenManagersDirectory={() => {
          setLoginModalBranch(null);
          setIsLoginModalOpen(true);
        }}
        onOpenCreateBranchModal={() => onOpenCreateBranchModal()}
        onRefresh={onRefresh}
      />

      <BranchFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        brandFilter={brandFilter}
        onBrandFilterChange={setBrandFilter}
        brands={brands}
        filteredCount={filteredBranches.length}
        totalCount={branches.length}
      />

      {/* Bulk Operations Toolbar */}
      {selectedBranchIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/50 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>
              {selectedBranchIds.length} {selectedBranchIds.length === 1 ? "outlet" : "outlets"}{" "}
              selected
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="emeraldSubtle"
              size="xs"
              disabled={bulkProcessing}
              onClick={() => handleBulkToggleActive(true)}
              title="Activate selected outlets"
            >
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={13} />
              <span>Make Online</span>
            </Button>

            <Button
              variant="destructive"
              size="xs"
              disabled={bulkProcessing}
              onClick={() => handleBulkToggleActive(false)}
              title="Suspend selected outlets"
            >
              <HugeiconsIcon icon={CancelCircleIcon} size={13} />
              <span>Make Offline</span>
            </Button>

            <Button variant="secondary" size="xs" onClick={() => setSelectedBranchIds([])}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {viewMode === "table" ? (
        <BranchTable
          loading={loading}
          branches={filteredBranches}
          brandMap={brandMap}
          merchantMap={merchantMap}
          branchManagers={branchManagers}
          togglingBranch={togglingBranch}
          selectedBranchIds={selectedBranchIds}
          onToggleSelectBranch={handleToggleSelectBranch}
          onSelectAllBranches={handleSelectAllBranches}
          onOpenManageLogins={(branch) => {
            setLoginModalBranch(branch);
            setIsLoginModalOpen(true);
          }}
          onOpenMenuForBranch={onOpenMenuForBranch}
          onToggleBranch={onToggleBranch}
          onEditBranch={onEditBranch}
          onDeleteBranch={onDeleteBranch}
          onCopy={onCopy}
        />
      ) : (
        <BranchCardGrid
          loading={loading}
          branches={filteredBranches}
          brandMap={brandMap}
          merchantMap={merchantMap}
          branchManagers={branchManagers}
          togglingBranch={togglingBranch}
          selectedBranchIds={selectedBranchIds}
          onToggleSelectBranch={handleToggleSelectBranch}
          onOpenManageLogins={(branch) => {
            setLoginModalBranch(branch);
            setIsLoginModalOpen(true);
          }}
          onOpenMenuForBranch={onOpenMenuForBranch}
          onToggleBranch={onToggleBranch}
          onEditBranch={onEditBranch}
          onDeleteBranch={onDeleteBranch}
          onCopy={onCopy}
        />
      )}

      <BranchLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginModalBranch(undefined);
        }}
        branch={loginModalBranch}
        branches={branches}
        brands={brands}
        merchants={merchants}
        branchManagers={branchManagers}
        onCreateManager={onCreateBranchManager}
        onAssignManager={onAssignBranchManager}
        onCopy={onCopy}
        copiedField={copiedField}
      />
    </div>
  );
}
