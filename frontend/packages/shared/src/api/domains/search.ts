import type { ApiClientInstance } from "../client";
import type { SearchResponse, SearchSuggestionsResponse } from "../../types/search";

export async function searchApi(
  client: ApiClientInstance,
  params: {
    q?: string;
    type?: string;
    is_veg?: boolean;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
  },
): Promise<SearchResponse> {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.set("q", params.q);
  if (params.type) queryParams.set("type", params.type);
  if (params.is_veg !== undefined) queryParams.set("is_veg", String(params.is_veg));
  if (params.min_price !== undefined) queryParams.set("min_price", String(params.min_price));
  if (params.max_price !== undefined) queryParams.set("max_price", String(params.max_price));
  if (params.sort_by) queryParams.set("sort_by", params.sort_by);

  const qs = queryParams.toString();
  return client<SearchResponse>(`/search${qs ? `?${qs}` : ""}`);
}

export async function getSearchSuggestionsApi(
  client: ApiClientInstance,
  q: string,
): Promise<SearchSuggestionsResponse> {
  return client<SearchSuggestionsResponse>(`/search/suggestions?q=${encodeURIComponent(q)}`);
}
