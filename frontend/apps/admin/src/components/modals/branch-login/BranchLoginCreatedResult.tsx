import React from "react";
import { RESTAURANT_PORTAL_URL } from "../../../config";

export interface CreatedManagerResult {
  email: string;
  password: string;
  branchName: string;
  branchId: string;
}

interface BranchLoginCreatedResultProps {
  createdResult: CreatedManagerResult;
  onDismiss: () => void;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
}

export default function BranchLoginCreatedResult({
  createdResult,
  onDismiss,
  onCopy,
}: BranchLoginCreatedResultProps) {
  return (
    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 flex flex-col gap-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-lg">🎉</span>
          <span className="text-xs font-bold text-emerald-300">
            Branch Manager Account Created & Bound Successfully!
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          ✕ Dismiss
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
        <div>
          <span className="text-slate-500 text-[11px] block">OUTLET:</span>
          <span className="text-white font-medium">{createdResult.branchName}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[11px] block">ROLE:</span>
          <span className="text-emerald-400 font-bold">BranchManager</span>
        </div>
        <div>
          <span className="text-slate-500 text-[11px] block">LOGIN EMAIL:</span>
          <span className="text-cyan-300 font-semibold">{createdResult.email}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[11px] block">PASSWORD:</span>
          <span className="text-amber-300 font-bold">{createdResult.password}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const packet = `Outlet: ${createdResult.branchName}\nLogin Email: ${createdResult.email}\nPassword: ${createdResult.password}\nRole: BranchManager\nRestaurant Portal: ${RESTAURANT_PORTAL_URL}`;
            onCopy(packet, "Full credentials packet copied! ✓");
          }}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>📋</span>
          <span>Copy Full Credentials Packet</span>
        </button>
      </div>
    </div>
  );
}
