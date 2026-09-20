/**
 * Validation Utilities
 * Common validation helpers for forms and data inputs across frontends.
 */

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  // Indian 10-digit mobile phone standard with optional +91
  const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}

export function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

export function isPositiveNumber(val: unknown): val is number {
  return typeof val === "number" && !Number.isNaN(val) && val > 0;
}
