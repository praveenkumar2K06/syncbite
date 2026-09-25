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
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import type { Branch, Brand, MerchantRecord, BranchManagerResponse } from "../../api/admin";
import { StatusBadge } from "../../components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";
import { isBranchOpenNow } from "../../utils/branchHours";

interface BranchTableProps {
  loading: boolean;
  branches: Branch[];
  brandMap: Map<string, Brand>;
  merchantMap: Map<string, MerchantRecord>;
  branchManagers: BranchManagerResponse[];
  togglingBranch: string | null;
  selectedBranchIds: string[];
  onToggleSelectBranch: (branchId: string) => void;
  onSelectAllBranches: (selected: boolean) => void;
  onOpenManageLogins: (branch: Branch) => void;
  onOpenMenuForBranch: (branchId: string) => void;
  onToggleBranch: (branch: Branch) => void;
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branch: Branch) => void;
  onCopy?: (text: string, msg?: string) => void;
}

export default function BranchTable({
  loading,
  branches,
  brandMap,
  merchantMap,
  branchManagers,
  togglingBranch,
  selectedBranchIds,
  onToggleSelectBranch,
  onSelectAllBranches,
  onOpenManageLogins,
  onOpenMenuForBranch,
  onToggleBranch,
  onEditBranch,
  onDeleteBranch,
  onCopy,
}: BranchTableProps) {
  // Confirm offline state for safety
  const [confirmOfflineBranchId, setConfirmOfflineBranchId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl bg-slate-900/60" />
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
          Try adjusting your search query, status, or brand filter to see results.
        </div>
      </div>
    );
  }

  const allSelected = branches.length > 0 && selectedBranchIds.length === branches.length;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/70 shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-950/90 border-b border-slate-800">
              <th className="px-4 py-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAllBranches(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer h-4 w-4"
                  title={allSelected ? "Deselect all" : "Select all"}
                />
              </th>
              {[
                "Status",
                "Branch Outlet",
                "Parent Hierarchy",
                "Branch Manager Login",
                "Campus Location",
                "Schedule & Window",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {branches.map((branch, i) => {
              const parentBrand = brandMap.get(branch.brand_id);
              const parentMerchant = parentBrand ? merchantMap.get(parentBrand.merchant_id) : null;
              const isToggling = togglingBranch === branch.id;
              const assignedManagers = branchManagers.filter((m) => m.branch_id === branch.id);
              const isAssigned = assignedManagers.length > 0;
              const isSelected = selectedBranchIds.includes(branch.id);
              const isOpenNow = isBranchOpenNow(branch.opening_time, branch.closing_time);

              return (
                <tr
                  key={branch.id}
                  className={`hover:bg-slate-800/30 transition-colors ${
                    isSelected
                      ? "bg-amber-950/20"
                      : i % 2 === 0
                        ? "bg-slate-900/40"
                        : "bg-slate-950/20"
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectBranch(branch.id)}
                      className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer h-4 w-4"
                    />
                  </td>

                  {/* Operational Status */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={branch.is_active ? "ONLINE" : "OFFLINE"} />
                  </td>

                  {/* Branch Info */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white text-sm tracking-tight">
                      {branch.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                      <span>ID: {branch.id.slice(0, 8)}…</span>
                      {onCopy && (
                        <button
                          type="button"
                          onClick={() => onCopy(branch.id, "Branch ID copied!")}
                          className="hover:text-slate-300 text-slate-500 cursor-pointer"
                          title="Copy Branch ID"
                        >
                          <HugeiconsIcon icon={Copy01Icon} size={11} />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Parent Hierarchy Context */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
                      <HugeiconsIcon icon={Tag01Icon} size={13} className="shrink-0" />
                      <span className="truncate max-w-[140px]">
                        {parentBrand ? parentBrand.name : "Direct Brand"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Building02Icon}
                        size={12}
                        className="text-slate-500 shrink-0"
                      />
                      <span
                        className="truncate max-w-[140px]"
                        title={parentMerchant ? parentMerchant.business_name : "Campus Direct"}
                      >
                        {parentMerchant ? parentMerchant.business_name : "Campus Direct"}
                      </span>
                    </div>
                  </td>

                  {/* Branch Manager Login & Role Column */}
                  <td className="px-5 py-4 min-w-[200px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isAssigned ? (
                        <div className="flex items-center gap-1">
                          <Badge variant="approved" className="gap-1 font-mono text-[10px]">
                            <HugeiconsIcon icon={UserIcon} size={11} />
                            <span>BranchManager</span>
                          </Badge>
                          {assignedManagers.length > 1 && (
                            <Badge variant="default" className="text-[9px] px-1.5 py-0 font-mono">
                              +{assignedManagers.length - 1}
                            </Badge>
                          )}
                        </div>
                      ) : parentMerchant ? (
                        <Badge variant="violet" className="gap-1 font-mono text-[10px]">
                          <HugeiconsIcon icon={Building02Icon} size={11} />
                          <span>MerchantOwner</span>
                        </Badge>
                      ) : (
                        <Badge variant="pending" className="gap-1 font-mono text-[10px]">
                          <HugeiconsIcon icon={AlertCircleIcon} size={11} />
                          <span>Unassigned</span>
                        </Badge>
                      )}
                    </div>

                    <div
                      className={`text-[11px] font-mono mt-1.5 truncate max-w-[190px] ${
                        isAssigned
                          ? "text-emerald-300"
                          : parentMerchant
                            ? "text-violet-300"
                            : "text-slate-500 italic"
                      }`}
                      title={
                        isAssigned
                          ? assignedManagers[0].email
                          : parentMerchant
                            ? `Managed under ${parentMerchant.business_name}`
                            : "No manager assigned"
                      }
                    >
                      {isAssigned
                        ? assignedManagers[0].email
                        : parentMerchant
                          ? `Under ${parentMerchant.business_name}`
                          : "— No manager assigned"}
                    </div>

                    {/* Manage Logins Trigger */}
                    <div className="mt-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenManageLogins(branch)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1 cursor-pointer border transition-all ${
                          isAssigned
                            ? "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                            : "bg-cyan-950/60 border-cyan-800/70 text-cyan-300 hover:bg-cyan-900"
                        }`}
                      >
                        <HugeiconsIcon icon={UserIcon} size={11} />
                        <span>
                          {isAssigned
                            ? `Manage Logins (${assignedManagers.length})`
                            : "+ Assign Manager"}
                        </span>
                      </button>
                    </div>
                  </td>

                  {/* Campus Location */}
                  <td className="px-5 py-4 max-w-[160px]">
                    <div
                      className="text-slate-300 text-xs truncate flex items-center gap-1.5"
                      title={branch.address_text || "VIT Campus"}
                    >
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={12}
                        className="text-slate-500 shrink-0"
                      />
                      <span className="truncate">{branch.address_text || "VIT Campus"}</span>
                    </div>
                  </td>

                  {/* Operating Hours & Open Now indicator */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
                        <HugeiconsIcon
                          icon={Clock01Icon}
                          size={12}
                          className="text-slate-500 shrink-0"
                        />
                        <span>
                          {branch.opening_time?.slice(0, 5)} - {branch.closing_time?.slice(0, 5)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOpenNow ? "bg-emerald-400" : "bg-slate-500"
                          }`}
                        />
                        <span
                          className={isOpenNow ? "text-emerald-400 font-medium" : "text-slate-500"}
                        >
                          {isOpenNow ? "Open now" : "Closed now"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {/* Branch actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button
                              type="button"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                              title="Branch actions"
                            >
                              <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                            </button>
                          }
                        />
                        <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
                          <DropdownMenuItem
                            onClick={() => onOpenMenuForBranch(branch.id)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <HugeiconsIcon icon={Menu01Icon} size={13} />
                            <span>Manage Menu</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onOpenManageLogins(branch)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <HugeiconsIcon icon={UserIcon} size={13} />
                            <span>
                              {isAssigned ? "Manage Branch Managers" : "Assign Branch Manager"}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEditBranch(branch)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <HugeiconsIcon icon={Edit01Icon} size={13} />
                            <span>Edit Branch</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={isToggling}
                            onClick={() => {
                              if (branch.is_active) {
                                setConfirmOfflineBranchId(branch.id);
                              } else {
                                onToggleBranch(branch);
                              }
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <HugeiconsIcon
                              icon={branch.is_active ? AlertCircleIcon : CheckmarkCircle01Icon}
                              size={13}
                            />
                            <span>
                              {isToggling
                                ? "Updating status..."
                                : branch.is_active
                                  ? "Take Offline"
                                  : "Bring Online"}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onCopy?.(branch.id, "Branch ID copied!")}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <HugeiconsIcon icon={Copy01Icon} size={13} />
                            <span>Copy Branch ID</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {confirmOfflineBranchId === branch.id && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setConfirmOfflineBranchId(null);
                                  onToggleBranch(branch);
                                }}
                                className="flex items-center gap-2 cursor-pointer text-rose-400 focus:text-rose-300"
                              >
                                <HugeiconsIcon icon={AlertCircleIcon} size={13} />
                                <span>Confirm Take Offline</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setConfirmOfflineBranchId(null)}
                                className="cursor-pointer"
                              >
                                Cancel
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
