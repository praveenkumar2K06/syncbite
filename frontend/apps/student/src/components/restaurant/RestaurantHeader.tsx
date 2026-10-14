import React from "react";
import type { Restaurant } from "@/types";
import { ArrowLeftIcon, MapPinIcon, ClockIcon } from "@/components/icons";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export function RestaurantHeader({ restaurant, onBack }: RestaurantHeaderProps) {
  return (
    <div className="relative h-52 md:h-72 bg-navy overflow-hidden border-b-2 border-navy">
      <img
        src={restaurant.banner_url || restaurant.image}
        alt={restaurant.name}
        className="w-full h-full object-cover opacity-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/50 to-navy/30" />

      <button
        onClick={onBack}
        className="absolute top-4 left-4 flex items-center gap-2 bg-cream border-2 border-navy text-navy text-xs font-bold uppercase px-3 py-2 hover:bg-golden transition-colors duration-75 shadow-[2px_2px_0_#17232B]"
      >
        <ArrowLeftIcon size={14} />
        Back
      </button>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 border ${
            restaurant.is_campus !== false
              ? "bg-navy/90 text-cream border-cream/30"
              : "bg-raspberry text-white border-white/40"
          }`}
        >
          {restaurant.is_campus !== false ? "🏫 Campus Inside" : "🛵 Campus Outside"}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 ${
            restaurant.isOpen
              ? "bg-sage text-white"
              : "bg-navy/80 text-cream/60 border border-cream/20"
          }`}
        >
          {restaurant.isOpen && (
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />
          )}
          {restaurant.isOpen ? "Open Now" : "Closed"}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <h1 className="font-impact text-3xl md:text-5xl uppercase text-cream leading-none mb-1">
          {restaurant.name}
        </h1>
        {restaurant.brand_name && restaurant.brand_name !== restaurant.name && (
          <p className="text-golden text-xs font-bold uppercase tracking-wider mb-2">
            Part of {restaurant.brand_name}
          </p>
        )}
        <div className="flex items-center gap-4">
          <span className="text-cream/80 text-xs flex items-center gap-1">
            <MapPinIcon size={11} />
            {restaurant.location}
          </span>
          <span className="text-golden text-xs font-bold flex items-center gap-1">
            <ClockIcon size={11} />
            {restaurant.prepTime}
          </span>
        </div>
      </div>
    </div>
  );
}

interface OrderModeBannerProps {
  orderMode: "now" | "schedule";
}

export function OrderModeBanner({ orderMode }: OrderModeBannerProps) {
  return (
    <div className="bg-cream border-b-2 border-navy px-4 py-2.5">
      <div className="max-w-3xl mx-auto flex items-center gap-2 text-xs font-semibold">
        {orderMode === "now" ? (
          <>
            <span className="text-raspberry">⚡</span>
            <span className="text-navy/60">
              Ordering for <span className="text-navy">nearest slot</span>
            </span>
          </>
        ) : (
          <>
            <span className="text-navy">🕒</span>
            <span className="text-navy/60">Scheduling pickup — choose time at checkout</span>
          </>
        )}
      </div>
    </div>
  );
}

interface CategoryNavProps {
  categories: Array<{ key: string; label: string }>;
  activeCategory: string;
  onSelectCategory: (key: string) => void;
  vegOnly: boolean;
  onToggleVegOnly: () => void;
  hasCategoryItems: (key: string) => boolean;
}

export function CategoryNav({
  categories,
  activeCategory,
  onSelectCategory,
  vegOnly,
  onToggleVegOnly,
  hasCategoryItems,
}: CategoryNavProps) {
  return (
    <div className="bg-cream sticky top-14 z-20 border-b-2 border-navy">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between gap-2 overflow-x-auto">
        {categories.length > 0 && (
          <div className="flex overflow-x-auto">
            {categories.map(({ key, label }) => {
              if (!hasCategoryItems(key)) return null;
              return (
                <button
                  key={key}
                  onClick={() => onSelectCategory(key)}
                  className={`flex-shrink-0 py-3 px-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    activeCategory === key
                      ? "border-raspberry text-raspberry"
                      : "border-transparent text-navy/40 hover:text-navy"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Quick Pure-Veg Switcher */}
        <button
          onClick={onToggleVegOnly}
          className={`flex-shrink-0 ml-auto my-2 px-3 py-1.5 border-2 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
            vegOnly
              ? "bg-sage border-navy text-white shadow-[2px_2px_0_#17232B]"
              : "bg-cream-100 border-navy/30 text-navy/70 hover:border-navy"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sage inline-block" />
          {vegOnly ? "Pure Veg Active" : "Veg Only"}
        </button>
      </div>
    </div>
  );
}
