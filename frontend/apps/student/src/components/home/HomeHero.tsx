import React from "react";
import { ZapIcon, ClockIcon, ArrowRightIcon } from "@/components/icons";
import type { OrderMode } from "@/types";

interface HomeHeroProps {
  onOrderMode: (mode: OrderMode) => void;
}

export function HomeHero({ onOrderMode }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "rgb(23, 136, 46)" }}>
      {/* Ambient bg texture */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&h=900&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-14 md:pt-12 md:pb-20">
        <div className="grid md:grid-cols-[1fr_340px] gap-8 items-center">
          {/* Text */}
          <div className="animate-fade-up">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-block -rotate-2 bg-golden text-navy text-[11px] font-bold px-3 py-1 uppercase tracking-wider border border-navy/20">
                Made for Campus
              </span>
              <span className="inline-block rotate-1 border border-white/40 text-white/70 text-[11px] font-medium px-3 py-1 uppercase tracking-wider">
                Campus Outlets
              </span>
            </div>

            <h1
              className="font-impact uppercase leading-[0.88] text-white mb-1"
              style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}
            >
              Your
            </h1>
            <h1
              className="font-impact uppercase leading-[0.88] text-white mb-1"
              style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}
            >
              Favourite
            </h1>
            <h1
              className="font-impact uppercase leading-[0.88] text-golden mb-2"
              style={{ fontSize: "clamp(3rem, 12vw, 8rem)" }}
            >
              Food,
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-3 mb-4">
              <span
                className="font-impact uppercase leading-[0.9] text-white"
                style={{ fontSize: "clamp(1.8rem, 7vw, 5rem)" }}
              >
                Without the
              </span>
              <span
                className="font-impact uppercase leading-[0.9] text-raspberry"
                style={{ fontSize: "clamp(1.8rem, 7vw, 5rem)" }}
              >
                Queue.
              </span>
            </div>

            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-md font-display italic">
              Great food, made easier. Pick your restaurant, choose your time, and collect without the
              wait.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onOrderMode("now")}
                className="group flex items-center justify-center gap-3 bg-raspberry text-white px-6 py-4 border-2 border-white/80 shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(0,0,0,0.5)] transition-all duration-75 active:translate-x-0 active:translate-y-0"
              >
                <ZapIcon
                  size={18}
                  strokeWidth={2.5}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-impact text-xl tracking-wider uppercase">Order Now</span>
                <ArrowRightIcon
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => onOrderMode("schedule")}
                className="group flex items-center justify-center gap-3 bg-golden text-navy px-6 py-4 border-2 border-navy/40 shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(0,0,0,0.4)] transition-all duration-75"
              >
                <ClockIcon size={18} strokeWidth={2} />
                <span className="font-impact text-xl tracking-wider uppercase">Schedule Order</span>
                <ArrowRightIcon
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* Food visual — desktop */}
          <div className="hidden md:block relative">
            <div className="relative inline-block">
              <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-golden/50 pointer-events-none" />
              <div className="animate-float w-[300px] h-[360px] overflow-hidden border-2 border-white/30">
                <img
                  src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=720&fit=crop&auto=format"
                  alt="Campus biryani"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* Steam elements */}
              <div className="absolute top-4 left-1/3 w-3 h-8 bg-white/20 rounded-full blur-sm animate-steam" />
              <div className="absolute top-2 left-1/2 w-2 h-6 bg-white/15 rounded-full blur-sm animate-steam-2" />
              {/* Caption sticker */}
              <div className="absolute -bottom-2 -left-6 bg-raspberry border-2 border-navy px-3 py-1 rotate-[-3deg]">
                <span className="font-impact text-white text-sm tracking-wider uppercase">
                  Good food ahead
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom curve into cream */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6 bg-cream"
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
      />
    </section>
  );
}
