import React from "react";
import type { Branch, BranchManagerResponse, Brand } from "../../../api/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Key01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface BranchAssignedManagersTableProps {
  branch: Branch;
  parentBrand?: Brand | null;
  assignedManagers: BranchManagerResponse[];
  sameBrandBranches: Branch[];
  reassigningUserId: string | null;
  setReassigningUserId: (id: string | null) => void;
  inlineDestBranchId: string;
  setInlineDestBranchId: (id: string) => void;
  reassigning: boolean;
  onInlineReassign: (userId: string) => void;
  onManageCredentials: (manager: BranchManagerResponse) => void;
}

export default function BranchAssignedManagersTable({
  branch,
  parentBrand,
  assignedManagers,
  sameBrandBranches,
  reassigningUserId,
  setReassigningUserId,
  inlineDestBranchId,
  setInlineDestBranchId,
  reassigning,
  onInlineReassign,
  onManageCredentials,
}: BranchAssignedManagersTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">
            Assigned Branch Managers ({assignedManagers.length})
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-mono">
          Direct Store Access Active
        </span>
      </div>

      {/* Table of assigned managers for this branch */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider bg-slate-900/60">
              <th className="py-2.5 px-3">Manager Email</th>
              <th className="py-2.5 px-3">Role</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {assignedManagers.map((mgr) => {
              const isReassigningThis = reassigningUserId === mgr.user_id;
              // Destination branches MUST ONLY belong to the same brand_id!
              const availableDestBranches = sameBrandBranches.filter((b) => b.id !== branch.id);

              return (
                <React.Fragment key={mgr.user_id}>
                  <tr className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-emerald-300">
                      ✉️ {mgr.email}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950 border border-emerald-800 text-emerald-400">
                        BranchManager
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (isReassigningThis) {
                              setReassigningUserId(null);
                            } else {
                              setReassigningUserId(mgr.user_id);
                              if (availableDestBranches.length > 0) {
                                setInlineDestBranchId(availableDestBranches[0].id);
                              }
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
                        >
                          <span>🔄 Reassign Branch</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onManageCredentials(mgr)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                        >
                          <HugeiconsIcon icon={Key01Icon} size={13} />
                          Credentials
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Inline Reassign Subform (STRICTLY for same brand_id) */}
                  {isReassigningThis && (
                    <tr className="bg-slate-900/90 border-b border-cyan-900/50">
                      <td colSpan={4} className="p-3">
                        {availableDestBranches.length === 0 ? (
                          <div className="p-2 text-xs text-amber-300 bg-amber-950/40 rounded border border-amber-800/40 flex items-center justify-between">
                            <span>
                              ℹ️ "{branch.name}" is the only physical branch registered under{" "}
                              <strong>{parentBrand ? parentBrand.name : "this brand"}</strong>.
                              Create another branch under this brand to reassign.
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
                              Move to ({parentBrand?.name} outlet):
                            </span>
                            <Select
                              value={inlineDestBranchId}
                              onValueChange={(value) => setInlineDestBranchId(value ?? "")}
                            >
                              <SelectTrigger className="flex-1 px-3 py-1.5 rounded-lg text-xs outline-none bg-slate-950 border border-slate-700 text-slate-100">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableDestBranches.map((b) => (
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
    </div>
  );
}
