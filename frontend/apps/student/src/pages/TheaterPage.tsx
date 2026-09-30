import { useState, useEffect } from "react";
import { ClockIcon, ZapIcon } from "@/components/icons";
import { formatCurrency } from "@syncbite/shared";
import { useAppContext } from "@/context/AppContext";
import type { MenuItem } from "@/types";

interface TheaterVenue {
  id: string;
  theaterName: string;
  screenType: string;
  location: string;
  pricePerSeat: number;
  showtimes: string[];
  experience: string;
}

interface MovieListing {
  id: string;
  title: string;
  language: string;
  genre: string;
  duration: string;
  rating: string;
  certification: string;
  synopsis: string;
  posterUrl: string;
  theaters: TheaterVenue[];
}

export interface TheaterPairedFood {
  branchId: string;
  branchName: string;
  fulfillmentMode: "THEATER_SEAT" | "TAKEAWAY";
  items: Array<{ item: MenuItem; qty: number }>;
  totalAmount: number;
  orderPushed: boolean;
  orderPushedAt?: string;
  targetPushTime: string;
}

interface ConfirmedBooking {
  bookingId: string;
  movieTitle: string;
  duration: string;
  theaterName: string;
  screenType: string;
  location: string;
  showtime: string;
  seats: string[];
  totalAmount: number;
  bookedAt: string;
  pairedFood?: TheaterPairedFood | null;
}

const SEAT_LAYOUT_ROWS = ["A", "B", "C", "D", "E"];
const SEATS_PER_ROW = 8;

const FEATURED_MOVIES: MovieListing[] = [
  {
    id: "m-1",
    title: "Dune: Part Two",
    language: "English / IMAX",
    genre: "Sci-Fi · Adventure · Action",
    duration: "2h 46m",
    rating: "8.6/10",
    certification: "UA 16+",
    synopsis:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    posterUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    theaters: [
      {
        id: "t-1",
        theaterName: "PVR Gold Class / Cinepolis VIP",
        screenType: "IMAX 4K Laser · Dolby Atmos",
        location: "Grand Galleria Mall",
        pricePerSeat: 450,
        showtimes: ["11:30 AM", "02:45 PM", "06:15 PM", "09:45 PM"],
        experience: "VIP Motorized Recliners · Gourmet In-Seat Service",
      },
      {
        id: "t-2",
        theaterName: "INOX Insignia Luxe Cinema",
        screenType: "Dolby Vision · 7.1.4 Atmos",
        location: "City Square Center",
        pricePerSeat: 550,
        showtimes: ["01:00 PM", "04:30 PM", "08:00 PM", "11:15 PM"],
        experience: "Private Screening Audi · Luxury Lounge Access",
      },
    ],
  },
  {
    id: "m-2",
    title: "Oppenheimer",
    language: "English / 70mm",
    genre: "Biography · Drama · History",
    duration: "3h 00m",
    rating: "8.9/10",
    certification: "A",
    synopsis:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    posterUrl:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    theaters: [
      {
        id: "t-3",
        theaterName: "PVR Gold Class / Cinepolis VIP",
        screenType: "4K Laser · 64-Channel Atmos",
        location: "Grand Galleria Mall",
        pricePerSeat: 420,
        showtimes: ["12:00 PM", "03:45 PM", "07:30 PM"],
        experience: "Recliner Pods · Private Screen",
      },
    ],
  },
  {
    id: "m-3",
    title: "Interstellar: 10th Anniversary IMAX Re-Release",
    language: "English",
    genre: "Sci-Fi · Drama",
    duration: "2h 49m",
    rating: "8.7/10",
    certification: "UA",
    synopsis:
      "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft to find a new planet for humans.",
    posterUrl:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    theaters: [
      {
        id: "t-4",
        theaterName: "INOX Insignia Luxe Cinema",
        screenType: "Laser 3D · Dolby Atmos",
        location: "City Square Center",
        pricePerSeat: 500,
        showtimes: ["02:00 PM", "05:45 PM", "09:30 PM"],
        experience: "Insignia Butler Service · Plush Recliners",
      },
    ],
  },
];

