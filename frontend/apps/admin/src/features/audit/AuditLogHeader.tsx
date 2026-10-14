import React from "react";

export default function AuditLogHeader() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
        <span>≡ Platform Audit Trail</span>
        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-950/70 border border-emerald-800/60 text-emerald-400">
          Immutable Ledger
        </span>
      </h2>
      <p className="text-xs text-slate-400 mt-1">
        Cryptographically append-only audit trail recording every administrative event, user ID, IP
        address, and payload delta.
      </p>
    </div>
  );
}
