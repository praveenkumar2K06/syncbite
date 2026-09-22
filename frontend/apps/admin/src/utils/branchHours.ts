export function isBranchOpenNow(openTime?: string, closeTime?: string, now = new Date()): boolean {
  if (!openTime || !closeTime) return false;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMinute] = openTime.split(":").map(Number);
  const [closeHour, closeMinute] = closeTime.split(":").map(Number);
  const opensAt = openHour * 60 + (openMinute || 0);
  const closesAt = closeHour * 60 + (closeMinute || 0);
  return closesAt >= opensAt
    ? currentMinutes >= opensAt && currentMinutes <= closesAt
    : currentMinutes >= opensAt || currentMinutes <= closesAt;
}
