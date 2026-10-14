import React from "react";
import type { BannerResponse } from "../../api/admin";
import { relTime } from "../../utils/formatters";

interface BannerCardsGridProps {
  loading: boolean;
  banners: BannerResponse[];
  onPreviewBanner: (banner: BannerResponse) => void;
  onToggleActive: (banner: BannerResponse) => void;
  onDeleteBanner: (bannerId: string) => void;
}

export default function BannerCardsGrid({
  loading,
  banners,
  onPreviewBanner,
  onToggleActive,
  onDeleteBanner,
}: BannerCardsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-56 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div
        className="p-12 text-center rounded-2xl flex flex-col items-center justify-center gap-3"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <span className="text-3xl">🎨</span>
        <div className="text-sm font-semibold text-white">No promotional banners configured</div>
        <div className="text-xs text-slate-400 max-w-sm">
          Create hero banners to highlight restaurant discounts and campus announcements.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {banners.map((b) => (
        <div
          key={b.id}
          className="rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800 transition-all hover:border-slate-700"
          style={{ background: "#111827" }}
        >
          {/* Image with overlay tags */}
          <div className="relative h-40 bg-slate-950 overflow-hidden group">
            <img
              src={b.image_url}
              alt={b.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  b.is_active ? "bg-emerald-500 text-black" : "bg-slate-700 text-slate-300"
                }`}
              >
                {b.is_active ? "ACTIVE" : "INACTIVE"}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/70 text-white">
                Order #{b.display_order}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <div className="text-sm font-bold text-white drop-shadow-md line-clamp-2">
                {b.title}
              </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="p-4 flex flex-col gap-3">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span className="truncate max-w-[200px]" title={b.target_url || "None"}>
                🔗 {b.target_url || "No link"}
              </span>
              <span className="font-mono text-[11px] text-slate-500">{relTime(b.created_at)}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                onClick={() => onPreviewBanner(b)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
              >
                👁️ Preview
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToggleActive(b)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    b.is_active
                      ? "text-rose-400 bg-rose-950/40 hover:bg-rose-900/60"
                      : "text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/60"
                  }`}
                >
                  {b.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => onDeleteBanner(b.id)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 transition-all cursor-pointer"
                  title="Delete banner"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
