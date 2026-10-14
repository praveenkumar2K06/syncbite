import { useNavigate, useLocation } from "react-router-dom";
import { HomeIcon, GridIcon, ClipboardIcon, UserIcon, ZapIcon } from "./icons";

interface BottomNavProps {
  cartCount: number;
}

export default function BottomNav({ cartCount: _cartCount }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const items = [
    { label: "Home", icon: HomeIcon, activePaths: ["/home"], to: "/home" },
    {
      label: "Browse",
      icon: GridIcon,
      activePaths: ["/browse", "/restaurant", "/checkout", "/confirmation"],
      to: "/browse",
    },
    { label: "Games", icon: ZapIcon, activePaths: ["/games"], to: "/games" },
    { label: "Orders", icon: ClipboardIcon, activePaths: ["/orders"], to: "/orders" },
    { label: "Profile", icon: UserIcon, activePaths: ["/profile"], to: "/profile" },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream border-t-2 border-navy"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex">
        {items.map(({ label, icon: Icon, activePaths, to }, idx) => {
          const isActive = activePaths.some((p) => currentPath.startsWith(p));
          return (
            <button
              key={`${label}-${idx}`}
              onClick={() => navigate(to)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
                isActive ? "bg-raspberry" : "hover:bg-cream-100"
              }`}
            >
              <Icon
                size={19}
                className={isActive ? "text-cream" : "text-navy/40"}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span
                className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? "text-cream" : "text-navy/40"}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
