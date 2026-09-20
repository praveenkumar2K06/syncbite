/**
 * Common Types and Primitives
 * Shared across Student, Restaurant, and Admin applications.
 */

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastState {
  msg: string;
  type?: ToastType;
}

export type ToastInfo = ToastState;

export interface ApiErrorPayload {
  error_code?: string;
  message?: string;
  detail?: string | Record<string, unknown> | Array<unknown>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page?: number;
  page_size?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
