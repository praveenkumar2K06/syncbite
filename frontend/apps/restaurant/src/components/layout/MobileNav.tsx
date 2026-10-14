import { NavLink } from "react-router-dom";
import { C, NAV } from "@/constants";
import Icon from "../common/Icon";
import { Badge } from "@/components/ui/badge";

export interface MobileNavProps {
  activeCount: number;
}

const MOBILE_NAV_KEYS = ["dashboard", "orders", "menu", "inventory", "settings"];

export default function MobileNav({ activeCount }: MobileNavProps) {
  const mobileNavItems = NAV.filter((i) => MOBILE_NAV_KEYS.includes(i.key));

  return (
    <nav
      style={{
        background: C.white,
        borderTop: `1.5px solid ${C.border}`,
        display: "flex",
        boxShadow: "0 -1px 0 rgba(0,0,0,.04)",
        flexShrink: 0,
      }}
      className="mobile-nav"
    >
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.key}
          to={`/${item.key}`}
          style={({ isActive }) => ({
            flex: 1,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: 3,
            padding: "9px 4px 10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: isActive ? C.green : C.light,
            position: "relative" as const,
            textDecoration: "none",
          })}
        >
          {({ isActive }) => (
            <>
              {item.key === "orders" && activeCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute top-1.5 right-[calc(50%-16px)] h-3.5 min-w-3.5 px-0.5 text-[8px] font-bold leading-none justify-center rounded-full"
                >
                  {activeCount}
                </Badge>
              )}
              <Icon n={item.icon} size={19} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "30%",
                    right: "30%",
                    height: 2,
                    borderRadius: 1,
                    background: C.green,
                  }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
