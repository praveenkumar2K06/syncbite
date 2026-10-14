import { apiClient } from "./client";

import {
  getCartApi as sharedGetCart,
  addCartItemApi as sharedAddCartItem,
  updateCartItemQtyApi as sharedUpdateCartItemQty,
  removeCartItemApi as sharedRemoveCartItem,
  clearCartApi as sharedClearCart,
  validateCartApi as sharedValidateCart,
} from "@syncbite/shared";

import type { BackendCartItem, BackendCart, CartValidationResponse } from "@syncbite/shared";

export type { BackendCartItem, BackendCart, CartValidationResponse };

export async function getCartApi(): Promise<BackendCart> {
  return sharedGetCart(apiClient);
}

export async function addCartItemApi(
  branchId: string,
  menuItemId: string,
  quantity = 1,
  selectedModifiers?: any,
): Promise<BackendCart> {
  return sharedAddCartItem(apiClient, branchId, menuItemId, quantity, selectedModifiers);
}

export async function updateCartItemQtyApi(itemId: string, quantity: number): Promise<BackendCart> {
  return sharedUpdateCartItemQty(apiClient, itemId, quantity);
}

export async function removeCartItemApi(itemId: string): Promise<BackendCart> {
  return sharedRemoveCartItem(apiClient, itemId);
}

export async function clearCartApi(): Promise<void> {
  return sharedClearCart(apiClient);
}

export async function validateCartApi(): Promise<CartValidationResponse> {
  return sharedValidateCart(apiClient);
}
