import { apiClient } from "./client";
import type { CartItem, Order } from "@/types";

import {
  createOrderApi as sharedCreateOrder,
  getOrdersApi as sharedGetOrders,
  getOrderByIdApi as sharedGetOrderById,
  cancelOrderApi as sharedCancelOrder,
  toStudentStatus,
} from "@syncbite/shared";

import type { BackendOrderItem, BackendOrder, CreateOrderPayload } from "@syncbite/shared";

export type { BackendOrderItem, BackendOrder, CreateOrderPayload };

export async function createOrderApi(payload: CreateOrderPayload): Promise<BackendOrder> {
  return sharedCreateOrder(apiClient, payload);
}

export async function getOrdersApi(): Promise<BackendOrder[]> {
  return sharedGetOrders(apiClient);
}

export async function getOrderByIdApi(orderId: string): Promise<BackendOrder> {
  return sharedGetOrderById(apiClient, orderId);
}

export async function cancelOrderApi(orderId: string, reason?: string): Promise<BackendOrder> {
  return sharedCancelOrder(apiClient, orderId, reason);
}

/**
 * Normalizes backend order status to frontend UI status via shared utility.
 */
export function mapBackendStatusToUi(backendStatus: string): Order["status"] {
  return toStudentStatus(backendStatus);
}

/**
 * Adapts a BackendOrder to the frontend Order shape.
 */
export function adaptBackendOrderToUi(
  backendOrder: BackendOrder,
  branchName = "Campus Stall",
): Order {
  const items: CartItem[] = (backendOrder.items || []).map((item) => ({
    menuItem: {
      id: item.menu_item_id,
      name: item.item_name_snapshot || "Menu Item",
      description: "",
      price: item.unit_price_snapshot,
      category: "popular",
      image: "",
      isVeg: true,
    },
    quantity: item.quantity,
    restaurantId: backendOrder.branch_id,
  }));

  const createdDate = new Date(backendOrder.created_at);
  const timeStr = createdDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const snap = backendOrder.delivery_address_snapshot || {};
  const rawMode = (snap.fulfillment_mode || snap.order_type || "").toUpperCase();
  const fulfillmentMode =
    rawMode === "DINE_IN" || rawMode === "TAKEAWAY" ? rawMode : undefined;

  return {
    id: `SAT-${backendOrder.id.slice(0, 8).toUpperCase()}`,
    restaurantId: backendOrder.branch_id,
    restaurantName: snap.branch_name || branchName,
    items,
    total: backendOrder.total_amount,
    pickupTime: snap.pickup_time || timeStr,
    date: snap.date || dateStr,
    status: mapBackendStatusToUi(backendOrder.status),
    fulfillmentMode,
    gameTicketCode: snap.game_ticket_code || undefined,
    gamePlatformName: snap.game_platform_name || undefined,
    scheduledPushAt: snap.scheduled_push_at || undefined,
    autoPushed: Boolean(snap.auto_pushed),
  };
}
