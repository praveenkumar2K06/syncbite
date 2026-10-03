import { useState, useEffect, useCallback } from "react";

export type OrderViewMode = "kanban" | "list";

export const ORDER_VIEW_STORAGE_KEY = "syncbite_restaurant_order_view";
const ORDER_VIEW_CHANGE_EVENT = "syncbite:orderview:change";

export function getOrderViewMode(): OrderViewMode {
  if (typeof window === "undefined") return "kanban";
  try {
    const saved = localStorage.getItem(ORDER_VIEW_STORAGE_KEY);
    if (saved === "list" || saved === "kanban") return saved;
  } catch {
    // Ignore localStorage access failures
  }
  return "kanban";
}

export function setOrderViewMode(mode: OrderViewMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDER_VIEW_STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent<OrderViewMode>(ORDER_VIEW_CHANGE_EVENT, { detail: mode }));
  } catch {
    // Ignore localStorage access failures
  }
}

export function useOrderViewMode(): [OrderViewMode, (mode: OrderViewMode) => void] {
  const [mode, setMode] = useState<OrderViewMode>(() => getOrderViewMode());

  useEffect(() => {
    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<OrderViewMode>;
      if (customEvent.detail === "kanban" || customEvent.detail === "list") {
        setMode(customEvent.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === ORDER_VIEW_STORAGE_KEY && (e.newValue === "kanban" || e.newValue === "list")) {
        setMode(e.newValue);
      }
    };

    window.addEventListener(ORDER_VIEW_CHANGE_EVENT, handleCustom);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(ORDER_VIEW_CHANGE_EVENT, handleCustom);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const updateMode = useCallback((newMode: OrderViewMode) => {
    setOrderViewMode(newMode);
    setMode(newMode);
  }, []);

  return [mode, updateMode];
}
