import React from "react";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface AuditLogFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  actionFilter: string;
  onActionFilterChange: (val: string) => void;
  distinctActions: string[];
  entityFilter: string;
  onEntityFilterChange: (val: string) => void;
  distinctEntities: string[];
  adminFilter: string;
  onAdminFilterChange: (val: string) => void;
  distinctAdmins: string[];
  filteredCount: number;
  totalCount: number;
}

export default function AuditLogFilters({
  search,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  distinctActions,
  entityFilter,
  onEntityFilterChange,
  distinctEntities,
  adminFilter,
  onAdminFilterChange,
  distinctAdmins,
  filteredCount,
  totalCount,
}: AuditLogFiltersProps) {
  return (
    <div
      className="p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3"
      style={{ background: "#111827", border: "1px solid #1e2d45" }}
    >
      <div className="flex items-center gap-3 w-full md:w-auto flex-1 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search action, target entity, IP…"
            className="w-full px-3.5 py-2 rounded-xl text-xs outline-none pl-8"
          />
          <span className="absolute left-2.5 top-2 text-xs text-slate-500">🔍</span>
        </div>

        {/* Action Filter */}
        <Select value={actionFilter} onValueChange={(value) => onActionFilterChange(value ?? "")}>
          <SelectTrigger className="px-3 py-2 rounded-xl text-xs outline-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            {distinctActions.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Entity Filter */}
        <Select value={entityFilter} onValueChange={(value) => onEntityFilterChange(value ?? "")}>
          <SelectTrigger className="px-3 py-2 rounded-xl text-xs outline-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Entities</SelectItem>
            {distinctEntities.map((ent) => (
              <SelectItem key={ent} value={ent}>
                {ent}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Admin User Filter */}
        {distinctAdmins.length > 1 && (
          <Select value={adminFilter} onValueChange={(value) => onAdminFilterChange(value ?? "")}>
            <SelectTrigger className="px-3 py-2 rounded-xl text-xs outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Admin Users</SelectItem>
              {distinctAdmins.map((adm) => (
                <SelectItem key={adm} value={adm}>
                  {adm}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="text-xs text-slate-400 font-mono self-end md:self-center">
        Showing {filteredCount} of {totalCount} logged events
      </div>
    </div>
  );
}
