import { useState, useMemo } from "react";
import type { AuditLog } from "../api/admin";
import AuditLogHeader from "./audit/AuditLogHeader";
import AuditLogFilters from "./audit/AuditLogFilters";
import AuditLogTable from "./audit/AuditLogTable";
import AuditLogDetailModal from "./audit/AuditLogDetailModal";

interface AuditLogsTabProps {
  logs: AuditLog[];
  logsLoading: boolean;
}

export default function AuditLogsTab({ logs, logsLoading }: AuditLogsTabProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [adminFilter, setAdminFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Distinct values for dropdown filters
  const distinctActions = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.action).filter(Boolean)));
  }, [logs]);

  const distinctEntities = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.target_entity).filter(Boolean)));
  }, [logs]);

  const distinctAdmins = useMemo(() => {
    return Array.from(new Set(logs.map((l) => l.admin_user_id).filter(Boolean)));
  }, [logs]);

  // Filtered audit events
  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== "ALL" && log.action !== actionFilter) return false;
      if (entityFilter !== "ALL" && log.target_entity !== entityFilter) return false;
      if (adminFilter !== "ALL" && log.admin_user_id !== adminFilter) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.target_entity.toLowerCase().includes(q) ||
        (log.target_entity_id && log.target_entity_id.toLowerCase().includes(q)) ||
        log.ip_address.toLowerCase().includes(q) ||
        log.admin_user_id.toLowerCase().includes(q)
      );
    });
  }, [logs, actionFilter, entityFilter, adminFilter, search]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <AuditLogHeader />

      <AuditLogFilters
        search={search}
        onSearchChange={setSearch}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        distinctActions={distinctActions}
        entityFilter={entityFilter}
        onEntityFilterChange={setEntityFilter}
        distinctEntities={distinctEntities}
        adminFilter={adminFilter}
        onAdminFilterChange={setAdminFilter}
        distinctAdmins={distinctAdmins}
        filteredCount={filtered.length}
        totalCount={logs.length}
      />

      <AuditLogTable logsLoading={logsLoading} logs={filtered} onSelectLog={setSelectedLog} />

      <AuditLogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
