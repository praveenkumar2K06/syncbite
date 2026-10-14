import type { PortalOrderStatus } from "@/lib/portal";

export function formatElapsedTime(createdAt?: string): string {
  if (!createdAt) return "";
  try {
    const created = new Date(createdAt).getTime();
    if (isNaN(created)) return "";
    const diffMs = Date.now() - created;
    const diffMin = Math.max(0, Math.floor(diffMs / 60000));
    if (diffMin === 0) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return `${hours}h ${mins}m ago`;
  } catch {
    return "";
  }
}

export type OrderUrgency = "normal" | "warning" | "urgent";

export function getOrderUrgency(createdAt?: string): OrderUrgency {
  if (!createdAt) return "normal";
  try {
    const created = new Date(createdAt).getTime();
    if (isNaN(created)) return "normal";
    const diffMin = Math.max(0, Math.floor((Date.now() - created) / 60000));
    if (diffMin >= 15) return "urgent";
    if (diffMin >= 7) return "warning";
    return "normal";
  } catch {
    return "normal";
  }
}

export function isOrderActive(status: PortalOrderStatus): boolean {
  return status === "new" || status === "preparing" || status === "ready";
}
