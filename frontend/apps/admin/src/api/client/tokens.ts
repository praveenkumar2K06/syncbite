import { readStoredValue, removeStoredValue, writeStoredValue } from "../../utils/storage";

export const ACCESS_TOKEN_KEY = "sat_admin_access";
export const REFRESH_TOKEN_KEY = "sat_admin_refresh";

export function getAccessToken(): string | null {
  return readStoredValue(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return readStoredValue(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh?: string | null) {
  writeStoredValue(ACCESS_TOKEN_KEY, access);
  if (refresh) writeStoredValue(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  removeStoredValue(ACCESS_TOKEN_KEY);
  removeStoredValue(REFRESH_TOKEN_KEY);
}
