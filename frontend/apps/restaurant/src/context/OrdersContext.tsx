import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useOrders } from "@/hooks/useOrders";
import { kitchenAlert, useKitchenSound } from "@/lib/kitchenAudio";

export interface OrdersContextValue extends ReturnType<typeof useOrders> {
  newOrdersCount: number;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export interface OrdersProviderProps {
  branchId: string | null;
  showToast?: (msg: string, type?: "success" | "error") => void;
  children: ReactNode;
}

/**
 * Global Orders Provider for the restaurant portal.
 * Maintains a single, continuous orders polling loop across all screens
 * and triggers global audio chimes whenever unaccepted new orders exist.
 */
export function OrdersProvider({ branchId, showToast, children }: OrdersProviderProps) {
  const ordersState = useOrders({ branchId, showToast, autoPoll: true });
  const { soundEnabled, toggleSound } = useKitchenSound();

  const newOrdersCount = useMemo(
    () => ordersState.orders.filter((o) => o.status === "new").length,
    [ordersState.orders],
  );

  const prevNewCountRef = useRef(newOrdersCount);

  // Global sound chime loop: plays across ALL screens whenever there are unaccepted new orders
  useEffect(() => {
    if (newOrdersCount > 0 && soundEnabled) {
      kitchenAlert.startLoopIfNewOrders(true);
      // If an additional new incoming order arrived, trigger chime immediately
      if (newOrdersCount > prevNewCountRef.current) {
        kitchenAlert.playChime();
      }
    } else {
      kitchenAlert.stopLoop();
    }
    prevNewCountRef.current = newOrdersCount;
  }, [newOrdersCount, soundEnabled]);

  // Stop loop on unmount (e.g. user signs out)
  useEffect(() => {
    return () => {
      kitchenAlert.stopLoop();
    };
  }, []);

  // One-time user gesture listener to unlock Web Audio context on modern browsers
  useEffect(() => {
    const unlock = () => {
      kitchenAlert.unlock();
    };
    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const value = useMemo<OrdersContextValue>(
    () => ({
      ...ordersState,
      newOrdersCount,
      soundEnabled,
      toggleSound,
    }),
    [ordersState, newOrdersCount, soundEnabled, toggleSound],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrdersContext(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error("useOrdersContext must be used within an OrdersProvider");
  }
  return ctx;
}

export function useOptionalOrdersContext(): OrdersContextValue | null {
  return useContext(OrdersContext);
}
