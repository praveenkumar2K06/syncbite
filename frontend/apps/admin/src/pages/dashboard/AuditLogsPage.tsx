import { useCallback } from "react";
import { getAuditLogsApi, type AuditLog } from "../../api/admin";
import { useDashboardActions } from "../../context/DashboardContext";
import AuditLogsTab from "../../features/AuditLogsTab";
import { useAsyncData } from "../../hooks/useAsyncData";

export default function AuditLogsPage() {
  const { showToast } = useDashboardActions();
  const loadLogs = useCallback(() => getAuditLogsApi(200), []);
  const { data: logs, loading: logsLoading } = useAsyncData<AuditLog[]>(loadLogs, () =>
    showToast("Could not load audit logs.", "error"),
  );

  return <AuditLogsTab logs={logs ?? []} logsLoading={logsLoading} />;
}
