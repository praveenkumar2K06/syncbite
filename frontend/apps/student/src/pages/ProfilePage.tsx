import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import type { Order, Page } from "@/types";
import { getCustomerProfileApi } from "@/api";
import { useAppContext } from "@/context/AppContext";
import {
  LOGOUT_CONFIRMS,
  BADGES,
  getInitials,
  getAccentColor,
  getTotalSpend,
  getFavStall,
  ProfileHero,
  ProfileStatsRow,
  ProfileBadgesSection,
  ProfileRecentOrders,
  LogoutModal,
} from "@/components/profile";

interface AuthUser {
  name: string;
  email: string;
  avatar: string;
}

interface ProfilePageProps {
  user?: AuthUser;
  orders?: Order[];
  onNavigate?: (page: Page) => void;
  onLogout?: () => void;
}

export default function ProfilePage(props: ProfilePageProps = {}) {
  const navigate = useNavigate();
  const ctx = useAppContext();

  const user = props.user ?? ctx.user;
  const orders = props.orders ?? ctx.orders;
  const onNavigate = props.onNavigate ?? ((p: Page) => navigate(`/${p}`));
  const onLogout = props.onLogout ?? ctx.handleLogout;

  const [profileName, setProfileName] = useState(user?.name ?? "");
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutLine] = useState(
    () => LOGOUT_CONFIRMS[Math.floor(Math.random() * LOGOUT_CONFIRMS.length)],
  );

  useEffect(() => {
    if (!user) return;
    getCustomerProfileApi()
      .then((p) => {
        if (p?.full_name && p.full_name !== "Customer") {
          setProfileName(p.full_name);
        }
      })
      .catch(() => {});
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const initials = getInitials(profileName);
  const accentColor = getAccentColor(profileName);
  const totalSpend = getTotalSpend(orders);
  const favStall = getFavStall(orders);
  const earnedBadges = BADGES.filter((b) => b.condition(orders));
  const lockedBadges = BADGES.filter((b) => !b.condition(orders));

  return (
    <div className="pb-28 md:pb-12">
      <ProfileHero
        name={user.name}
        email={user.email}
        initials={initials}
        accentColor={accentColor}
      />

      <div className="max-w-xl mx-auto px-4 py-5 space-y-5">
        <ProfileStatsRow
          orderCount={orders.length}
          totalSpend={totalSpend}
          favStallName={favStall?.name}
        />

        <ProfileBadgesSection earnedBadges={earnedBadges} lockedBadges={lockedBadges} />

        <ProfileRecentOrders orders={orders} onNavigate={onNavigate} />

        {/* Navigation list */}
        <div className="border-2 border-navy divide-y-2 divide-navy/10">
          <button
            onClick={() => onNavigate("orders")}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-cream-100 transition-colors text-left cursor-pointer"
          >
            <span className="font-bold text-navy text-sm">Order History</span>
            <span className="text-navy/30 text-sm">→</span>
          </button>
          <button
            onClick={() => onNavigate("home")}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-cream-100 transition-colors text-left cursor-pointer"
          >
            <span className="font-bold text-navy text-sm">Back to Home</span>
            <span className="text-navy/30 text-sm">→</span>
          </button>
          <button
            onClick={() => setConfirmLogout(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-raspberry/5 transition-colors text-left cursor-pointer"
          >
            <span className="font-bold text-raspberry text-sm">Sign Out</span>
            <span className="text-raspberry/40 text-sm">→</span>
          </button>
        </div>
      </div>

      <LogoutModal
        isOpen={confirmLogout}
        logoutLine={logoutLine}
        onConfirm={onLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}
