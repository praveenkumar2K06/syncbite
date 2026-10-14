import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Restaurant, OrderMode, Page } from "@/types";
import { useHumor } from "@/components/HumorSystem";
import { useAppContext } from "@/context/AppContext";
import {
  BROWSE_HUMOR_LINES,
  getAccent,
  type BrowseFilterKey,
  BrowseHeader,
  BrowseFilterBar,
  BrowseGrid,
} from "@/components/browse";

interface BrowsePageProps {
  onNavigate?: (page: Page, opts?: { restaurant?: Restaurant; mode?: OrderMode }) => void;
  restaurants?: Restaurant[];
}

export default function BrowsePage({
  onNavigate: propNavigate,
  restaurants: propRestaurants,
}: BrowsePageProps = {}) {
  const { restaurants: ctxRestaurants, setOrderMode, setSelectedRestaurant } = useAppContext();
  const navigate = useNavigate();
  const activeRestaurants = propRestaurants ?? ctxRestaurants;

  const onNavigate =
    propNavigate ??
    ((page: Page, opts?: { restaurant?: Restaurant; mode?: OrderMode }) => {
      if (page === "restaurant" && opts?.restaurant) {
        setSelectedRestaurant(opts.restaurant);
        setOrderMode(opts.mode ?? "now");
        navigate(`/restaurant/${opts.restaurant.id}`);
      } else {
        navigate(`/${page}`);
      }
    });
  const { trigger } = useHumor();
  const [filter, setFilter] = useState<BrowseFilterKey>("all");
  const [humorLine] = useState(
    () => BROWSE_HUMOR_LINES[Math.floor(Math.random() * BROWSE_HUMOR_LINES.length)],
  );
  const hoverCount = useRef(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger humor if user hovers many cards without clicking (indecisive browsing)
  function onCardHover() {
    hoverCount.current++;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      hoverCount.current = 0;
    }, 8000);
    if (hoverCount.current >= 5) {
      trigger("long-browse-no-order");
      hoverCount.current = 0;
    }
  }

  // Trigger humor when they land on this page after coming from restaurant (revisit pattern)
  useEffect(() => {
    const timer = setTimeout(() => trigger("homepage-inactive"), 25000);
    return () => clearTimeout(timer);
  }, [trigger]);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  const filtered = activeRestaurants.filter((r) => {
    if (filter === "open") return r.isOpen;
    if (filter === "veg_only") return r.menu.length > 0 && r.menu.every((m) => m.isVeg);
    if (filter === "has_veg") return r.menu.some((m) => m.isVeg);
    return true;
  });

  return (
    <div className="pb-28 md:pb-12">
      <BrowseHeader humorLine={humorLine} />
      <BrowseFilterBar
        currentFilter={filter}
        onFilterChange={setFilter}
        filteredCount={filtered.length}
      />
      <BrowseGrid
        restaurants={filtered}
        activeRestaurants={activeRestaurants}
        getAccent={getAccent}
        onNavigate={onNavigate}
        onHover={onCardHover}
      />
    </div>
  );
}
