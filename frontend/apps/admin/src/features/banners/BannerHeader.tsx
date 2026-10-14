import React from "react";

interface BannerHeaderProps {
  bannersCount: number;
  onOpenCreateModal: () => void;
  onRefresh: () => void;
}

export default function BannerHeader({
  bannersCount,
  onOpenCreateModal,
  onRefresh,
}: BannerHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span>🎨 Marketing Banner Management</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-950/70 border border-indigo-800/60 text-indigo-400">
            {bannersCount} Banners
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure student homepage hero carousels, target links, promotions, order priorities, and
          visibility.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenCreateModal}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#ffffff" }}
        >
          <span>＋</span> Create Banner
        </button>
        <button
          onClick={onRefresh}
          className="px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          style={{ background: "#1a2235", color: "#94a3b8", border: "1px solid #1e2d45" }}
        >
          ↻ Refresh
        </button>
      </div>
    </div>
  );
}
