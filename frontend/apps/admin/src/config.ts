/**
 * Deployment-specific values.
 *
 * Everything here is driven by Vite env vars (see `.env.example`) so one build
 * can be pointed at different environments without editing source. Do not
 * hardcode hosts, ports, or paths in components.
 */

/**
 * Where a restaurant manager signs in. Printed on the credential files the
 * dashboard generates, so it must match the deployed restaurant portal.
 */
export const RESTAURANT_PORTAL_URL =
  import.meta.env.VITE_RESTAURANT_PORTAL_URL || "http://localhost:8444";
