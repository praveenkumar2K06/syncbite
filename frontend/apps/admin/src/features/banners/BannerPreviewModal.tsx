import React from "react";
import type { BannerResponse } from "../../api/admin";

interface BannerPreviewModalProps {
  banner: BannerResponse | null;
  onClose: () => void;
}

export default function BannerPreviewModal({ banner, onClose }: BannerPreviewModalProps) {
  if (!banner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
        style={{ background: "#111827" }}
      >
        <div className="relative h-64 bg-slate-950">
          <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs px-2 py-0.5 rounded font-bold bg-amber-500 text-black uppercase">
              Featured Promotion
            </span>
            <h3 className="text-lg font-bold mt-2">{banner.title}</h3>
            <div className="text-xs text-slate-300 mt-1">
              Tap will navigate to: {banner.target_url}
            </div>
          </div>
        </div>
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
