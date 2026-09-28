import React from "react";

interface CustomerHeaderProps {
  totalCount: number;
  onRefresh: () => void;
}

export default function CustomerHeader({ totalCount, onRefresh }: CustomerHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span>👥 Customer Management</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-sky-950/70 border border-sky-800/60 text-sky-400">
            {totalCount} Students Indexed
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Student customer directory synthesized from verified checkout orders, hostels, payment
          records, and lifecycle controls.
        </p>
      </div>

      <button
        onClick={onRefresh}
        className="px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
        style={{ background: "#1a2235", color: "#94a3b8", border: "1px solid #1e2d45" }}
      >
        ↻ Refresh
      </button>
    </div>
  );
}
