import { Input } from "../../ui/input";
import React from "react";
import type { Branch, BranchManagerResponse, Brand } from "../../../api/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Key01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface BranchLoginDirectoryTabProps {
  branchManagers: BranchManagerResponse[];
  branches: Branch[];
  brands: Brand[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  directoryBrandFilter: string;
  setDirectoryBrandFilter: (b: string) => void;
  getManagerBrandId: (mgr: BranchManagerResponse) => string | undefined;
  reassigningUserId: string | null;
  setReassigningUserId: (id: string | null) => void;
  inlineDestBranchId: string;
  setInlineDestBranchId: (id: string) => void;
  reassigning: boolean;
  onInlineReassign: (userId: string) => void;
  onManageCredentials: (manager: BranchManagerResponse) => void;
}

export default function BranchLoginDirectoryTab({
  branchManagers,
  branches,
  brands,
  searchQuery,
  setSearchQuery,
  directoryBrandFilter,
  setDirectoryBrandFilter,
  getManagerBrandId,
  reassigningUserId,
  setReassigningUserId,
  inlineDestBranchId,
  setInlineDestBranchId,
  reassigning,
  onInlineReassign,
  onManageCredentials,
}: BranchLoginDirectoryTabProps) {
  const filteredDirectoryManagers = branchManagers.filter((m) => {
    const mBrandId = getManagerBrandId(m);
    if (directoryBrandFilter !== "ALL" && mBrandId !== directoryBrandFilter) {
      return false;
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const bName = (
      m.branch_name ||
      branches.find((b) => b.id === m.branch_id)?.name ||
      ""
    ).toLowerCase();
    const brandName = (brands.find((br) => br.id === mBrandId)?.name || "").toLowerCase();
    return m.email.toLowerCase().includes(q) || bName.includes(q) || brandName.includes(q);
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Search & Brand Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search managers by email or outlet name..."
            className="w-full px-3.5 py-2 rounded-xl text-xs outline-none bg-background border border-slate-800 text-foreground pl-8"
          />
          <span className="absolute left-2.5 top-2 text-xs text-slate-500">🔍</span>
        </div>

        <Select
          value={directoryBrandFilter}
          onValueChange={(value) => setDirectoryBrandFilter(value ?? "")}
        >
          <SelectTrigger className="px-3 py-2 rounded-xl text-xs outline-none bg-background border border-slate-800 text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Brands ({brands.length})</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredDirectoryManagers.length === 0 ? (
        <div className="p-8 text-center bg-background rounded-xl border border-slate-800 text-xs text-slate-400">
          No branch managers found for this filter.
        </div>
      ) : (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-background max-h-96 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider bg-slate-900/60 sticky top-0">
                <th className="py-2.5 px-3">Manager Email</th>
                <th className="py-2.5 px-3">Brand & Branch Outlet</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDirectoryManagers.map((mgr) => {
                const assignedBranch = branches.find((b) => b.id === mgr.branch_id);
                const mgrBrandId = getManagerBrandId(mgr);
                const mgrBrand = brands.find((br) => br.id === mgrBrandId);
                const isReassigningThis = reassigningUserId === mgr.user_id;

                // Only branches of THAT manager's brand are eligible destinations!
                const eligibleDestBranches = branches.filter(
                  (b) => b.brand_id === mgrBrandId && b.id !== mgr.branch_id,
                );

                return (
                  <React.Fragment key={mgr.user_id}>
                    <tr className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-emerald-300">
                        ✉️ {mgr.email}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">
                          {assignedBranch ? assignedBranch.name : mgr.branch_name || "Unassigned"}
                        </div>
                        <div className="text-[10px] text-violet-400 font-mono mt-0.5">
                          🏷️ {mgrBrand ? mgrBrand.name : "Direct Brand"}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (isReassigningThis) {
                              setReassigningUserId(null);
                            } else {
                              setReassigningUserId(mgr.user_id);
                              if (eligibleDestBranches.length > 0) {
                                setInlineDestBranchId(eligibleDestBranches[0].id);
                              }
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-input transition-colors cursor-pointer"
                        >
                          <span>🔄 Reassign</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onManageCredentials(mgr)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                        >
                          <HugeiconsIcon icon={Key01Icon} size={13} />
                          Credentials
                        </button>
                      </td>
                    </tr>

                    {/* Inline Reassign form in directory (STRICTLY for that specific brand_id) */}
                    {isReassigningThis && (
                      <tr className="bg-slate-900/90 border-b border-cyan-900/50">
                        <td colSpan={4} className="p-3">
                          {eligibleDestBranches.length === 0 ? (
                            <div className="p-2 text-xs text-amber-300 bg-amber-950/40 rounded border border-amber-800/40 flex items-center justify-between">
                              <span>
                                ℹ️ No other branch outlets exist under{" "}
                                <strong>{mgrBrand ? mgrBrand.name : "this brand"}</strong> to
                                transfer to.
                              </span>
                              <button
                                type="button"
                                onClick={() => setReassigningUserId(null)}
                                className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5"
                              >
                                Close
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                              <span className="text-xs text-slate-300 font-medium whitespace-nowrap">
                                Move within {mgrBrand?.name}:
                              </span>
                              <Select
                                value={inlineDestBranchId}
                                onValueChange={(value) => setInlineDestBranchId(value ?? "")}
                              >
                                <SelectTrigger className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none bg-background border border-input text-foreground">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {eligibleDestBranches.map((b) => (
                                    <SelectItem key={b.id} value={b.id}>
                                      {b.name} ({b.address_text || "Campus Zone"})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <button
                                type="button"
                                disabled={reassigning || !inlineDestBranchId}
                                onClick={() => onInlineReassign(mgr.user_id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 transition-colors cursor-pointer"
                              >
                                {reassigning ? "Moving..." : "Confirm Move"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setReassigningUserId(null)}
                                className="px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
