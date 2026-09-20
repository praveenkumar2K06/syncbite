/**
 * String and Text Formatting Utilities
 * Shared across Admin, Restaurant, and Student applications.
 */

/**
 * Generates an alphanumeric slug from a string.
 * Example: "Campus Rolls & Bowls" -> "campusrollsbowls"
 */
export function slugify(name: string): string {
  return (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Generates a memorable yet secure temp password for branch manager onboarding.
 * Matches credential generation logic used in admin app.
 */
export function generateSecurePassword(name = "SyncBite"): string {
  const clean = name.replace(/[^a-zA-Z]/g, "").slice(0, 6);
  const prefix =
    clean.length >= 3 ? clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase() : "Campus";
  const num = Math.floor(100 + Math.random() * 900);
  const specials = ["!", "@", "#", "$", "&"];
  const sym = specials[Math.floor(Math.random() * specials.length)];
  return `${prefix}@${num}${sym}2026`;
}

/**
 * Returns a display name for a user (either custom name or email local-part).
 */
export function displayName(user: { email: string; name?: string } | null | undefined): string {
  if (!user) return "";
  if (user.name) return user.name;
  const local = user.email ? user.email.split("@")[0] : "";
  return local || user.email || "";
}

/**
 * Truncates a string to maximum length with optional ellipsis.
 */
export function truncate(text: string, maxLength: number, suffix = "..."): string {
  if (!text || text.length <= maxLength) return text || "";
  return text.slice(0, maxLength) + suffix;
}

/**
 * Capitalizes first letter of each word or sentence.
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
