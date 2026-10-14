import type { ApiClientInstance } from "../client";
import type {
  AdminCoupon,
  CouponValidationResponse,
  ReviewModerationResult,
} from "../../types/cart";

export async function validateCouponApi(
  client: ApiClientInstance,
  code: string,
  cartTotal: number,
): Promise<CouponValidationResponse> {
  return client<CouponValidationResponse>("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code: code.trim().toUpperCase(), cart_total: cartTotal }),
  });
}

export async function applyCouponApi(
  client: ApiClientInstance,
  code: string,
  orderId: string,
): Promise<{ success: boolean; discount_amount: number }> {
  return client<{ success: boolean; discount_amount: number }>("/coupons/apply", {
    method: "POST",
    body: JSON.stringify({ code: code.trim().toUpperCase(), order_id: orderId }),
  });
}

export async function getCouponsApi(client: ApiClientInstance): Promise<AdminCoupon[]> {
  return client<AdminCoupon[]>("/coupons");
}

export async function createAdminCouponApi(
  client: ApiClientInstance,
  payload: {
    code: string;
    discount_type: "PERCENTAGE" | "FLAT";
    discount_value: number;
    min_order_amount?: number;
    max_discount_amount?: number;
    valid_from: string;
    valid_until: string;
    branch_id?: string;
  },
): Promise<AdminCoupon> {
  return client<AdminCoupon>("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function moderateReviewApi(
  client: ApiClientInstance,
  reviewId: string,
  isHidden: boolean,
  reason?: string,
): Promise<ReviewModerationResult> {
  return client<ReviewModerationResult>(`/reviews/${reviewId}/moderate`, {
    method: "PUT",
    body: JSON.stringify({ is_hidden: isHidden, moderation_reason: reason || null }),
  });
}
