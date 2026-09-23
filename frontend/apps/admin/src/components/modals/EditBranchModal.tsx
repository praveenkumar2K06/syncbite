import { Input } from "../ui/input";
import React, { useState, useEffect } from "react";
import type { Branch } from "../../api/admin";

interface EditBranchModalProps {
  branch: Branch | null;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: {
    name?: string;
    address_text?: string;
    latitude?: number | null;
    longitude?: number | null;
    is_active?: boolean;
    opening_time?: string;
    closing_time?: string;
  }) => Promise<void>;
}

export default function EditBranchModal({ branch, saving, onClose, onSave }: EditBranchModalProps) {
  const [name, setName] = useState("");
  const [addressText, setAddressText] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (branch) {
      setName(branch.name || "");
      setAddressText(branch.address_text || "");
      setLatitude(branch.latitude != null ? String(branch.latitude) : "");
      setLongitude(branch.longitude != null ? String(branch.longitude) : "");
      setOpeningTime(branch.opening_time || "08:00:00");
      setClosingTime(branch.closing_time || "23:00:00");
      setIsActive(branch.is_active);
    }
  }, [branch]);

  if (!branch) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !addressText.trim()) return;
    const lat = latitude.trim() === "" ? null : Number(latitude);
    const lng = longitude.trim() === "" ? null : Number(longitude);
    await onSave({
      name: name.trim(),
      address_text: addressText.trim(),
      latitude: lat === null || !isNaN(lat) ? lat : null,
      longitude: lng === null || !isNaN(lng) ? lng : null,
      is_active: isActive,
      opening_time: openingTime,
      closing_time: closingTime,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 shadow-2xl animate-scale-up"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <div>
              <h3 className="text-base font-bold text-white">Update Branch</h3>
              <p className="text-xs text-slate-400">Edit branch location & operating hours</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Branch Name *</label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Address *</label>
            <Input
              type="text"
              required
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Latitude</label>
              <Input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Longitude</label>
              <Input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground font-mono text-xs"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Opening Time
              </label>
              <Input
                type="text"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                placeholder="08:00:00"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Closing Time
              </label>
              <Input
                type="text"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                placeholder="23:00:00"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground font-mono text-xs"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="edit-branch-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 bg-background border-input cursor-pointer"
            />
            <label
              htmlFor="edit-branch-active"
              className="text-xs text-slate-300 cursor-pointer select-none"
            >
              Online / Active
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim() || !addressText.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-40 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 15px rgba(249,115,22,0.3)",
              }}
            >
              {saving ? "Saving..." : "Save Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
