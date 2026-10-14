import { NavLink } from "react-router-dom";
import type { Tab } from "../../types/dashboard";

interface AdminSidebarProps {
  restaurantCount: number;
  onLogout: () => void;
}

interface NavSection {
  title: string;
  items: Array<{ id: Tab; label: string; icon: string }>;
}

const SECTIONS: NavSection[] = [
  {
    title: "Platform",
    items: [
      { id: "overview", label: "Dashboard Overview", icon: "⊞" },
      { id: "analytics", label: "Platform Analytics", icon: "📊" },
    ],
  },
  {
    title: "Merchants & Outlets",
    items: [
      { id: "merchants", label: "Merchants & Brands", icon: "🏢" },
      { id: "brands", label: "Brand Management", icon: "🏷️" },
      { id: "branches", label: "Branch Outlets", icon: "📍" },
      { id: "menu", label: "Menu Editor", icon: "📋" },
      { id: "categories", label: "Categories", icon: "🏷️" },
      { id: "onboard", label: "Onboard Outlet", icon: "＋" },
    ],
  },
  {
    title: "Commerce & Users",
    items: [
      { id: "games", label: "Game Platforms & Tickets", icon: "🎮" },
      { id: "orders", label: "Orders", icon: "📦" },
      { id: "payments", label: "Payments & Refunds", icon: "💳" },
      { id: "customers", label: "Customers", icon: "👥" },
      { id: "banners", label: "Marketing Banners", icon: "🎨" },
      { id: "subscriptions", label: "Subscriptions", icon: "📜" },
      { id: "notifications", label: "Announcements", icon: "🔔" },
    ],
  },
  {
    title: "System & Governance",
    items: [
      { id: "flags", label: "Feature Flags", icon: "⚑" },
      { id: "logs", label: "Audit Logs", icon: "≡" },
    ],
  },
];

export default function AdminSidebar({ restaurantCount, onLogout }: AdminSidebarProps) {
  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{ background: "#111827", borderRight: "1px solid #1e2d45" }}
    >
      <div
        className="px-6 py-5 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: "1px solid #1e2d45" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 0 20px rgba(249,115,22,0.35)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
            <path
              d="M2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <div>
          <div className="text-base font-bold text-white tracking-wide">SyncBite</div>
          <div className="text-xs font-semibold" style={{ color: "#f97316" }}>
            Super Admin
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {SECTIONS.map((sec) => (
          <div key={sec.title}>
            <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              {sec.title}
            </div>
            <div className="flex flex-col gap-1">
              {sec.items.map((t) => (
                <NavLink
                  key={t.id}
                  to={`/dashboard/${t.id}`}
                  id={`nav-${t.id}`}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer no-underline"
                  style={({ isActive }) => ({
                    background: isActive ? "rgba(249,115,22,0.14)" : "transparent",
                    color: isActive ? "#f97316" : "#94a3b8",
                    border: isActive ? "1px solid rgba(249,115,22,0.25)" : "1px solid transparent",
                  })}
                >
                  <span className="text-sm">{t.icon}</span>
                  <span className="truncate">{t.label}</span>
                  {t.id === "branches" && restaurantCount > 0 && (
                    <span
                      className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                      style={{ background: "#1e2d45", color: "#94a3b8" }}
                    >
                      {restaurantCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4" style={{ borderTop: "1px solid #1e2d45" }}>
        <button
          id="admin-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
          style={{ color: "#64748b" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#f43f5e";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(244,63,94,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <span>⎋</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
