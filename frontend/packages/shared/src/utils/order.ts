/**
 * Order Status State Machine and Navigation Helpers
 * Shared between Restaurant portal and Student app.
 */

import {
  BackendOrderStatus,
  type OrderAction,
  type OrderTab,
  type PortalOrderStatus,
} from "../types/order";

/** Order transition actions mirroring OrderService.VALID_TRANSITIONS on backend */
export const NEXT_ORDER_ACTION: Record<string, OrderAction | null> = {
  [BackendOrderStatus.SCHEDULED]: {
    status: BackendOrderStatus.PLACED,
    label: "Push Order Now",
  },
  [BackendOrderStatus.PLACED]: {
    status: BackendOrderStatus.ACCEPTED,
    label: "Accept Order",
  },
  [BackendOrderStatus.ACCEPTED]: {
    status: BackendOrderStatus.PREPARING,
    label: "Start Preparing",
  },
  [BackendOrderStatus.PREPARING]: {
    status: BackendOrderStatus.READY,
    label: "Mark Ready",
  },
  [BackendOrderStatus.READY]: {
    status: BackendOrderStatus.COMPLETED,
    label: "Mark Completed",
  },
  [BackendOrderStatus.COMPLETED]: null,
  [BackendOrderStatus.CANCELLED]: null,
};

export const ORDER_TABS: OrderTab[] = [
  { key: "new", label: "New" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "completed", label: "Done" },
  { key: "cancelled", label: "Cancelled" },
];

export function toPortalStatus(backendStatus: string): PortalOrderStatus {
  const upper = (backendStatus || "").toUpperCase();
  switch (upper) {
    case BackendOrderStatus.PREPARING:
      return "preparing";
    case BackendOrderStatus.READY:
      return "ready";
    case BackendOrderStatus.COMPLETED:
      return "completed";
    case BackendOrderStatus.CANCELLED:
      return "cancelled";
    default:
      // SCHEDULED, PLACED and ACCEPTED belong in the "New" queue
      return "new";
  }
}

export function toStudentStatus(
  backendStatus: string,
): "scheduled" | "placed" | "accepted" | "preparing" | "ready" | "completed" | "cancelled" {
  const s = (backendStatus || "").toUpperCase();
  if (s === "SCHEDULED") {
    return "scheduled";
  }
  if (s === "COMPLETED" || s === "DELIVERED" || s === "PICKED_UP") {
    return "completed";
  }
  if (s === "CANCELLED") {
    return "cancelled";
  }
  if (s === "READY" || s === "PACKED") {
    return "ready";
  }
  if (s === "PREPARING") {
    return "preparing";
  }
  if (s === "ACCEPTED") {
    return "accepted";
  }
  return "placed";
}

export function nextOrderAction(backendStatus: string): OrderAction | null {
  const upper = (backendStatus || "").toUpperCase();
  return NEXT_ORDER_ACTION[upper] ?? null;
}

export function canCancelOrder(backendStatus: string): boolean {
  const upper = (backendStatus || "").toUpperCase();
  return (
    upper === BackendOrderStatus.SCHEDULED ||
    upper === BackendOrderStatus.PLACED ||
    upper === BackendOrderStatus.ACCEPTED
  );
}

export function isPendingOrder(backendStatus: string): boolean {
  const upper = (backendStatus || "").toUpperCase();
  return (
    upper === BackendOrderStatus.SCHEDULED ||
    upper === BackendOrderStatus.PLACED ||
    upper === BackendOrderStatus.ACCEPTED ||
    upper === BackendOrderStatus.PREPARING
  );
}

export function isStillActionable(backendStatus: string): boolean {
  const upper = (backendStatus || "").toUpperCase();
  return upper !== BackendOrderStatus.CANCELLED;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Scheduled (In Game)",
  PLACED: "Order Placed",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  READY: "Ready for Pickup",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  scheduled: "Scheduled (In Game)",
  placed: "Order Placed",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PLATFORM_FREEZE_STORAGE_KEY = "sat_campus_platform_freeze";

let _isPlatformFrozen = false;
const _freezeSubscribers = new Set<(frozen: boolean) => void>();

export interface FeatureFlagItem {
  flag_key: string;
  enabled: boolean;
  value?: string | null;
}

export function isFreezeFlag(flag: { flag_key: string }): boolean {
  const k = flag.flag_key.toUpperCase();
  return (
    k === "EMERGENCY_MAINTENANCE_MODE" ||
    k === "MAINTENANCE_MODE" ||
    k === "PLATFORM_FREEZE" ||
    k === "EMERGENCY_PLATFORM_FREEZE"
  );
}

/**
 * Returns current platform freeze state (in-memory, synchronized via feature flags endpoint).
 */
export function isPlatformFrozen(): boolean {
  return _isPlatformFrozen;
}

/**
 * Updates platform freeze state and notifies all active subscribers.
 */
export function setPlatformFreeze(frozen: boolean): void {
  _isPlatformFrozen = frozen;
  _freezeSubscribers.forEach((fn) => {
    try {
      fn(frozen);
    } catch {
      // ignore subscriber error
    }
  });
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    try {
      window.dispatchEvent(new CustomEvent("platform-freeze-change", { detail: frozen }));
    } catch {
      // ignore
    }
  }
}

/**
 * Subscribes to live platform freeze state changes.
 */
export function subscribePlatformFreeze(fn: (frozen: boolean) => void): () => void {
  _freezeSubscribers.add(fn);
  return () => {
    _freezeSubscribers.delete(fn);
  };
}

/**
 * Fetches the system feature flags endpoint and synchronizes platform freeze state.
 * Uses the feature flags endpoint and eliminates dependency on localStorage.
 */
export async function checkPlatformFreezeApi(
  clientOrBaseUrl?: string | (<T>(endpoint: string) => Promise<T>),
): Promise<boolean> {
  try {
    let flags: FeatureFlagItem[] = [];
    if (typeof clientOrBaseUrl === "function") {
      flags = await clientOrBaseUrl<FeatureFlagItem[]>("/admin/feature-flags");
    } else {
      const base =
        typeof clientOrBaseUrl === "string"
          ? clientOrBaseUrl
          : typeof window !== "undefined" && (window as any).VITE_API_URL
            ? (window as any).VITE_API_URL
            : "/api/v1";
      const cleanBase = base.replace(/\/+$/, "");
      const res = await fetch(`${cleanBase}/admin/feature-flags`);
      if (!res.ok) return _isPlatformFrozen;
      flags = (await res.json()) as FeatureFlagItem[];
    }

    if (Array.isArray(flags)) {
      const freezeFlag = flags.find(isFreezeFlag);
      const frozen = freezeFlag ? Boolean(freezeFlag.enabled) : false;
      setPlatformFreeze(frozen);
      return frozen;
    }
    return _isPlatformFrozen;
  } catch {
    return _isPlatformFrozen;
  }
}
