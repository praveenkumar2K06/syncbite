import React from "react";
import type { BrowseFilterKey } from "./constants";
import { BROWSE_FILTER_TABS } from "./constants";

interface BrowseHeaderProps {
  humorLine: string;
}

export function BrowseHeader({ humorLine }: BrowseHeaderProps) {
  return (
    <div className="bg-navy border-b-2 border-navy px-4 pt-6 pb-5">
      <p className="text-golden font-bold text-[10px] uppercase tracking-[0.3em] mb-1">
        Campus Dining Hub
      </p>
      <h1 className="font-impact text-4xl md:text-5xl text-cream uppercase leading-none mb-2">
        All Stalls & Outlets
      </h1>
      <p className="font-display italic text-cream/50 text-sm">{humorLine}</p>
    </div>
  );
}

interface BrowseFilterBarProps {
  currentFilter: BrowseFilterKey;
  onFilterChange: (filter: BrowseFilterKey) => void;
  filteredCount: number;
}

export function BrowseFilterBar({
  currentFilter,
  onFilterChange,
  filteredCount,
}: BrowseFilterBarProps) {
  return (
    <div className="sticky top-14 z-20 bg-cream border-b-2 border-navy px-4">
      <div className="flex gap-0 overflow-x-auto">
        {BROWSE_FILTER_TABS.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`flex-shrink-0 py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              currentFilter === f.key
                ? "border-raspberry text-raspberry"
                : "border-transparent text-navy/40 hover:text-navy"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex-shrink-0 flex items-center pr-1">
          <span className="text-[10px] font-bold text-navy/30 uppercase tracking-wider">
            {filteredCount} stall{filteredCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
