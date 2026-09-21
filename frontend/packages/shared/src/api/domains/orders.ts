import type { ApiClientInstance } from "../client";
import type { BackendOrder, CreateOrderPayload, Order } from "../../types/order";

export async function createOrderApi(
  client: ApiClientInstance,
  payload: CreateOrderPayload,
): Promise<BackendOrder> {
  return client<BackendOrder>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getOrdersApi(
  client: ApiClientInstance,
  query?: { branch_id?: string; status?: string },
): Promise<BackendOrder[]> {
  const qs = new URLSearchParams();
  if (query?.branch_id) qs.set("branch_id", query.branch_id);
  if (query?.status) qs.set("status", query.status);
  const qsString = qs.toString();
  return client<BackendOrder[]>(`/orders${qsString ? `?${qsString}` : ""}`);
}

export async function getOrderByIdApi(
  client: ApiClientInstance,
  orderId: string,
): Promise<BackendOrder> {
  return client<BackendOrder>(`/orders/${orderId}`);
}

export async function updateOrderStatusApi(
  client: ApiClientInstance,
  orderId: string,
  status: string,
): Promise<Order> {
  return client<Order>(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function cancelOrderApi(
  client: ApiClientInstance,
  orderId: string,
  reason?: string,
): Promise<BackendOrder> {
  return client<BackendOrder>(`/orders/${orderId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ status: "CANCELLED", reason: reason || "Cancellation requested" }),
  });
}
