import { useState, type ReactNode } from "react";
import { formatDate } from "../../utils/format";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building02Icon,
  Tag01Icon,
  Store01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Edit01Icon,
  Delete02Icon,
  MoreVerticalIcon,
  Copy01Icon,
  Menu01Icon,
  Clock01Icon,
  Location01Icon,
  PlusSignIcon,
  InformationCircleIcon,
  Key01Icon,
} from "@hugeicons/core-free-icons";
import type { MerchantHierarchyItem, Branch, MerchantRecord, Brand } from "../../api/admin";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../../components/ui/sheet";

export type MerchantStatusFilter =
  | "ALL"
  | "APPROVED"
  | "PENDING_VERIFICATION"
  | "REJECTED"
  | "SUSPENDED"
  | "DEACTIVATED"
  | "OTHER";

interface Props {
  hierarchyLoading: boolean;
  filteredHierarchy: MerchantHierarchyItem[];
  search: string;
  statusFilter: MerchantStatusFilter;
  setSearch: (value: string) => void;
  setStatusFilter: (value: MerchantStatusFilter) => void;
  expandedMerchants: Record<string, boolean>;
  onToggleMerchant: (id: string) => void;
  getStatusBadge: (status: string) => ReactNode;
  onOpenCreateBrandModal: (merchantId?: string) => void;
  onOpenCreateBranchModal: (brandId?: string) => void;
  onOpenMenuForBranch: (branchId: string) => void;
  onToggleBranch: (branch: Branch) => void;
  togglingBranch: string | null;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
  onEditMerchant: (merchant: MerchantRecord) => void;
  onManageCredentials?: (merchant: MerchantRecord) => void;
  onEditBrand: (brand: Brand) => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBrand: (brand: Brand) => void;
  onDeleteBranch: (branch: Branch) => void;
}

