import { apiClient } from "../client";
import {
  getOrdersApi as sharedGetOrdersApi,
  getOrderByIdApi as sharedGetOrderByIdApi,
  updateOrderStatusApi as sharedUpdateOrderStatusApi,
  cancelOrderApi as sharedCancelOrderApi,
  type OrderStatus,
  type OrderApiRecord,
} from "@syncbite/shared";

export type { OrderStatus, OrderApiRecord };

export async function getOrdersApi(params?: {
  branch_id?: string;
  status?: OrderStatus;
}): Promise<OrderApiRecord[]> {
  const orders = await sharedGetOrdersApi(apiClient, params);
  return orders as unknown as OrderApiRecord[];
}

export async function getOrderByIdApi(id: string): Promise<OrderApiRecord> {
  const order = await sharedGetOrderByIdApi(apiClient, id);
  return order as unknown as OrderApiRecord;
}

export async function updateOrderStatusApi(
  id: string,
  status: OrderStatus,
): Promise<OrderApiRecord> {
  const order = await sharedUpdateOrderStatusApi(apiClient, id, status);
  return order as unknown as OrderApiRecord;
}

export async function cancelOrderApi(id: string, reason = "Cancelled by Admin"): Promise<void> {
  await sharedCancelOrderApi(apiClient, id, reason);
}
