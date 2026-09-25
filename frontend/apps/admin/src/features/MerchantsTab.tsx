import { useState, useMemo, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building02Icon,
  RefreshIcon,
  Tag01Icon,
  Store01Icon,
  RocketIcon,
  Search01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import type { MerchantHierarchyItem, Branch, MerchantRecord, Brand } from "../api/admin";
import MerchantHierarchyTree, {
  type MerchantStatusFilter,
} from "./merchants/MerchantHierarchyTree";
import { StatusBadge } from "../components/ui/status-badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { matchesHierarchyQuery } from "../utils/entitySearch";

interface MerchantsTabProps {
  hierarchy: MerchantHierarchyItem[];
  hierarchyLoading: boolean;
  onRefresh: () => void;
  onOpenCreateBrandModal: (merchantId?: string) => void;
  onOpenCreateBranchModal: (brandId?: string) => void;
  onNavigateToOnboard: () => void;
  onOpenMenuForBranch: (branchId: string) => void;
  onToggleBranch: (branch: Branch) => void;
  togglingBranch: string | null;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
  onEditMerchant: (merchant: MerchantRecord) => void;
  onManageMerchantCredentials?: (merchant: MerchantRecord) => void;
  onEditBrand: (brand: Brand) => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBrand: (brand: Brand) => void;
  onDeleteBranch: (branch: Branch) => void;
}

export default function MerchantsTab({
  hierarchy,
  hierarchyLoading,
  onRefresh,
  onOpenCreateBrandModal,
  onOpenCreateBranchModal,
  onNavigateToOnboard,
  onOpenMenuForBranch,
  onToggleBranch,
  togglingBranch,
  onCopy,
  onEditMerchant,
  onManageMerchantCredentials,
  onEditBrand,
  onEditBranch,
  onDeleteBrand,
  onDeleteBranch,
}: MerchantsTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MerchantStatusFilter>("ALL");
  const [expandedMerchants, setExpandedMerchants] = useState<Record<string, boolean>>({});

  // Auto-expand search matches when user types a query
  useEffect(() => {
    if (!search.trim()) return;

    const next: Record<string, boolean> = {};
    hierarchy.forEach((item) => {
      if (matchesHierarchyQuery(item, search)) {
        next[item.merchant.id] = true;
      }
    });

    setExpandedMerchants((prev) => ({ ...prev, ...next }));
  }, [search, hierarchy]);

  const toggleMerchant = (id: string) => {
    setExpandedMerchants((prev) => {
      // If never explicitly toggled, check if search or auto-expanded: default is collapsed false
      const current = prev[id] ?? false;
      return {
        ...prev,
        [id]: !current,
      };
    });
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    hierarchy.forEach((item) => {
      next[item.merchant.id] = true;
    });
    setExpandedMerchants(next);
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    hierarchy.forEach((item) => {
      next[item.merchant.id] = false;
    });
    setExpandedMerchants(next);
  };

  // Aggregated Stats
  const stats = useMemo(() => {
    const totalMerchants = hierarchy.length;
    const approvedMerchants = hierarchy.filter((m) => m.merchant.status === "APPROVED").length;
    const pendingMerchants = hierarchy.filter(
      (m) => m.merchant.status === "PENDING_VERIFICATION",
    ).length;
    const rejectedMerchants = hierarchy.filter((m) => m.merchant.status === "REJECTED").length;
    const suspendedMerchants = hierarchy.filter((m) => m.merchant.status === "SUSPENDED").length;
    const deactivatedMerchants = hierarchy.filter(
      (m) => m.merchant.status === "DEACTIVATED" || m.merchant.status === "INACTIVE",
    ).length;
    const otherMerchants =
      totalMerchants -
      approvedMerchants -
      pendingMerchants -
      rejectedMerchants -
      suspendedMerchants -
      deactivatedMerchants;

    const totalBrands = hierarchy.reduce((acc, m) => acc + m.brands.length, 0);

    const allBranches = hierarchy.flatMap((m) => m.brands.flatMap((b) => b.branches));
    const totalBranches = allBranches.length;
    const onlineBranches = allBranches.filter((b) => b.is_active).length;
    const offlineBranches = totalBranches - onlineBranches;

    return {
      totalMerchants,
      approvedMerchants,
      pendingMerchants,
      rejectedMerchants,
      suspendedMerchants,
      deactivatedMerchants,
      otherMerchants,
      totalBrands,
      totalBranches,
      onlineBranches,
      offlineBranches,
    };
  }, [hierarchy]);

  // Filter hierarchy by search and status
  const filteredHierarchy = useMemo(() => {
    return hierarchy.filter((item) => {
      // Status filter
      if (statusFilter === "APPROVED" && item.merchant.status !== "APPROVED") return false;
      if (
        statusFilter === "PENDING_VERIFICATION" &&
        item.merchant.status !== "PENDING_VERIFICATION"
      )
        return false;
      if (statusFilter === "REJECTED" && item.merchant.status !== "REJECTED") return false;
      if (statusFilter === "SUSPENDED" && item.merchant.status !== "SUSPENDED") return false;
      if (
        statusFilter === "DEACTIVATED" &&
        item.merchant.status !== "DEACTIVATED" &&
        item.merchant.status !== "INACTIVE"
      )
        return false;
      if (
        statusFilter === "OTHER" &&
        [
          "APPROVED",
          "PENDING_VERIFICATION",
          "REJECTED",
          "SUSPENDED",
          "DEACTIVATED",
          "INACTIVE",
        ].includes(item.merchant.status)
      )
        return false;

      return matchesHierarchyQuery(item, search);
    });
  }, [hierarchy, search, statusFilter]);

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} />;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* ── Top Header & Main Actions ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <HugeiconsIcon icon={Building02Icon} size={20} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Merchants & Brands Hierarchy
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Org hierarchy (Merchant → Brand → Branch) – best for reviewing corporate structure,
            brand portfolios, and outlet subtrees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="default"
            size="default"
            onClick={onRefresh}
            title="Reload merchants, brands, and branches"
          >
            <HugeiconsIcon icon={RefreshIcon} size={15} />
            <span>Refresh</span>
          </Button>

          <Button variant="amberSubtle" size="default" onClick={() => onOpenCreateBrandModal()}>
            <HugeiconsIcon icon={Tag01Icon} size={15} />
            <span>+ New Brand</span>
          </Button>

          <Button variant="cyanSubtle" size="default" onClick={() => onOpenCreateBranchModal()}>
            <HugeiconsIcon icon={Store01Icon} size={15} />
            <span>+ New Branch</span>
          </Button>

          <Button variant="orange" size="default" onClick={onNavigateToOnboard}>
            <HugeiconsIcon icon={RocketIcon} size={15} />
            <span>Onboard Merchant</span>
          </Button>
        </div>
      </div>

      {/* ── Enterprise Overview Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Merchants Card */}
        <div className="rounded-2xl p-4 bg-slate-900/70 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Corporate Merchants</span>
            <HugeiconsIcon icon={Building02Icon} size={16} className="text-orange-400" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tracking-tight">
              {stats.totalMerchants}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
              {stats.approvedMerchants} Approved
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2 flex-wrap">
            {stats.pendingMerchants > 0 && (
              <span className="text-amber-400">{stats.pendingMerchants} Pending</span>
            )}
            {stats.suspendedMerchants > 0 && (
              <span className="text-purple-400">{stats.suspendedMerchants} Suspended</span>
            )}
            {stats.rejectedMerchants > 0 && (
              <span className="text-rose-400">{stats.rejectedMerchants} Rejected</span>
            )}
          </div>
        </div>

        {/* Brands Card */}
        <div className="rounded-2xl p-4 bg-slate-900/70 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Brand Concepts</span>
            <HugeiconsIcon icon={Tag01Icon} size={16} className="text-amber-400" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tracking-tight">
              {stats.totalBrands}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {(stats.totalBrands / (stats.totalMerchants || 1)).toFixed(1)} / merchant
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Active concepts across campus dining
          </div>
        </div>

        {/* Outlets Card */}
        <div className="rounded-2xl p-4 bg-slate-900/70 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Store Outlets</span>
            <HugeiconsIcon icon={Store01Icon} size={16} className="text-cyan-400" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tracking-tight">
              {stats.totalBranches}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
              {stats.onlineBranches} Online
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>{stats.offlineBranches} Offline</span>
            <span className="text-emerald-400/80">
              {stats.totalBranches > 0
                ? Math.round((stats.onlineBranches / stats.totalBranches) * 100)
                : 0}
              % Live
            </span>
          </div>
        </div>
      </div>

      {/* ── Filter Bar & Search (Sticky on scroll) ── */}
      <div className="sticky top-2 z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-md">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {(
            [
              { id: "ALL", label: `All (${stats.totalMerchants})` },
              { id: "APPROVED", label: `Approved (${stats.approvedMerchants})` },
              { id: "PENDING_VERIFICATION", label: `Pending (${stats.pendingMerchants})` },
              { id: "SUSPENDED", label: `Suspended (${stats.suspendedMerchants})` },
              { id: "REJECTED", label: `Rejected (${stats.rejectedMerchants})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-slate-800 text-white shadow-sm border border-input"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {stats.otherMerchants > 0 && (
            <button
              onClick={() => setStatusFilter("OTHER")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === "OTHER"
                  ? "bg-slate-800 text-white border border-input"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              Other ({stats.otherMerchants})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <HugeiconsIcon icon={Search01Icon} size={14} />
            </span>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search merchants, brands, FSSAI..."
              className="pl-9 pr-8"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={expandAll}
              title="Expand all merchant trees"
            >
              Expand All
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={collapseAll}
              title="Collapse all merchant trees"
            >
              Collapse
            </Button>
          </div>
        </div>
      </div>

      <MerchantHierarchyTree
        hierarchyLoading={hierarchyLoading}
        filteredHierarchy={filteredHierarchy}
        search={search}
        statusFilter={statusFilter}
        setSearch={setSearch}
        setStatusFilter={setStatusFilter}
        expandedMerchants={expandedMerchants}
        onToggleMerchant={toggleMerchant}
        getStatusBadge={getStatusBadge}
        onOpenCreateBrandModal={onOpenCreateBrandModal}
        onOpenCreateBranchModal={onOpenCreateBranchModal}
        onOpenMenuForBranch={onOpenMenuForBranch}
        onToggleBranch={onToggleBranch}
        togglingBranch={togglingBranch}
        onCopy={onCopy}
        onEditMerchant={onEditMerchant}
        onManageCredentials={onManageMerchantCredentials}
        onEditBrand={onEditBrand}
        onEditBranch={onEditBranch}
        onDeleteBrand={onDeleteBrand}
        onDeleteBranch={onDeleteBranch}
      />
    </div>
  );
}
