/**
 * Search and Discovery Types
 * Used in Student app and campus search endpoints.
 */

export type SearchResultType = "restaurant" | "dish" | "category";

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  branch_id?: string;
  branch_name?: string;
  rating?: number;
  is_veg?: boolean;
}

export interface SearchResponse {
  results: SearchResultItem[];
  total_count: number;
  query?: string;
}

export interface SearchSuggestionsResponse {
  suggestions: string[];
}

export interface SearchQueryParams {
  q?: string;
  type?: string;
  is_veg?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
}
