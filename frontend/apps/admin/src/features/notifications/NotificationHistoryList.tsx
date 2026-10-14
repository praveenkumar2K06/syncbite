import React from "react";
import type { NotificationResponse } from "../../api/admin";
import { relTime } from "../../utils/formatters";

interface NotificationHistoryListProps {
  loading: boolean;
  logs: NotificationResponse[];
}

export default function NotificationHistoryList({ loading, logs }: NotificationHistoryListProps) {
  return (
    <div className="lg:col-span-7 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          📜 Dispatched Logs & Announcement History ({logs.length})
        </h3>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <span className="text-2xl">📭</span>
          <p className="font-semibold text-slate-300">No notification logs recorded in database.</p>
          <p className="text-[11px] text-slate-500">
            Compose and dispatch announcements or alerts above to populate the ledger.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[680px] overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-slate-800 flex flex-col gap-2 hover:border-slate-700 transition-colors"
              style={{ background: "#111827" }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      log.channel === "EMAIL"
                        ? "bg-purple-950/80 text-purple-400 border border-purple-800/60"
                        : log.channel === "PUSH"
                          ? "bg-sky-950/80 text-sky-400 border border-sky-800/60"
                          : "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                    }`}
                  >
                    {log.channel}
                  </span>
                  <span className="font-semibold text-white text-xs">{log.subject}</span>
                </div>

                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                  {log.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">{log.body}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                <span className="truncate max-w-[280px]">To: {log.recipient}</span>
                <span>{relTime(log.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
