import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import type { MenuItem } from "@/types";
import {
  getGamePlatformsApi,
  bookGameTicketApi,
  getGameTicketsApi,
  pushGameTicketOrderApi,
  cancelGameTicketApi,
  extendGameTicketApi,
  type GamePlatform,
  type GameTicket,
  type GameFulfillmentMode,
} from "@/api";
import { ClockIcon, ZapIcon } from "@/components/icons";
import { formatCurrency } from "@syncbite/shared";

const DURATION_OPTIONS = [1, 2, 3, 4];
const PLAYER_OPTIONS = [1, 2, 3, 4];
const CATEGORY_FILTERS = [
  "ALL",
  "TURF",
  "SNOOKER",
  "BOWLING",
  "GAMING_CAFE",
  "CONSOLE",
  "PC",
  "VR",
  "TABLE",
  "ARCADE",
];

function formatRemaining(endTimeIso: string, nowMs: number): {
  text: string;
  expired: boolean;
  secondsLeft: number;
  minutesLeft: number;
  isWithinHalfHour: boolean;
} {
  const endMs = new Date(endTimeIso).getTime();
  const diffSec = Math.max(0, Math.floor((endMs - nowMs) / 1000));
  const hrs = Math.floor(diffSec / 3600);
  const mins = Math.floor((diffSec % 3600) / 60);
  const secs = diffSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    text: `${pad(hrs)}:${pad(mins)}:${pad(secs)}`,
    expired: diffSec <= 0,
    secondsLeft: diffSec,
    minutesLeft: Math.ceil(diffSec / 60),
    isWithinHalfHour: diffSec > 0 && diffSec <= 1800, // <= 30 minutes left
  };
}