export default function TheaterPage() {
  const [selectedMovie, setSelectedMovie] = useState<MovieListing>(FEATURED_MOVIES[0]);
  const [selectedVenue, setSelectedVenue] = useState<TheaterVenue>(FEATURED_MOVIES[0].theaters[0]);
  const [selectedShowtime, setSelectedShowtime] = useState<string>(FEATURED_MOVIES[0].theaters[0].showtimes[0]);

  // Seat selection
  const [selectedSeats, setSelectedSeats] = useState<string[]>(["C4", "C5"]);
  const [occupiedSeats] = useState<Set<string>>(new Set(["A1", "A2", "B5", "D3", "E7"]));

  // Booking UI state
  const [activeTab, setActiveTab] = useState<"book" | "my-tickets">("book");
  const [myBookings, setMyBookings] = useState<ConfirmedBooking[]>(() => {
    try {
      const stored = localStorage.getItem("sat_movie_bookings");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [bookingSuccess, setBookingSuccess] = useState<ConfirmedBooking | null>(null);

  // Paired Restaurant Food Order for Movie
  const { restaurants, fetchRestaurantMenu } = useAppContext();
  const [pairFood, setPairFood] = useState(true);
  const [foodDeliveryTiming, setFoodDeliveryTiming] = useState<"INTERVAL" | "AFTER_SHOW">("INTERVAL");
  const [fulfillmentMode, setFulfillmentMode] = useState<"THEATER_SEAT" | "TAKEAWAY">("THEATER_SEAT");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [branchMenu, setBranchMenu] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [foodSelections, setFoodSelections] = useState<Record<string, { item: MenuItem; qty: number }>>({});

  // Auto-select initial restaurant
  useEffect(() => {
    if (!selectedBranchId && restaurants.length > 0) {
      const first = restaurants.find((r) => r.isOpen) || restaurants[0];
      if (first) setSelectedBranchId(first.id);
    }
  }, [restaurants, selectedBranchId]);

  // Fetch branch menu
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

  function handleSelectMovie(m: MovieListing) {
    setSelectedMovie(m);
    setSelectedVenue(m.theaters[0]);
    setSelectedShowtime(m.theaters[0].showtimes[0]);
    setSelectedSeats(["C4", "C5"]);
  }

  function handleSelectVenue(v: TheaterVenue) {
    setSelectedVenue(v);
    setSelectedShowtime(v.showtimes[0]);
  }

  function toggleSeat(seatId: string) {
    if (occupiedSeats.has(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId],
    );
  }

  const selectedFoodList = Object.values(foodSelections).filter((f) => f.qty > 0);
  const foodTotal = selectedFoodList.reduce((acc, curr) => acc + curr.item.price * curr.qty, 0);
  const ticketAmount = selectedSeats.length * (selectedVenue?.pricePerSeat || 450);
  const totalAmount = ticketAmount + (pairFood ? foodTotal : 0);

  function handlePushTheaterFoodNow(bookingId: string) {
    const updated = myBookings.map((b) => {
      if (b.bookingId === bookingId && b.pairedFood) {
        return {
          ...b,
          pairedFood: {
            ...b.pairedFood,
            orderPushed: true,
            orderPushedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        };
      }
      return b;
    });
    setMyBookings(updated);
    try {
      localStorage.setItem("sat_movie_bookings", JSON.stringify(updated));
    } catch {}
  }

  function handleConfirmBooking() {
    if (selectedSeats.length === 0) return;

    const selectedBranch = restaurants.find((r) => r.id === selectedBranchId);
    const hasFood = pairFood && selectedFoodList.length > 0;

    const newBooking: ConfirmedBooking = {
      bookingId: `MOV-${Math.floor(100000 + Math.random() * 900000)}`,
      movieTitle: selectedMovie.title,
      duration: selectedMovie.duration,
      theaterName: selectedVenue.theaterName,
      screenType: selectedVenue.screenType,
      location: selectedVenue.location,
      showtime: selectedShowtime,
      seats: [...selectedSeats],
      totalAmount,
      bookedAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      pairedFood: hasFood
        ? {
            branchId: selectedBranchId,
            branchName: selectedBranch?.name || "Selected Restaurant",
            fulfillmentMode,
            items: [...selectedFoodList],
            totalAmount: foodTotal,
            orderPushed: false,
            targetPushTime:
              foodDeliveryTiming === "INTERVAL"
                ? "During Movie Interval (Auto-Pushed at Intermission)"
                : `After Movie End (${selectedMovie.duration} Auto-Push)`,
          }
        : null,
    };

    const updated = [newBooking, ...myBookings];
    setMyBookings(updated);
    try {
      localStorage.setItem("sat_movie_bookings", JSON.stringify(updated));
    } catch {
      // safe fallback
    }
    setBookingSuccess(newBooking);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="border-[3px] border-navy bg-[#121E24] text-cream p-6 md:p-8 shadow-[6px_6px_0_#17232B] mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-golden text-navy px-2.5 py-0.5 font-black text-[11px] uppercase tracking-widest border border-navy">
                🎬 Private Multiplexes &amp; Theaters
              </span>
              <span className="bg-raspberry text-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Select Movie · Pick Showtime · Book Recliners
              </span>
            </div>
            <h1
              className="font-impact uppercase tracking-tight text-cream leading-[0.9]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.25rem)" }}
            >
              Book Movie Shows
            </h1>
            <p className="font-sans text-xs md:text-sm text-cream/70 max-w-2xl mt-2.5 leading-relaxed">
              Browse movie show durations, pick your preferred private theater auditorium, choose recliner seats, and reserve your movie tickets instantly.
            </p>
          </div>

          <div className="flex sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("book")}
              className={`px-4 py-3 border-2 border-cream font-impact text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "book"
                  ? "bg-golden text-navy shadow-[3px_3px_0_#FFF8EE]"
                  : "bg-navy text-cream hover:bg-cream/10"
              }`}
            >
              🎟️ Book Movie Tickets
            </button>
            <button
              onClick={() => setActiveTab("my-tickets")}
              className={`px-4 py-3 border-2 border-cream font-impact text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "my-tickets"
                  ? "bg-raspberry text-cream shadow-[3px_3px_0_#FFF8EE]"
                  : "bg-navy text-cream hover:bg-cream/10"
              }`}
            >
              🍿 My Movie Tickets
              {myBookings.length > 0 && (
                <span className="bg-golden text-navy text-xs font-sans font-black px-1.5 py-0.5 border border-navy">
                  {myBookings.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === "book" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Now Showing Movie Carousel */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="border-2 border-navy bg-cream p-4 shadow-[4px_4px_0_#17232B]">
              <h2 className="font-impact text-xl uppercase text-navy">1. Select Movie</h2>
              <p className="text-xs text-navy/60">Choose a film to view duration &amp; screens</p>
            </div>

            <div className="space-y-3">
              {FEATURED_MOVIES.map((movie) => {
                const isSelected = selectedMovie.id === movie.id;
                return (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie)}
                    className={`border-2 border-navy bg-cream p-3 transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? "ring-2 ring-raspberry shadow-[5px_5px_0_#E03A52] -translate-x-0.5 -translate-y-0.5 bg-cream-100"
                        : "shadow-[3px_3px_0_#17232B] hover:shadow-[5px_5px_0_#17232B]"
                    }`}
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-16 h-24 object-cover border-2 border-navy shrink-0 bg-navy"
                    />
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="bg-navy text-cream px-1.5 py-0.2 text-[8px] font-bold uppercase">
                            {movie.certification}
                          </span>
                          <span className="text-[10px] font-bold text-raspberry uppercase">
                            ⭐ {movie.rating}
                          </span>
                        </div>
                        <h3 className="font-impact text-base text-navy uppercase leading-tight line-clamp-1">
                          {movie.title}
                        </h3>
                        <p className="text-[10px] text-navy/60 font-semibold">{movie.genre}</p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-navy/10">
                        <ClockIcon size={12} className="text-navy/70" />
                        <span className="text-[11px] font-mono font-bold text-navy">
                          Duration: {movie.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Showtime Picker & Seat Booking */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Film Overview */}
            <div className="border-[3px] border-navy bg-cream p-5 shadow-[5px_5px_0_#17232B]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-navy/10 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-navy/40 block">
                    Now Booking
                  </span>
                  <h2 className="font-impact text-2xl uppercase text-navy leading-none">
                    {selectedMovie.title}
                  </h2>
                </div>
                <div className="bg-golden text-navy border-2 border-navy px-3 py-1 font-impact text-sm flex items-center gap-1.5">
                  <ClockIcon size={14} />
                  <span>Duration: {selectedMovie.duration}</span>
                </div>
              </div>

              {/* Theater Selector */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-2">
                  2. Choose Private Theater / Multiplex:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMovie.theaters.map((venue) => {
                    const isVenueActive = selectedVenue?.id === venue.id;
                    return (
                      <button
                        key={venue.id}
                        type="button"
                        onClick={() => handleSelectVenue(venue)}
                        className={`text-left p-3 border-2 border-navy transition-all cursor-pointer ${
                          isVenueActive
                            ? "bg-navy text-cream shadow-[3px_3px_0_#BCFF4F]"
                            : "bg-white text-navy hover:bg-golden/30"
                        }`}
                      >
                        <p className="font-impact text-sm uppercase leading-tight">
                          {venue.theaterName}
                        </p>
                        <p className="text-[10px] font-semibold opacity-80 mt-0.5">
                          📍 {venue.location} · {venue.screenType}
                        </p>
                        <p className="text-[11px] font-bold text-golden mt-1">
                          {formatCurrency(venue.pricePerSeat)} / recliner
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Showtime Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-2">
                  3. Select Showtime ({selectedMovie.duration} show):
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedVenue.showtimes.map((time) => {
                    const isTimeActive = selectedShowtime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedShowtime(time)}
                        className={`px-3 py-2 font-mono text-xs font-bold border-2 border-navy transition-all cursor-pointer flex items-center gap-1.5 ${
                          isTimeActive
                            ? "bg-raspberry text-cream shadow-[2px_2px_0_#17232B]"
                            : "bg-white text-navy hover:bg-golden"
                        }`}
                      >
                        <ClockIcon size={12} className={isTimeActive ? "text-cream" : "text-raspberry"} />
                        <span>{time}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recliner Seat Booking Grid */}
            <div className="border-[3px] border-navy bg-cream p-5 shadow-[5px_5px_0_#17232B] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-navy/10 pb-3">
                <div>
                  <h3 className="font-impact text-xl uppercase text-navy">4. Select Recliner Seats</h3>
                  <p className="text-xs text-navy/60">
                    Screen: {selectedVenue.screenType} · {selectedShowtime}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 bg-white border border-navy" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 bg-raspberry border border-navy" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 bg-navy/30 border border-navy/40" />
                    <span>Occupied</span>
                  </div>
                </div>
              </div>

              {/* Theater Screen Bar */}
              <div className="w-full h-2.5 bg-navy/20 rounded-full border-t-2 border-navy mb-4 relative flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-widest font-bold text-navy/40 bg-cream px-2">
                  Cinema Screen this way
                </span>
              </div>

              {/* Seats Grid */}
              <div className="flex flex-col items-center gap-2 py-2">
                {SEAT_LAYOUT_ROWS.map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="w-4 font-mono font-bold text-xs text-navy/50">{row}</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: SEATS_PER_ROW }).map((_, colIdx) => {
                        const seatNumber = `${row}${colIdx + 1}`;
                        const isOccupied = occupiedSeats.has(seatNumber);
                        const isSelected = selectedSeats.includes(seatNumber);

                        return (
                          <button
                            key={seatNumber}
                            type="button"
                            disabled={isOccupied}
                            onClick={() => toggleSeat(seatNumber)}
                            className={`w-7 h-7 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                              isOccupied
                                ? "bg-navy/20 border-navy/20 text-navy/30 cursor-not-allowed"
                                : isSelected
                                  ? "bg-raspberry text-cream border-navy shadow-[1px_1px_0_#17232B] -translate-y-0.5"
                                  : "bg-white text-navy border-navy hover:bg-golden"
                            }`}
                          >
                            {colIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Paired Food Order Section */}
              <div className="border-t-2 border-navy pt-5 mt-3 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-navy/20 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-impact text-lg uppercase text-navy">
                        🍿 Pair Food Order (Auto-Pushed to Restaurant)
                      </span>
                      <span className="bg-raspberry text-cream text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-navy">
                        Smart Sync
                      </span>
                    </div>
                    <p className="text-xs text-navy/60 mt-0.5">
                      Order hot food from Katpadi restaurants synced to auto-push during movie interval or right as the show ends!
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs uppercase text-navy select-none">
                    <input
                      type="checkbox"
                      checked={pairFood}
                      onChange={(e) => setPairFood(e.target.checked)}
                      className="w-4 h-4 accent-raspberry"
                    />
                    <span>Add Food Order</span>
                  </label>
                </div>

                {pairFood && (
                  <div className="bg-cream-100 border-2 border-navy p-4 space-y-4">
                    {/* Auto-Push Timing Picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                          ⏰ Auto-Push Timing
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFoodDeliveryTiming("INTERVAL")}
                            className={`flex-1 py-2 px-2 text-xs font-bold uppercase border-2 border-navy transition-all cursor-pointer ${
                              foodDeliveryTiming === "INTERVAL"
                                ? "bg-golden text-navy shadow-[2px_2px_0_#17232B]"
                                : "bg-white text-navy/60 hover:text-navy"
                            }`}
                          >
                            🍿 At Intermission (Interval)
                          </button>
                          <button
                            type="button"
                            onClick={() => setFoodDeliveryTiming("AFTER_SHOW")}
                            className={`flex-1 py-2 px-2 text-xs font-bold uppercase border-2 border-navy transition-all cursor-pointer ${
                              foodDeliveryTiming === "AFTER_SHOW"
                                ? "bg-golden text-navy shadow-[2px_2px_0_#17232B]"
                                : "bg-white text-navy/60 hover:text-navy"
                            }`}
                          >
                            🎬 At Movie End ({selectedMovie.duration})
                          </button>
                        </div>
                      </div>

                      {/* Delivery Mode */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                          🛵 Fulfillment Mode
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setFulfillmentMode("THEATER_SEAT")}
                            className={`flex-1 py-2 px-2 text-xs font-bold uppercase border-2 border-navy transition-all cursor-pointer ${
                              fulfillmentMode === "THEATER_SEAT"
                                ? "bg-navy text-cream shadow-[2px_2px_0_#BCFF4F]"
                                : "bg-white text-navy/60 hover:text-navy"
                            }`}
                          >
                            💺 Deliver to My Seat ({selectedSeats.length > 0 ? selectedSeats.join(",") : "Seats"})
                          </button>
                          <button
                            type="button"
                            onClick={() => setFulfillmentMode("TAKEAWAY")}
                            className={`flex-1 py-2 px-2 text-xs font-bold uppercase border-2 border-navy transition-all cursor-pointer ${
                              fulfillmentMode === "TAKEAWAY"
                                ? "bg-navy text-cream shadow-[2px_2px_0_#BCFF4F]"
                                : "bg-white text-navy/60 hover:text-navy"
                            }`}
                          >
                            🥡 Counter Takeaway
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Restaurant Dropdown */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-1">
                        🍴 Select Restaurant
                      </label>
                      <select
                        value={selectedBranchId}
                        onChange={(e) => {
                          setSelectedBranchId(e.target.value);
                          setFoodSelections({});
                        }}
                        className="w-full bg-white border-2 border-navy px-3 py-2 text-xs font-bold uppercase text-navy focus:outline-none"
                      >
                        {restaurants.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} · {r.location}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Menu items picker */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-navy/70 mb-2">
                        Select Dishes from Menu:
                      </p>
                      {loadingMenu ? (
                        <p className="text-xs font-bold text-navy/40 py-2">Loading dishes…</p>
                      ) : branchMenu.length === 0 ? (
                        <p className="text-xs text-navy/50 py-2">No menu items found for this branch.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                          {branchMenu.map((item) => {
                            const curQty = foodSelections[item.id]?.qty || 0;
                            return (
                              <div
                                key={item.id}
                                className="bg-white border border-navy/40 p-2 flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0">
                                  <p className="font-bold text-xs text-navy truncate">{item.name}</p>
                                  <p className="text-[11px] font-mono text-raspberry font-bold">
                                    {formatCurrency(item.price)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  {curQty > 0 ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setFoodSelections((prev) => ({
                                            ...prev,
                                            [item.id]: { item, qty: curQty - 1 },
                                          }))
                                        }
                                        className="w-6 h-6 bg-cream border border-navy font-bold text-xs flex items-center justify-center cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <span className="w-5 text-center text-xs font-mono font-bold">
                                        {curQty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setFoodSelections((prev) => ({
                                            ...prev,
                                            [item.id]: { item, qty: curQty + 1 },
                                          }))
                                        }
                                        className="w-6 h-6 bg-golden border border-navy font-bold text-xs flex items-center justify-center cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFoodSelections((prev) => ({
                                          ...prev,
                                          [item.id]: { item, qty: 1 },
                                        }))
                                      }
                                      className="px-2.5 py-1 bg-cream hover:bg-golden border border-navy font-bold text-[10px] uppercase cursor-pointer"
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

                    {/* Food Total Summary */}
                    {selectedFoodList.length > 0 && (
                      <div className="bg-white border-2 border-navy p-2.5 flex items-center justify-between text-xs font-bold text-navy">
                        <span>
                          Food Items ({selectedFoodList.reduce((acc, curr) => acc + curr.qty, 0)} items):
                        </span>
                        <span className="text-raspberry font-impact text-base">
                          {formatCurrency(foodTotal)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cost & Booking Action */}
              <div className="border-t-2 border-navy pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-navy/70">
                    Selected Seats:{" "}
                    <strong>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</strong>
                    {pairFood && selectedFoodList.length > 0 && (
                      <span className="ml-2 text-raspberry font-bold">
                        (+ {selectedFoodList.length} Food Dishes Paired)
                      </span>
                    )}
                  </p>
                  <p className="font-impact text-2xl text-navy">
                    Total: <span className="text-raspberry">{formatCurrency(totalAmount)}</span>
                    {pairFood && foodTotal > 0 && (
                      <span className="text-xs text-navy/50 font-normal ml-2">
                        (Tickets: {formatCurrency(ticketAmount)} + Food: {formatCurrency(foodTotal)})
                      </span>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={selectedSeats.length === 0}
                  className="bg-raspberry text-cream border-2 border-navy px-6 py-3 font-impact text-base uppercase tracking-wider shadow-[3px_3px_0_#17232B] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  🎟️ Book {selectedSeats.length} {selectedSeats.length === 1 ? "Ticket" : "Tickets"} {pairFood && selectedFoodList.length > 0 ? "& Food Sync" : ""} →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* My Movie Tickets Tab */
        <div className="space-y-4">
          <div className="border-2 border-navy bg-cream p-4 shadow-[4px_4px_0_#17232B] flex items-center justify-between">
            <div>
              <h2 className="font-impact text-2xl uppercase text-navy">My Confirmed Movie Tickets</h2>
              <p className="text-xs text-navy/60">
                Show these passes at the private theater box office or usher desk
              </p>
            </div>
            <button
              onClick={() => setActiveTab("book")}
              className="px-3 py-1.5 bg-golden text-navy border-2 border-navy font-bold text-xs uppercase"
            >
              + Book Another Movie
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div className="p-12 border-2 border-navy bg-cream text-center">
              <p className="font-impact text-2xl uppercase text-navy/40 mb-2">No Booked Tickets Yet</p>
              <p className="text-xs text-navy/60 mb-4">Select a movie and book your seats to view them here.</p>
              <button
                onClick={() => setActiveTab("book")}
                className="bg-raspberry text-cream px-5 py-2.5 font-impact text-sm uppercase tracking-wider border-2 border-navy shadow-[2px_2px_0_#17232B]"
              >
                Explore Movies &amp; Showtimes →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="border-[3px] border-navy bg-cream p-5 shadow-[5px_5px_0_#17232B] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-navy/10 pb-2 mb-3">
                      <span className="font-mono text-xs font-black text-raspberry bg-raspberry/10 px-2 py-0.5 border border-raspberry/30">
                        PASS #{b.bookingId}
                      </span>
                      <span className="bg-sage text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-navy">
                        ✓ Confirmed
                      </span>
                    </div>

                    <h3 className="font-impact text-2xl uppercase text-navy leading-tight">
                      {b.movieTitle}
                    </h3>
                    <p className="text-xs font-bold text-raspberry uppercase tracking-wider mt-0.5">
                      📍 {b.theaterName} · {b.screenType}
                    </p>
                    <p className="text-xs text-navy/60">{b.location}</p>

                    <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-white border-2 border-navy">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-navy/50 block">Showtime</span>
                        <span className="font-mono font-bold text-sm text-navy">{b.showtime}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-navy/50 block">Duration</span>
                        <span className="font-mono font-bold text-sm text-navy">{b.duration}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-navy/50 block">Seats</span>
                        <span className="font-mono font-bold text-sm text-raspberry">
                          {b.seats.join(", ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-navy/50 block">Amount Paid</span>
                        <span className="font-impact text-sm text-navy">{formatCurrency(b.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Paired Food Order Details on Movie Ticket */}
                    {b.pairedFood && (
                      <div className="mt-3 p-3 bg-white border-2 border-navy space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-navy/10 pb-1.5">
                          <span className="text-[11px] font-bold uppercase text-navy flex items-center gap-1">
                            🍿 Paired Food Order ({b.pairedFood.branchName})
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 border ${
                              b.pairedFood.orderPushed
                                ? "bg-sage text-white border-navy"
                                : "bg-golden text-navy border-navy"
                            }`}
                          >
                            {b.pairedFood.orderPushed ? "✓ Auto-Pushed to Kitchen" : "⏳ Scheduled Auto-Push"}
                          </span>
                        </div>

                        <div className="text-xs text-navy/70 space-y-0.5">
                          <p>
                            <strong>Timing:</strong> {b.pairedFood.targetPushTime}
                          </p>
                          <p>
                            <strong>Delivery:</strong>{" "}
                            {b.pairedFood.fulfillmentMode === "THEATER_SEAT"
                              ? `Deliver to Recliners: ${b.seats.join(", ")}`
                              : "Theater Counter Pickup"}
                          </p>
                          <p>
                            <strong>Items:</strong>{" "}
                            {b.pairedFood.items.map((i) => `${i.qty}× ${i.item.name}`).join(", ")} (
                            {formatCurrency(b.pairedFood.totalAmount)})
                          </p>
                        </div>

                        {!b.pairedFood.orderPushed && (
                          <button
                            type="button"
                            onClick={() => handlePushTheaterFoodNow(b.bookingId)}
                            className="w-full mt-2 py-1.5 px-3 bg-raspberry text-cream border-2 border-navy font-impact text-xs uppercase tracking-wider shadow-[2px_2px_0_#17232B] hover:bg-navy transition-colors cursor-pointer"
                          >
                            ⚡ Simulate Intermission &amp; Push Food Order Now
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-navy/10 flex items-center justify-between text-[11px] text-navy/50">
                    <span>Booked on: {b.bookedAt}</span>
                    <span className="font-bold text-navy">Private Cinema E-Ticket</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Confirmation Popup Modal */}
      {bookingSuccess && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm"
          onClick={() => setBookingSuccess(null)}
        >
          <div
            className="w-full max-w-md bg-cream border-[3px] border-navy p-6 shadow-[8px_8px_0_#17232B] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-navy/10 pb-3">
              <span className="bg-sage text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 border border-navy">
                ✓ Booking Confirmed
              </span>
              <button
                type="button"
                onClick={() => setBookingSuccess(null)}
                className="w-7 h-7 bg-white border border-navy font-bold text-sm hover:bg-golden flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy/50">
                Ticket #{bookingSuccess.bookingId}
              </p>
              <h3 className="font-impact text-2xl uppercase text-navy leading-tight mt-0.5">
                {bookingSuccess.movieTitle}
              </h3>
              <p className="text-xs font-bold text-raspberry uppercase mt-0.5">
                {bookingSuccess.theaterName}
              </p>
            </div>

            <div className="bg-white border-2 border-navy p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-navy/60">Showtime:</span>
                <span className="font-bold font-mono text-navy">{bookingSuccess.showtime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy/60">Running Duration:</span>
                <span className="font-bold font-mono text-navy">{bookingSuccess.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy/60">Recliner Seats:</span>
                <span className="font-bold font-mono text-raspberry">{bookingSuccess.seats.join(", ")}</span>
              </div>
              <div className="flex justify-between border-t border-navy/10 pt-1.5 text-sm font-impact text-navy">
                <span>Total Paid:</span>
                <span className="text-raspberry">{formatCurrency(bookingSuccess.totalAmount)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setBookingSuccess(null);
                setActiveTab("my-tickets");
              }}
              className="w-full bg-navy text-cream border-2 border-navy py-3 font-impact text-sm uppercase tracking-wider shadow-[3px_3px_0_#BCFF4F] hover:bg-raspberry transition-colors"
            >
              View My Tickets →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
