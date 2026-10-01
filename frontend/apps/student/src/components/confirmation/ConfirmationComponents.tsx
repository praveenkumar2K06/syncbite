import React from "react";
import type { Order } from "@/types";
import { ArrowRightIcon } from "@/components/icons";

export const CONFETTI_COLORS = ["#D92D57", "#E8B84A", "#F7B28F", "#4F8B68", "#17232B", "#FFFDF8"];

export function ConfettiPiece({ color, style }: { color: string; style: React.CSSProperties }) {
  return (
    <div
      className="confetti-piece absolute w-2.5 h-2.5"
      style={{ backgroundColor: color, ...style }}
    />
  );
}

interface ConfettiRainProps {
  show: boolean;
}

export function ConfettiRain({ show }: ConfettiRainProps) {
  if (!show) return null;

  const pieces = Array.from({ length: 24 }, (_, i) => ({
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? "#FFFDF8",
    style: {
      left: `${(i / 24) * 100}%`,
      top: 0,
      animationDelay: `${(i * 0.07).toFixed(2)}s`,
      animationDuration: `${1.1 + (i % 4) * 0.18}s`,
      transform: `rotate(${i * 23}deg)`,
    } as React.CSSProperties,
  }));

  return (
    <div className="absolute inset-x-0 top-0 h-40 overflow-hidden pointer-events-none">
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} color={p.color} style={p.style} />
      ))}
    </div>
  );
}

export function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-navy/50 text-xs font-semibold uppercase tracking-wider">{label}</span>
      <span
        className={`text-sm font-bold ${highlight ? "text-raspberry font-impact text-lg" : "text-navy"}`}
      >
        {value}
      </span>
    </div>
  );
}

interface ConfirmationOrderCardProps {
  order: Order;
}

export function ConfirmationOrderCard({ order }: ConfirmationOrderCardProps) {
  const totalItemCount = order.items.reduce((s, ci) => s + ci.quantity, 0);

  return (
    <div className="w-full max-w-sm border-2 border-navy shadow-[5px_5px_0_#17232B] overflow-hidden mb-8 text-left">
      <div className="bg-navy px-4 py-3 flex items-center justify-between">
        <span className="text-cream/50 text-[10px] font-bold uppercase tracking-widest">
          Order ID
        </span>
        <span className="font-impact text-golden text-xl">{order.id}</span>
      </div>

      <div className="divide-y-2 divide-navy/10 bg-cream">
        <DetailRow label="Restaurant" value={order.restaurantName} />
        <DetailRow label="Pickup" value={`${order.date} · ${order.pickupTime}`} />
        <DetailRow label="Items" value={`${totalItemCount} item${totalItemCount > 1 ? "s" : ""}`} />
        <DetailRow label="Amount" value={`₹${order.total}`} highlight />
      </div>

      <div className="px-4 py-3 bg-sage flex items-start gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1 flex-shrink-0 animate-pulse-dot" />
        <p className="text-white text-xs font-semibold leading-snug">
          Show this screen at the counter to collect your order.
        </p>
      </div>
    </div>
  );
}

interface ConfirmationActionsProps {
  onTrackOrder: () => void;
  onBackToHome: () => void;
}

export function ConfirmationActions({ onTrackOrder, onBackToHome }: ConfirmationActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
      <button
        onClick={onTrackOrder}
        className="flex-1 flex items-center justify-center gap-2 bg-navy text-cream py-3.5 border-2 border-navy font-impact text-lg uppercase tracking-wider shadow-[3px_3px_0_#17232B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#17232B] transition-all duration-75 cursor-pointer"
      >
        Track Order
        <ArrowRightIcon size={16} />
      </button>
      <button
        onClick={onBackToHome}
        className="flex-1 bg-cream border-2 border-navy text-navy py-3.5 font-bold text-sm uppercase tracking-wider hover:bg-cream-100 transition-colors duration-75 cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  );
}
