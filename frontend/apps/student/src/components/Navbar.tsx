import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartIcon, MapPinIcon } from "./icons";

interface AuthUser {
  name: string;
  email: string;
  avatar?: string;
}

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  cartJustAdded?: boolean;
  user?: AuthUser;
  onLogout?: () => void;
}

export default function Navbar({
  cartCount,
  cartTotal,
  cartJustAdded,
  user,
  onLogout,
}: NavbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const navItems = [
    { label: "Home", to: "/home", activeOn: ["/home"] },
    { label: "Browse", to: "/browse", activeOn: ["/browse", "/restaurant"] },
    { label: "Game Arena", to: "/games", activeOn: ["/games"] },
    { label: "Movie Theater", to: "/theater", activeOn: ["/theater"] },
    { label: "Orders", to: "/orders", activeOn: ["/orders"] },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream border-b-2 border-navy">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link
          to="/home"
          className="flex-shrink-0 font-impact text-xl uppercase tracking-wider text-navy hover:text-raspberry transition-colors"
        >
          SyncBite
        </Link>

        <nav className="hidden md:flex items-center gap-0">
          {navItems.map(({ label, to, activeOn }) => {
            const isActive = activeOn.some((p) => currentPath.startsWith(p));
            return (
              <button
                key={label}
                onClick={() => navigate(to)}
                className={`relative px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive ? "text-raspberry" : "text-navy/50 hover:text-navy"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-raspberry" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden md:flex items-center gap-1.5 border border-navy/20 text-xs font-semibold text-navy/60 hover:text-navy hover:border-navy transition-colors px-2.5 py-1.5 rounded-none">
            <MapPinIcon size={12} />
            Campus Hub
          </button>

          {user ? (
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="flex items-center justify-center w-9 h-9 border-2 border-navy bg-raspberry text-cream text-xs font-bold hover:bg-navy transition-colors"
              >
                {initials}
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-cream border-2 border-navy shadow-[4px_4px_0_#17232B] z-50">
                  <div className="px-3 py-2.5 border-b-2 border-navy/10">
                    <p className="font-bold text-navy text-xs truncate">{user.name}</p>
                    <p className="text-navy/40 text-[10px] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-3 py-2.5 text-xs font-bold text-raspberry uppercase tracking-wider hover:bg-raspberry hover:text-white transition-colors"
                  >
                    Sign out (we'll miss you)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:flex items-center justify-center h-9 px-3 border-2 border-navy bg-cream text-navy text-xs font-bold uppercase tracking-wider hover:bg-golden transition-colors"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => navigate("/checkout")}
            className="relative flex items-center gap-2 h-9 px-3 border-2 border-navy hover:bg-navy hover:text-cream transition-all duration-75 group"
          >
            <CartIcon
              size={17}
              className={`text-navy group-hover:text-cream transition-colors ${cartJustAdded ? "animate-cart-bounce" : ""}`}
            />
            {cartCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold">
                <span className="text-raspberry group-hover:text-golden">{cartCount}</span>
                <span className="hidden sm:inline text-navy/40 group-hover:text-cream/40">·</span>
                <span className="hidden sm:inline font-bold group-hover:text-cream">
                  ₹{cartTotal}
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
