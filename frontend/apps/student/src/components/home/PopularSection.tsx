import React from "react";
import type { MenuItem, Restaurant } from "@/types";

interface PopularCardProps {
  item: MenuItem;
  restaurantName: string;
  accent: { bg: string; text: string; border: string };
  onClick: () => void;
  featured: boolean;
}

export function PopularCard({ item, restaurantName, accent, onClick, featured }: PopularCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group text-left bg-cream border-2 border-navy overflow-hidden shadow-[3px_3px_0_#17232B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#17232B] transition-all duration-200 ${
        featured ? "md:col-span-1 row-span-1" : ""
      }`}
    >
      <div
        className={`overflow-hidden bg-cream-100 ${featured ? "aspect-[4/3]" : "aspect-square"}`}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-2.5">
        <span
          className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 mb-1"
          style={{ backgroundColor: accent.bg, color: accent.text }}
        >
          {restaurantName}
        </span>
        <p className="font-bold text-navy text-xs leading-snug truncate">{item.name}</p>
        <p className="font-impact text-navy text-sm mt-0.5">₹{item.price}</p>
      </div>
    </button>
  );
}

interface PopularSectionProps {
  popular: Array<{ restaurant: Restaurant; item: MenuItem }>;
  activeRestaurants: Restaurant[];
  getAccent: (idx: number) => { bg: string; text: string; border: string };
  onNavigateToRestaurant: (r: Restaurant) => void;
}

export function PopularSection({
  popular,
  activeRestaurants,
  getAccent,
  onNavigateToRestaurant,
}: PopularSectionProps) {
  return (
    <section className="bg-raspberry border-t-2 border-b-2 border-navy py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-[0.35em] mb-1">
              — Trending today
            </p>
            <h2
              className="font-impact uppercase text-white leading-none"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}
            >
              Popular
              <br />
              Right Now
            </h2>
          </div>
          <span className="font-display italic text-white/50 text-sm text-right hidden sm:block">
            Fresh from the kitchen
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {popular.map(({ restaurant, item }, idx) => (
            <PopularCard
              key={item.id}
              item={item}
              restaurantName={restaurant.name}
              accent={getAccent(activeRestaurants.indexOf(restaurant))}
              onClick={() => onNavigateToRestaurant(restaurant)}
              featured={idx === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
