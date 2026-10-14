import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Order, Page } from "@/types";
import { useHumor } from "@/components/HumorSystem";
import { useAppContext } from "@/context/AppContext";
import {
  ConfettiRain,
  ConfirmationOrderCard,
  ConfirmationActions,
} from "@/components/confirmation";

interface ConfirmationPageProps {
  order?: Order;
  onNavigate?: (page: Page) => void;
}

export default function ConfirmationPage(props: ConfirmationPageProps = {}) {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useAppContext();

  const order: Order | undefined =
    props.order ??
    (location.state as { order?: Order } | null)?.order ??
    orders.find((o) => o.id === orderId);
  const onNavigate = props.onNavigate ?? ((page: Page) => navigate(`/${page}`));

  const [showConfetti, setShowConfetti] = useState(true);
  const { trigger } = useHumor();

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    trigger("order-complete");
  }, [trigger]);

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="font-impact text-3xl uppercase text-navy mb-4">Order Not Found</h1>
        <p className="text-navy/60 text-sm mb-6">Could not find order #{orderId}.</p>
        <button
          onClick={() => navigate("/orders")}
          className="bg-navy text-cream py-3 px-6 border-2 border-navy font-impact text-base uppercase tracking-wider cursor-pointer"
        >
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 text-center relative overflow-hidden">
      <ConfettiRain show={showConfetti} />

      {/* Check Icon */}
      <div className="mb-6 animate-scale-in">
        <div className="w-20 h-20 bg-sage border-2 border-navy shadow-[4px_4px_0_#17232B] flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <polyline
              points="20 6 9 17 4 12"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-check"
            />
          </svg>
        </div>
      </div>

      <p className="text-navy/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-2">
        Order Confirmed
      </p>
      <h1 className="font-impact text-5xl uppercase text-navy mb-2 leading-none">
        You are all set!
      </h1>
      <p className="text-navy/60 text-sm font-display italic mb-8">Your order has been placed.</p>

      {/* Order card */}
      <ConfirmationOrderCard order={order} />

      {/* Actions */}
      <ConfirmationActions
        onTrackOrder={() => onNavigate("orders")}
        onBackToHome={() => onNavigate("home")}
      />
    </div>
  );
}
