/**
 * Deployment-specific configuration values.
 *
 * Everything here is driven by Vite environment variables (see `.env.example`)
 * so one build can be pointed at different environments without editing source.
 */

/**
 * Relative by default (`/api/v1`) so the Vite dev proxy forwards requests to the
 * backend target (configured via VITE_API_PROXY_TARGET). Set VITE_API_URL to an
 * absolute URL for staging/production (e.g. https://api.syncbite.app/api/v1).
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

/**
 * Pre-configured branch (outlet) ID if this portal is pre-pinned to a specific outlet.
 * Falls back to resolving ownership from the signed-in account and local storage.
 */
export const CONFIGURED_BRANCH_ID = (import.meta.env.VITE_BRANCH_ID || "").trim();
