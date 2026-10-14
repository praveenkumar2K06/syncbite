import { useState, useCallback, useEffect, useMemo } from "react";
import { cancelOrderApi, getBranchOrdersApi, toUserMessage, updateOrderStatusApi } from "@/api";
import {
  computeMetrics,
  mapOrder,
  mapOrders,
  nextOrderAction,
  toPortalStatus,
  type OrderVM,
  type PortalMenu,
} from "@/lib/portal";
import { EMPTY_MENU, ORDER_POLL_MS } from "@/constants";

export interface UseOrdersOptions {
  branchId: string | null;
  showToast?: (msg: string, type?: "success" | "error") => void;
  menu?: PortalMenu;
  autoPoll?: boolean;
  pollIntervalMs?: number;
}

function areOrdersEqual(prev: OrderVM[], next: OrderVM[]): boolean {
  if (prev === next) return true;
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i++) {
    const p = prev[i];
    const n = next[i];
    if (
      p.id !== n.id ||
      p.status !== n.status ||
      p.total !== n.total ||
      p.backendStatus !== n.backendStatus ||
      p.items.length !== n.items.length
    ) {
      return false;
    }
  }
  return true;
}

export function useOrders({
  branchId,
  showToast,
  menu = EMPTY_MENU,
  autoPoll = true,
  pollIntervalMs = ORDER_POLL_MS,
}: UseOrdersOptions) {
  const [orders, setOrders] = useState<OrderVM[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  /** Pulls the latest orders without full-page reloads. */
  const refreshOrders = useCallback(
    async (id?: string) => {
      const targetId = id || branchId;
      if (!targetId) return;
      try {
        const fresh = mapOrders(await getBranchOrdersApi(targetId));
        setOrders((prev) => (areOrdersEqual(prev, fresh) ? prev : fresh));
      } catch {
        // Background refresh failure must not interrupt active kitchen operations.
      }
    },
    [branchId],
  );

  // Initial load when branchId changes
  useEffect(() => {
    if (!branchId) {
      setOrders([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getBranchOrdersApi(branchId)
      .then((data) => {
        if (!cancelled) {
          setOrders(mapOrders(data));
        }
      })
      .catch((err) => {
        if (!cancelled && showToast) {
          showToast(toUserMessage(err), "error");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [branchId, showToast]);

  // Live polling only while this hook is mounted (e.g. on Orders / Dashboard screen)
  useEffect(() => {
    if (!branchId || !autoPoll) return;

    const tick = () => {
      void refreshOrders(branchId);
    };

    const timer = setInterval(tick, pollIntervalMs);
    const onVisibilityOrFocus = () => {
      if (!document.hidden) void refreshOrders(branchId);
    };

    window.addEventListener("focus", onVisibilityOrFocus);
    document.addEventListener("visibilitychange", onVisibilityOrFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onVisibilityOrFocus);
      document.removeEventListener("visibilitychange", onVisibilityOrFocus);
    };
  }, [branchId, autoPoll, pollIntervalMs, refreshOrders]);

  const handleAdvanceOrder = useCallback(
    async (order: OrderVM) => {
      const action = nextOrderAction(order.backendStatus);
      if (!action) return;
      setBusyOrderId(order.id);

      // Optimistic advance: immediate responsive feedback in kitchen UI
      const previousOrders = orders;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, backendStatus: action.status, status: toPortalStatus(action.status) }
            : o,
        ),
      );

      try {
        const updated = await updateOrderStatusApi(order.id, action.status);
        setOrders((prev) => prev.map((o) => (o.id === order.id ? mapOrder(updated) : o)));
        showToast?.(`Order ${order.displayId} — ${action.label.toLowerCase()}.`);
      } catch (err) {
        // Rollback on API failure
        setOrders(previousOrders);
        showToast?.(`Failed to update order ${order.displayId}: ${toUserMessage(err)}`, "error");
        if (branchId) void refreshOrders(branchId);
      } finally {
        setBusyOrderId(null);
      }
    },
    [orders, showToast, branchId, refreshOrders],
  );

  const handleCancelOrder = useCallback(
    async (order: OrderVM) => {
      setBusyOrderId(order.id);
      const previousOrders = orders;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, backendStatus: "CANCELLED", status: "cancelled" } : o,
        ),
      );
      try {
        const updated = await cancelOrderApi(order.id);
        setOrders((prev) => prev.map((o) => (o.id === order.id ? mapOrder(updated) : o)));
        showToast?.(`Order ${order.displayId} cancelled.`);
      } catch (err) {
        setOrders(previousOrders);
        showToast?.(`Failed to cancel order ${order.displayId}: ${toUserMessage(err)}`, "error");
        if (branchId) void refreshOrders(branchId);
      } finally {
        setBusyOrderId(null);
      }
    },
    [orders, showToast, branchId, refreshOrders],
  );

  const metrics = useMemo(() => computeMetrics(menu, orders), [menu, orders]);
  const activeCount = metrics.pending;

  return {
    orders,
    loading,
    refreshOrders,
    handleAdvanceOrder,
    handleCancelOrder,
    busyOrderId,
    metrics,
    activeCount,
  };
}

export default useOrders;
