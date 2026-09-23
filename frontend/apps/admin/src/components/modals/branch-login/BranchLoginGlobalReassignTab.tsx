import React from "react";
import type { Branch, BranchManagerResponse, Brand } from "../../../api/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface BranchLoginGlobalReassignTabProps {
  brands: Brand[];
  branches: Branch[];
  branchManagers: BranchManagerResponse[];
  reassignBrandId: string;
  setReassignBrandId: (id: string) => void;
  reassignSelectedUserId: string;
  setReassignSelectedUserId: (id: string) => void;
  reassignSelectedDestBranchId: string;
  setReassignSelectedDestBranchId: (id: string) => void;
  getManagerBrandId: (mgr: BranchManagerResponse) => string | undefined;
  reassigning: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BranchLoginGlobalReassignTab({
  brands,
  branches,
  branchManagers,
  reassignBrandId,
  setReassignBrandId,
  reassignSelectedUserId,
  setReassignSelectedUserId,
  reassignSelectedDestBranchId,
  setReassignSelectedDestBranchId,
  getManagerBrandId,
  reassigning,
  onSubmit,
}: BranchLoginGlobalReassignTabProps) {
  const brandManagers = branchManagers.filter((m) => getManagerBrandId(m) === reassignBrandId);
  const brandBranches = branches.filter((b) => b.brand_id === reassignBrandId);

  return (
    <form
      onSubmit={onSubmit}
      className="p-5 rounded-xl bg-slate-950 border border-cyan-900/50 flex flex-col gap-4"
    >
      <div className="border-b border-slate-800 pb-2.5">
        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <span>🔄</span> Reassign Branch Manager (Scoped per Brand)
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Select a brand to view only managers and branches belonging to that specific brand.
        </p>
      </div>

      {/* Step 1: Select Brand */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">1. Select Brand *</label>
        <Select value={reassignBrandId} onValueChange={(value) => setReassignBrandId(value ?? "")}>
          <SelectTrigger
            aria-required
            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="" disabled>
              Select brand...
            </SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                🏷️ {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {reassignBrandId && (
        <>
          {/* Step 2: Select Manager (STRICTLY for this brand_id) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              2. Select Branch Manager to Move (Filtered to Selected Brand Only) *
            </label>
            {brandManagers.length === 0 ? (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs">
                No managers are currently registered under this brand.
              </div>
            ) : (
              <Select
                value={reassignSelectedUserId}
                onValueChange={(value) => setReassignSelectedUserId(value ?? "")}
              >
                <SelectTrigger
                  aria-required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brandManagers.map((m) => {
                    const curB = branches.find((b) => b.id === m.branch_id);
                    return (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        {m.email} (Current Outlet: {curB?.name || "Unassigned"})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Step 3: Select Destination Branch (STRICTLY for this brand_id) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              3. Select Destination Branch Outlet (Within Same Brand Only) *
            </label>
            {brandBranches.length === 0 ? (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs">
                No branch outlets exist under this brand.
              </div>
            ) : (
              <Select
                value={reassignSelectedDestBranchId}
                onValueChange={(value) => setReassignSelectedDestBranchId(value ?? "")}
              >
                <SelectTrigger
                  aria-required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-slate-900 border border-slate-700 text-slate-100 focus:border-cyan-500"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brandBranches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} ({b.address_text || "Campus Zone"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
            <button
              type="submit"
              disabled={
                reassigning ||
                !reassignSelectedUserId ||
                !reassignSelectedDestBranchId ||
                brandManagers.length === 0 ||
                brandBranches.length === 0
              }
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              {reassigning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Reassigning...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Execute Reassignment</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
