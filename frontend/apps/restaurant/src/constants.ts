import type { CSSProperties } from "react";
import type { PortalMenu } from "@/lib/portal";
import type { NavItem } from "./types";

export const EMPTY_MENU: PortalMenu = {
  items: [],
  categories: [],
  categoryIds: {},
};
export const DEFAULT_CATEGORY = "General";
/** How often the orders screen re-checks the backend for new work. */
export const ORDER_POLL_MS = 20_000;

// Tokens — kept minimal
export const C = {
  text: "#0f172a",
  sub: "#475569",
  light: "#94a3b8",
  border: "#cbd5e1",
  bg: "#f1f5f9",
  white: "#ffffff",
  green: "#15803d",
  greenBg: "#f0fdf4",
  greenBorder: "#86efac",
  red: "#b91c1c",
  redBg: "#fef2f2",
  amber: "#b45309",
  amberBg: "#fffbeb",
  blue: "#1d4ed8",
  blueBg: "#eff6ff",
  navy: "#1e293b",
  navySub: "rgba(255,255,255,0.6)",
  navyMuted: "rgba(255,255,255,0.28)",
} as const;

export const GLOBAL_CSS = `
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes up { from{transform:translateY(6px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes sheet { from{transform:translateY(100%)} to{transform:translateY(0)} }
  * { box-sizing:border-box; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
  input:focus,select:focus,textarea:focus { outline:2px solid ${C.green}; outline-offset:-1px; }
  .press:active { opacity:.7; }
  .row:hover { background:#e8edf4 !important; }
`;

export const inp: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: `1.5px solid ${C.border}`,
  borderRadius: 4,
  fontSize: 13,
  color: C.text,
  background: C.white,
  boxSizing: "border-box",
  outline: "none",
};

export const NAV: NavItem[] = [
  { key: "dashboard", label: "Home", icon: "home", section: "operations" },
  { key: "orders", label: "Orders", icon: "orders", section: "operations" },
  { key: "menu", label: "Menu", icon: "menu", section: "operations" },
  { key: "categories", label: "Categories", icon: "categories", section: "operations" },
  { key: "inventory", label: "Inventory", icon: "inventory", section: "operations" },
  { key: "kitchens", label: "Kitchens", icon: "kitchens", section: "operations" },
  { key: "branches", label: "Branches", icon: "branches", section: "organization" },
  { key: "brands", label: "Brands", icon: "brands", section: "organization" },
  { key: "finances", label: "Finances", icon: "finances", section: "financials" },
  { key: "subscription", label: "Subscription", icon: "subscription", section: "financials" },
  { key: "merchant", label: "Merchant", icon: "merchant", section: "account" },
  { key: "notifications", label: "Notifications", icon: "notifications", section: "account" },
  { key: "settings", label: "Settings", icon: "settings", section: "account" },
];
