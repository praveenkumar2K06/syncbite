import { NavLink } from "react-router-dom";
import { usePortal } from "@/context/PortalContext";
import { C, NAV } from "@/constants";
import Icon from "../common/Icon";
import { Badge } from "@/components/ui/badge";

export interface SidebarProps {
  isOpen: boolean;
  activeCount?: number;
}

export default function Sidebar({ isOpen, activeCount = 0 }: SidebarProps) {
  const { isMerchantOwner } = usePortal();

  return (
    <aside
      style={{
        width: 216,
        height: "100vh",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        borderRight: "1px solid rgba(255,255,255,.06)",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
      className="desktop-sidebar"
    >
      <div
        style={{
          padding: "18px 16px 14px",
          borderBottom: "1px solid rgba(255,255,255,.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 5,
              background: `linear-gradient(135deg, ${C.green} 0%, #166534 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "#fff",
              flexShrink: 0,
              boxShadow: "0 1px 4px rgba(0,0,0,.4)",
            }}
          >
            S
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#f8fafc",
                margin: 0,
                letterSpacing: "-0.2px",
              }}
            >
              SyncBite
            </p>
            <p
              style={{
                fontSize: 10,
                color: isMerchantOwner ? "#86efac" : "rgba(255,255,255,.4)",
                fontWeight: isMerchantOwner ? 600 : 400,
                margin: 0,
              }}
            >
              {isMerchantOwner ? "Merchant Owner" : "Restaurant Outlet"}
            </p>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "8px 8px 16px" }}>
        {[
          { title: "Operations", key: "operations" },
          { title: "Organization", key: "organization" },
          { title: "Financials", key: "financials" },
          { title: "Account", key: "account" },
        ].map((sec, idx) => {
          const items = NAV.filter((i) => {
            if (i.section !== sec.key) return false;
            // Restrict financials and merchant legal settings to MerchantOwner
            if (
              !isMerchantOwner &&
              (i.key === "finances" || i.key === "subscription" || i.key === "merchant")
            ) {
              return false;
            }
            return true;
          });
          if (!items.length) return null;

          return (
            <div key={sec.key} style={{ marginTop: idx === 0 ? 2 : 12 }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  color: "rgba(255,255,255,.25)",
                  padding: "4px 10px 3px",
                }}
              >
                {sec.title}
              </div>
              {items.map((item) => {
                const displayLabel =
                  !isMerchantOwner && item.key === "branches"
                    ? "My Outlet"
                    : !isMerchantOwner && item.key === "brands"
                      ? "Outlet Brand"
                      : item.label;

                return (
                  <NavLink
                    key={item.key}
                    to={`/${item.key}`}
                    style={({ isActive }) => ({
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "7px 10px",
                      borderRadius: 5,
                      marginBottom: 1,
                      background: isActive ? "rgba(255,255,255,.09)" : "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left" as const,
                      color: isActive ? "#f8fafc" : "rgba(255,255,255,.55)",
                      fontSize: 12.5,
                      fontWeight: isActive ? 600 : 400,
                      borderLeft: isActive ? `2px solid ${C.green}` : "2px solid transparent",
                      transition: "background .1s, color .1s",
                      textDecoration: "none",
                    })}
                    viewTransition
                  >
                    <Icon n={item.icon} size={15} />
                    <span className="truncate flex-1">{displayLabel}</span>
                    {item.key === "orders" && activeCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-auto h-4 min-w-4 px-1 text-[9px] font-bold leading-none justify-center rounded-full"
                      >
                        {activeCount}
                      </Badge>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>
      <div
        style={{
          padding: "12px 16px 18px",
          borderTop: "1px solid rgba(255,255,255,.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: isOpen ? "#4ade80" : "rgba(255,255,255,.2)",
              flexShrink: 0,
              boxShadow: isOpen ? "0 0 6px #4ade8088" : "none",
              transition: "all .2s",
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.4)",
              fontWeight: 500,
            }}
          >
            {isOpen ? "Accepting orders" : "Closed"}
          </span>
        </div>
      </div>
    </aside>
  );
}
