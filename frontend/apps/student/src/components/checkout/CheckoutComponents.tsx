import React from "react";
import type { CartItem, Restaurant } from "@/types";
import { MapPinIcon, MinusIcon, PlusIcon } from "@/components/icons";

interface CheckoutRestaurantCardProps {
  restaurant?: Restaurant | null;
}

export function CheckoutRestaurantCard({ restaurant }: CheckoutRestaurantCardProps) {
  return (
    <div className="border-2 border-navy px-4 py-3 mb-4 flex items-center justify-between bg-cream-100">
      <div>
        <p className="text-[10px] text-navy/40 uppercase tracking-widest font-bold mb-0.5">From</p>
        <p className="font-impact text-xl uppercase text-navy">{restaurant?.name}</p>
        <p className="text-navy/50 text-xs flex items-center gap-1 mt-0.5">
          <MapPinIcon size={10} />
          {restaurant?.location}
        </p>
      </div>
      <span
        className={`text-xs font-bold px-2 py-1 uppercase tracking-wider ${
          restaurant?.isOpen ? "bg-sage text-white" : "bg-navy/10 text-navy/50"
        }`}
      >
        {restaurant?.isOpen ? "Open" : "Closed"}
      </span>
    </div>
  );
}

interface CartItemListProps {
  cart: CartItem[];
  total: number;
  onUpdateQty: (itemId: string, delta: number) => void;
}

export function CartItemList({ cart, total, onUpdateQty }: CartItemListProps) {
  return (
    <div className="border-2 border-navy overflow-hidden mb-4">
      {cart.map((ci, idx) => (
        <div
          key={ci.menuItem.id}
          className={`flex items-center gap-3 px-4 py-3 ${idx !== 0 ? "border-t-2 border-navy/10" : ""}`}
        >
          <span
            className="w-3 h-3 border-2 flex-shrink-0"
            style={{
              borderColor: ci.menuItem.isVeg ? "#4F8B68" : "#D92D57",
              backgroundColor: ci.menuItem.isVeg ? "#4F8B68" : "#D92D57",
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-navy block truncate">
              {ci.menuItem.name}
            </span>
            {ci.instructions && (
              <span className="text-[11px] text-raspberry font-medium block">
                Note: "{ci.instructions}"
              </span>
            )}
          </div>
          <div className="flex items-center gap-0 border-2 border-navy overflow-hidden mr-2">
            <button
              onClick={() => onUpdateQty(ci.menuItem.id, -1)}
              className="w-7 h-7 flex items-center justify-center hover:bg-navy hover:text-cream transition-colors duration-75 cursor-pointer"
            >
              <MinusIcon size={11} className="text-navy" />
            </button>
            <span className="w-6 text-center text-sm font-bold text-navy border-x-2 border-navy">
              {ci.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(ci.menuItem.id, 1)}
              className="w-7 h-7 flex items-center justify-center hover:bg-navy hover:text-cream transition-colors duration-75 cursor-pointer"
            >
              <PlusIcon size={11} className="text-navy" />
            </button>
          </div>
          <span className="text-sm font-bold text-navy w-12 text-right">
            ₹{ci.menuItem.price * ci.quantity}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between px-4 py-3 border-t-2 border-navy bg-navy">
        <span className="font-impact text-lg uppercase text-cream tracking-wider">Total</span>
        <span className="font-impact text-2xl text-golden">₹{total}</span>
      </div>
    </div>
  );
}

interface PickupScheduleSectionProps {
  orderMode: "now" | "schedule";
  prepTime?: string;
  dateTabs: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  timeSlots: Array<{ label: string; available: boolean }>;
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}

export function PickupScheduleSection({
  orderMode,
  prepTime,
  dateTabs,
  selectedDate,
  onSelectDate,
  timeSlots,
  selectedSlot,
  onSelectSlot,
}: PickupScheduleSectionProps) {
  return (
    <div className="border-2 border-navy overflow-hidden mb-6">
      <div className="px-4 py-3 border-b-2 border-navy bg-cream-100 flex items-center gap-2">
        {orderMode === "now" ? (
          <>
            <span className="text-raspberry">⚡</span>
            <span className="font-bold text-sm uppercase tracking-wider text-navy">
              Nearest Pickup Slot
            </span>
          </>
        ) : (
          <>
            <span className="text-navy">🕒</span>
            <span className="font-bold text-sm uppercase tracking-wider text-navy">
              Schedule Pickup
            </span>
          </>
        )}
      </div>

      {orderMode === "now" ? (
        <div className="px-4 py-4">
          <div className="bg-sage border-2 border-sage px-3 py-2.5">
            <p className="text-white text-xs font-bold mb-0.5 uppercase tracking-wider">
              Ready in ~{prepTime || "15 mins"}
            </p>
            <p className="text-white font-impact text-xl uppercase">12:30 PM — Today</p>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-[10px] text-navy/40 mb-2 uppercase tracking-widest font-bold">
              Select Date
            </p>
            <div className="flex gap-2">
              {dateTabs.map((d) => (
                <button
                  key={d}
                  onClick={() => onSelectDate(d)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border-2 transition-colors duration-75 cursor-pointer ${
                    selectedDate === d
                      ? "bg-navy border-navy text-cream"
                      : "bg-cream border-navy/20 text-navy/60 hover:border-navy hover:text-navy"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-navy/40 mb-2 uppercase tracking-widest font-bold">
              Select Time
            </p>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.label}
                  onClick={() => slot.available && onSelectSlot(slot.label)}
                  disabled={!slot.available}
                  className={`py-2 text-xs font-bold border-2 uppercase tracking-wider transition-colors duration-75 cursor-pointer ${
                    !slot.available
                      ? "border-navy/10 text-navy/20 cursor-not-allowed line-through"
                      : selectedSlot === slot.label
                        ? "bg-raspberry border-raspberry text-cream"
                        : "bg-cream border-navy/20 text-navy/70 hover:border-navy hover:text-navy"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CheckoutPayBarProps {
  isFrozen: boolean;
  total: number;
  onPay: () => void;
  isSubmitting?: boolean;
}

export function CheckoutPayBar({ isFrozen, total, onPay, isSubmitting }: CheckoutPayBarProps) {
  const disabled = isFrozen || isSubmitting;
  return (
    <div className="fixed md:relative bottom-[56px] md:bottom-0 left-0 right-0 p-4 md:p-0 bg-cream md:bg-transparent border-t-2 md:border-0 border-navy">
      <button
        onClick={onPay}
        disabled={disabled}
        className={`w-full group flex items-center justify-center gap-3 py-4 border-2 border-navy font-impact text-2xl uppercase tracking-wider transition-all duration-75 ${
          disabled
            ? "bg-navy/20 text-navy/40 cursor-not-allowed shadow-none border-navy/30"
            : "bg-raspberry text-cream shadow-[4px_4px_0_#17232B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#17232B] active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer"
        }`}
      >
        {isFrozen ? (
          <span>Checkout Paused (Emergency Freeze)</span>
        ) : isSubmitting ? (
          <span>Securing Order...</span>
        ) : (
          <>
            Pay ₹{total}&nbsp;&nbsp;
            <span>→</span>
          </>
        )}
      </button>
    </div>
  );
}