export default function MerchantHierarchyTree({
  hierarchyLoading,
  filteredHierarchy,
  search,
  statusFilter,
  setSearch,
  setStatusFilter,
  expandedMerchants,
  onToggleMerchant,
  getStatusBadge,
  onOpenCreateBrandModal,
  onOpenCreateBranchModal,
  onOpenMenuForBranch,
  onToggleBranch,
  togglingBranch,
  onCopy,
  onEditMerchant,
  onManageCredentials,
  onEditBrand,
  onEditBranch,
  onDeleteBrand,
  onDeleteBranch,
}: Props) {
  // Detail Drawer state for inspecting full merchant legal/financial details
  const [selectedMerchantForDrawer, setSelectedMerchantForDrawer] = useState<MerchantRecord | null>(
    null,
  );

  return (
    <>
      {/* ── Hierarchy Tree Content ── */}
      {hierarchyLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-2xl bg-slate-900/60" />
          ))}
        </div>
      ) : filteredHierarchy.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-800/60 text-slate-400">
            <HugeiconsIcon icon={Building02Icon} size={32} />
          </div>
          <p className="text-base font-semibold text-slate-200">No merchant entities found</p>
          <p className="text-xs text-slate-500 max-w-md">
            {search || statusFilter !== "ALL"
              ? "No merchants, brands, or branches match your current filter and search query."
              : "Onboard a new merchant to establish the Merchant ➔ Brand ➔ Branch hierarchy."}
          </p>
          {(search || statusFilter !== "ALL") && (
            <Button
              variant="amberSubtle"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
              className="mt-2"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredHierarchy.map(({ merchant, brands }) => {
            const isExpanded = expandedMerchants[merchant.id] ?? false;
            const childrenId = `merchant-children-${merchant.id}`;
            const totalBranchCount = brands.reduce((acc, b) => acc + b.branches.length, 0);
            const onlineBranchCount = brands.reduce(
              (acc, b) => acc + b.branches.filter((br) => br.is_active).length,
              0,
            );

            return (
              <div
                key={merchant.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-sm hover:border-slate-700/80 transition-all backdrop-blur-sm"
              >
                {/* ── Level 1: Merchant Header ── */}
                <div
                  className={`p-4 sm:p-5 bg-slate-950/80 rounded-t-2xl flex flex-wrap items-center justify-between gap-4 ${isExpanded ? "border-b border-slate-800/80" : "rounded-b-2xl"}`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-[260px]">
                    {/* Expand/Collapse Accordion Trigger Button */}
                    <button
                      type="button"
                      onClick={() => onToggleMerchant(merchant.id)}
                      className="mt-0.5 sm:mt-0 w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-800 focus-visible:ring-2 focus-visible:ring-amber-500"
                      title={isExpanded ? "Collapse merchant subtree" : "Expand merchant subtree"}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} merchant ${merchant.business_name}`}
                      aria-expanded={isExpanded}
                      aria-controls={childrenId}
                    >
                      <HugeiconsIcon
                        icon={isExpanded ? ArrowDown01Icon : ArrowRight01Icon}
                        size={15}
                      />
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Business Name, Status, and Legal Name */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-white text-base tracking-tight truncate max-w-sm">
                          {merchant.business_name}
                        </span>
                        {getStatusBadge(merchant.status)}
                        {merchant.legal_entity_name && (
                          <span className="text-xs text-slate-400 font-normal truncate">
                            ({merchant.legal_entity_name})
                          </span>
                        )}
                      </div>

                      {/* Primary KPI Pills & Compact Metadata Row */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-2">
                        {/* KPI Pills */}
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-amber-950/40 text-amber-300 border border-amber-800/40 font-semibold">
                            {brands.length} {brands.length === 1 ? "Brand" : "Brands"}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 font-semibold">
                            {totalBranchCount} {totalBranchCount === 1 ? "Outlet" : "Outlets"}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-semibold">
                            {onlineBranchCount} Online
                          </span>
                        </div>

                        <span className="text-slate-600 hidden sm:inline">•</span>

                        {/* FSSAI Quick Copy */}
                        {merchant.fssai_license_number && (
                          <button
                            type="button"
                            onClick={() => onCopy(merchant.fssai_license_number, "FSSAI copied! ✓")}
                            className="hover:text-cyan-300 transition-colors cursor-pointer font-mono text-[11px]"
                            title="Click to copy FSSAI"
                          >
                            FSSAI:{" "}
                            <span className="text-slate-300">{merchant.fssai_license_number}</span>
                          </button>
                        )}

                        {/* GSTIN Quick Copy */}
                        {merchant.gstin && (
                          <button
                            type="button"
                            onClick={() => onCopy(merchant.gstin!, "GSTIN copied! ✓")}
                            className="hover:text-cyan-300 transition-colors cursor-pointer font-mono text-[11px]"
                            title="Click to copy GSTIN"
                          >
                            GST: <span className="text-slate-300">{merchant.gstin}</span>
                          </button>
                        )}

                        {/* View Full Details Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedMerchantForDrawer(merchant)}
                          className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <HugeiconsIcon icon={InformationCircleIcon} size={12} />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Merchant Action Buttons with Shadcn Portal Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="amberSubtle"
                      size="sm"
                      onClick={() => onOpenCreateBrandModal(merchant.id)}
                      title="Add a brand profile under this merchant"
                    >
                      <HugeiconsIcon icon={PlusSignIcon} size={14} />
                      <span className="hidden sm:inline">Brand</span>
                    </Button>

                    {/* Shadcn DropdownMenu with base-ui Portal (never cut off by closed accordion) */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="secondary" size="iconSm" title="More options">
                            <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
                        {onManageCredentials && (
                          <DropdownMenuItem
                            onClick={() => onManageCredentials(merchant)}
                            className="flex items-center gap-2 cursor-pointer text-violet-300 focus:text-violet-200"
                          >
                            <HugeiconsIcon icon={Key01Icon} size={14} />
                            <span>Manage Owner Credentials</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => setSelectedMerchantForDrawer(merchant)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <HugeiconsIcon icon={InformationCircleIcon} size={14} />
                          <span>View Legal & Bank Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onCopy(merchant.id, "Merchant ID copied! ✓")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <HugeiconsIcon icon={Copy01Icon} size={14} />
                          <span>Copy Merchant ID</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onEditMerchant(merchant)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <HugeiconsIcon icon={Edit01Icon} size={14} />
                          <span>Edit Merchant Profile</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* ── Subtree Rail: Level 2 & 3 Brands and Outlets ── */}
                <div id={childrenId} hidden={!isExpanded}>
                  <div className="p-4 sm:p-5 flex flex-col gap-4 bg-slate-950/40 border-l-2 border-l-amber-500/30 ml-3 sm:ml-5 my-2">
                    {brands.length === 0 ? (
                      <div className="rounded-xl p-5 bg-slate-900/40 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center gap-2">
                        <HugeiconsIcon icon={Tag01Icon} size={24} className="text-slate-500" />
                        <p className="text-xs text-slate-400">
                          No brand profiles registered under this merchant yet.
                        </p>
                        <Button
                          variant="amberSubtle"
                          size="sm"
                          onClick={() => onOpenCreateBrandModal(merchant.id)}
                          className="mt-1"
                        >
                          <HugeiconsIcon icon={PlusSignIcon} size={13} />
                          <span>Create First Brand</span>
                        </Button>
                      </div>
                    ) : (
                      brands.map(({ brand, branches }) => (
                        <div
                          key={brand.id}
                          className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-4.5 flex flex-col gap-3.5 shadow-sm"
                        >
                          {/* Brand Info Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                            <div className="flex items-center gap-3">
                              {brand.logo_url ? (
                                <img
                                  src={brand.logo_url}
                                  alt={brand.name}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-800"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                                  <HugeiconsIcon icon={Tag01Icon} size={18} />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-sm">{brand.name}</span>
                                  <span className="text-[11px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                                    {branches.length} {branches.length === 1 ? "outlet" : "outlets"}
                                  </span>
                                </div>
                                {brand.description && (
                                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xl">
                                    {brand.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {brand.cuisine_types && brand.cuisine_types.length > 0 && (
                                <div className="hidden md:flex items-center gap-1.5 mr-1">
                                  {brand.cuisine_types.map((c) => (
                                    <span
                                      key={c}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/80 border border-slate-700/60 text-slate-300"
                                    >
                                      {c}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Brand Actions */}
                              <Button
                                variant="amberSubtle"
                                size="sm"
                                onClick={() => onEditBrand(brand)}
                                title="Update brand marketing metadata & cuisines"
                              >
                                <HugeiconsIcon icon={Edit01Icon} size={13} />
                                <span>Edit</span>
                              </Button>

                              <Button
                                variant="cyanSubtle"
                                size="sm"
                                onClick={() => onOpenCreateBranchModal(brand.id)}
                                title="Add a store branch location under this brand"
                              >
                                <HugeiconsIcon icon={Store01Icon} size={13} />
                                <span>+ Branch</span>
                              </Button>

                              {/* Brand Shadcn DropdownMenu */}
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button
                                      variant="secondary"
                                      size="iconSm"
                                      title="More brand options"
                                    >
                                      <HugeiconsIcon icon={MoreVerticalIcon} size={13} />
                                    </Button>
                                  }
                                />
                                <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
                                  <DropdownMenuItem
                                    onClick={() => onCopy(brand.id, "Brand ID copied! ✓")}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <HugeiconsIcon icon={Copy01Icon} size={13} />
                                    <span>Copy Brand ID</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => onDeleteBrand(brand)}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <HugeiconsIcon icon={Delete02Icon} size={13} />
                                    <span>Delete Brand</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* ── Branches / Outlets Subtree Rail ── */}
                          {branches.length === 0 ? (
                            <div className="py-2.5 text-center text-xs text-slate-500">
                              No physical store branches open for this brand yet.{" "}
                              <button
                                onClick={() => onOpenCreateBranchModal(brand.id)}
                                className="text-cyan-400 font-medium hover:underline cursor-pointer"
                              >
                                + Add Branch
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                              {branches.map((branch) => (
                                <div
                                  key={branch.id}
                                  className="rounded-xl p-3.5 bg-slate-950/80 border border-slate-800/90 flex flex-col justify-between gap-3 hover:border-slate-700 transition-all shadow-sm"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span
                                          className={`w-2 h-2 rounded-full inline-block shrink-0 ${
                                            branch.is_active ? "bg-emerald-400" : "bg-rose-400"
                                          }`}
                                        />
                                        <span className="font-semibold text-white text-xs truncate">
                                          {branch.name}
                                        </span>
                                      </div>
                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                          branch.is_active
                                            ? "text-emerald-400 bg-emerald-950/60 border border-emerald-900/50"
                                            : "text-rose-400 bg-rose-950/60 border border-rose-900/50"
                                        }`}
                                      >
                                        {branch.is_active ? "ONLINE" : "OFFLINE"}
                                      </span>
                                    </div>

                                    <div className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                                      <HugeiconsIcon
                                        icon={Location01Icon}
                                        size={12}
                                        className="text-slate-500 shrink-0"
                                      />
                                      <span
                                        className="truncate"
                                        title={branch.address_text || "VIT Campus"}
                                      >
                                        {branch.address_text || "VIT Campus"}
                                      </span>
                                    </div>

                                    <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-1.5">
                                      <HugeiconsIcon
                                        icon={Clock01Icon}
                                        size={12}
                                        className="text-slate-500 shrink-0"
                                      />
                                      <span>
                                        {branch.opening_time?.slice(0, 5)} –{" "}
                                        {branch.closing_time?.slice(0, 5)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Outlet Actions */}
                                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/70">
                                    <div className="flex items-center gap-1.5">
                                      <Button
                                        variant="amberSubtle"
                                        size="xs"
                                        onClick={() => onOpenMenuForBranch(branch.id)}
                                        title="Open branch menu manager"
                                      >
                                        <HugeiconsIcon icon={Menu01Icon} size={12} />
                                        <span>Menu</span>
                                      </Button>

                                      <Button
                                        variant="cyanSubtle"
                                        size="xs"
                                        onClick={() => onEditBranch(branch)}
                                        title="Update branch details"
                                      >
                                        <HugeiconsIcon icon={Edit01Icon} size={12} />
                                        <span>Edit</span>
                                      </Button>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant={branch.is_active ? "destructive" : "emeraldSubtle"}
                                        size="xs"
                                        onClick={() => onToggleBranch(branch)}
                                        disabled={togglingBranch === branch.id}
                                        title={
                                          branch.is_active
                                            ? "Take branch offline"
                                            : "Make branch online"
                                        }
                                      >
                                        {togglingBranch === branch.id
                                          ? "…"
                                          : branch.is_active
                                            ? "Offline"
                                            : "Online"}
                                      </Button>

                                      {/* Outlet Shadcn DropdownMenu */}
                                      <DropdownMenu>
                                        <DropdownMenuTrigger
                                          render={
                                            <Button
                                              variant="secondary"
                                              size="iconSm"
                                              className="h-6 w-6"
                                              title="More outlet actions"
                                            >
                                              <HugeiconsIcon icon={MoreVerticalIcon} size={12} />
                                            </Button>
                                          }
                                        />
                                        <DropdownMenuContent
                                          align="end"
                                          side="bottom"
                                          sideOffset={6}
                                        >
                                          <DropdownMenuItem
                                            onClick={() => onCopy(branch.id, "Branch ID copied! ✓")}
                                            className="flex items-center gap-2 cursor-pointer"
                                          >
                                            <HugeiconsIcon icon={Copy01Icon} size={13} />
                                            <span>Copy Branch ID</span>
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => onDeleteBranch(branch)}
                                            className="flex items-center gap-2 cursor-pointer"
                                          >
                                            <HugeiconsIcon icon={Delete02Icon} size={13} />
                                            <span>Delete Branch</span>
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Merchant Detailed Sheet (Full-height & responsive width) ── */}
      <Sheet
        open={Boolean(selectedMerchantForDrawer)}
        onOpenChange={(open) => {
          if (!open) setSelectedMerchantForDrawer(null);
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl md:max-w-2xl bg-slate-900 border-l border-slate-800 p-0 flex flex-col h-full shadow-2xl overflow-hidden"
        >
          {selectedMerchantForDrawer && (
            <>
              {/* Header */}
              <SheetHeader className="p-5 border-b border-slate-800 bg-slate-950/70 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <HugeiconsIcon icon={Building02Icon} size={20} />
                  </div>
                  <div>
                    <SheetTitle className="text-base font-bold text-white tracking-tight">
                      {selectedMerchantForDrawer.business_name}
                    </SheetTitle>
                    <SheetDescription className="text-xs text-slate-400 mt-0.5">
                      Legal entity: {selectedMerchantForDrawer.legal_entity_name || "N/A"}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 text-xs">
                {/* Status & ID */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Merchant Status</span>
                    <div className="mt-1">{getStatusBadge(selectedMerchantForDrawer.status)}</div>
                  </div>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => onCopy(selectedMerchantForDrawer.id, "Merchant ID copied!")}
                  >
                    <HugeiconsIcon icon={Copy01Icon} size={12} />
                    <span>Copy ID</span>
                  </Button>
                </div>

                {/* Legal and Compliance */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-300">
                    Compliance & Registrations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-slate-400 text-[11px] block">FSSAI License</span>
                      <div className="font-mono text-slate-200 mt-1 font-semibold">
                        {selectedMerchantForDrawer.fssai_license_number || "Not registered"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">GSTIN</span>
                      <div className="font-mono text-slate-200 mt-1 font-semibold">
                        {selectedMerchantForDrawer.gstin || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Owner User ID</span>
                      <div className="font-mono text-slate-200 mt-1 truncate">
                        {selectedMerchantForDrawer.owner_user_id || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Registered On</span>
                      <div className="font-mono text-slate-200 mt-1">
                        {formatDate(selectedMerchantForDrawer.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banking Details */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-300">
                    Settlement Banking
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Bank Account Number</span>
                      <div className="font-mono text-slate-200 mt-1 font-semibold">
                        {selectedMerchantForDrawer.bank_account_number
                          ? `•••• ${selectedMerchantForDrawer.bank_account_number.slice(-4)}`
                          : "Not configured"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">IFSC Code</span>
                      <div className="font-mono text-slate-200 mt-1 font-semibold">
                        {selectedMerchantForDrawer.bank_ifsc_code || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Owner Account & Credentials */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <HugeiconsIcon icon={Key01Icon} size={14} className="text-violet-400" />
                      <span>Owner Account Credentials</span>
                    </h4>
                    {onManageCredentials && (
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => {
                          const m = selectedMerchantForDrawer;
                          setSelectedMerchantForDrawer(null);
                          onManageCredentials(m);
                        }}
                        className="border-violet-500/30 bg-violet-500/15 text-violet-200 hover:bg-violet-500/25"
                      >
                        <HugeiconsIcon icon={Key01Icon} size={12} />
                        <span>Manage Credentials</span>
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Owner User ID</span>
                      <div className="font-mono text-slate-200 mt-1 truncate">
                        {selectedMerchantForDrawer.owner_user_id || "N/A"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Owner Email</span>
                      <div className="font-mono text-slate-200 mt-1 truncate">
                        {selectedMerchantForDrawer.owner_email || "Not loaded (Click manage)"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Button */}
                <Button
                  variant="orange"
                  className="w-full mt-1"
                  onClick={() => {
                    const m = selectedMerchantForDrawer;
                    setSelectedMerchantForDrawer(null);
                    onEditMerchant(m);
                  }}
                >
                  <HugeiconsIcon icon={Edit01Icon} size={14} />
                  <span>Edit Merchant Details</span>
                </Button>
              </div>

              {/* Footer */}
              <SheetFooter className="p-4 border-t border-slate-800 bg-slate-950/60 shrink-0 flex items-center justify-between">
                {onManageCredentials ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const m = selectedMerchantForDrawer;
                      setSelectedMerchantForDrawer(null);
                      onManageCredentials(m);
                    }}
                    className="border-violet-500/30 bg-violet-500/15 text-violet-200 hover:bg-violet-500/25"
                  >
                    <HugeiconsIcon icon={Key01Icon} size={13} />
                    <span>Credentials</span>
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setSelectedMerchantForDrawer(null)}
                >
                  Close
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
