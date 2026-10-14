export const ACCENT_PALETTE: Array<{ bg: string; text: string; border: string }> = [
  { bg: "#4F8B68", text: "#fff", border: "#17232B" },
  { bg: "#E8B84A", text: "#17232B", border: "#17232B" },
  { bg: "#D92D57", text: "#fff", border: "#17232B" },
  { bg: "#F7B28F", text: "#17232B", border: "#17232B" },
  { bg: "#17232B", text: "#FFFDF8", border: "#17232B" },
  { bg: "#7C5CBF", text: "#fff", border: "#17232B" },
  { bg: "#2A9D8F", text: "#fff", border: "#17232B" },
];

export function getAccent(idx: number) {
  return ACCENT_PALETTE[idx % ACCENT_PALETTE.length] ?? ACCENT_PALETTE[0]!;
}

export const BROWSE_HUMOR_LINES = [
  "Every stall judging you for not picking yet.",
  "All six are great. That's the problem.",
  "Swipe your indecision away.",
  "Your stomach called. It has opinions.",
  "Pro tip: open all six and panic equally.",
  "The queue is moving. Are you?",
];

export type BrowseFilterKey = "all" | "open" | "veg_only" | "has_veg";

export const BROWSE_FILTER_TABS: Array<{ key: BrowseFilterKey; label: string }> = [
  { key: "all", label: "All Restaurants" },
  { key: "open", label: "Open Now" },
  { key: "veg_only", label: "🌱 100% Pure Veg" },
  { key: "has_veg", label: "Veg Options" },
];
