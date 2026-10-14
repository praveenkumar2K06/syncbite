import { useNavigate } from "react-router-dom";
import type { Branch, Menu, MenuItem } from "../api/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface MenuTabProps {
  selectedBranch?: Branch;
  selectedBranchId: string;
  branches: Branch[];
  currentMenu: Menu | null;
  menuLoading: boolean;
  selectedCatFilter: string;
  itemToggling: string | null;
  onSelectBranchId: (id: string) => void;
  onSelectCatFilter: (filter: string) => void;
  onInitializeMenu: () => void;
  onOpenCreateItem: () => void;
  onOpenEditItem: (item: MenuItem) => void;
  onToggleItemAvailability: (item: MenuItem) => void;
  onOpenBulkImport?: () => void;
}

export default function MenuTab({
  selectedBranch,
  selectedBranchId,
  branches,
  currentMenu,
  menuLoading,
  selectedCatFilter,
  itemToggling,
  onSelectBranchId,
  onSelectCatFilter,
  onInitializeMenu,
  onOpenCreateItem,
  onOpenEditItem,
  onToggleItemAvailability,
  onOpenBulkImport,
}: MenuTabProps) {
  const navigate = useNavigate();
  const allMenuItems =
    currentMenu?.categories?.flatMap((c) =>
      c.items.map((it) => ({ ...it, category_name: c.name })),
    ) || [];

  const filteredMenuItems =
    selectedCatFilter === "ALL"
      ? allMenuItems
      : allMenuItems.filter((it) => it.category_id === selectedCatFilter);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Restaurant Selector Header */}
      <div
        className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: "#111827", border: "1px solid #1e2d45" }}
      >
        <div>
          <div
            className="text-xs uppercase font-medium tracking-wider"
            style={{ color: "#f97316" }}
          >
            Menu Management
          </div>
          <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            {selectedBranch?.name || "Select a Restaurant"}
            {selectedBranch && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-md"
                style={{
                  background: selectedBranch.is_active
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(244,63,94,0.15)",
                  color: selectedBranch.is_active ? "#10b981" : "#f43f5e",
                }}
              >
                {selectedBranch.is_active ? "ONLINE" : "OFFLINE"}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {selectedBranch?.address_text || "VIT Campus"}
          </div>
        </div>

        {/* Dropdown selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 whitespace-nowrap">Switch Restaurant:</label>
          <Select
            value={selectedBranchId}
            onValueChange={(value) => {
              onSelectBranchId(value ?? "");
              onSelectCatFilter("ALL");
            }}
          >
            <SelectTrigger
              className="px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
              style={{ background: "#0a0f1a", border: "1px solid #1e2d45", color: "#e2e8f0" }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Menu Content */}
      {menuLoading ? (
        <div className="flex flex-col gap-4">
          <div className="skeleton h-12 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-36 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : !currentMenu ? (
        /* Uninitialized Menu State */
        <div
          className="rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4"
          style={{ background: "#111827", border: "1px solid #1e2d45" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "rgba(249,115,22,0.1)" }}
          >
            🍽
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">No Menu Configured Yet</h3>
            <p className="text-sm mt-1 max-w-md mx-auto text-slate-400">
              "{selectedBranch?.name}" does not have an active menu catalog in the backend database.
              You can initialize one right now.
            </p>
          </div>
          <button
            onClick={onInitializeMenu}
            className="mt-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "white",
              boxShadow: "0 0 20px rgba(249,115,22,0.3)",
            }}
          >
            ＋ Initialize Menu Catalog
          </button>
        </div>
      ) : (
        /* Active Menu Editor */
        <div className="flex flex-col gap-6">
          {/* Category Filter Tabs & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onSelectCatFilter("ALL")}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                style={{
                  background: selectedCatFilter === "ALL" ? "#f97316" : "#111827",
                  color: selectedCatFilter === "ALL" ? "#ffffff" : "#94a3b8",
                  border: "1px solid #1e2d45",
                }}
              >
                All Dishes ({allMenuItems.length})
              </button>

              {currentMenu.categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCatFilter(cat.id)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    background: selectedCatFilter === cat.id ? "#f97316" : "#111827",
                    color: selectedCatFilter === cat.id ? "#ffffff" : "#94a3b8",
                    border: "1px solid #1e2d45",
                  }}
                >
                  {cat.name} ({cat.items?.length || 0})
                </button>
              ))}

              <button
                onClick={() => navigate("/dashboard/categories")}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                style={{
                  background: "#1a2235",
                  color: "#f97316",
                  border: "1px dashed rgba(249,115,22,0.4)",
                }}
              >
                <span>🏷️</span> Manage Categories →
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onOpenBulkImport && (
                <button
                  onClick={onOpenBulkImport}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                >
                  <span>📥</span> Bulk Import CSV
                </button>
              )}

              <button
                onClick={onOpenCreateItem}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  color: "white",
                  boxShadow: "0 0 15px rgba(249,115,22,0.3)",
                }}
              >
                <span>＋</span> Add New Dish
              </button>
            </div>
          </div>

          {/* Dishes Grid */}
          {filteredMenuItems.length === 0 ? (
            <div
              className="rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3"
              style={{ background: "#111827", border: "1px solid #1e2d45" }}
            >
              <div className="text-2xl">📋</div>
              <div className="text-sm font-medium text-slate-300">
                No dishes in this category yet.
              </div>
              <p className="text-xs text-slate-500">
                Click "+ Add New Dish" above to create dishes for {selectedBranch?.name}.
              </p>
              <button
                onClick={onOpenCreateItem}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                style={{
                  background: "rgba(249,115,22,0.15)",
                  color: "#f97316",
                  border: "1px solid rgba(249,115,22,0.3)",
                }}
              >
                ＋ Add First Dish
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:border-slate-600"
                  style={{ background: "#111827", border: "1px solid #1e2d45" }}
                >
                  <div className="flex gap-4">
                    {/* Dish image thumbnail */}
                    <div
                      className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: "#1a2235", border: "1px solid #1e2d45" }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{item.is_veg ? "🥗" : "🍗"}</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0"
                          style={{
                            borderColor: item.is_veg ? "#10b981" : "#f43f5e",
                            borderRadius: "3px",
                          }}
                          title={item.is_veg ? "Vegetarian" : "Non-Vegetarian"}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: item.is_veg ? "#10b981" : "#f43f5e" }}
                          />
                        </span>
                        <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                      </div>

                      <div className="text-base font-extrabold text-white mt-1">
                        ₹{item.base_price}
                      </div>

                      {item.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="text-[11px] text-slate-500 mt-1">
                        Category: <span className="text-slate-300">{item.category_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer controls: Live In-Stock toggle & Edit button */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid #1e2d45" }}
                  >
                    {/* In-Stock Toggle Button */}
                    <button
                      onClick={() => onToggleItemAvailability(item)}
                      disabled={itemToggling === item.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      style={{
                        background: item.is_available
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(244,63,94,0.12)",
                        color: item.is_available ? "#10b981" : "#f43f5e",
                        border: `1px solid ${item.is_available ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: item.is_available ? "#10b981" : "#f43f5e" }}
                      />
                      {itemToggling === item.id
                        ? "Updating…"
                        : item.is_available
                          ? "In Stock"
                          : "Sold Out"}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onOpenEditItem(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                      style={{
                        background: "#1a2235",
                        color: "#94a3b8",
                        border: "1px solid #1e2d45",
                      }}
                    >
                      ✏️ Edit Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
