import React from "react";
import type { Order, Page } from "@/types";
import { formatCurrency } from "@syncbite/shared";

interface ProfileHeroProps {
  name: string;
  email: string;
  initials: string;
  accentColor: string;
}

export function ProfileHero({ name, email, initials, accentColor }: ProfileHeroProps) {
  return (
    <div
      className="relative border-b-2 border-navy overflow-hidden"
      style={{ backgroundColor: accentColor }}
    >
      {/* Texture */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        {["🍛", "☕", "🥞", "🥤"].map((e, i) => (
          <span
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              top: `${15 + i * 18}%`,
              left: `${60 + i * 8}%`,
              transform: `rotate(${i * 20}deg)`,
            }}
          >
            {e}
          </span>
        ))}
      </div>

      <div className="relative px-5 pt-8 pb-6 max-w-xl mx-auto">
        <div
          className="w-20 h-20 border-4 border-white/30 flex items-center justify-center mb-4"
          style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
        >
          <span className="font-impact text-3xl text-white">{initials}</span>
        </div>

        <h1 className="font-impact text-3xl text-white uppercase leading-none">{name}</h1>
        <p className="text-white/70 text-sm font-medium mt-0.5">{email}</p>

        <div className="mt-4 flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1.5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />
          <span className="text-white text-[11px] font-bold uppercase tracking-wider">
            Campus Dining · Verified Account
          </span>
        </div>
      </div>
    </div>
  );
}

interface ProfileStatsRowProps {
  orderCount: number;
  totalSpend: number;
  favStallName?: string | null;
}

export function ProfileStatsRow({ orderCount, totalSpend, favStallName }: ProfileStatsRowProps) {
  return (
    <div className="grid grid-cols-3 border-2 border-navy shadow-[3px_3px_0_#17232B]">
      {[
        { label: "Orders", value: orderCount.toString() },
        { label: "Spent", value: formatCurrency(totalSpend) },
        { label: "Fav Stall", value: favStallName ? favStallName.split(" ")[0] : "—" },
      ].map(({ label, value }, i) => (
        <div
          key={label}
          className={`flex flex-col items-center py-4 px-2 ${i < 2 ? "border-r-2 border-navy" : ""}`}
        >
          <span className="font-impact text-2xl text-navy leading-none">{value}</span>
          <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-0.5">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

interface ProfileBadgesSectionProps {
  earnedBadges: Array<{ id: string; icon: string; label: string; desc: string }>;
  lockedBadges: Array<{ id: string; icon: string; label: string; desc: string }>;
}

export function ProfileBadgesSection({ earnedBadges, lockedBadges }: ProfileBadgesSectionProps) {
  return (
    <div>
      <h2 className="font-impact text-xl text-navy uppercase mb-3">Badges</h2>
      {earnedBadges.length === 0 && (
        <div className="border-2 border-navy/20 px-4 py-5 text-center">
          <p className="font-display italic text-navy/40 text-sm">
            No badges yet. Place your first order to start collecting.
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {earnedBadges.map((b) => (
          <div
            key={b.id}
            className="border-2 border-navy bg-golden/10 px-3 py-3 flex items-start gap-3 shadow-[2px_2px_0_#17232B]"
          >
            <span className="text-2xl flex-shrink-0">{b.icon}</span>
            <div>
              <p className="font-bold text-navy text-xs uppercase tracking-wider">{b.label}</p>
              <p className="text-navy/50 text-[10px] mt-0.5 leading-snug">{b.desc}</p>
            </div>
          </div>
        ))}
        {lockedBadges.map((b) => (
          <div
            key={b.id}
            className="border-2 border-navy/15 bg-cream-100 px-3 py-3 flex items-start gap-3 opacity-50"
          >
            <span className="text-2xl flex-shrink-0 grayscale">{b.icon}</span>
            <div>
              <p className="font-bold text-navy/40 text-xs uppercase tracking-wider">{b.label}</p>
              <p className="text-navy/30 text-[10px] mt-0.5 leading-snug">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProfileRecentOrdersProps {
  orders: Order[];
  onNavigate: (page: Page) => void;
}

export function ProfileRecentOrders({ orders, onNavigate }: ProfileRecentOrdersProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-impact text-xl text-navy uppercase">Recent Orders</h2>
        {orders.length > 0 && (
          <button
            onClick={() => onNavigate("orders")}
            className="text-[11px] font-bold text-raspberry uppercase tracking-wider hover:underline cursor-pointer"
          >
            View all →
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="border-2 border-navy/20 px-4 py-5 text-center">
          <p className="font-impact text-2xl text-navy/20 uppercase mb-1">Nothing yet.</p>
          <p className="font-display italic text-navy/40 text-sm">
            Your order history will appear here. Hint: it starts with a tap.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.slice(0, 3).map((o) => (
            <div
              key={o.id}
              className="border-2 border-navy px-3 py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-bold text-navy text-sm truncate">{o.restaurantName}</p>
                <p className="text-navy/40 text-[11px]">
                  {o.date} · {o.pickupTime}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-impact text-navy text-base">{formatCurrency(o.total)}</p>
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 ${
                    o.status === "ready"
                      ? "bg-sage text-white"
                      : o.status === "preparing"
                        ? "bg-golden text-navy"
                        : o.status === "placed"
                          ? "bg-navy/15 text-navy"
                          : o.status === "cancelled"
                            ? "bg-raspberry/15 text-raspberry"
                            : "bg-navy/10 text-navy/50"
                  }`}
                >
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface LogoutModalProps {
  isOpen: boolean;
  logoutLine: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ isOpen, logoutLine, onConfirm, onCancel }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy/70 z-50 flex items-end md:items-center justify-center px-4 pb-8 md:pb-0">
      <div className="w-full max-w-sm bg-cream border-2 border-navy shadow-[6px_6px_0_#17232B]">
        <div className="bg-raspberry px-5 py-4 border-b-2 border-navy">
          <p className="font-impact text-xl text-cream uppercase">Wait — really?</p>
          <p className="font-display italic text-cream/80 text-sm mt-0.5">{logoutLine}</p>
        </div>
        <div className="px-5 py-4 flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-navy text-cream font-bold text-sm uppercase tracking-wider py-3 border-2 border-navy hover:bg-raspberry transition-colors cursor-pointer"
          >
            Yes, sign me out
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-cream text-navy font-bold text-sm uppercase tracking-wider py-3 border-2 border-navy hover:bg-golden transition-colors cursor-pointer"
          >
            Actually, I'm staying
          </button>
        </div>
      </div>
    </div>
  );
}
