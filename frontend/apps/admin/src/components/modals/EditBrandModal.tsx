import { Input } from "../ui/input";
import React, { useState, useEffect } from "react";
import type { Brand } from "../../api/admin";

interface EditBrandModalProps {
  brand: Brand | null;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: {
    name?: string;
    logo_url?: string | null;
    banner_url?: string | null;
    description?: string | null;
    cuisine_types?: string[] | null;
  }) => Promise<void>;
}

export default function EditBrandModal({ brand, saving, onClose, onSave }: EditBrandModalProps) {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [cuisineInput, setCuisineInput] = useState("");

  useEffect(() => {
    if (brand) {
      setName(brand.name || "");
      setLogoUrl(brand.logo_url || "");
      setBannerUrl(brand.banner_url || "");
      setDescription(brand.description || "");
      setCuisineInput((brand.cuisine_types || []).join(", "));
    }
  }, [brand]);

  if (!brand) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const cuisine_types = cuisineInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    await onSave({
      name: name.trim(),
      logo_url: logoUrl.trim() || null,
      banner_url: bannerUrl.trim() || null,
      description: description.trim() || null,
      cuisine_types: cuisine_types.length > 0 ? cuisine_types : null,
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
            <span className="text-xl">🏷️</span>
            <div>
              <h3 className="text-base font-bold text-white">Update Brand</h3>
              <p className="text-xs text-slate-400">Edit brand marketing metadata</p>
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
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Brand Name *</label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Logo URL</label>
            <Input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Banner URL</label>
            <Input
              type="text"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Cuisine Types (Comma-separated)
            </label>
            <Input
              type="text"
              value={cuisineInput}
              onChange={(e) => setCuisineInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground font-mono text-xs"
            />
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
              disabled={saving || !name.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-40 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 15px rgba(249,115,22,0.3)",
              }}
            >
              {saving ? "Saving..." : "Save Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
