import { apiClient } from "./client";

import {
  searchApi as sharedSearch,
  getSearchSuggestionsApi as sharedGetSearchSuggestions,
} from "@syncbite/shared";

import type {
  SearchResultItem,
  SearchResponse,
  SearchSuggestionsResponse,
} from "@syncbite/shared";

export type { SearchResultItem, SearchResponse, SearchSuggestionsResponse };

export async function searchApi(params: {
  q?: string;
  type?: string;
  is_veg?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
}): Promise<SearchResponse> {
  return sharedSearch(apiClient, params);
}

export async function getSearchSuggestionsApi(q: string): Promise<SearchSuggestionsResponse> {
  return sharedGetSearchSuggestions(apiClient, q);
}
