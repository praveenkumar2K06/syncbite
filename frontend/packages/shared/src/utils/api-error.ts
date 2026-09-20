/**
 * Standardized API Error Class and Guards
 * Shared across Student, Restaurant, and Admin API clients.
 */

import type { ApiErrorPayload } from "../types/common";
export type { ApiErrorPayload };

export class ApiError extends Error {
  readonly status: number;
  readonly errorCode?: string;
  readonly details?: unknown;

  constructor(status: number, message: string, errorCode?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;

    // Restore prototype chain for instanceof checks across bundles
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromPayload(status: number, payload?: ApiErrorPayload): ApiError {
    const message = payload?.message || `Request failed with status ${status}`;
    return new ApiError(status, message, payload?.error_code, payload?.detail);
  }
}

export function isApiError(err: unknown): err is ApiError {
  return (
    err instanceof ApiError ||
    (Boolean(err) &&
      typeof err === "object" &&
      (err as ApiError).name === "ApiError" &&
      typeof (err as ApiError).status === "number")
  );
}
