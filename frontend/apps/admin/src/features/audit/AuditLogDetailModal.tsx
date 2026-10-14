import React from "react";
import type { AuditLog } from "../../api/admin";
import { formatDateTime } from "../../utils/format";

interface AuditLogDetailModalProps {
  log: AuditLog | null;
  onClose: () => void;
}

export default function AuditLogDetailModal({ log, onClose }: AuditLogDetailModalProps) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">≡</span>
            <div>
              <h3 className="text-base font-bold text-white">Audit Event Details</h3>
              <div className="text-xs text-slate-400 font-mono">ID: {log.id}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Action:</span>
            <div className="text-white font-bold mt-0.5">{log.action}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Target Entity:</span>
            <div className="text-sky-400 font-bold mt-0.5">
              {log.target_entity} ({log.target_entity_id || "null"})
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Admin User ID:</span>
            <div className="text-white font-mono mt-0.5">{log.admin_user_id}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Origin IP & Time:</span>
            <div className="text-white font-mono mt-0.5">
              {log.ip_address} • {formatDateTime(log.created_at)}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Changes Payload (JSON Delta)
          </div>
          <pre
            className="p-3.5 rounded-xl text-xs font-mono overflow-x-auto text-emerald-400 max-h-56 overflow-y-auto"
            style={{ background: "#0a0f1a", border: "1px solid #1e2d45" }}
          >
            {JSON.stringify(log.changes_payload, null, 2)}
          </pre>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
