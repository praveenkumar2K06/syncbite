import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  UserGroupIcon,
  PlusSignIcon,
  RefreshIcon,
  Table01Icon,
  LayoutGridIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "../../components/ui/button";

interface BranchHeaderProps {
  branchesCount: number;
  managersCount: number;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  onOpenManagersDirectory: () => void;
  onOpenCreateBranchModal: () => void;
  onRefresh: () => void;
}

export default function BranchHeader({
  branchesCount,
  managersCount,
  viewMode,
  onViewModeChange,
  onOpenManagersDirectory,
  onOpenCreateBranchModal,
  onRefresh,
}: BranchHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <HugeiconsIcon icon={Location01Icon} size={20} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Branch Outlet Operations</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 font-mono">
              {branchesCount} Outlets
            </span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Outlet operations – best for managing real-time status, operating schedules, manager
          assignments, and digital menus.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Table vs Grid Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "table"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Table View (operational scanning)"
          >
            <HugeiconsIcon icon={Table01Icon} size={15} />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "grid"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Card Grid View (visual cards)"
          >
            <HugeiconsIcon icon={LayoutGridIcon} size={15} />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>

        <Button
          variant="cyanSubtle"
          size="default"
          onClick={onOpenManagersDirectory}
          title="Open Platform Branch Managers Directory"
        >
          <HugeiconsIcon icon={UserGroupIcon} size={15} />
          <span>Managers ({managersCount})</span>
        </Button>

        <Button variant="emerald" size="default" onClick={onOpenCreateBranchModal}>
          <HugeiconsIcon icon={PlusSignIcon} size={15} />
          <span>Create Branch</span>
        </Button>

        <Button variant="default" size="default" onClick={onRefresh}>
          <HugeiconsIcon icon={RefreshIcon} size={15} />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
}
