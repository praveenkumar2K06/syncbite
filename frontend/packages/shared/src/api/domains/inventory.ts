import type { ApiClientInstance } from "../client";

export interface KitchenUnit {
  id: string;
  branch_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KitchenCreateRequest {
  branch_id: string;
  name?: string;
  is_active?: boolean;
}

export interface KitchenUpdateRequest {
  name?: string;
  is_active?: boolean;
}

export interface InventoryItem {
  id: string;
  branch_id: string;
  menu_item_id: string;
  quantity: number;
  is_in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export async function listBranchKitchensApi(
  client: ApiClientInstance,
  branchId: string,
): Promise<KitchenUnit[]> {
  return client<KitchenUnit[]>(`/branches/${branchId}/kitchens`);
}

export async function createKitchenApi(
  client: ApiClientInstance,
  payload: KitchenCreateRequest,
): Promise<KitchenUnit> {
  return client<KitchenUnit>("/kitchens", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateKitchenApi(
  client: ApiClientInstance,
  kitchenId: string,
  payload: KitchenUpdateRequest,
): Promise<KitchenUnit> {
  return client<KitchenUnit>(`/kitchens/${kitchenId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteKitchenApi(
  client: ApiClientInstance,
  kitchenId: string,
): Promise<void> {
  await client<void>(`/kitchens/${kitchenId}`, {
    method: "DELETE",
  });
}

export async function getBranchInventoryApi(
  client: ApiClientInstance,
  branchId: string,
): Promise<InventoryItem[]> {
  return client<InventoryItem[]>(`/branches/${branchId}/inventory`);
}

export async function initItemInventoryApi(
  client: ApiClientInstance,
  branchId: string,
  menuItemId: string,
  initialQuantity = 0,
): Promise<InventoryItem> {
  return client<InventoryItem>(`/branches/${branchId}/inventory`, {
    method: "POST",
    body: JSON.stringify({
      menu_item_id: menuItemId,
      initial_quantity: initialQuantity,
    }),
  });
}

export async function updateStockApi(
  client: ApiClientInstance,
  inventoryId: string,
  payload: {
    quantity: number;
    is_in_stock?: boolean | null;
    reason?: string;
  },
): Promise<InventoryItem> {
  return client<InventoryItem>(`/inventory/${inventoryId}/stock`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity: Math.max(0, payload.quantity),
      is_in_stock: payload.is_in_stock,
      reason: payload.reason ?? "MERCHANT_RESTOCK",
    }),
  });
}
