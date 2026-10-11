import { useLocation, useNavigate } from "react-router-dom";
import { useOptionalOrdersContext } from "@/context/OrdersContext";
import { useKitchenSound } from "@/lib/kitchenAudio";
import { formatMoney } from "@/lib/portal";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  VolumeOffIcon,
  ArrowRight01Icon,
  BellRingIcon,
} from "@hugeicons/core-free-icons";

export default function NewOrderAlertBanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const ordersCtx = useOptionalOrdersContext();
  const { soundEnabled, toggleSound } = useKitchenSound();

  const newOrders = ordersCtx?.orders.filter((o) => o.status === "new") ?? [];
  const newOrdersCount = newOrders.length;

  // Hide banner if there are no unaccepted new orders
  if (newOrdersCount === 0) {
    return null;
  }

  const isAlreadyOnOrdersPage = location.pathname === "/orders";
  const firstOrder = newOrders[0];

  return (
    <aside
      aria-label="New Order Alert"
      style={{
        background: "linear-gradient(90deg, #ea580c 0%, #f97316 28%, #dc2626 70%, #b91c1c 100%)",
      }}
      className="shrink-0 text-white px-3 sm:px-6 py-2.5 sm:py-3 shadow-md border-b border-orange-700/50 relative z-30 transition-all duration-300 animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 max-w-7xl mx-auto">
        {/* Left: Animated Icon + Order Count & Details */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="relative shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white shadow-inner">
            <HugeiconsIcon
              icon={BellRingIcon}
              strokeWidth={2}
              className="w-4 h-4 sm:w-4.5 sm:h-4.5"
            />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-90" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black tracking-widest uppercase bg-black/30 text-yellow-300 px-1.5 py-0.5 rounded border border-white/15">
                Urgent Attention
              </span>
              <h2 className="text-xs sm:text-sm font-extrabold text-white tracking-tight m-0 truncate">
                {newOrdersCount === 1
                  ? `New Order Received (${firstOrder?.displayId || "#1"})`
                  : `${newOrdersCount} New Orders Waiting Acceptance!`}
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-orange-100 font-medium m-0 truncate mt-0.5 flex items-center gap-1.5">
              <span>
                {newOrdersCount === 1 && firstOrder
                  ? `${firstOrder.items.length} items • ${formatMoney(firstOrder.total)} • Incoming now`
                  : "Incoming orders require kitchen confirmation"}
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-orange-300 opacity-70" />
              <span className="text-orange-200 text-[10px] sm:text-[11px]">
                {soundEnabled ? "🔔 Audio chime active (every 7s)" : "🔇 Alert muted"}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Quick Operational Actions (Mute + Go to Orders) */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {/* Mute / Unmute Button */}
          <button
            type="button"
            onClick={toggleSound}
            className="h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-semibold rounded-lg bg-black/25 hover:bg-black/40 active:scale-95 text-white border border-white/30 backdrop-blur-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title={soundEnabled ? "Mute kitchen chime loop" : "Unmute kitchen chime loop"}
          >
            <HugeiconsIcon
              icon={soundEnabled ? VolumeOffIcon : VolumeHighIcon}
              strokeWidth={2}
              className="w-3.5 h-3.5 text-yellow-300"
            />
            <span>{soundEnabled ? "Mute" : "Unmute"}</span>
          </button>

          {/* Go to Orders ("goto") Button */}
          <button
            type="button"
            onClick={() => {
              if (!isAlreadyOnOrdersPage) {
                navigate("/orders");
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="h-7 sm:h-8 px-3 sm:px-3.5 text-xs font-bold rounded-lg bg-white text-orange-950 hover:bg-orange-50 active:scale-95 shadow-md flex items-center gap-1.5 transition-all hover:shadow-lg cursor-pointer group"
          >
            <span>{isAlreadyOnOrdersPage ? "View Board" : "Go to Orders"}</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2.5}
              className="w-3.5 h-3.5 text-orange-700 transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
