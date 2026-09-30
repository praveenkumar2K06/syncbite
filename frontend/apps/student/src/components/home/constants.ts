export const TICKER_ITEMS = [
  "CAMPUS FOOD REIMAGINED",
  "SKIP THE QUEUE",
  "ORDER IN SECONDS",
  "PICK UP WHEN READY",
  "MADE FOR CAMPUS",
  "NO MORE WAITING",
  "GOOD FOOD AHEAD",
  "FRESH FROM THE KITCHEN",
];

export const ACCENT_PALETTE: Array<{ bg: string; text: string; border: string }> = [
  { bg: "#3A8F5E", text: "#ffffff", border: "#2E7A4F" },
  { bg: "#E87040", text: "#ffffff", border: "#C95C2E" },
  { bg: "#D92D57", text: "#ffffff", border: "#B5203F" },
  { bg: "#E8B84A", text: "#17232B", border: "#C99C2E" },
  { bg: "#C0433A", text: "#ffffff", border: "#9E3028" },
  { bg: "#2A9D8F", text: "#ffffff", border: "#1F7D71" },
  { bg: "#7C5CBF", text: "#ffffff", border: "#6849A0" },
];

export function getAccent(idx: number) {
  return ACCENT_PALETTE[idx % ACCENT_PALETTE.length]!;
}

export function applyPageEffect(type: "stretch" | "jello") {
  const root = document.getElementById("root");
  if (!root) return;
  root.classList.remove("page-stretch", "page-jello");
  void root.offsetWidth; // force reflow so re-triggering restarts the animation
  root.classList.add(type === "stretch" ? "page-stretch" : "page-jello");
  setTimeout(() => root.classList.remove("page-stretch", "page-jello"), 800);
}
