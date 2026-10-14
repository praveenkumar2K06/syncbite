import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Tag01Icon,
  Building02Icon,
  Clock01Icon,
  UserIcon,
  Menu01Icon,
  Edit01Icon,
  Delete02Icon,
  MoreVerticalIcon,
  Copy01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import type { Branch, Brand, MerchantRecord, BranchManagerResponse } from "../../api/admin";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { StatusBadge } from "../../components/ui/status-badge";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { isBranchOpenNow } from "../../utils/branchHours";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";

interface BranchCardGridProps {
  loading: boolean;
  branches: Branch[];
  brandMap: Map<string, Brand>;
  merchantMap: Map<string, MerchantRecord>;
  branchManagers: BranchManagerResponse[];
  togglingBranch: string | null;
  selectedBranchIds: string[];
  onToggleSelectBranch: (branchId: string) => void;
  onOpenManageLogins: (branch: Branch) => void;
  onOpenMenuForBranch: (branchId: string) => void;
  onToggleBranch: (branch: Branch) => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branch: Branch) => void;
  onCopy?: (text: string, msg?: string) => void;
}

export default function BranchCardGrid({
  loading,
  branches,
  brandMap,
  merchantMap,
  branchManagers,
  togglingBranch,
  selectedBranchIds,
  onToggleSelectBranch,
  onOpenManageLogins,
  onOpenMenuForBranch,
  onToggleBranch,
  onEditBranch,
  onDeleteBranch,
  onCopy,
}: BranchCardGridProps) {
  const [confirmOfflineBranchId, setConfirmOfflineBranchId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-52 rounded-2xl bg-slate-900/60" />
        ))}
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-900/60 border border-slate-800">
        <div className="p-3 rounded-2xl bg-slate-800/60 text-slate-400">
          <HugeiconsIcon icon={Location01Icon} size={32} />
        </div>
        <div className="text-base font-semibold text-white">No branch outlets found</div>
        <div className="text-xs text-slate-400 max-w-sm">
          Try adjusting your search filters or create a new branch outlet.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {branches.map((branch) => {
        const parentBrand = brandMap.get(branch.brand_id);
        const parentMerchant = parentBrand ? merchantMap.get(parentBrand.merchant_id) : null;
        const isToggling = togglingBranch === branch.id;
        const assignedManagers = branchManagers.filter((m) => m.branch_id === branch.id);
        const isAssigned = assignedManagers.length > 0;
        const isSelected = selectedBranchIds.includes(branch.id);
        const isOpenNow = isBranchOpenNow(branch.opening_time, branch.closing_time);

        return (
          <Card
            key={branch.id}
            className={`flex flex-col justify-between hover:border-slate-700 transition-all shadow-md ${
              isSelected
                ? "border-amber-500/60 bg-slate-900/90 ring-1 ring-amber-500/40"
                : "bg-slate-900/80"
            }`}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectBranch(branch.id)}
                    className="mt-1 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer h-4 w-4 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    {/* Parent Hierarchy Context */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate mb-1">
                      <HugeiconsIcon
                        icon={Tag01Icon}
                        size={11}
                        className="text-amber-400 shrink-0"
                      />
                      <span
                        className="text-amber-400 truncate max-w-[90px]"
                        title={parentBrand?.name}
                      >
                        {parentBrand?.name || "Brand"}
                      </span>
                      <span>›</span>
                      <span className="truncate max-w-[90px]" title={parentMerchant?.business_name}>
                        {parentMerchant?.business_name || "Merchant"}
                      </span>
                    </div>

                    <h3
                      className="font-bold text-white text-base tracking-tight truncate"
                      title={branch.name}
                    >
                      {branch.name}
                    </h3>
                  </div>
                </div>

                <StatusBadge
                  status={branch.is_active ? "ONLINE" : "OFFLINE"}
                  className="shrink-0"
                />
              </div>

              {/* Location & Hours */}
              <div className="mt-3 flex flex-col gap-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={13}
                    className="text-slate-500 shrink-0"
                  />
                  <span className="truncate" title={branch.address_text || "VIT Campus"}>
                    {branch.address_text || "VIT Campus"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 font-mono">
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={12}
                      className="text-slate-500 shrink-0"
                    />
                    <span>
                      {branch.opening_time?.slice(0, 5)} - {branch.closing_time?.slice(0, 5)}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-medium flex items-center gap-1 ${isOpenNow ? "text-emerald-400" : "text-slate-500"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? "bg-emerald-400" : "bg-slate-500"}`}
                    />
                    {isOpenNow ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
              {/* Manager assignment chip & trigger */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {isAssigned ? (
                      <Badge variant="approved" className="gap-1 font-mono text-[9px] py-0">
                        <HugeiconsIcon icon={UserIcon} size={10} />
                        <span>BranchManager</span>
                      </Badge>
                    ) : parentMerchant ? (
                      <Badge variant="violet" className="gap-1 font-mono text-[9px] py-0">
                        <HugeiconsIcon icon={Building02Icon} size={10} />
                        <span>MerchantOwner</span>
                      </Badge>
                    ) : (
                      <Badge variant="pending" className="gap-1 font-mono text-[9px] py-0">
                        <HugeiconsIcon icon={AlertCircleIcon} size={10} />
                        <span>Unassigned</span>
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 truncate mt-1">
                    {isAssigned ? assignedManagers[0].email : "— No dedicated manager"}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => onOpenManageLogins(branch)}
                  title="Manage Branch Manager logins"
                >
                  <HugeiconsIcon icon={UserIcon} size={11} />
                  <span>{isAssigned ? "Logins" : "Assign"}</span>
                </Button>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="amberSubtle"
                  size="xs"
                  onClick={() => onOpenMenuForBranch(branch.id)}
                  title="Open Branch Menu"
                >
                  <HugeiconsIcon icon={Menu01Icon} size={12} />
                  <span>Menu</span>
                </Button>

                <Button
                  variant="cyanSubtle"
                  size="xs"
                  onClick={() => onEditBranch(branch)}
                  title="Edit Branch"
                >
                  <HugeiconsIcon icon={Edit01Icon} size={12} />
                  <span>Edit</span>
                </Button>
              </div>

              <div className="flex items-center gap-1.5">
                {confirmOfflineBranchId === branch.id ? (
                  <div className="flex items-center gap-1 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmOfflineBranchId(null);
                        onToggleBranch(branch);
                      }}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                    >
                      Confirm?
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmOfflineBranchId(null)}
                      className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <Button
                    variant={branch.is_active ? "destructive" : "emeraldSubtle"}
                    size="xs"
                    onClick={() => {
                      if (branch.is_active) {
                        setConfirmOfflineBranchId(branch.id);
                      } else {
                        onToggleBranch(branch);
                      }
                    }}
                    disabled={isToggling}
                  >
                    {isToggling ? "…" : branch.is_active ? "Offline" : "Online"}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="secondary"
                        size="iconSm"
                        className="h-6 w-6"
                        title="More branch actions"
                      >
                        <HugeiconsIcon icon={MoreVerticalIcon} size={12} />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
                    <DropdownMenuItem
                      onClick={() => onOpenManageLogins(branch)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <HugeiconsIcon icon={UserIcon} size={13} />
                      <span>Manage Branch Managers</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onCopy?.(branch.id, "Branch ID copied!")}
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
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
