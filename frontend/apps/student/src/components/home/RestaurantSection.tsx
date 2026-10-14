import React from "react";
import type { Restaurant } from "@/types";
import { ArrowRightIcon, MapPinIcon } from "@/components/icons";

interface RestaurantCardProps {
  restaurant: Restaurant;
  accent: { bg: string; text: string; border: string };
  onClick: () => void;
}

export function RestaurantCard({ restaurant, accent, onClick }: RestaurantCardProps) {
  const closed = !restaurant.isOpen;

  return (
    <button
      onClick={closed ? undefined : onClick}
      disabled={closed}
      className="flex-shrink-0 w-[82vw] md:w-auto snap-start group relative overflow-hidden border-2 border-navy shadow-[4px_4px_0_#17232B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#17232B] transition-all duration-200 text-left disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#17232B]"
    >
      {/* Photo / Parent Brand Banner */}
      <div className="aspect-[4/3] overflow-hidden bg-navy relative">
        <img
          src={restaurant.banner_url || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          loading="lazy"
        />
        {closed && (
          <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
            <div className="border-2 border-cream/40 bg-navy px-4 py-1.5 rotate-[-5deg]">
              <span className="font-impact text-cream uppercase tracking-wider text-sm">
                Back Soon
              </span>
            </div>
          </div>
        )}
        {/* Status badge */}
        {!closed && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 bg-sage text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />
              Open Now
            </span>
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 bg-cream/95 text-navy text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-navy/30 shadow-[1px_1px_0_#17232B]">
            ★ {restaurant.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Info strip — accent color */}
      <div className="p-3 md:p-4" style={{ backgroundColor: accent.bg }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-impact text-xl md:text-2xl uppercase leading-none"
            style={{ color: accent.text }}
          >
            {restaurant.name}
          </h3>
          <ArrowRightIcon
            size={18}
            className="flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform duration-200"
            style={{ color: accent.text }}
          />
        </div>
        <p className="text-[11px] font-medium mb-2 opacity-70" style={{ color: accent.text }}>
          {restaurant.category}
        </p>
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider opacity-60 flex items-center gap-1"
            style={{ color: accent.text }}
          >
            <MapPinIcon size={10} />
            {restaurant.location.split(" ").slice(-2).join(" ")}
          </span>
          <span className="text-[11px] font-bold opacity-80" style={{ color: accent.text }}>
            {restaurant.prepTime}
          </span>
        </div>
      </div>
    </button>
  );
}

interface RestaurantSectionProps {
  displayedRestaurants: Restaurant[];
  getAccent: (idx: number) => { bg: string; text: string; border: string };
  onNavigateToRestaurant: (r: Restaurant) => void;
}

export function RestaurantSection({
  displayedRestaurants,
  getAccent,
  onNavigateToRestaurant,
}: RestaurantSectionProps) {
  return (
    <section className="bg-cream pt-10 pb-12 md:pb-16">
      {/* Section header */}
      <div className="px-4 max-w-6xl mx-auto mb-6">
        <p className="text-raspberry text-[11px] font-bold uppercase tracking-[0.35em] mb-1">
          — Featured Dining
        </p>
        <div className="flex items-end justify-between gap-4">
          <h2
            className="font-impact uppercase text-navy leading-none"
            style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)" }}
          >
            Pick Your
            <br className="sm:hidden" /> Food Spot
          </h2>
          <p className="font-display italic text-navy/50 text-sm text-right hidden sm:block">
            Your favourite restaurants & cafes,
            <br />
            all in one place.
          </p>
        </div>

        {/* Swipe hint — mobile only */}
        <div className="flex items-center gap-2 mt-3 md:hidden">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1 rounded-full ${i === 0 ? "w-5 bg-raspberry" : "w-2 bg-navy/20"}`}
              />
            ))}
          </div>
          <span className="text-[11px] text-navy/40 font-medium uppercase tracking-wider">
            Swipe to explore
          </span>
        </div>
      </div>

      {/* Carousel */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pl-4 pr-4 md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:px-4 md:max-w-6xl md:mx-auto">
        {displayedRestaurants.length === 0 && (
          <div className="col-span-3 py-16 text-center text-navy/40 font-bold uppercase tracking-wider text-sm">
            No outlets found in this area…
          </div>
        )}
        {[
          ...displayedRestaurants.filter((r) => r.isOpen),
          ...displayedRestaurants.filter((r) => !r.isOpen),
        ].map((r, idx) => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            accent={getAccent(idx)}
            onClick={() => r.isOpen && onNavigateToRestaurant(r)}
          />
        ))}
      </div>
    </section>
  );
}
