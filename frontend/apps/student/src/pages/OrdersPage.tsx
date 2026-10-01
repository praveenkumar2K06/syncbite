import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Order, Page, Restaurant } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { OrderCard, OrdersHeader, OrdersEmptyState } from "@/components/orders";

interface OrdersPageProps {
  orders?: Order[];
  restaurants?: Restaurant[];
  onNavigate?: (page: Page, opts?: { restaurant?: Restaurant }) => void;
}

export default function OrdersPage(props: OrdersPageProps = {}) {
  const navigate = useNavigate();
  const ctx = useAppContext();

  const orders = props.orders ?? ctx.orders;
  const restaurants = props.restaurants ?? ctx.restaurants;
  const onNavigate =
    props.onNavigate ??
    ((page: Page, opts?: { restaurant?: Restaurant }) => {
      if (page === "restaurant" && opts?.restaurant) {
        ctx.setSelectedRestaurant(opts.restaurant);
        navigate(`/restaurant/${opts.restaurant.id}`);
      } else {
        navigate(`/${page}`);
      }
    });
  const active = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");
  const past = orders.filter((o) => o.status === "completed" || o.status === "cancelled");

  const [refreshing, setRefreshing] = useState(false);

  async function handleManualRefresh() {
    setRefreshing(true);
    await ctx.refreshOrders();
    setTimeout(() => setRefreshing(false), 400);
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-24 md:pb-8">
      <OrdersHeader refreshing={refreshing} onRefresh={handleManualRefresh} />

      {active.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse-dot" />
              <p className="text-[10px] text-navy/50 font-bold uppercase tracking-[0.3em]">
                Active Orders (Live Tracking)
              </p>
            </div>
            <span className="text-[10px] text-sage font-bold uppercase tracking-wider">
              Auto-updating
            </span>
          </div>
          <div className="space-y-3">
            {active.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onReorder={() => {
                  const r = restaurants.find((res) => res.id === order.restaurantId);
                  if (r) onNavigate("restaurant", { restaurant: r });
                }}
              />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <p className="text-[10px] text-navy/50 font-bold uppercase tracking-[0.3em] mb-3">
            Past Orders
          </p>
          <div className="space-y-3">
            {past.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onReorder={() => {
                  const r = restaurants.find((res) => res.id === order.restaurantId);
                  if (r) onNavigate("restaurant", { restaurant: r });
                }}
              />
            ))}
          </div>
        </section>
      )}

      {orders.length === 0 && <OrdersEmptyState />}
    </div>
  );
}
