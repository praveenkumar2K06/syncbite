/**
 * SyncBite Student API Client
 * Built using @syncbite/shared createApiClient.
 */

import { ApiError, createApiClient, type ApiErrorPayload } from "@syncbite/shared";

export const ACCESS_TOKEN_KEY = "sat_access_token";
export const REFRESH_TOKEN_KEY = "sat_refresh_token";
export const AUTH_USER_KEY = "sat_auth_user";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

const clientInstance = createApiClient({
  baseUrl: API_BASE_URL,
  accessTokenKey: ACCESS_TOKEN_KEY,
  refreshTokenKey: REFRESH_TOKEN_KEY,
  userKey: AUTH_USER_KEY,
});

export const apiClient = clientInstance;
export const getAccessToken = clientInstance.getAccessToken;
export const getRefreshToken = clientInstance.getRefreshToken;
export const setTokens = clientInstance.setTokens;
export const clearTokens = clientInstance.clearTokens;
export const onSessionExpired = clientInstance.onSessionExpired;

export { ApiError, type ApiErrorPayload };
