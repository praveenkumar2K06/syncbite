import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import type { Brand } from "../../api/admin";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface BranchFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: "ALL" | "ACTIVE" | "INACTIVE";
  onStatusFilterChange: (val: "ALL" | "ACTIVE" | "INACTIVE") => void;
  brandFilter: string;
  onBrandFilterChange: (val: string) => void;
  brands: Brand[];
  filteredCount: number;
  totalCount: number;
}

export default function BranchFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  brandFilter,
  onBrandFilterChange,
  brands,
  filteredCount,
  totalCount,
}: BranchFiltersProps) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-3 w-full md:w-auto flex-1 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <HugeiconsIcon icon={Search01Icon} size={14} />
          </span>
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search branches by name, campus zone, brand…"
            className="pl-9 pr-8"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-slate-800">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onStatusFilterChange(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-slate-800 text-white shadow-sm border border-input/80"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s === "ALL" ? "All Outlets" : s === "ACTIVE" ? "Active (Online)" : "Inactive"}
            </button>
          ))}
        </div>

        <Select value={brandFilter} onValueChange={(value) => onBrandFilterChange(value ?? "")}>
          <SelectTrigger className="h-9 px-3 rounded-xl text-xs outline-none bg-background border border-slate-800 text-slate-200 focus:border-amber-500 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-xs text-slate-400 font-mono self-end md:self-center shrink-0">
        Showing <span className="text-white font-semibold">{filteredCount}</span> of {totalCount}{" "}
        outlets
      </div>
    </div>
  );
}
