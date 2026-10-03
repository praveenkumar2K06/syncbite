/**
 * Presentation helpers that translate the shared backend's records into the
 * view models the portal screens render.
 */

import type { Branch, Menu, MenuItem, Order } from "@/api/restaurant";

// ─── Order status ─────────────────────────────────────────────────────────────

import {
  BackendOrderStatus,
  ORDER_TABS,
  toPortalStatus,
  isStillActionable,
  nextOrderAction,
  canCancelOrder,
  isPendingOrder,
  toTimeInput,
  fromTimeInput,
  formatMoney,
  formatTime,
  formatDate,
  displayName,
  type PortalOrderStatus,
  type OrderAction,
  type OrderTab,
} from "@syncbite/shared";

export {
  BackendOrderStatus,
  ORDER_TABS,
  toPortalStatus,
  isStillActionable,
  nextOrderAction,
  canCancelOrder,
  isPendingOrder,
  toTimeInput,
  fromTimeInput,
  formatMoney,
  formatTime,
  formatDate,
  displayName,
};

export type { PortalOrderStatus, OrderAction, OrderTab };

/** Alias used by the screens for the portal-facing status. */
export type OrderStatus = PortalOrderStatus;

// ─── Menu ─────────────────────────────────────────────────────────────────────

/**
 * The backend only stores `is_veg`, so the portal offers a binary food type.
 * ("Egg" items persist as non-vegetarian.)
 */
export type FoodType = "veg" | "nonveg";

export interface MenuItemVM {
  id: string;
  categoryId: string;
  category: string;
  name: string;
  price: number;
  description: string;
  foodType: FoodType;
  isAvailable: boolean;
  imageUrl?: string | null;
}

export interface CategoryVM {
  id: string;
  name: string;
  displayOrder: number;
}

export interface PortalMenu {
  items: MenuItemVM[];
  categories: string[];
  categoryIds: Record<string, string>;
  categoryOrders?: Record<string, number>;
}

export function mapMenuItem(item: MenuItem, categoryName: string): MenuItemVM {
  return {
    id: item.id,
    categoryId: item.category_id,
    category: categoryName,
    name: item.name,
    price: Number(item.base_price),
    description: item.description ?? "",
    foodType: item.is_veg ? "veg" : "nonveg",
    isAvailable: item.is_available,
    imageUrl: item.image_url ?? null,
  };
}

