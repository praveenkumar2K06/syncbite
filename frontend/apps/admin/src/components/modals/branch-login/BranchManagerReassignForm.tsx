import React from "react";
import type { Branch, BranchManagerResponse, Brand } from "../../../api/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface BranchManagerReassignFormProps {
  branch: Branch;
  parentBrand?: Brand | null;
  otherBrandManagers: BranchManagerResponse[];
  branches: Branch[];
  reassignSelectedUserId: string;
  setReassignSelectedUserId: (id: string) => void;
  reassigning: boolean;
  onReassign: () => void;
  onCancel?: () => void;
  isStandaloneCard?: boolean;
}

export default function BranchManagerReassignForm({
  branch,
  parentBrand,
  otherBrandManagers,
  branches,
  reassignSelectedUserId,
  setReassignSelectedUserId,
  reassigning,
  onReassign,
  onCancel,
  isStandaloneCard = false,
}: BranchManagerReassignFormProps) {
  if (isStandaloneCard) {
    return (
      <div className="p-5 rounded-xl bg-slate-950 border border-cyan-900/40 flex flex-col gap-4 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>🔄</span> Reassign {parentBrand?.name} Manager to {branch.name}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Select an existing operations manager from another branch of{" "}
          <strong>{parentBrand?.name}</strong> to transfer and bind to{" "}
          <strong>{branch.name}</strong>:
        </p>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Select Existing Manager (Filtered by {parentBrand?.name} only) *
          </label>
          <Select
            value={reassignSelectedUserId}
            onValueChange={(value) => setReassignSelectedUserId(value ?? "")}
          >
            <SelectTrigger className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-slate-900 border border-slate-700 text-slate-100 font-mono focus:border-cyan-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {otherBrandManagers.map((m) => {
                const curB = branches.find((b) => b.id === m.branch_id);
                return (
                  <SelectItem key={m.user_id} value={m.user_id}>
                    {m.email} (Currently at: {curB?.name || "Unassigned"})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            disabled={reassigning || !reassignSelectedUserId}
            onClick={onReassign}
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
                <span>Confirm Reassignment</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-400">
        Select an existing manager already registered under <strong>{parentBrand?.name}</strong> to
        assign to this branch outlet:
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <Select
          value={reassignSelectedUserId}
          onValueChange={(value) => setReassignSelectedUserId(value ?? "")}
        >
          <SelectTrigger className="flex-1 px-3 py-2 rounded-xl text-xs outline-none bg-slate-900 border border-slate-700 text-slate-100 font-mono">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {otherBrandManagers.map((m) => {
              const curB = branches.find((b) => b.id === m.branch_id);
              return (
                <SelectItem key={m.user_id} value={m.user_id}>
                  {m.email} (Currently at: {curB?.name || "Unassigned"})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <button
          type="button"
          disabled={reassigning || !reassignSelectedUserId}
          onClick={onReassign}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 cursor-pointer"
        >
          {reassigning ? "Assigning..." : "Assign to This Branch"}
        </button>
      </div>
    </div>
  );
}
