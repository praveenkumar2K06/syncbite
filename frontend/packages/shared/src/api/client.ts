/**
 * Factory and helper types for creating standardized API clients across apps.
 */

import { ApiError, type ApiErrorPayload } from "../utils/api-error";

export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export function createLocalStorageAdapter(): StorageAdapter {
  return {
    get: (key: string) => {
      try {
        return typeof localStorage === "undefined" ? null : localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set: (key: string, value: string) => {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(key, value);
        }
      } catch {
        // safe no-op
      }
    },
    remove: (key: string) => {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(key);
        }
      } catch {
        // safe no-op
      }
    },
  };
}

export interface ApiClientConfig {
  baseUrl: string;
  accessTokenKey: string;
  refreshTokenKey: string;
  userKey?: string;
  storage?: StorageAdapter;
  refreshEndpoint?: string;
  onSessionExpired?: () => void;
}

export interface ApiClientInstance {
  <T>(endpoint: string, options?: RequestInit): Promise<T>;
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(access: string, refresh?: string | null): void;
  clearTokens(): void;
  onSessionExpired(handler: () => void): void;
  getBaseUrl(): string;
}

/**
 * Creates a configured API client function with token management,
 * automatic 401 refresh queueing, and structured error throwing.
 */
export function createApiClient(config: ApiClientConfig): ApiClientInstance {
  const storage = config.storage || createLocalStorageAdapter();
  const refreshEndpoint = config.refreshEndpoint || "/auth/refresh";

  let sessionExpiredHandler: (() => void) | null = config.onSessionExpired || null;
  let isRefreshing = false;
  let refreshSubscribers: Array<(token: string) => void> = [];

  function subscribeTokenRefresh(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
  }

  function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
  }

  function getAccessToken(): string | null {
    return storage.get(config.accessTokenKey);
  }

  function getRefreshToken(): string | null {
    return storage.get(config.refreshTokenKey);
  }

  function setTokens(access: string, refresh?: string | null) {
    storage.set(config.accessTokenKey, access);
    if (refresh) {
      storage.set(config.refreshTokenKey, refresh);
    }
  }

  function clearTokens() {
    storage.remove(config.accessTokenKey);
    storage.remove(config.refreshTokenKey);
    if (config.userKey) {
      storage.remove(config.userKey);
    }
  }

  function notifySessionExpired() {
    clearTokens();
    if (sessionExpiredHandler) {
      try {
        sessionExpiredHandler();
      } catch (e) {
        console.error("[ApiClient] Error in onSessionExpired handler", e);
      }
    }
  }

  function buildUrl(endpoint: string): string {
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      return endpoint;
    }
    const base = config.baseUrl.replace(/\/+$/, "");
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }

  async function refreshAuthTokens(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(buildUrl(refreshEndpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        notifySessionExpired();
        return null;
      }

      const data = (await response.json()) as { access_token?: string; refresh_token?: string };
      if (data.access_token) {
        setTokens(data.access_token, data.refresh_token || refreshToken);
        return data.access_token;
      }
      return null;
    } catch {
      return null;
    }
  }

  async function parseResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      let errData: ApiErrorPayload = {};
      try {
        errData = (await res.json()) as ApiErrorPayload;
      } catch {
        // ignore JSON parse failure
      }
      const message =
        errData.message ||
        (typeof errData.detail === "string" ? errData.detail : undefined) ||
        `Request failed with status ${res.status}`;
      throw new ApiError(res.status, message, errData.error_code, errData.detail);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return res.json() as Promise<T>;
  }

  const client = async function <T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = new Headers(options.headers || {});

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const token = getAccessToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, { ...options, headers });

    // Handle 401 Unauthorized with automatic refresh & retry
    if (response.status === 401 && getRefreshToken() && !endpoint.includes("/auth/")) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAuthTokens();
        isRefreshing = false;
        if (newToken) {
          onRefreshed(newToken);
        } else {
          notifySessionExpired();
          throw new ApiError(401, "Session expired, please sign in again.", "UNAUTHORIZED");
        }
      }

      return new Promise<T>((resolve, reject) => {
        subscribeTokenRefresh(async (newToken) => {
          try {
            headers.set("Authorization", `Bearer ${newToken}`);
            const retryRes = await fetch(url, { ...options, headers });
            resolve(await parseResponse<T>(retryRes));
          } catch (err) {
            reject(err);
          }
        });
      });
    }

    return parseResponse<T>(response);
  } as ApiClientInstance;

  client.getAccessToken = getAccessToken;
  client.getRefreshToken = getRefreshToken;
  client.setTokens = setTokens;
  client.clearTokens = clearTokens;
  client.onSessionExpired = (handler: () => void) => {
    sessionExpiredHandler = handler;
  };
  client.getBaseUrl = () => config.baseUrl;

  return client;
}