/** Flattens the backend's menu -> category -> item tree into list view models. */
export function mapMenu(menu: Menu | null): PortalMenu {
  const items: MenuItemVM[] = [];
  const categoryIds: Record<string, string> = {};
  const categoryOrders: Record<string, number> = {};

  const sortedCategories = [...(menu?.categories ?? [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );

  for (const category of sortedCategories) {
    categoryIds[category.name] = category.id;
    categoryOrders[category.name] = category.display_order ?? 0;
    for (const item of category.items ?? []) {
      items.push(mapMenuItem(item, category.name));
    }
  }

  return {
    items,
    categories: sortedCategories.map((c) => c.name),
    categoryIds,
    categoryOrders,
  };
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderLineVM {
  name: string;
  qty: number;
  unitPrice: number;
  note: string;
}

export interface OrderVM {
  id: string;
  /** Short display id, e.g. "#1042". */
  displayId: string;
  createdAt: string;
  time: string;
  customer: string;
  items: OrderLineVM[];
  total: number;
  status: PortalOrderStatus;
  backendStatus: string;
  note: string;
  isActionable: boolean;
  fulfillmentMode?: "DINE_IN" | "TAKEAWAY";
  isGameOrder?: boolean;
  gameTicketCode?: string;
  gamePlatformName?: string;
  gameDurationHours?: number;
  stationLabel?: string;
  scheduledPushAt?: string;
  autoPushed?: boolean;
}

export function maskCustomer(customerProfileId: string): string {
  const tail = customerProfileId.replace(/-/g, "").slice(-2).toUpperCase();
  return `User ***${tail}`;
}

/** Pulls any free-text the student recorded on an item's modifiers. */
function extractLineNote(snapshot: unknown): string {
  if (!snapshot) return "";
  if (typeof snapshot === "string") return snapshot.trim();
  if (Array.isArray(snapshot)) {
    return snapshot.map(extractLineNote).filter(Boolean).join(", ");
  }
  if (typeof snapshot === "object") {
    const record = snapshot as Record<string, unknown>;
    const text = record.note ?? record.notes ?? record.comment ?? record.name;
    return typeof text === "string" ? text.trim() : "";
  }
  return "";
}

export function mapOrder(order: Order): OrderVM {
  const lines = (order.items ?? []).map((item) => ({
    name: item.item_name_snapshot,
    qty: item.quantity,
    unitPrice: Number(item.unit_price_snapshot),
    note: extractLineNote(item.selected_modifiers_snapshot),
  }));

  const snap = (order.delivery_address_snapshot ?? {}) as Record<string, unknown>;
  const rawMode = String(snap.fulfillment_mode ?? snap.order_type ?? "").toUpperCase();
  const fulfillmentMode =
    rawMode === "DINE_IN" || rawMode === "TAKEAWAY"
      ? (rawMode as "DINE_IN" | "TAKEAWAY")
      : undefined;
  const gameTicketCode =
    typeof snap.game_ticket_code === "string" ? snap.game_ticket_code : undefined;
  const gamePlatformName =
    typeof snap.game_platform_name === "string" ? snap.game_platform_name : undefined;
  const gameDurationHours =
    typeof snap.game_duration_hours === "number" ? snap.game_duration_hours : undefined;
  const stationLabel =
    typeof snap.station_label === "string" ? snap.station_label : undefined;
  const scheduledPushAt =
    typeof snap.scheduled_push_at === "string" ? snap.scheduled_push_at : undefined;
  const autoPushed = Boolean(snap.auto_pushed);
  const isGameOrder = Boolean(snap.is_game_order || gameTicketCode);
  const snapInstructions =
    typeof snap.instructions === "string" ? snap.instructions.trim() : "";

  const combinedNotes = [
    snapInstructions,
    ...lines.map((l) => l.note).filter(Boolean),
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    id: order.id,
    displayId: `#${order.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`,
    createdAt: order.created_at,
    time: formatTime(order.created_at),
    customer: maskCustomer(order.customer_profile_id),
    items: lines,
    total: Number(order.total_amount),
    status: toPortalStatus(order.status),
    backendStatus: order.status,
    note: combinedNotes,
    isActionable: isStillActionable(order.status),
    fulfillmentMode,
    isGameOrder,
    gameTicketCode,
    gamePlatformName,
    gameDurationHours,
    stationLabel,
    scheduledPushAt,
    autoPushed,
  };
}

export function mapOrders(orders: Order[]): OrderVM[] {
  return (orders ?? []).map(mapOrder);
}

// ─── Dashboard metrics ────────────────────────────────────────────────────────

export interface DashboardMetrics {
  pending: number;
  today: number;
  available: number;
  unavailable: number;
  todayRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
}

export function computeMetrics(menu: PortalMenu, orders: OrderVM[]): DashboardMetrics {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const validOrders = orders.filter((o) => o.backendStatus !== BackendOrderStatus.CANCELLED);

  const todayOrders = validOrders.filter((o) => {
    const placed = new Date(o.createdAt);
    return !Number.isNaN(placed.getTime()) && placed.getTime() >= startOfToday.getTime();
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const todayCount = todayOrders.length;
  const totalRevenue = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const averageOrderValue =
    todayCount > 0
      ? todayRevenue / todayCount
      : validOrders.length > 0
        ? totalRevenue / validOrders.length
        : 0;

  const uniqueCustomers = new Set(
    validOrders.map((o) => o.customer).filter((c) => Boolean(c) && c !== "Student"),
  ).size;

  return {
    pending: orders.filter((o) => isPendingOrder(o.backendStatus)).length,
    today: todayCount,
    available: menu.items.filter((i) => i.isAvailable).length,
    unavailable: menu.items.filter((i) => !i.isAvailable).length,
    todayRevenue,
    averageOrderValue,
    totalCustomers: uniqueCustomers > 0 ? uniqueCustomers : validOrders.length,
  };
}

// ─── Branch ───────────────────────────────────────────────────────────────────

export interface BranchVM {
  id: string;
  brandId: string;
  name: string;
  address: string;
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
}

export function mapBranch(branch: Branch): BranchVM {
  return {
    id: branch.id,
    brandId: branch.brand_id,
    name: branch.name,
    address: branch.address_text,
    isOpen: branch.is_active,
    openingTime: branch.opening_time,
    closingTime: branch.closing_time,
  };
}
