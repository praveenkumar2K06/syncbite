import type { ApiClientInstance } from "../client";
import type { BackendCart, CartValidationResponse } from "../../types/cart";

export async function getCartApi(client: ApiClientInstance): Promise<BackendCart> {
  return client<BackendCart>("/cart");
}

export async function addCartItemApi(
  client: ApiClientInstance,
  branchId: string,
  menuItemId: string,
  quantity = 1,
  selectedModifiers?: unknown,
): Promise<BackendCart> {
  return client<BackendCart>("/cart/items", {
    method: "POST",
    body: JSON.stringify({
      branch_id: branchId,
      menu_item_id: menuItemId,
      quantity,
      selected_modifiers: selectedModifiers,
    }),
  });
}

export async function updateCartItemQtyApi(
  client: ApiClientInstance,
  itemId: string,
  quantity: number,
): Promise<BackendCart> {
  return client<BackendCart>(`/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItemApi(
  client: ApiClientInstance,
  itemId: string,
): Promise<BackendCart> {
  return client<BackendCart>(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export async function clearCartApi(client: ApiClientInstance): Promise<void> {
  return client<void>("/cart", {
    method: "DELETE",
  });
}

export async function validateCartApi(client: ApiClientInstance): Promise<CartValidationResponse> {
  return client<CartValidationResponse>("/cart/validate", {
    method: "POST",
  });
}
