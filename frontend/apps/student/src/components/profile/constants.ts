import type { Order } from "@/types";

export const LOGOUT_CONFIRMS = [
  "You sure? Your cart will feel abandoned.",
  "Leaving already? The idli sambar will miss you.",
  "This is a cry for help. But ok.",
  "Fine. But your stomach will regret this.",
];

export const BADGES = [
  {
    id: "first-order",
    icon: "🏆",
    label: "First Order",
    desc: "Placed your very first order",
    condition: (orders: Order[]) => orders.length >= 1,
  },
  {
    id: "regular",
    icon: "🔥",
    label: "Regular",
    desc: "Ordered 5 or more times",
    condition: (orders: Order[]) => orders.length >= 5,
  },
  {
    id: "big-spender",
    icon: "💸",
    label: "Big Spender",
    desc: "Spent over ₹500 total",
    condition: (orders: Order[]) => orders.reduce((s, o) => s + o.total, 0) >= 500,
  },
  {
    id: "veg-loyalist",
    icon: "🥦",
    label: "Veg Loyalist",
    desc: "All orders are 100% veg",
    condition: (orders: Order[]) =>
      orders.length > 0 && orders.every((o) => o.items.every((ci) => ci.menuItem.isVeg)),
  },
  {
    id: "explorer",
    icon: "🗺️",
    label: "Explorer",
    desc: "Ordered from 3 different stalls",
    condition: (orders: Order[]) => new Set(orders.map((o) => o.restaurantId)).size >= 3,
  },
  {
    id: "night-owl",
    icon: "🦉",
    label: "Night Owl",
    desc: "Ordered after 8 PM",
    condition: () => false,
  },
];

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAccentColor(name: string) {
  const colors = ["#D92D57", "#4F8B68", "#E8B84A", "#7C5CBF", "#17232B"];
  return colors[name.charCodeAt(0) % colors.length];
}

export function getTotalSpend(orders: Order[]) {
  return orders.reduce((s, o) => s + o.total, 0);
}

export function getFavStall(orders: Order[]) {
  if (!orders.length) return null;
  const counts = new Map<string, { name: string; count: number }>();
  for (const o of orders) {
    const cur = counts.get(o.restaurantId) ?? { name: o.restaurantName, count: 0 };
    counts.set(o.restaurantId, { ...cur, count: cur.count + 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)[0];
}
