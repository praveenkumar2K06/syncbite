/**
 * SyncBite Admin API Client
 * Uses @syncbite/shared createApiClient configured with admin token keys.
 */

import { ApiError, createApiClient, type ApiErrorPayload } from "@syncbite/shared";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./tokens";
import { readStoredValue, removeStoredValue, writeStoredValue } from "../../utils/storage";

export { ApiError, type ApiErrorPayload };

/**
 * Relative by default so the Vite dev proxy forwards /api/v1 to the local
 * backend (override the target with VITE_API_PROXY_TARGET). Set VITE_API_URL to
 * an absolute URL for staging/production — never hardcode a host in source.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

const adminStorageAdapter = {
  get: (key: string) => readStoredValue(key),
  set: (key: string, value: string) => {
    writeStoredValue(key, value);
  },
  remove: (key: string) => {
    removeStoredValue(key);
  },
};

export const apiClient = createApiClient({
  baseUrl: API_BASE_URL,
  accessTokenKey: ACCESS_TOKEN_KEY,
  refreshTokenKey: REFRESH_TOKEN_KEY,
  storage: adminStorageAdapter,
});
