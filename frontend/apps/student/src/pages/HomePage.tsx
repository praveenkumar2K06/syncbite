import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { Restaurant, OrderMode } from "@/types";
import { useHumor } from "@/components/HumorSystem";
import { useAppContext } from "@/context/AppContext";
import {
  TICKER_ITEMS,
  getAccent,
  applyPageEffect,
  HomeTicker,
  HomeHero,
  RestaurantSection,
  PopularSection,
  ScheduleCtaSection,
  HomeFooter,
} from "@/components/home";

function resolvePopular(sourceRestaurants: Restaurant[]) {
  return sourceRestaurants.slice(0, 6).flatMap((r) => {
    const item = r.menu[0];
    return item ? [{ restaurant: r, item }] : [];
  });
}

export default function HomePage() {
  const {
    restaurants: activeRestaurants,
    setOrderMode,
    setSelectedRestaurant,
    fetchRestaurantMenu,
  } = useAppContext();
  const navigate = useNavigate();
  const popular = resolvePopular(activeRestaurants);
  const { trigger } = useHumor();
  const footerRef = useRef<HTMLElement>(null);
  // Load menu items only for the first few featured restaurants on Home mount
  useEffect(() => {
    const featured = activeRestaurants.slice(0, 6);
    featured.forEach((r) => {
      if (!r.menu || r.menu.length === 0) {
        fetchRestaurantMenu(r.id).catch(() => {});
      }
    });
  }, [activeRestaurants, fetchRestaurantMenu]);

  const displayedRestaurants = activeRestaurants;

  function handleNavigateToRestaurant(r: Restaurant, mode: OrderMode = "now") {
    setSelectedRestaurant(r);
    setOrderMode(mode);
    navigate(`/restaurant/${r.id}`);
  }

  function handleOrderMode(mode: OrderMode) {
    setOrderMode(mode);
    navigate("/browse");
  }

  // Excessive scroll (throttled via requestAnimationFrame)
  useEffect(() => {
    let cumulative = 0;
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = window.scrollY - lastY;
          lastY = window.scrollY;
          if (delta > 0) {
            cumulative += delta;
            if (cumulative > 2800) {
              trigger("excessive-scroll");
              applyPageEffect("stretch");
              cumulative = 0;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [trigger]);

  // Erratic scroll (throttled via requestAnimationFrame)
  useEffect(() => {
    let lastDir = 0;
    let dirChanges = 0;
    let lastY = window.scrollY;
    let windowStart = Date.now();
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = window.scrollY - lastY;
          lastY = window.scrollY;
          if (delta !== 0) {
            const dir = delta > 0 ? 1 : -1;
            if (lastDir !== 0 && dir !== lastDir) dirChanges++;
            lastDir = dir;
            const now = Date.now();
            if (now - windowStart > 3000) {
              dirChanges = 0;
              windowStart = now;
            }
            if (dirChanges >= 6) {
              trigger("erratic-scroll");
              applyPageEffect("jello");
              dirChanges = 0;
              windowStart = Date.now();
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [trigger]);

  // Inactivity 30s
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function reset() {
      clearTimeout(timer);
      timer = setTimeout(() => trigger("homepage-inactive"), 30_000);
    }
    reset();
    const events = ["scroll", "mousemove", "touchstart", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [trigger]);

  // Reached bottom via IntersectionObserver
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) trigger("reached-bottom");
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [trigger]);

  return (
    <div className="pb-16 md:pb-0">
      <HomeTicker items={TICKER_ITEMS} />
      <HomeHero onOrderMode={handleOrderMode} />

      {/* Entertainment Sections: Game Arena & Movie Theater */}
      <section className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Game Arena Banner */}
        <div className="border-2 border-navy bg-navy text-cream p-6 shadow-[5px_5px_0_#BCFF4F] flex flex-col justify-between gap-5">
          <div>
            <span className="inline-block bg-golden text-navy border border-navy px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
              🎮 Game Arena · Snooker, Bowling, PC &amp; VR
            </span>
            <h2 className="font-impact text-2xl md:text-3xl uppercase tracking-wide text-cream leading-tight">
              Snooker, Bowling &amp; Gaming
            </h2>
            <p className="text-cream/75 text-xs mt-2 leading-relaxed">
              Book live stations for Snooker &amp; Pool, Cosmic 10-Pin Bowling, PS5 Pro, and RTX 4090 rigs paired with automated kitchen food delivery!
            </p>
          </div>
          <button
            onClick={() => navigate("/games")}
            className="self-start bg-raspberry text-cream border-2 border-cream px-5 py-2.5 font-impact text-sm uppercase tracking-wider shadow-[2px_2px_0_#FFF8EE] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            🎟️ Book Gaming &amp; Food →
          </button>
        </div>

        {/* Movie Theater Banner */}
        <div className="border-2 border-navy bg-[#121E24] text-cream p-6 shadow-[5px_5px_0_#E03A52] flex flex-col justify-between gap-5">
          <div>
            <span className="inline-block bg-raspberry text-cream border border-cream/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
              🍿 Private Multiplexes &amp; Theaters
            </span>
            <h2 className="font-impact text-2xl md:text-3xl uppercase tracking-wide text-cream leading-tight">
              Movie Theaters &amp; Showtimes
            </h2>
            <p className="text-cream/75 text-xs mt-2 leading-relaxed">
              Explore regional private cinemas, VIP recliner screens, IMAX auditoriums, exact movie running durations, and daily show timings.
            </p>
          </div>
          <button
            onClick={() => navigate("/theater")}
            className="self-start bg-golden text-navy border-2 border-navy px-5 py-2.5 font-impact text-sm uppercase tracking-wider shadow-[2px_2px_0_#FFF8EE] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            🎬 View Show Durations &amp; Schedules →
          </button>
        </div>
      </section>

      <RestaurantSection
        displayedRestaurants={displayedRestaurants}
        getAccent={getAccent}
        onNavigateToRestaurant={handleNavigateToRestaurant}
      />
      {popular.length > 0 && (
        <PopularSection
          popular={popular}
          activeRestaurants={activeRestaurants}
          getAccent={getAccent}
          onNavigateToRestaurant={handleNavigateToRestaurant}
        />
      )}
      <ScheduleCtaSection onOrderMode={handleOrderMode} />
      <HomeFooter footerRef={footerRef} />
    </div>
  );
}
