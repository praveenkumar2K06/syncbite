import React, { useState } from "react";
import type { Restaurant, Page, OrderMode } from "@/types";
import { MapPinIcon, ClockIcon, StarIcon } from "@/components/icons";

interface BrowseRestaurantCardProps {
  restaurant: Restaurant;
  accent: { bg: string; text: string; border: string };
  onNavigate: (page: Page, opts?: { restaurant?: Restaurant; mode?: OrderMode }) => void;
  onHover: () => void;
}

export function BrowseRestaurantCard({
  restaurant: r,
  accent,
  onNavigate,
  onHover,
}: BrowseRestaurantCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onNavigate("restaurant", { restaurant: r, mode: "now" })}
      onMouseEnter={() => {
        setHovered(true);
        onHover();
      }}
      onMouseLeave={() => setHovered(false)}
      className="group text-left w-full border-2 border-navy bg-cream overflow-hidden transition-all duration-75"
      style={
        hovered
          ? { boxShadow: "5px 5px 0 #17232B", transform: "translate(-2px, -2px)" }
          : { boxShadow: "3px 3px 0 #17232B" }
      }
    >
      {/* Image / Parent Brand Banner */}
      <div className="relative h-44 overflow-hidden bg-navy">
        <img
          src={r.banner_url || r.image}
          alt={r.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />

        {/* Open/Closed badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-white/20"
            style={{
              backgroundColor: r.isOpen ? accent.bg : "#17232B",
              color: r.isOpen ? accent.text : "#ffffff80",
            }}
          >
            {r.isOpen && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />}
            {r.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Rating & Dietary Tag */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {r.menu.length > 0 && r.menu.every((m) => m.isVeg) ? (
            <span className="bg-sage text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-white/20">
              Pure Veg
            </span>
          ) : (
            <span className="bg-golden/90 text-navy text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-navy/20">
              Multi-Cuisine
            </span>
          )}
          <div className="flex items-center gap-1 bg-cream/90 border border-navy/20 px-2 py-1">
            <StarIcon size={11} className="text-golden fill-golden" />
            <span className="text-[11px] font-bold text-navy">{r.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h2 className="font-impact text-2xl text-cream uppercase leading-none">{r.name}</h2>
          {r.brand_name && r.brand_name !== r.name && (
            <p className="text-[10px] font-semibold text-golden uppercase tracking-wider mt-0.5 opacity-90">
              by {r.brand_name}
            </p>
          )}
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between px-3 py-2.5 border-t-2 border-navy">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-navy/60 font-semibold">
            <MapPinIcon size={11} />
            {r.location}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-navy/60 font-semibold">
            <ClockIcon size={11} />
            {r.prepTime}
          </span>
        </div>

        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 border"
          style={{ backgroundColor: accent.bg, color: accent.text, borderColor: accent.border }}
        >
          {r.category.split("·")[0]?.trim() ?? ""}
        </span>
      </div>
    </button>
  );
}

interface BrowseGridProps {
  restaurants: Restaurant[];
  activeRestaurants: Restaurant[];
  getAccent: (idx: number) => { bg: string; text: string; border: string };
  onNavigate: (page: Page, opts?: { restaurant?: Restaurant; mode?: OrderMode }) => void;
  onHover: () => void;
}

export function BrowseGrid({
  restaurants,
  activeRestaurants,
  getAccent,
  onNavigate,
  onHover,
}: BrowseGridProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
      {restaurants.map((r) => (
        <BrowseRestaurantCard
          key={r.id}
          restaurant={r}
          accent={getAccent(activeRestaurants.indexOf(r))}
          onNavigate={onNavigate}
          onHover={onHover}
        />
      ))}

      {restaurants.length === 0 && (
        <div className="col-span-2 py-20 text-center">
          <p className="font-impact text-3xl text-navy/20 uppercase mb-2">Nothing here.</p>
          <p className="text-navy/40 text-sm font-display italic">
            Try a different filter, hungry one.
          </p>
        </div>
      )}
    </div>
  );
}
