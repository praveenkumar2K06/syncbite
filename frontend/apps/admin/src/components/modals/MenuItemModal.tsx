import { Input } from "../ui/input";
import React from "react";
import type { ItemModalState, ItemFormData } from "../../types/dashboard";
import type { MenuCategory } from "../../api/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface MenuItemModalProps {
  modal: ItemModalState;
  form: ItemFormData;
  saving: boolean;
  categories?: MenuCategory[];
  onClose: () => void;
  onChangeForm: (updated: ItemFormData) => void;
  onSave: (e: React.FormEvent) => void;
}

export default function MenuItemModal({
  modal,
  form,
  saving,
  categories,
  onClose,
  onChangeForm,
  onSave,
}: MenuItemModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5 shadow-2xl animate-scale-up"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{modal.mode === "create" ? "＋" : "✏️"}</span>
            {modal.mode === "create" ? "Add New Dish" : "Edit Dish Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Dish Name *</label>
            <Input
              type="text"
              required
              value={form.name}
              onChange={(e) => onChangeForm({ ...form, name: e.target.value })}
              placeholder="e.g. Masala Dosa, Paneer Wrap..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Category *</label>
            {categories && categories.length > 0 ? (
              <Select
                value={form.category_id}
                onValueChange={(value) => onChangeForm({ ...form, category_id: value ?? "" })}
              >
                <SelectTrigger className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select an existing category</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div>
                <Input
                  type="text"
                  required
                  value={form.new_category_name}
                  onChange={(e) => onChangeForm({ ...form, new_category_name: e.target.value })}
                  placeholder="Type category name (e.g. Meals, Snacks...)"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  This will automatically create this new category for this restaurant.
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Price (₹) *</label>
              <Input
                type="number"
                step="1"
                min="0"
                required
                value={form.base_price}
                onChange={(e) => onChangeForm({ ...form, base_price: e.target.value })}
                placeholder="e.g. 75"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Dietary Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChangeForm({ ...form, is_veg: true })}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  style={{
                    background: form.is_veg ? "rgba(16,185,129,0.2)" : "#0a0f1a",
                    color: form.is_veg ? "#10b981" : "#64748b",
                    border: `1px solid ${form.is_veg ? "#10b981" : "#1e2d45"}`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Veg
                </button>
                <button
                  type="button"
                  onClick={() => onChangeForm({ ...form, is_veg: false })}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  style={{
                    background: !form.is_veg ? "rgba(244,63,94,0.2)" : "#0a0f1a",
                    color: !form.is_veg ? "#f43f5e" : "#64748b",
                    border: `1px solid ${!form.is_veg ? "#f43f5e" : "#1e2d45"}`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Non-Veg
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Availability Status
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChangeForm({ ...form, is_available: true })}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                style={{
                  background: form.is_available ? "rgba(16,185,129,0.2)" : "#0a0f1a",
                  color: form.is_available ? "#10b981" : "#64748b",
                  border: `1px solid ${form.is_available ? "#10b981" : "#1e2d45"}`,
                }}
              >
                In Stock (Ready to Order)
              </button>
              <button
                type="button"
                onClick={() => onChangeForm({ ...form, is_available: false })}
                className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                style={{
                  background: !form.is_available ? "rgba(244,63,94,0.2)" : "#0a0f1a",
                  color: !form.is_available ? "#f43f5e" : "#64748b",
                  border: `1px solid ${!form.is_available ? "#f43f5e" : "#1e2d45"}`,
                }}
              >
                Sold Out (Hidden from Ordering)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => onChangeForm({ ...form, description: e.target.value })}
              placeholder="Ingredients, preparation, portion size..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Image URL (Optional)
            </label>
            <Input
              type="url"
              value={form.image_url}
              onChange={(e) => onChangeForm({ ...form, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-background border border-input text-foreground"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                boxShadow: "0 0 15px rgba(249,115,22,0.3)",
              }}
            >
              {saving ? "Saving..." : modal.mode === "create" ? "Add Dish to Menu" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