export default function GamesPage() {
  const navigate = useNavigate();
  const {
    restaurants,
    cart,
    clearCart,
    fetchRestaurantMenu,
    refreshOrders,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<"book" | "tickets">("book");
  const [platforms, setPlatforms] = useState<GamePlatform[]>([]);
  const [tickets, setTickets] = useState<GameTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Booking configurator state
  const [selectedPlatform, setSelectedPlatform] = useState<GamePlatform | null>(null);
  const [durationHours, setDurationHours] = useState<number>(2);
  const [playersCount, setPlayersCount] = useState<number>(1);
  const [pairFood, setPairFood] = useState<boolean>(true);
  const [fulfillmentMode, setFulfillmentMode] = useState<GameFulfillmentMode>("DINE_IN");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [branchMenu, setBranchMenu] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [foodSelections, setFoodSelections] = useState<
    Record<string, { item: MenuItem; qty: number }>
  >({});
  const [foodInstructions, setFoodInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Live clock for countdown timers
  const [nowMs, setNowMs] = useState(() => Date.now());

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [platList, tickList] = await Promise.all([
        getGamePlatformsApi(),
        getGameTicketsApi(),
      ]);
      // Exclude THEATER platforms from Game Arena (it lives separately in /theater)
      const nonTheaterPlats = platList.filter(
        (p) => p.category.toUpperCase() !== "THEATER",
      );
      const nonTheaterTickets = tickList.filter(
        (t) => t.platform?.category?.toUpperCase() !== "THEATER",
      );
      setPlatforms(nonTheaterPlats);
      setTickets(nonTheaterTickets);
      if (nonTheaterPlats.length > 0 && (!selectedPlatform || selectedPlatform.category.toUpperCase() === "THEATER")) {
        setSelectedPlatform(nonTheaterPlats[0]);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedPlatform]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Pre-select first open restaurant or cart's restaurant
  useEffect(() => {
    if (!selectedBranchId && restaurants.length > 0) {
      const cartRestId = cart[0]?.restaurantId;
      const defaultRest =
        restaurants.find((r) => r.id === cartRestId) ||
        restaurants.find((r) => r.isOpen) ||
        restaurants[0];
      if (defaultRest) {
        setSelectedBranchId(defaultRest.id);
      }
    }
  }, [restaurants, cart, selectedBranchId]);

  // Pre-fill food selections from student cart if same restaurant
  useEffect(() => {
    if (cart.length > 0 && selectedBranchId && cart[0]?.restaurantId === selectedBranchId) {
      const initial: Record<string, { item: MenuItem; qty: number }> = {};
      for (const ci of cart) {
        initial[ci.menuItem.id] = { item: ci.menuItem, qty: ci.quantity };
      }
      setFoodSelections((prev) => (Object.keys(prev).length === 0 ? initial : prev));
    }
  }, [cart, selectedBranchId]);

  // Fetch menu whenever selectedBranchId changes
  useEffect(() => {
    if (!selectedBranchId) return;
    let cancelled = false;
    setLoadingMenu(true);
    fetchRestaurantMenu(selectedBranchId)
      .then((items) => {
        if (!cancelled) setBranchMenu(items);
      })
      .catch(() => {
        if (!cancelled) setBranchMenu([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMenu(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedBranchId, fetchRestaurantMenu]);

  // 1-second ticker for countdowns + auto-trigger push if timer reaches 0
  useEffect(() => {
    const interval = setInterval(() => {
      const current = Date.now();
      setNowMs(current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll tickets every 8s when on tickets tab so backend scheduler updates show live
  useEffect(() => {
    if (activeTab !== "tickets") return;
    const poll = setInterval(() => {
      getGameTicketsApi()
        .then(setTickets)
        .catch(() => {});
      void refreshOrders();
    }, 8000);
    return () => clearInterval(poll);
  }, [activeTab, refreshOrders]);

  function updateFoodQty(item: MenuItem, delta: number) {
    setFoodSelections((prev) => {
      const existing = prev[item.id]?.qty ?? 0;
      const nextQty = Math.max(0, existing + delta);
      const copy = { ...prev };
      if (nextQty === 0) {
        delete copy[item.id];
      } else {
        copy[item.id] = { item, qty: nextQty };
      }
      return copy;
    });
  }

  const selectedFoodList = Object.values(foodSelections);
  const foodTotal = selectedFoodList.reduce(
    (sum, entry) => sum + entry.item.price * entry.qty,
    0,
  );
  const gameTotal = selectedPlatform
    ? selectedPlatform.hourly_rate * durationHours * playersCount
    : 0;
  const comboTotal = gameTotal + (pairFood ? foodTotal : 0);

  const selectedBranch = restaurants.find((r) => r.id === selectedBranchId);

  async function handleBookTicketAndFood() {
    if (!selectedPlatform || submitting) return;
    setBannerMessage(null);
    setSubmitting(true);

    try {
      const hasFood = pairFood && selectedBranchId && selectedFoodList.length > 0;
      const createdTicket = await bookGameTicketApi({
        platform_id: selectedPlatform.id,
        duration_hours: durationHours,
        players_count: playersCount,
        food_order: hasFood
          ? {
              branch_id: selectedBranchId,
              branch_name: selectedBranch?.name || "Campus Stall",
              fulfillment_mode: fulfillmentMode,
              items: selectedFoodList.map(({ item, qty }) => ({
                menu_item_id: item.id,
                quantity: qty,
                selected_modifiers_snapshot: [
                  {
                    note: `[${fulfillmentMode.replace("_", "-")}] Auto-pushed after ${durationHours}h game (${selectedPlatform.name})`,
                  },
                ],
              })),
              instructions:
                foodInstructions.trim() ||
                `${fulfillmentMode === "DINE_IN" ? "Dine-In" : "Takeaway"} order paired with ${durationHours}h ${selectedPlatform.name} session`,
            }
          : null,
      });

      if (hasFood && cart[0]?.restaurantId === selectedBranchId) {
        clearCart();
      }
      setFoodSelections({});
      setFoodInstructions("");
      await Promise.all([loadData(), refreshOrders()]);
      setActiveTab("tickets");
      setBannerMessage({
        type: "success",
        text: hasFood
          ? `Ticket ${createdTicket.ticket_code} booked for ${durationHours}h! Your ${fulfillmentMode === "DINE_IN" ? "Dine-In" : "Takeaway"} food order is scheduled and will automatically push to ${selectedBranch?.name || "the restaurant"} when your ${durationHours}h game ends.`
          : `Game Ticket ${createdTicket.ticket_code} booked on ${selectedPlatform.name} (${createdTicket.station_label})!`,
      });
    } catch (err) {
      setBannerMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not book game ticket. Please make sure you are signed in and the backend is running.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePushOrderNow(ticket: GameTicket) {
    if (actionBusyId) return;
    setActionBusyId(ticket.id);
    setBannerMessage(null);
    try {
      const updated = await pushGameTicketOrderApi(ticket.id);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      await refreshOrders();
      setBannerMessage({
        type: "success",
        text: `⚡ Game session ${updated.ticket_code} completed! Your ${updated.fulfillment_mode === "TAKEAWAY" ? "Takeaway" : "Dine-In"} food order has been automatically pushed to the restaurant kitchen!`,
      });
    } catch (err) {
      setBannerMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to push order to restaurant.",
      });
    } finally {
      setActionBusyId(null);
    }
  }

  async function handleCancelTicket(ticket: GameTicket) {
    if (actionBusyId) return;
    setActionBusyId(ticket.id);
    setBannerMessage(null);
    try {
      const updated = await cancelGameTicketApi(ticket.id);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      await Promise.all([loadData(), refreshOrders()]);
      setBannerMessage({
        type: "success",
        text: `Ticket ${updated.ticket_code} and its scheduled food order were cancelled.`,
      });
    } catch (err) {
      setBannerMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to cancel game ticket.",
      });
    } finally {
      setActionBusyId(null);
    }
  }

  async function handleExtendTicket(ticket: GameTicket, additionalHours: number = 1) {
    if (actionBusyId) return;
    setActionBusyId(ticket.id);
    setBannerMessage(null);
    try {
      const updated = await extendGameTicketApi(ticket.id, additionalHours);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      await refreshOrders();
      setBannerMessage({
        type: "success",
        text: `⏳ Session extended by +${additionalHours}h! Total game time is now ${updated.duration_hours}h. Your food delivery time has been automatically rescheduled to ${new Date(updated.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}!`,
      });
    } catch (err) {
      setBannerMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to extend play time.",
      });
    } finally {
      setActionBusyId(null);
    }
  }

  const filteredPlatforms = platforms.filter((p) =>
    categoryFilter === "ALL" ? true : p.category.toUpperCase() === categoryFilter,
  );

  const activeTicketsCount = tickets.filter((t) => t.status === "ACTIVE").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-12">
      {/* Hero Banner */}
      <div className="border-2 border-navy bg-navy text-cream p-6 md:p-8 shadow-[5px_5px_0_#E03A52] mb-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-raspberry text-cream px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] border border-cream/30 mb-3">
              <ZapIcon size={12} />
              Campus Game Arena × Auto-Push Dining
            </div>
            <h1 className="font-impact text-4xl md:text-6xl uppercase tracking-wide leading-none text-cream">
              Game Platform Tickets &amp; Food Sync
            </h1>
            <p className="text-cream/75 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
              Book PS5 Pro, RTX 4090 PC, VR, Snooker or Bowling tickets and pre-order your meal (
              <span className="text-golden font-bold">Dine-In</span> or{" "}
              <span className="text-golden font-bold">Takeaway</span>). If your game time is{" "}
              <span className="text-golden font-bold">2 hours</span>, at the end of 2 hours your
              food order is <span className="underline decoration-raspberry">automatically pushed</span>{" "}
              straight to the restaurant kitchen!
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("book")}
              className={`px-4 py-3 border-2 border-cream font-impact text-base uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "book"
                  ? "bg-golden text-navy shadow-[3px_3px_0_#FFF8EE]"
                  : "bg-navy text-cream hover:bg-cream/10"
              }`}
            >
              🎮 Book Tickets &amp; Food
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-4 py-3 border-2 border-cream font-impact text-base uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "tickets"
                  ? "bg-raspberry text-cream shadow-[3px_3px_0_#FFF8EE]"
                  : "bg-navy text-cream hover:bg-cream/10"
              }`}
            >
              🎟️ My Tickets
              {activeTicketsCount > 0 && (
                <span className="bg-golden text-navy text-xs font-sans font-black px-1.5 py-0.5 border border-navy">
                  {activeTicketsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {bannerMessage && (
        <div
          className={`mb-6 p-4 border-2 border-navy shadow-[4px_4px_0_#17232B] flex items-center justify-between gap-4 ${
            bannerMessage.type === "success"
              ? "bg-sage text-white"
              : "bg-raspberry text-cream"
          }`}
        >
          <p className="text-xs md:text-sm font-bold leading-snug">{bannerMessage.text}</p>
          <button
            onClick={() => setBannerMessage(null)}
            className="text-xs font-bold uppercase tracking-wider px-2 py-1 border border-current hover:opacity-80 shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Global 30-Minute Food Prep Alarm Alert */}
      {tickets.some(
        (t) =>
          t.status === "ACTIVE" &&
          t.linked_order_id &&
          !t.order_pushed &&
          formatRemaining(t.end_time, nowMs).isWithinHalfHour,
      ) && (
        <div className="mb-6 p-4 border-3 border-navy bg-golden shadow-[5px_5px_0_#E03A52] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">⏰</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-impact text-base uppercase text-navy">
                  🚨 Customer Alert: Food Preparation Starting in &lt; 30 Minutes!
                </span>
                <span className="bg-raspberry text-cream text-[10px] font-mono font-bold px-1.5 py-0.5 border border-navy">
                  ACTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-navy/80 mt-0.5">
                The restaurant kitchen is getting ready to prepare your hot meal for your game end! If you want to keep playing, add more play time now so your food is delivered fresh when you actually finish!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const target = tickets.find(
                  (t) =>
                    t.status === "ACTIVE" &&
                    t.linked_order_id &&
                    !t.order_pushed &&
                    formatRemaining(t.end_time, nowMs).isWithinHalfHour,
                );
                if (target) void handleExtendTicket(target, 1);
              }}
              className="px-4 py-2 bg-navy text-golden border-2 border-navy font-impact text-sm uppercase tracking-wider shadow-[2px_2px_0_#FFF8EE] hover:bg-raspberry hover:text-cream transition-all cursor-pointer"
            >
              +1 Hour Play (Delay Food Prep)
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className="px-3 py-2 bg-cream text-navy border-2 border-navy font-bold text-xs uppercase cursor-pointer"
            >
              View Ticket
            </button>
          </div>
        </div>
      )}

      {activeTab === "book" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 7 COLS: Game Platforms Catalog */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-navy pb-3">
              <div>
                <h2 className="font-impact text-2xl uppercase text-navy">
                  1. Choose Your Activity or Arena
                </h2>
                <p className="text-xs text-navy/60">
                  Turfs, Snooker clubs, Bowling alleys &amp; Gaming cafes near VIT
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_FILTERS.map((cat) => {
                  const labels: Record<string, string> = {
                    ALL: "All",
                    TURF: "⚽ Turfs",
                    SNOOKER: "🎱 Snooker",
                    BOWLING: "🎳 Bowling",
                    GAMING_CAFE: "🖥️ Gaming Cafes",
                    CONSOLE: "🎮 Console",
                    PC: "💻 PC Rigs",
                    VR: "🥽 VR",
                    TABLE: "🏓 Table",
                    ARCADE: "🕹️ Arcade",
                  };
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border-2 border-navy transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? "bg-navy text-cream"
                          : "bg-cream text-navy hover:bg-golden"
                      }`}
                    >
                      {labels[cat] || cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {loading ? (
              <div className="p-12 border-2 border-navy bg-cream text-center font-bold text-navy/50 uppercase tracking-widest text-xs">
                Loading Game Platforms…
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPlatforms.map((platform) => {
                  const isSelected = selectedPlatform?.id === platform.id;
                  const isFull = platform.available_units <= 0;
                  return (
                    <div
                      key={platform.id}
                      onClick={() => !isFull && setSelectedPlatform(platform)}
                      className={`border-2 border-navy bg-cream flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-raspberry shadow-[5px_5px_0_#E03A52] -translate-x-0.5 -translate-y-0.5"
                          : "shadow-[3px_3px_0_#17232B] hover:shadow-[5px_5px_0_#17232B]"
                      } ${isFull ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <div>
                        <div className="relative h-36 bg-navy overflow-hidden border-b-2 border-navy">
                          {platform.image_url ? (
                            <img
                              src={platform.image_url}
                              alt={platform.name}
                              className="w-full h-full object-cover opacity-90"
                            />
                          ) : null}
                          <div className="absolute top-2 left-2 bg-navy text-golden border border-cream/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            {platform.category}
                          </div>
                          <div
                            className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-navy ${
                              isFull
                                ? "bg-raspberry text-cream"
                                : "bg-sage text-white"
                            }`}
                          >
                            {platform.available_units}/{platform.total_units} Free
                          </div>
                          <div className="absolute bottom-2 right-2 bg-golden text-navy border-2 border-navy px-2.5 py-0.5 font-impact text-base">
                            {formatCurrency(platform.hourly_rate)}/hr
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-impact text-xl uppercase text-navy leading-tight">
                              {platform.name}
                            </h3>
                          </div>
                          <p className="text-[11px] font-bold text-raspberry uppercase tracking-wider mt-0.5">
                            📍 {platform.location}
                          </p>
                          <p className="text-xs text-navy/70 mt-2 line-clamp-2">
                            {platform.description}
                          </p>

                          {Array.isArray(platform.features) && platform.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {platform.features.map((feat, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-bold bg-cream-100 border border-navy/30 px-2 py-0.5 text-navy/80"
                                >
                                  {feat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-4 pb-4 pt-2">
                        <button
                          type="button"
                          disabled={isFull}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isFull) setSelectedPlatform(platform);
                          }}
                          className={`w-full py-2 border-2 border-navy font-impact text-sm uppercase tracking-wider transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-raspberry text-cream"
                              : "bg-cream-100 text-navy hover:bg-golden"
                          }`}
                        >
                          {isFull
                            ? "All Stations Occupied"
                            : isSelected
                              ? "✓ Selected for Ticket"
                              : "Select Platform"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: Ticket Duration + Auto-Push Food Configurator */}
          <div className="lg:col-span-5 border-2 border-navy bg-cream shadow-[5px_5px_0_#17232B] p-5 space-y-5 sticky top-20">
            <div className="border-b-2 border-navy pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-raspberry">
                Step 2 &amp; 3 · Ticket + Food Auto-Push
              </span>
              <h2 className="font-impact text-2xl uppercase text-navy mt-0.5">
                {selectedPlatform ? selectedPlatform.name : "Select a Game Platform"}
              </h2>
              {selectedPlatform && (
                <p className="text-xs text-navy/60">
                  {selectedPlatform.location} · {formatCurrency(selectedPlatform.hourly_rate)}/hr per player
                </p>
              )}
            </div>

            {/* Game Duration Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                ⏱️ Game Session Duration (Auto-pushes food at end of timer)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DURATION_OPTIONS.map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDurationHours(hrs)}
                    className={`py-2.5 border-2 border-navy font-impact text-base uppercase tracking-wider transition-all cursor-pointer ${
                      durationHours === hrs
                        ? "bg-navy text-golden shadow-[2px_2px_0_#E03A52]"
                        : "bg-cream-100 text-navy hover:bg-golden/40"
                    }`}
                  >
                    {hrs} {hrs === 1 ? "Hr" : "Hrs"}
                    {hrs === 2 && (
                      <span className="block text-[9px] font-sans font-bold text-raspberry">
                        Popular
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Players Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                👥 Number of Players / Controllers
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PLAYER_OPTIONS.map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setPlayersCount(cnt)}
                    className={`py-2 border-2 border-navy text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      playersCount === cnt
                        ? "bg-raspberry text-cream"
                        : "bg-cream-100 text-navy hover:bg-golden/40"
                    }`}
                  >
                    {cnt} {cnt === 1 ? "Player" : "Players"}
                  </button>
                ))}
              </div>
            </div>

            {/* Pair Food Order Toggle */}
            <div className="border-2 border-navy bg-cream-100 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-impact text-base uppercase text-navy">
                    🍔 Add Auto-Pushed Restaurant Order
                  </p>
                  <p className="text-[11px] text-navy/60">
                    Automatically pushes to restaurant at the end of your {durationHours}h game
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPairFood((v) => !v)}
                  className={`px-3 py-1 border-2 border-navy text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                    pairFood ? "bg-sage text-white" : "bg-cream text-navy"
                  }`}
                >
                  {pairFood ? "Enabled ✓" : "Ticket Only"}
                </button>
              </div>

              {pairFood && (
                <div className="space-y-3 pt-2 border-t border-navy/15">
                  {/* Dine-In vs Takeaway Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                      Fulfillment Mode (When {durationHours}h Game Ends)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFulfillmentMode("DINE_IN")}
                        className={`py-2 px-3 border-2 border-navy text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                          fulfillmentMode === "DINE_IN"
                            ? "bg-golden text-navy shadow-[2px_2px_0_#17232B]"
                            : "bg-cream text-navy/60"
                        }`}
                      >
                        🍽️ Dine-In
                      </button>
                      <button
                        type="button"
                        onClick={() => setFulfillmentMode("TAKEAWAY")}
                        className={`py-2 px-3 border-2 border-navy text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                          fulfillmentMode === "TAKEAWAY"
                            ? "bg-golden text-navy shadow-[2px_2px_0_#17232B]"
                            : "bg-cream text-navy/60"
                        }`}
                      >
                        🥡 Takeaway
                      </button>
                    </div>
                  </div>

                  {/* Restaurant Stall Picker */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                      Select Restaurant Stall
                    </label>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => {
                        setSelectedBranchId(e.target.value);
                        setFoodSelections({});
                      }}
                      className="w-full border-2 border-navy bg-cream px-3 py-2 text-xs font-bold text-navy focus:outline-none"
                    >
                      {restaurants.length === 0 && (
                        <option value="">No restaurant stalls loaded</option>
                      )}
                      {restaurants.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.category}) {r.isOpen ? "· Open" : "· Closed"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Menu Item Picker */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-navy/70">
                        Pick Food Items ({selectedFoodList.length} selected)
                      </label>
                      {selectedFoodList.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFoodSelections({})}
                          className="text-[10px] font-bold text-raspberry underline cursor-pointer"
                        >
                          Clear food
                        </button>
                      )}
                    </div>

                    {loadingMenu ? (
                      <div className="p-4 text-center text-xs text-navy/50 border border-navy/20 bg-cream">
                        Loading stall menu…
                      </div>
                    ) : branchMenu.length === 0 ? (
                      <div className="p-3 text-center text-xs text-navy/50 border border-navy/20 bg-cream">
                        No menu items found for this stall.
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto border-2 border-navy bg-cream divide-y divide-navy/10">
                        {branchMenu.map((item) => {
                          const qty = foodSelections[item.id]?.qty ?? 0;
                          return (
                            <div
                              key={item.id}
                              className="px-3 py-2 flex items-center justify-between gap-2 text-xs"
                            >
                              <div className="min-w-0">
                                <p className="font-bold text-navy truncate">
                                  <span
                                    className={`inline-block w-2 h-2 mr-1.5 rounded-full ${
                                      item.isVeg ? "bg-sage" : "bg-raspberry"
                                    }`}
                                  />
                                  {item.name}
                                </p>
                                <p className="text-[11px] font-mono text-navy/60">
                                  {formatCurrency(item.price)}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {qty > 0 ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => updateFoodQty(item, -1)}
                                      className="w-6 h-6 border border-navy bg-cream-100 font-bold text-navy hover:bg-raspberry hover:text-cream cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="w-5 text-center font-bold text-navy">
                                      {qty}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => updateFoodQty(item, 1)}
                                      className="w-6 h-6 border border-navy bg-navy text-cream font-bold hover:bg-raspberry cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => updateFoodQty(item, 1)}
                                    className="px-2.5 py-1 border border-navy bg-golden/60 hover:bg-golden text-[10px] font-bold uppercase tracking-wider text-navy cursor-pointer"
                                  >
                                    + Add
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={foodInstructions}
                    onChange={(e) => setFoodInstructions(e.target.value)}
                    placeholder="Optional note (e.g. Table 4 for Dine-In, Extra spicy)…"
                    className="w-full border-2 border-navy bg-cream px-3 py-1.5 text-xs text-navy placeholder:text-navy/40 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Auto-Push Explanation Callout */}
            <div className="bg-navy text-cream p-3 border-2 border-navy text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-golden uppercase tracking-wider text-[10px]">
                <span>⚡ Automatic End-of-Game Push</span>
                <span>{durationHours}h Timer</span>
              </div>
              <p className="text-cream/80 text-[11px] leading-relaxed">
                {pairFood && selectedFoodList.length > 0 ? (
                  <>
                    Your{" "}
                    <strong className="text-golden">
                      {fulfillmentMode === "DINE_IN" ? "Dine-In" : "Takeaway"}
                    </strong>{" "}
                    food order ({selectedFoodList.reduce((s, x) => s + x.qty, 0)} items) will be
                    held in <strong className="text-golden">SCHEDULED</strong> state and
                    automatically pushed to{" "}
                    <strong className="text-cream">
                      {selectedBranch?.name || "the restaurant"}
                    </strong>{" "}
                    at the end of your <strong className="text-golden">{durationHours}-hour</strong>{" "}
                    game session!
                  </>
                ) : (
                  <>
                    Select food items above if you want your meal automatically pushed to the
                    restaurant when your {durationHours}-hour game ends.
                  </>
                )}
              </p>
            </div>

            {/* Price Breakdown & Submit */}
            <div className="space-y-2 pt-2 border-t-2 border-navy">
              <div className="flex justify-between text-xs text-navy/70">
                <span>
                  Game Ticket ({durationHours}h × {playersCount}p)
                </span>
                <span className="font-bold text-navy">{formatCurrency(gameTotal)}</span>
              </div>
              {pairFood && selectedFoodList.length > 0 && (
                <div className="flex justify-between text-xs text-navy/70">
                  <span>
                    Paired Food ({fulfillmentMode === "DINE_IN" ? "Dine-In" : "Takeaway"})
                  </span>
                  <span className="font-bold text-navy">{formatCurrency(foodTotal)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-impact text-lg uppercase text-navy">Total Payable</span>
                <span className="font-impact text-2xl text-raspberry">
                  {formatCurrency(comboTotal)}
                </span>
              </div>

              <button
                type="button"
                disabled={!selectedPlatform || submitting}
                onClick={handleBookTicketAndFood}
                className="w-full mt-2 py-3.5 bg-raspberry text-cream border-2 border-navy font-impact text-lg uppercase tracking-wider shadow-[4px_4px_0_#17232B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#17232B] transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting
                  ? "Booking Ticket & Scheduling Food…"
                  : pairFood && selectedFoodList.length > 0
                    ? `Book ${durationHours}h Game + Schedule ${fulfillmentMode === "DINE_IN" ? "Dine-In" : "Takeaway"}`
                    : `Book ${durationHours}h Game Ticket`}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: MY BOOKED GAME TICKETS & LIVE AUTO-PUSH TIMERS */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-navy pb-4">
            <div>
              <h2 className="font-impact text-3xl uppercase text-navy">
                My Game Platform Tickets
              </h2>
              <p className="text-xs text-navy/60">
                Live session timers &amp; automatic end-of-game restaurant order push status
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void loadData()}
                className="px-3 py-2 border-2 border-navy bg-cream text-xs font-bold uppercase tracking-wider hover:bg-golden transition-colors cursor-pointer"
              >
                ↻ Refresh Tickets
              </button>
              <button
                onClick={() => navigate("/orders")}
                className="px-3 py-2 border-2 border-navy bg-navy text-cream text-xs font-bold uppercase tracking-wider hover:bg-raspberry transition-colors cursor-pointer"
              >
                View Food Orders →
              </button>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div className="border-2 border-dashed border-navy/30 p-16 text-center bg-cream">
              <h3 className="font-impact text-3xl uppercase text-navy/40 mb-2">
                No Game Tickets Booked Yet
              </h3>
              <p className="text-xs text-navy/50 mb-6">
                Book a game platform slot and pair a Dine-In or Takeaway food order that
                auto-pushes when your game finishes!
              </p>
              <button
                onClick={() => setActiveTab("book")}
                className="px-6 py-3 bg-raspberry text-cream border-2 border-navy font-impact text-base uppercase tracking-wider shadow-[3px_3px_0_#17232B] cursor-pointer"
              >
                Browse Game Platforms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {tickets.map((ticket) => {
                const rem = formatRemaining(ticket.end_time, nowMs);
                const isActive = ticket.status === "ACTIVE";
                const hasFood = Boolean(ticket.linked_order_id);
                const linkedOrder = ticket.linked_order;

                return (
                  <div
                    key={ticket.id}
                    className="border-2 border-navy bg-cream shadow-[4px_4px_0_#17232B] overflow-hidden flex flex-col justify-between"
                  >
                    {/* Ticket Header */}
                    <div>
                      <div className="bg-navy text-cream px-4 py-3 flex items-center justify-between border-b-2 border-navy">
                        <div className="flex items-center gap-2">
                          <span className="bg-golden text-navy font-mono font-black text-xs px-2 py-0.5 border border-cream">
                            {ticket.ticket_code}
                          </span>
                          <span className="font-mono text-xs text-cream/80 font-bold">
                            Station: {ticket.station_label}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 border ${
                            ticket.status === "ACTIVE"
                              ? "bg-sage text-white border-white/40"
                              : ticket.status === "COMPLETED"
                                ? "bg-golden text-navy border-navy"
                                : "bg-raspberry text-cream border-white/40"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>

                      {/* Ticket Body */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-impact text-2xl uppercase text-navy leading-none">
                              {ticket.platform?.name || "Game Arena Session"}
                            </h3>
                            <p className="text-xs text-navy/60 mt-1">
                              {ticket.duration_hours} Hour Session · {ticket.players_count}{" "}
                              {ticket.players_count === 1 ? "Player" : "Players"} ·{" "}
                              {formatCurrency(ticket.ticket_amount)}
                            </p>
                          </div>

                          {/* Live Countdown Box */}
                          {isActive && (
                            <div className="border-2 border-navy bg-golden px-3 py-1.5 text-right shrink-0">
                              <span className="block text-[9px] font-bold uppercase tracking-wider text-navy/70">
                                {rem.expired ? "Session Ended" : "Time Remaining"}
                              </span>
                              <span className="font-mono font-black text-base text-navy">
                                {rem.text}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-[11px] text-navy/60 font-mono bg-cream-100 px-3 py-2 border border-navy/20">
                          <span className="flex items-center gap-1">
                            <ClockIcon size={11} />
                            Start:{" "}
                            {new Date(ticket.start_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>→</span>
                          <span>
                            End (Auto-Push):{" "}
                            {new Date(ticket.end_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Paired Food Order Section */}
                        {hasFood ? (
                          <div className="border-2 border-navy bg-cream-100 p-3 space-y-2">
                            {/* 30-MINUTE KITCHEN ALARM NOTIFICATION */}
                            {isActive && !ticket.order_pushed && rem.isWithinHalfHour && (
                              <div className="bg-golden border-2 border-navy p-2.5 animate-pulse flex items-start gap-2 shadow-[2px_2px_0_#17232B]">
                                <span className="text-xl">🔔</span>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-impact text-xs uppercase tracking-wider text-navy">
                                      30-Min Food Prep Alarm!
                                    </span>
                                    <span className="bg-raspberry text-cream font-mono font-black text-[10px] px-1.5 py-0.5 border border-navy">
                                      {rem.minutesLeft} min left
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-bold text-navy/90 leading-tight mt-0.5">
                                    Restaurant kitchen will start firing up your order in {rem.minutesLeft} minutes!
                                  </p>
                                  <p className="text-[10px] text-navy/70 mt-1">
                                    Want to keep playing? Click <strong>+1 Hour Play</strong> below to delay cooking and keep your food hot!
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold uppercase text-navy">
                                  Paired Food Order
                                </span>
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-navy bg-golden text-navy">
                                  {ticket.fulfillment_mode === "TAKEAWAY"
                                    ? "🥡 Takeaway"
                                    : "🍽️ Dine-In"}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                                  ticket.order_pushed
                                    ? "bg-sage text-white"
                                    : "bg-navy text-golden"
                                }`}
                              >
                                {ticket.order_pushed
                                  ? "✓ Auto-Pushed to Restaurant"
                                  : "⏳ Scheduled (Waiting for Game End)"}
                              </span>
                            </div>

                            {linkedOrder && (
                              <div className="text-xs text-navy/80 space-y-1">
                                <p className="font-bold text-navy">
                                  Stall:{" "}
                                  {linkedOrder.delivery_address_snapshot?.branch_name ||
                                    "Campus Restaurant"}{" "}
                                  · Order Status:{" "}
                                  <span className="text-raspberry uppercase">
                                    {linkedOrder.status}
                                  </span>
                                </p>
                                <p className="text-navy/60 text-[11px]">
                                  Items:{" "}
                                  {(linkedOrder.items || [])
                                    .map((i) => `${i.quantity}× ${i.item_name_snapshot}`)
                                    .join(", ")}{" "}
                                  ({formatCurrency(linkedOrder.total_amount)})
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-navy/40 italic">
                            No food order paired with this game ticket.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ticket Actions Footer */}
                    {isActive && (
                      <div className="px-4 py-3 bg-cream-100 border-t-2 border-navy space-y-2">
                        {/* Extend Play Time Strip */}
                        {!ticket.order_pushed && (
                          <div className="bg-golden/30 border border-navy/40 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <p className="text-[11px] font-black uppercase text-navy flex items-center gap-1">
                                <span>⏳ Need More Game Time?</span>
                              </p>
                              <p className="text-[10px] text-navy/70 leading-tight">
                                Increasing play time automatically pushes food delivery back so your food stays steaming hot!
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                disabled={actionBusyId === ticket.id}
                                onClick={() => void handleExtendTicket(ticket, 1)}
                                className="px-2.5 py-1.5 bg-golden text-navy border-2 border-navy font-impact text-xs uppercase tracking-wider hover:bg-navy hover:text-golden transition-all shadow-[1px_1px_0_#17232B] cursor-pointer"
                              >
                                +1 Hour Play
                              </button>
                              <button
                                type="button"
                                disabled={actionBusyId === ticket.id}
                                onClick={() => void handleExtendTicket(ticket, 2)}
                                className="px-2.5 py-1.5 bg-golden text-navy border-2 border-navy font-impact text-xs uppercase tracking-wider hover:bg-navy hover:text-golden transition-all shadow-[1px_1px_0_#17232B] cursor-pointer"
                              >
                                +2 Hours
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {hasFood && !ticket.order_pushed ? (
                            <button
                              type="button"
                              disabled={actionBusyId === ticket.id}
                              onClick={() => void handlePushOrderNow(ticket)}
                              className="flex-1 py-2 px-3 bg-raspberry text-cream border-2 border-navy font-impact text-sm uppercase tracking-wider shadow-[2px_2px_0_#17232B] hover:bg-navy transition-colors cursor-pointer"
                            >
                              {actionBusyId === ticket.id
                                ? "Pushing to Restaurant…"
                                : `⚡ Simulate ${ticket.duration_hours}h End & Push Order Now`}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={actionBusyId === ticket.id}
                              onClick={() => void handlePushOrderNow(ticket)}
                              className="flex-1 py-2 px-3 bg-navy text-cream border-2 border-navy font-impact text-sm uppercase tracking-wider cursor-pointer"
                            >
                              Complete Game Session
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={actionBusyId === ticket.id}
                            onClick={() => void handleCancelTicket(ticket)}
                            className="py-2 px-3 border-2 border-navy bg-cream text-navy text-xs font-bold uppercase tracking-wider hover:bg-raspberry hover:text-cream transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

