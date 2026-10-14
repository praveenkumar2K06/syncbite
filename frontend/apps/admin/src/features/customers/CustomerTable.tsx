import React from "react";
import { fmt, relTime } from "../../utils/formatters";
import type { CustomerData } from "./types";

interface CustomerTableProps {
  loading: boolean;
  customers: CustomerData[];
  totalCount: number;
  onSelectCustomer: (cust: CustomerData) => void;
  onToggleStatus: (id: string, newStatus: "ACTIVE" | "SUSPENDED" | "FLAGGED") => void;
}

export default function CustomerTable({
  loading,
  customers,
  totalCount,
  onSelectCustomer,
  onToggleStatus,
}: CustomerTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div
        className="p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <span className="text-3xl">👥</span>
        <div className="text-sm font-semibold text-white">
          {totalCount === 0
            ? "No registered customers found in database"
            : "No students matching search filter"}
        </div>
        <div className="text-xs text-slate-400 max-w-sm">
          {totalCount === 0
            ? "Customer profiles will automatically populate here as students place orders on campus."
            : "Try clearing your search query or reset status filter."}
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
              "Status",
              "Student Profile",
              "Campus Hostel",
              "Orders & Spent",
              "Joined",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                style={{ borderBottom: "1px solid #1e2d45" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((cust, i) => (
            <tr
              key={cust.id}
              style={{ background: i % 2 === 0 ? "#111827" : "rgba(26,34,53,0.4)" }}
              className="border-t border-slate-800/60 hover:bg-slate-800/40 transition-colors"
            >
              {/* Status */}
              <td className="px-5 py-4">
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 w-fit ${
                    cust.status === "ACTIVE"
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                      : cust.status === "FLAGGED"
                        ? "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                        : "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      cust.status === "ACTIVE"
                        ? "bg-emerald-400"
                        : cust.status === "FLAGGED"
                          ? "bg-amber-400"
                          : "bg-rose-400"
                    }`}
                  />
                  {cust.status}
                </span>
              </td>

              {/* Profile */}
              <td className="px-5 py-4">
                <div className="font-semibold text-white text-sm">{cust.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{cust.email}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{cust.phone}</div>
              </td>

              {/* Hostel */}
              <td className="px-5 py-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span>🏠</span>
                  <span>{cust.campus_hostel}</span>
                </div>
              </td>

              {/* Orders & Spent */}
              <td className="px-5 py-4">
                <div className="font-semibold text-white text-xs">{cust.total_orders} Orders</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                  {fmt(cust.total_spent)} Lifetime
                </div>
              </td>

              {/* Joined */}
              <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                {relTime(cust.created_at)}
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectCustomer(cust)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
                  >
                    View Profile
                  </button>

                  {cust.status === "ACTIVE" ? (
                    <button
                      onClick={() => onToggleStatus(cust.id, "SUSPENDED")}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-all cursor-pointer"
                      title="Suspend account"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleStatus(cust.id, "ACTIVE")}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40 transition-all cursor-pointer"
                      title="Reactivate account"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
