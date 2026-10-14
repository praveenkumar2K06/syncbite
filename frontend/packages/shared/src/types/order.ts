/**
 * Order Domain Types, Statuses, and Progression Enums
 * Shared across Student, Restaurant, and Admin applications.
 */

/** Canonical statuses recognized by backend PATCH /orders/{id}/status */
export const BackendOrderStatus = {
  SCHEDULED: "SCHEDULED",
  PLACED: "PLACED",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  READY: "READY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type BackendOrderStatusValue = (typeof BackendOrderStatus)[keyof typeof BackendOrderStatus];

/** Tab-oriented statuses grouped by the restaurant portal UI */
export type PortalOrderStatus = "new" | "preparing" | "ready" | "completed" | "cancelled";

/** Lowercase order statuses used by the student UI */
export type StudentOrderStatus =
  | "scheduled"
  | "placed"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface OrderAction {
  status: string;
  label: string;
}

export interface OrderTab {
  key: PortalOrderStatus;
  label: string;
}

export interface BackendOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name_snapshot: string;
  name?: string | null;
  unit_price_snapshot: number;
  price_snapshot?: number | string | null;
  price?: number | string | null;
  quantity: number;
  selected_modifiers_snapshot?: any;
  created_at?: string;
}

export type OrderItem = BackendOrderItem;

export interface OrderStatusLog {
  id: string;
  order_id: string;
  previous_status: string | null;
  new_status: string;
  status?: OrderStatus | string;
  changed_by_user_id: string;
  created_at: string;
}

export type OrderStatus =
  | "SCHEDULED"
  | "PLACED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

export interface BackendOrder {
  id: string;
  customer_profile_id: string;
  branch_id: string;
  total_amount: number;
  status: OrderStatus | string;
  delivery_address_snapshot?: any;
  created_at: string;
  updated_at: string;
  payment_method?: string | null;
  payment_id?: string | null;
  payment_status?: string | null;
  items: OrderItem[];
  status_logs?: OrderStatusLog[];
}

export type Order = BackendOrder;

export interface OrderApiRecord extends BackendOrder {
  status: OrderStatus;
}

export interface CreateOrderPayload {
  branch_id: string;
  items: Array<{
    menu_item_id: string;
    quantity: number;
    selected_modifiers_snapshot?: any;
  }>;
  delivery_address_snapshot?: any;
}

export type OrderMode = "now" | "schedule";
