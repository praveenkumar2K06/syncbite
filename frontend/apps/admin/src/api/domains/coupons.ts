import { apiClient } from "../client";
import {
  getCouponsApi as sharedGetCouponsApi,
  createAdminCouponApi as sharedCreateAdminCouponApi,
  moderateReviewApi as sharedModerateReviewApi,
  type AdminCoupon,
  type ReviewModerationResult,
} from "@syncbite/shared";

export type { AdminCoupon, ReviewModerationResult };

export async function getCouponsApi(): Promise<AdminCoupon[]> {
  return sharedGetCouponsApi(apiClient);
}

export async function createAdminCouponApi(payload: {
  code: string;
  discount_type: "PERCENTAGE" | "FLAT";
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  valid_from: string;
  valid_until: string;
  branch_id?: string;
}): Promise<AdminCoupon> {
  return sharedCreateAdminCouponApi(apiClient, payload);
}

export async function moderateReviewApi(
  reviewId: string,
  isHidden: boolean,
  reason?: string,
): Promise<ReviewModerationResult> {
  return sharedModerateReviewApi(apiClient, reviewId, isHidden, reason);
}
