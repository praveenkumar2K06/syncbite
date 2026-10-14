/**
 * Date and Time Formatting Utilities
 * Standardizes time and relative time formatting across apps.
 */

/**
 * Formats an ISO string, timestamp, or Date into human relative time.
 * Example: "just now", "5m ago", "2h ago", "3d ago"
 */
export function formatRelativeTime(input: string | number | Date): string {
  const time = typeof input === "object" ? input.getTime() : new Date(input).getTime();
  if (Number.isNaN(time)) return "";

  const diff = Date.now() - time;
  if (diff < 0) return "just now";

  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;

  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;

  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/**
 * Alias matching admin's relTime()
 */
export const relTime = formatRelativeTime;

/**
 * Formats an ISO string or Date into localized readable date.
 * Example: "5 Oct 2026"
 */
export function formatDate(
  input: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
): string {
  const date = typeof input === "object" ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, options);
}

/**
 * Formats an ISO string or Date into readable time.
 * Example: "10:30 AM"
 */
export function formatTime(
  input: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  },
): string {
  const date = typeof input === "object" ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, options);
}

/**
 * Converts backend HH:MM:SS to HH:MM for HTML <input type="time">.
 */
export function toTimeInput(value: string | null | undefined): string {
  return (value || "").slice(0, 5);
}

/**
 * Converts HH:MM from HTML <input type="time"> to backend HH:MM:SS.
 */
export function fromTimeInput(value: string | null | undefined): string {
  if (!value) return "";
  return value.length === 5 ? `${value}:00` : value;
}

/**
 * Checks if current local time falls within configured branch operating hours.
 * Supports standard hours (e.g. 08:00 to 23:00) and overnight spans (e.g. 20:00 to 03:00).
 */
export function isBranchOperatingNow(
  openingTime: string | null | undefined,
  closingTime: string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!openingTime || !closingTime) return true;
  const pad = (n: number) => String(n).padStart(2, "0");
  const nowHhMmSs = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const op = openingTime.length === 5 ? `${openingTime}:00` : openingTime;
  const cl = closingTime.length === 5 ? `${closingTime}:00` : closingTime;

  if (op <= cl) {
    return nowHhMmSs >= op && nowHhMmSs <= cl;
  }
  // Overnight operating hours (crosses midnight)
  return nowHhMmSs >= op || nowHhMmSs <= cl;
}
