import { Input } from "../ui/input";
import React, { useState, useEffect } from "react";
import type { MerchantRecord } from "../../api/admin";
import { AdminDialog } from "../ui/admin-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CreateBrandModalProps {
  open: boolean;
  initialMerchantId?: string;
  merchants: MerchantRecord[];
  saving: boolean;
  onClose: () => void;
  onSave: (payload: {
    merchant_id: string;
    name: string;
    description?: string;
    cuisine_types?: string[];
  }) => Promise<void>;
}

export default function CreateBrandModal({
  open,
  initialMerchantId,
  merchants,
  saving,
  onClose,
  onSave,
}: CreateBrandModalProps) {
  const [merchantId, setMerchantId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cuisineInput, setCuisineInput] = useState("");

  useEffect(() => {
    if (open) {
      setMerchantId(initialMerchantId || merchants[0]?.id || "");
      setName("");
      setDescription("");
      setCuisineInput("");
    }
  }, [open, initialMerchantId, merchants]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!merchantId || !name.trim()) return;

    const cuisine_types = cuisineInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    await onSave({
      merchant_id: merchantId,
      name: name.trim(),
      description: description.trim() || undefined,
      cuisine_types: cuisine_types.length > 0 ? cuisine_types : undefined,
    });
  }

  return (
    <AdminDialog
      onClose={onClose}
      title="Create New Brand"
      description="Provisions a brand identity under an approved merchant entity"
      className="sm:max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏷️</span>
            <div>
              <h3 className="text-base font-bold text-white">Create New Brand</h3>
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
              Parent Merchant *
            </label>
            <Select value={merchantId} onValueChange={(value) => setMerchantId(value ?? "")}>
              <SelectTrigger
                aria-required
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {merchants.length === 0 ? (
                  <SelectItem value="" disabled>
                    No merchants available
                  </SelectItem>
                ) : (
                  merchants.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.business_name} ({m.legal_entity_name})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Brand Name *</label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Burger, Juice Point..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brand story or cuisine theme..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Cuisine Types (Comma-separated, Optional)
            </label>
            <Input
              type="text"
              value={cuisineInput}
              onChange={(e) => setCuisineInput(e.target.value)}
              placeholder="e.g. Fast Food, Beverages, North Indian"
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
              disabled={saving || !name.trim() || !merchantId}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 15px rgba(249,115,22,0.3)",
              }}
            >
              {saving ? "Creating Brand..." : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </AdminDialog>
  );
}
