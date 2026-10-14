import { Input } from "../ui/input";
import React, { useState, useEffect } from "react";
import type { Brand } from "../../api/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CreateBranchModalProps {
  open: boolean;
  initialBrandId?: string;
  brands: Brand[];
  saving: boolean;
  onClose: () => void;
  onSave: (payload: {
    brand_id: string;
    name: string;
    address_text: string;
    opening_time?: string;
    closing_time?: string;
    is_active?: boolean;
  }) => Promise<void>;
}

export default function CreateBranchModal({
  open,
  initialBrandId,
  brands,
  saving,
  onClose,
  onSave,
}: CreateBranchModalProps) {
  const [brandId, setBrandId] = useState("");
  const [name, setName] = useState("");
  const [addressText, setAddressText] = useState("");
  const [openingTime, setOpeningTime] = useState("08:00:00");
  const [closingTime, setClosingTime] = useState("23:00:00");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (open) {
      setBrandId(initialBrandId || brands[0]?.id || "");
      setName("");
      setAddressText("VIT Vellore Campus");
      setOpeningTime("08:00:00");
      setClosingTime("23:00:00");
      setIsActive(true);
    }
  }, [open, initialBrandId, brands]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brandId || !name.trim() || !addressText.trim()) return;

    await onSave({
      brand_id: brandId,
      name: name.trim(),
      address_text: addressText.trim(),
      opening_time: openingTime,
      closing_time: closingTime,
      is_active: isActive,
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
              <h3 className="text-base font-bold text-white">Create New Branch Location</h3>
              <p className="text-xs text-slate-400">
                Provisions a physical store outlet under a restaurant brand
              </p>
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
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Parent Brand *
            </label>
            <Select value={brandId} onValueChange={(value) => setBrandId(value ?? "")}>
              <SelectTrigger
                aria-required
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {brands.length === 0 ? (
                  <SelectItem value="" disabled>
                    No brands available
                  </SelectItem>
                ) : (
                  brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Branch / Outlet Name *
            </label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Main Food Court, North Block Outpost..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Physical Campus Location *
            </label>
            <Input
              type="text"
              required
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              placeholder="e.g. TT Gallery, Academic Zone, SJT Floor 1..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
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
              id="branch-is-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 bg-background border-input cursor-pointer"
            />
            <label
              htmlFor="branch-is-active"
              className="text-xs text-slate-300 cursor-pointer select-none"
            >
              Online / Active immediately
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
              disabled={saving || !name.trim() || !brandId || !addressText.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 15px rgba(249,115,22,0.3)",
              }}
            >
              {saving ? "Creating Branch..." : "Create Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
