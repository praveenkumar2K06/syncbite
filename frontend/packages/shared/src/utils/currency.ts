/**
 * Currency and Price Formatting Utilities
 * Standardizes rupee formatting across all 3 apps.
 */

/**
 * Formats a numeric price into a rupee string.
 * Example:
 *   formatCurrency(150) -> "₹150"
 *   formatCurrency(150.5) -> "₹150.50"
 */
export function formatCurrency(value: number, options: { showDecimals?: boolean } = {}): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "₹0";
  }

  if (options.showDecimals) {
    return `₹${value.toFixed(2)}`;
  }

  return Number.isInteger(value) ? `₹${value}` : `₹${value.toFixed(2)}`;
}

/**
 * Compact currency formatter for high amounts (analytics, dashboard cards).
 * Example:
 *   formatCompactCurrency(150000) -> "₹1.5L"
 *   formatCompactCurrency(4500) -> "₹4.5K"
 *   formatCompactCurrency(250) -> "₹250"
 */
export function formatCompactCurrency(n: number): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "₹0";
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

/**
 * Alias for formatCompactCurrency, matching admin dashboard's fmt()
 */
export const fmt = formatCompactCurrency;

/**
 * Portal-style money formatter.
 * Integer -> "₹80", decimal -> "₹80.50".
 */
export function formatMoney(value: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "₹0";
  return Number.isInteger(value) ? `₹${value}` : `₹${value.toFixed(2)}`;
}

/**
 * Safely parses any price string or number into a valid float.
 */
export function parseCurrency(val: string | number): number {
  if (typeof val === "number") return Number.isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^0-9.-]+/g, "");
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}
