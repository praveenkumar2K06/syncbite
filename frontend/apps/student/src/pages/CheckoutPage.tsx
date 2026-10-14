import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem, Order, OrderMode, Page, Restaurant } from "@/types";
import { timeSlots, dateTabs } from "@/data";
import { ArrowLeftIcon, ZapIcon } from "@/components/icons";
import {
  createOrderApi,
  createPaymentIntentApi,
  verifyPaymentApi,
  adaptBackendOrderToUi,
} from "@/api";
import { useAppContext } from "@/context/AppContext";
import {
  PaymentSplash,
  CheckoutRestaurantCard,
  CartItemList,
  PickupScheduleSection,
  CheckoutPayBar,
} from "@/components/checkout";

interface CheckoutPageProps {
  cart?: CartItem[];
  orderMode?: OrderMode;
  restaurant?: Restaurant | null;
  onUpdateQty?: (itemId: string, delta: number) => void;
  onNavigate?: (page: Page, opts?: { confirmedOrder?: Order }) => void;
  onClearCart?: () => void;
}

export default function CheckoutPage(props: CheckoutPageProps = {}) {
  const navigate = useNavigate();
  const ctx = useAppContext();

  const cart = props.cart ?? ctx.cart;
  const orderMode = props.orderMode ?? ctx.orderMode;
  const restaurant = props.restaurant !== undefined ? props.restaurant : ctx.selectedRestaurant;
  const onUpdateQty = props.onUpdateQty ?? ctx.updateQty;
  const onClearCart = props.onClearCart ?? ctx.clearCart;
  const onNavigate =
    props.onNavigate ??
    ((page: Page, opts?: { confirmedOrder?: Order }) => {
      if (page === "confirmation" && opts?.confirmedOrder) {
        navigate(`/confirmation/${opts.confirmedOrder.id}`, {
          state: { order: opts.confirmedOrder },
        });
      } else if (page === "restaurant") {
        if (restaurant) navigate(`/restaurant/${restaurant.id}`);
        else navigate("/browse");
      } else {
        navigate(`/${page}`);
      }
    });

  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedSlot, setSelectedSlot] = useState("12:30 PM");
  const [fulfillmentMode, setFulfillmentMode] = useState<"DINE_IN" | "TAKEAWAY">("DINE_IN");
  const [splash, setSplash] = useState<"idle" | "processing" | "secured" | "launch">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const total = cart.reduce((s, ci) => s + ci.menuItem.price * ci.quantity, 0);
  const restaurantId = cart[0]?.restaurantId;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 border-2 border-navy flex items-center justify-center mb-4">
          <ZapIcon size={24} className="text-navy/30" />
        </div>
        <h2 className="font-impact text-3xl uppercase text-navy mb-2">Cart is empty</h2>
        <p className="text-navy/50 text-sm mb-6">Your cart is waiting for something delicious.</p>
        <button
          onClick={() => onNavigate("home")}
          className="bg-raspberry text-cream border-2 border-navy px-6 py-3 font-impact text-lg uppercase tracking-wider shadow-[3px_3px_0_#17232B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#17232B] transition-all duration-75 cursor-pointer"
        >
          Browse Stalls
        </button>
      </div>
    );
  }

  async function handlePay() {
    if (isSubmitting || ctx.isFrozen) return;

    if (!restaurantId) {
      setError("No restaurant stall found for items in your cart.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setSplash("processing");

    // Clear any previous active timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const pickupTime = orderMode === "now" ? "12:30 PM" : selectedSlot;
    const date = orderMode === "now" ? "Today" : selectedDate;

    try {
      const orderRes = await createOrderApi({
        branch_id: restaurantId,
        items: cart.map((ci) => ({
          menu_item_id: ci.menuItem.id,
          quantity: ci.quantity,
        })),
        delivery_address_snapshot: {
          branch_name: restaurant?.name || "Campus Stall",
          fulfillment_mode: fulfillmentMode,
          order_type: fulfillmentMode,
          pickup_time: pickupTime,
          date: date,
          instructions: cart
            .map((ci) => (ci.instructions ? `${ci.menuItem.name}: ${ci.instructions}` : null))
            .filter(Boolean)
            .join("; "),
        },
      });

      if (!orderRes || !orderRes.id) {
        throw new Error("Order creation failed: Backend did not return a valid order ID.");
      }

      // Initialize payment intent and attempt payment verification
      try {
        const intent = await createPaymentIntentApi(orderRes.id);
        if (intent?.payment_intent_id) {
          try {
            await verifyPaymentApi(
              orderRes.id,
              intent.payment_intent_id,
              intent.order_id,
              intent.client_secret || `sig_${intent.payment_intent_id.slice(0, 8)}`,
            );
          } catch (verifyErr) {
            console.warn("[Checkout] Payment verification warning:", verifyErr);
          }
        }
      } catch (paymentErr) {
        console.warn("[Checkout] Payment intent initialization warning:", paymentErr);
      }

      const adapted = adaptBackendOrderToUi(orderRes, restaurant?.name || "Campus Stall");
      const confirmedOrder: Order = {
        ...adapted,
        items: cart.length > 0 ? cart : adapted.items,
        total,
        pickupTime,
        date,
        fulfillmentMode,
      };

      // Progress splash stages with tracked timers that cleanup on unmount
      const t1 = setTimeout(() => {
        setSplash("secured");
      }, 2000);
      timersRef.current.push(t1);

      const t2 = setTimeout(() => {
        setSplash("launch");
      }, 4000);
      timersRef.current.push(t2);

      const t3 = setTimeout(() => {
        ctx.setOrders((prev) => [confirmedOrder, ...prev]);
        onClearCart();
        setIsSubmitting(false);
        onNavigate("confirmation", { confirmedOrder });
      }, 5200);
      timersRef.current.push(t3);
    } catch (err: unknown) {
      // Clear timers and reset splash if backend rejected order
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      setSplash("idle");
      setIsSubmitting(false);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to place order. Please check your network and try again.";
      setError(message);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28 md:pb-12">
      <button
        onClick={() => onNavigate("restaurant")}
        className="flex items-center gap-2 text-navy/60 text-xs font-bold uppercase tracking-wider mb-6 hover:text-navy transition-colors cursor-pointer"
      >
        <ArrowLeftIcon size={14} />
        Back to menu
      </button>

      <h1 className="font-impact text-4xl uppercase text-navy mb-6">Your Order</h1>

      <CheckoutRestaurantCard restaurant={restaurant} />
      <CartItemList cart={cart} total={total} onUpdateQty={onUpdateQty} />

      {/* Dine-In vs Takeaway Selector */}
      <div className="border-2 border-navy bg-cream p-4 mb-6 shadow-[3px_3px_0_#17232B]">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-navy/60 mb-2">
          Order Fulfillment Preference
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFulfillmentMode("DINE_IN")}
            className={`py-2.5 px-3 border-2 border-navy font-impact text-base uppercase tracking-wider cursor-pointer transition-all ${
              fulfillmentMode === "DINE_IN"
                ? "bg-golden text-navy shadow-[2px_2px_0_#17232B]"
                : "bg-cream-100 text-navy/60"
            }`}
          >
            🍽️ Dine-In
          </button>
          <button
            type="button"
            onClick={() => setFulfillmentMode("TAKEAWAY")}
            className={`py-2.5 px-3 border-2 border-navy font-impact text-base uppercase tracking-wider cursor-pointer transition-all ${
              fulfillmentMode === "TAKEAWAY"
                ? "bg-golden text-navy shadow-[2px_2px_0_#17232B]"
                : "bg-cream-100 text-navy/60"
            }`}
          >
            🥡 Takeaway
          </button>
        </div>
      </div>

      {/* Pair with 2-Hour Game Platform Ticket CTA */}
      <div className="border-2 border-navy bg-navy text-cream p-4 mb-6 shadow-[3px_3px_0_#E03A52] flex items-center justify-between gap-4">
        <div>
          <p className="font-impact text-lg uppercase text-golden leading-tight">
            🎮 Playing at the Game Arena?
          </p>
          <p className="text-[11px] text-cream/80 mt-0.5">
            Pair this cart with a 2-hour Game Platform ticket — we&apos;ll automatically push your{" "}
            {fulfillmentMode === "DINE_IN" ? "Dine-In" : "Takeaway"} order when your game ends!
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/games")}
          className="shrink-0 bg-raspberry text-cream border-2 border-cream px-3.5 py-2 font-impact text-sm uppercase tracking-wider hover:bg-golden hover:text-navy transition-colors cursor-pointer"
        >
          Pair Game →
        </button>
      </div>

      <PickupScheduleSection
        orderMode={orderMode}
        prepTime={restaurant?.prepTime}
        dateTabs={dateTabs}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        timeSlots={timeSlots}
        selectedSlot={selectedSlot}
        onSelectSlot={setSelectedSlot}
      />

      {/* Platform Freeze Alert */}
      {ctx.isFrozen && (
        <div className="bg-rose-500/10 border-2 border-raspberry p-4 text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-raspberry font-impact text-lg uppercase tracking-wide">
            <span>🛑</span> Campus Emergency Freeze In Effect
          </div>
          <p className="text-xs text-navy/70 mt-1 font-medium">
            Campus administration has temporarily frozen all digital checkout transactions. Please
            visit stalls directly or check back shortly.
          </p>
        </div>
      )}

      {/* Checkout Error Alert */}
      {error && (
        <div
          className="bg-rose-500/10 border-2 border-raspberry p-4 mb-6 flex flex-col gap-1.5 animate-fade-in"
          style={{ boxShadow: "3px 3px 0 #17232B" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-raspberry font-impact text-lg uppercase tracking-wide">
              <span>⚠️</span> Order Placement Failed
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[10px] font-bold text-navy/50 uppercase tracking-wider hover:text-navy cursor-pointer"
            >
              ✕ Dismiss
            </button>
          </div>
          <p className="text-xs text-navy/80 font-medium">{error}</p>
        </div>
      )}

      <CheckoutPayBar
        isFrozen={ctx.isFrozen}
        total={total}
        onPay={handlePay}
        isSubmitting={isSubmitting}
      />

      {/* Payment splash overlay */}
      {splash !== "idle" && (
        <PaymentSplash
          stage={splash}
          total={total}
          restaurantName={restaurant?.name ?? "Campus Stall"}
        />
      )}
    </div>
  );
}
