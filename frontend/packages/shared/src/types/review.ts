/**
 * Review and Rating Types
 * Shared across Student, Restaurant, and Admin applications.
 */

export interface Review {
  id: string;
  order_id?: string | null;
  customer_profile_id: string;
  branch_id: string;
  rating: number;
  comment: string | null;
  merchant_reply?: string | null;
  is_hidden?: boolean;
  created_at: string;
  updated_at?: string;
}

export type ReviewResponse = Review;

export interface RatingSummary {
  branch_id: string;
  average_rating: number;
  total_reviews: number;
  rating_distribution?: Record<string | number, number>;
}
