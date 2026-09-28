import React from "react";
import { Input } from "../../components/ui/input";

interface CustomerFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: "ALL" | "ACTIVE" | "FLAGGED" | "SUSPENDED";
  onStatusFilterChange: (status: "ALL" | "ACTIVE" | "FLAGGED" | "SUSPENDED") => void;
  filteredCount: number;
  totalCount: number;
}

export default function CustomerFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  filteredCount,
  totalCount,
}: CustomerFiltersProps) {
  return (
    <div
      className="p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3"
      style={{ background: "#111827", border: "1px solid #1e2d45" }}
    >
      <div className="flex items-center gap-3 w-full md:w-auto flex-1 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by student name, email, hostel…"
            className="w-full px-3.5 py-2 rounded-xl text-xs outline-none pl-8"
          />
          <span className="absolute left-2.5 top-2 text-xs text-slate-500">🔍</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(["ALL", "ACTIVE", "FLAGGED", "SUSPENDED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onStatusFilterChange(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s === "ALL" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-400 font-mono self-end md:self-center">
        Showing {filteredCount} of {totalCount} students
      </div>
    </div>
  );
}
