import { apiClient } from "./client";

import {
  getBranchReviewsApi as sharedGetBranchReviews,
  getBranchRatingSummaryApi as sharedGetBranchRatingSummary,
  createReviewApi as sharedCreateReview,
} from "@syncbite/shared";

import type { ReviewResponse, RatingSummary } from "@syncbite/shared";

export type { ReviewResponse, RatingSummary };

export async function getBranchReviewsApi(branchId: string): Promise<ReviewResponse[]> {
  return sharedGetBranchReviews(apiClient, branchId);
}

export async function getBranchRatingSummaryApi(branchId: string): Promise<RatingSummary> {
  return sharedGetBranchRatingSummary(apiClient, branchId);
}

export async function createReviewApi(
  branchId: string,
  rating: number,
  comment?: string,
  orderId?: string,
): Promise<ReviewResponse> {
  return sharedCreateReview(apiClient, {
    branch_id: branchId,
    rating,
    comment,
    order_id: orderId,
  });
}
