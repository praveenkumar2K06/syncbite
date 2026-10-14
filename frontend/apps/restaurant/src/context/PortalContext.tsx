import { createContext, useContext } from "react";
import type { useRestaurantPortal } from "@/hooks/useRestaurantPortal";

/** Shape of the value provided to every protected route. */
export type PortalContextValue = ReturnType<typeof useRestaurantPortal>;

export const PortalContext = createContext<PortalContextValue | null>(null);

/** Consume portal state inside any protected route component. */
export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext);
  if (!ctx) {
    throw new Error("usePortal must be used inside PortalContext.Provider");
  }
  return ctx;
}
