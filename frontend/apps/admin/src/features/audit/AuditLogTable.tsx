import React from "react";
import type { AuditLog } from "../../api/admin";
import { relTime } from "../../utils/formatters";

interface AuditLogTableProps {
  logsLoading: boolean;
  logs: AuditLog[];
  onSelectLog: (log: AuditLog) => void;
}

export default function AuditLogTable({ logsLoading, logs, onSelectLog }: AuditLogTableProps) {
  if (logsLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div
        className="p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <span className="text-3xl">≡</span>
        <div className="text-sm font-semibold text-white">No audit records match filters</div>
        <div className="text-xs text-slate-400 max-w-sm">
          Try adjusting your search query or reset filter options.
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden border border-slate-800"
      style={{ background: "#111827" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "#0f1724" }}>
            {[
              "Timestamp",
              "Admin Action",
              "Admin User",
              "Target Entity",
              "Entity ID",
              "IP Address",
              "Delta",
            ].map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-xs text-slate-500 uppercase tracking-wider font-semibold"
                style={{ borderBottom: "1px solid #1e2d45" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr
              key={log.id}
              style={{ background: i % 2 === 0 ? "#111827" : "rgba(26,34,53,0.4)" }}
              className="border-t border-slate-800/60 hover:bg-slate-800/40 transition-colors"
            >
              {/* Timestamp */}
              <td className="px-5 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                {relTime(log.created_at)}
              </td>

              {/* Action */}
              <td className="px-5 py-3">
                <span className="font-semibold text-white text-xs">{log.action}</span>
              </td>

              {/* Admin User */}
              <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                {log.admin_user_id.slice(0, 8)}…
              </td>

              {/* Target Entity */}
              <td className="px-5 py-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400">
                  {log.target_entity}
                </span>
              </td>

              {/* Entity ID */}
              <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                {log.target_entity_id ? `${log.target_entity_id.slice(0, 8)}…` : "—"}
              </td>

              {/* IP Address */}
              <td className="px-5 py-3 text-xs text-slate-500 font-mono">{log.ip_address}</td>

              {/* Changes Action */}
              <td className="px-5 py-3">
                <button
                  onClick={() => onSelectLog(log)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                >
                  View Delta
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
