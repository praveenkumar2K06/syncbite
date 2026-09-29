import { apiClient } from "./client";

import {
  validateCouponApi as sharedValidateCoupon,
  applyCouponApi as sharedApplyCoupon,
} from "@syncbite/shared";

import type { CouponValidationResponse } from "@syncbite/shared";

export type { CouponValidationResponse };

export async function validateCouponApi(
  code: string,
  cartTotal: number,
): Promise<CouponValidationResponse> {
  return sharedValidateCoupon(apiClient, code, cartTotal);
}

export async function applyCouponApi(
  code: string,
  orderId: string,
): Promise<{ success: boolean; discount_amount: number }> {
  return sharedApplyCoupon(apiClient, code, orderId);
}
