import React from "react";
import { ClockIcon, ArrowRightIcon } from "@/components/icons";
import type { OrderMode } from "@/types";

interface ScheduleCtaSectionProps {
  onOrderMode: (mode: OrderMode) => void;
}

export function ScheduleCtaSection({ onOrderMode }: ScheduleCtaSectionProps) {
  return (
    <section className="bg-golden border-b-2 border-navy py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-block -rotate-1 border-2 border-navy text-navy text-[11px] font-bold px-3 py-1 uppercase tracking-wider mb-4">
            Plan ahead
          </span>
          <h2
            className="font-impact uppercase text-navy leading-none mb-3"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
          >
            Beat the
            <br />
            Lunch Rush.
          </h2>
          <p className="text-navy/70 text-sm leading-relaxed mb-6 max-w-sm font-body">
            Schedule your order before you leave class. Walk straight to the counter — your food
            will be waiting.
          </p>
          <button
            onClick={() => onOrderMode("schedule")}
            className="group flex items-center gap-3 bg-navy text-cream px-6 py-4 border-2 border-navy shadow-[4px_4px_0_rgba(0,0,0,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(0,0,0,0.4)] transition-all duration-75"
          >
            <ClockIcon size={18} strokeWidth={2} />
            <span className="font-impact text-xl tracking-wider uppercase">Schedule Order</span>
            <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Time slot preview */}
        <div className="hidden md:block">
          <div className="border-2 border-navy shadow-[5px_5px_0_#17232B] overflow-hidden bg-cream max-w-xs">
            <div className="bg-navy px-4 py-3 flex items-center gap-2">
              <ClockIcon size={14} className="text-golden" />
              <span className="font-impact text-cream text-sm uppercase tracking-wider">
                Available Slots — Today
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              {["12:15 PM", "12:30 PM", "1:00 PM", "1:15 PM", "1:45 PM", "2:00 PM"].map(
                (slot, i) => (
                  <div
                    key={slot}
                    className={`py-2.5 text-center text-xs font-bold uppercase tracking-wider border-2 ${
                      i === 1
                        ? "bg-raspberry border-raspberry text-white"
                        : "bg-cream border-navy/20 text-navy/70"
                    }`}
                  >
                    {slot}
                  </div>
                ),
              )}
            </div>
            <div className="px-4 pb-4">
              <div className="bg-golden/40 border border-golden px-3 py-2 text-xs font-semibold text-navy">
                12:30 PM selected · Campus Cafe · ₹85
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface HomeFooterProps {
  footerRef: React.RefObject<HTMLElement | null>;
}

export function HomeFooter({ footerRef }: HomeFooterProps) {
  return (
    <footer ref={footerRef} className="bg-navy border-t-2 border-navy py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-impact text-golden text-base uppercase tracking-wider">
            Built for campus.
          </span>
          <span className="font-impact text-raspberry text-base uppercase tracking-wider">
            Made for hungry students.
          </span>
          <span className="text-cream/40 text-xs font-medium">
            By LMx<sub className="text-[0.65em]">Labs</sub>
          </span>
        </div>
      </div>
    </footer>
  );
}

interface HomeTickerProps {
  items: string[];
}

export function HomeTicker({ items }: HomeTickerProps) {
  return (
    <div className="bg-raspberry border-b-2 border-navy overflow-hidden py-2">
      <div className="flex animate-marquee whitespace-nowrap w-max">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="font-impact text-cream text-sm px-6 tracking-wider">
            {t}
            <span className="text-golden mx-6">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
