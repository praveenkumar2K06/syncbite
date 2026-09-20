/**
 * User-facing error message formatter shared across portals.
 */

import { ApiError } from "./api-error";

export function toUserMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (err instanceof ApiError) {
    if (err.errorCode === "INVALID_CREDENTIALS") {
      return "Incorrect email or password.";
    }
    if (err.errorCode === "USER_INACTIVE") {
      return "This account has been deactivated. Contact the platform admin.";
    }
    if (err.errorCode === "ROLE_NOT_AUTHORIZED") {
      return "Your account does not have access to this action.";
    }
    if (err.errorCode === "BRANCH_UPDATE_FORBIDDEN" || err.errorCode === "BRANCH_FORBIDDEN") {
      return "This account does not manage that outlet. Pick your own outlet in Settings.";
    }
    if (err.errorCode === "ILLEGAL_STATUS_TRANSITION") {
      return "That order already moved on. Refreshing the list.";
    }
    if (err.errorCode === "ENTITY_NOT_FOUND") {
      return "That record no longer exists. Refresh and try again.";
    }
    if (err.status === 0 || err.status === 422) {
      return "The server rejected that change. Check the values and try again.";
    }
    return err.message || fallback;
  }
  if (err instanceof TypeError) {
    return "Cannot reach the server. Check your connection and try again.";
  }
  return fallback;
}
