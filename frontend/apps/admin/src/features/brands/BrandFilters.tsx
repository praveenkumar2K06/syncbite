import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import type { MerchantRecord } from "../../api/admin";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export type BranchFilterType = "ALL" | "HAS_BRANCHES" | "NO_BRANCHES" | "LIVE_ONLY";

interface BrandFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedMerchantFilter: string;
  onSelectMerchantFilter: (val: string) => void;
  branchStatusFilter: BranchFilterType;
  onBranchStatusFilterChange: (val: BranchFilterType) => void;
  merchants: MerchantRecord[];
  filteredCount: number;
  totalCount: number;
}

export default function BrandFilters({
  search,
  onSearchChange,
  selectedMerchantFilter,
  onSelectMerchantFilter,
  branchStatusFilter,
  onBranchStatusFilterChange,
  merchants,
  filteredCount,
  totalCount,
}: BrandFiltersProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur-sm md:flex-row">
      <div className="flex items-center gap-3 w-full md:w-auto flex-1 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <HugeiconsIcon icon={Search01Icon} size={14} />
          </span>
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search brands, cuisines, merchant…"
            className="pl-9 pr-8"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 text-muted-foreground hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
            </button>
          )}
        </div>

        {/* Merchant Select */}
        <Select
          value={selectedMerchantFilter}
          onValueChange={(value) => onSelectMerchantFilter(value ?? "")}
        >
          <SelectTrigger className="h-9 rounded-xl border-input bg-background px-3 text-xs text-foreground transition-colors focus:border-ring">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Merchants</SelectItem>
            {merchants.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.business_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
          {(
            [
              { id: "ALL", label: "All" },
              { id: "HAS_BRANCHES", label: "Has Branches" },
              { id: "NO_BRANCHES", label: "No Branches" },
              { id: "LIVE_ONLY", label: "Live > 0" },
            ] as const
          ).map((chip) => (
            <button
              key={chip.id}
              onClick={() => onBranchStatusFilterChange(chip.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                branchStatusFilter === chip.id
                  ? "border border-border bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0 self-end font-mono text-xs text-muted-foreground md:self-center">
        Showing <span className="font-semibold text-foreground">{filteredCount}</span> of{" "}
        {totalCount} brands
      </div>
    </div>
  );
}
