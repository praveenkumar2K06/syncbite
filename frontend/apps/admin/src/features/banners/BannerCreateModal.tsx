import { Input } from "../../components/ui/input";
import React from "react";

export interface BannerCreateModalState {
  open: boolean;
  title: string;
  image_url: string;
  target_url: string;
  display_order: number;
  is_active: boolean;
  schedule_start?: string;
  schedule_end?: string;
  submitting: boolean;
}

interface BannerCreateModalProps {
  modal: BannerCreateModalState;
  onClose: () => void;
  onChangeField: <K extends keyof BannerCreateModalState>(
    key: K,
    value: BannerCreateModalState[K],
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BannerCreateModal({
  modal,
  onClose,
  onChangeField,
  onSubmit,
}: BannerCreateModalProps) {
  if (!modal.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 shadow-2xl"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <h3 className="text-base font-bold text-white">Create Marketing Banner</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-medium block mb-1">
              Banner Title / Promotion Heading *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Free Hostel Delivery Tonight on Orders > ₹150"
              value={modal.title}
              onChange={(e) => onChangeField("title", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Banner Image URL *</label>
            <Input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={modal.image_url}
              onChange={(e) => onChangeField("image_url", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
            />
          </div>

          {modal.image_url && (
            <div className="rounded-xl overflow-hidden h-28 border border-slate-800 bg-black">
              <img
                src={modal.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-medium block mb-1">
                Target Deep Link / Route
              </label>
              <Input
                type="text"
                placeholder="/search?cuisine=biryani"
                value={modal.target_url}
                onChange={(e) => onChangeField("target_url", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">
                Display Priority Order
              </label>
              <Input
                type="number"
                min="0"
                value={modal.display_order}
                onChange={(e) => onChangeField("display_order", parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="banner-is-active"
              checked={modal.is_active}
              onChange={(e) => onChangeField("is_active", e.target.checked)}
              className="rounded accent-indigo-500 cursor-pointer"
            />
            <label htmlFor="banner-is-active" className="text-slate-300 font-medium cursor-pointer">
              Activate banner immediately on homepage
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={modal.submitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
          >
            {modal.submitting ? "Publishing…" : "Publish Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}
