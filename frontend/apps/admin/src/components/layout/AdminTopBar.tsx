import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { Tab } from "../../types/dashboard";
import { formatLongDate } from "../../utils/format";

interface AdminTopBarProps {
  selectedBranchName?: string;
}

const TAB_TITLES: Record<Tab, string> = {
  overview: "Platform Overview",
  analytics: "Platform Analytics",
  merchants: "Merchants & Brands",
  brands: "Brand Management",
  branches: "Branch Outlets",
  restaurants: "Restaurants & Outlets",
  menu: "Menu Editor",
  categories: "Menu Categories",
  onboard: "Onboard Restaurant",
  games: "Game Platforms & Tickets",
  customers: "Customer Management",
  orders: "Order Management",
  payments: "Payments & Refunds",
  banners: "Marketing Banners",
  subscriptions: "Subscriptions & Billing",
  notifications: "Announcements & Notifications",
  flags: "System Feature Flags",
  logs: "Platform Audit Logs",
};

function tabFromPathname(pathname: string): Tab {
  const segment = pathname.split("/").pop() as Tab | undefined;
  const valid: Tab[] = [
    "overview",
    "analytics",
    "merchants",
    "brands",
    "branches",
    "restaurants",
    "menu",
    "categories",
    "onboard",
    "games",
    "customers",
    "orders",
    "payments",
    "banners",
    "subscriptions",
    "notifications",
    "flags",
    "logs",
  ];
  return valid.includes(segment as Tab) ? (segment as Tab) : "overview";
}

export default function AdminTopBar({ selectedBranchName }: AdminTopBarProps) {
  const [today] = useState(() => new Date());
  const location = useLocation();
  const tab = tabFromPathname(location.pathname);

  return (
    <div
      className="sticky top-0 z-10 px-8 py-4 flex items-center justify-between"
      style={{
        background: "rgba(10,15,26,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e2d45",
      }}
    >
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          {TAB_TITLES[tab]}
          {tab === "menu" && selectedBranchName && (
            <span
              className="text-sm font-normal px-2.5 py-0.5 rounded-lg"
              style={{ background: "rgba(249,115,22,0.15)", color: "#f97316" }}
            >
              {selectedBranchName}
            </span>
          )}
        </h1>
        <p className="text-xs mt-0.5 text-slate-400">{formatLongDate(today)}</p>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: "#111827", border: "1px solid #1e2d45" }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }}
          />
          <span className="text-xs font-medium text-slate-300">Platform Admin</span>
        </div>
      </div>
    </div>
  );
}
