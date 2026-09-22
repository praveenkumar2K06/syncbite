import { apiClient } from "../client";
import { getAuditLogsApi as sharedGetAuditLogs } from "@syncbite/shared";
import type { AuditLog } from "@syncbite/shared";

export async function getAuditLogsApi(limit = 50): Promise<AuditLog[]> {
  return sharedGetAuditLogs(apiClient, limit);
}
