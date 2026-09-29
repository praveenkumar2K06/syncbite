import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import CartBar from "./CartBar";
import ScrollToTop from "./ScrollToTop";
import { useAppContext } from "@/context/AppContext";

import { Suspense } from "react";
import PageSkeletonLoader from "./PageSkeletonLoader";

export default function AppLayout() {
  const { cart, cartJustAdded, user, handleLogout, isFrozen } = useAppContext();
  const location = useLocation();

  const cartCount = cart.reduce((s, ci) => s + ci.quantity, 0);
  const cartTotal = cart.reduce((s, ci) => s + ci.menuItem.price * ci.quantity, 0);

  const showCartBar = location.pathname.startsWith("/restaurant") && cartCount > 0;

  return (
    <div className="min-h-screen bg-cream font-body">
      <ScrollToTop />

      {isFrozen && (
        <div className="bg-raspberry text-white border-b-2 border-navy px-4 py-2 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_2px_0_#17232B] sticky top-0 z-50 animate-pulse">
          <span className="text-sm">🛑</span>
          <span>Campus Emergency Freeze Active — Ordering & Checkouts are temporarily paused</span>
        </div>
      )}

      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        cartJustAdded={cartJustAdded}
        user={user ?? undefined}
        onLogout={handleLogout}
      />

      <main className="min-h-screen">
        <Suspense fallback={<PageSkeletonLoader />}>
          <Outlet />
        </Suspense>
      </main>

      {showCartBar && <CartBar cart={cart} />}
      <BottomNav cartCount={cartCount} />
    </div>
  );
}
