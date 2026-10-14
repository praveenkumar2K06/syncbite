import type { ApiClientInstance } from "../client";
import type { Review, ReviewResponse, RatingSummary } from "../../types/review";

export async function getBranchReviewsApi(
  client: ApiClientInstance,
  branchId: string,
): Promise<ReviewResponse[]> {
  return client<ReviewResponse[]>(`/reviews/branches/${branchId}/reviews`).catch(async () => {
    return client<Review[]>(`/branches/${branchId}/reviews`);
  });
}

export async function getBranchRatingSummaryApi(
  client: ApiClientInstance,
  branchId: string,
): Promise<RatingSummary> {
  return client<RatingSummary>(`/reviews/branches/${branchId}/rating-summary`).catch(async () => {
    return client<RatingSummary>(`/branches/${branchId}/rating-summary`);
  });
}

export async function createReviewApi(
  client: ApiClientInstance,
  payload: {
    branch_id: string;
    rating: number;
    comment?: string;
    order_id?: string;
  },
): Promise<ReviewResponse> {
  return client<ReviewResponse>("/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
