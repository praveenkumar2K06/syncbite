import { useState, useEffect, useMemo } from "react";
import {
  getOrdersApi,
  type PlatformAnalytics,
  type Branch,
  type Brand,
  type MerchantRecord,
  type OrderApiRecord,
} from "../api/admin";
import FinancialLedgerSection from "./analytics/FinancialLedgerSection";
import OrderVelocitySection from "./analytics/OrderVelocitySection";
import OutletDistributionSection from "./analytics/OutletDistributionSection";
import CustomerCohortsSection from "./analytics/CustomerCohortsSection";
import MenuIntelligenceSection from "./analytics/MenuIntelligenceSection";
import type {
  BranchPerformanceItem,
  CustomerStats,
  DishVelocityItem,
  CategoryVelocityItem,
} from "./analytics/types";

export type { BranchPerformanceItem, CustomerStats, DishVelocityItem, CategoryVelocityItem };

interface AnalyticsTabProps {
  analytics: PlatformAnalytics | null;
  branches: Branch[];
  brands: Brand[];
  merchants: MerchantRecord[];
  onShowToast: (msg: string, type: "success" | "error") => void;
  loading?: boolean;
}

export default function AnalyticsTab({
  analytics,
  branches,
  brands,
  merchants,
  onShowToast,
  loading = false,
}: AnalyticsTabProps) {
  const [orders, setOrders] = useState<OrderApiRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setOrdersLoading(true);
    getOrdersApi()
      .then((data) => {
        if (active && Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch(() => {
        if (active) onShowToast("Could not load analytics order data.", "error");
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [onShowToast]);

  // 1. Financial Ledger
  const ordersVolume = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  }, [orders]);

  const gmv = analytics?.gross_revenue ?? ordersVolume;
  const platformCommission = analytics?.platform_commissions ?? 0;
  const subscriptionRev = "—";
  const refunds = orders
    .filter((o) => o.status === "CANCELLED")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const discounts = 0;
  const netRevenue =
    analytics?.platform_commissions != null
      ? Math.max(0, platformCommission - refunds)
      : platformCommission > 0
        ? Math.max(0, platformCommission - refunds)
        : "—";
  const restaurantPayout = Math.max(0, gmv - platformCommission - refunds);

  // 2. Order Performance
  const totalOrders = analytics?.total_orders ?? orders.length;
  const aov = totalOrders > 0 ? Math.round(gmv / totalOrders) : 0;

  const [now] = useState(() => Date.now());

  const { ordersDay, ordersWeek, ordersMonth } = useMemo(() => {
    const day = orders.filter(
      (o) => now - new Date(o.created_at).getTime() <= 24 * 60 * 60 * 1000,
    ).length;
    const week = orders.filter(
      (o) => now - new Date(o.created_at).getTime() <= 7 * 24 * 60 * 60 * 1000,
    ).length;
    const month = orders.filter(
      (o) => now - new Date(o.created_at).getTime() <= 30 * 24 * 60 * 60 * 1000,
    ).length;
    return { ordersDay: day, ordersWeek: week, ordersMonth: month };
  }, [orders, now]);

  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED").length;
  const completionRate =
    totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 1000) / 10 : 0;
  const cancellationRate =
    totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 1000) / 10 : 0;

  // 3. Branches
  const activeBranches = branches.filter((b) => b.is_active).length;
  const inactiveBranches = branches.length - activeBranches;

  const branchPerformance = useMemo<BranchPerformanceItem[]>(() => {
    return branches
      .map((b) => {
        const branchOrders = orders.filter((o) => o.branch_id === b.id);
        const volume = branchOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
        return {
          id: b.id,
          name: b.name,
          orderCount: branchOrders.length,
          volume,
        };
      })
      .sort((a, b) => b.volume - a.volume);
  }, [branches, orders]);

  // 4. Customer Cohorts
  const customerStats = useMemo<CustomerStats>(() => {
    const customerOrderMap = new Map<string, number>();
    const customerLastOrderMap = new Map<string, number>();

    orders.forEach((o) => {
      const email = o.delivery_address_snapshot?.email || o.customer_profile_id || "anonymous";
      customerOrderMap.set(email, (customerOrderMap.get(email) || 0) + 1);
      const oTime = new Date(o.created_at).getTime();
      const prev = customerLastOrderMap.get(email) || 0;
      if (oTime > prev) customerLastOrderMap.set(email, oTime);
    });

    const totalCust = analytics?.total_customers ?? customerOrderMap.size;
    const active = Array.from(customerLastOrderMap.values()).filter(
      (time) => now - time <= 30 * 24 * 60 * 60 * 1000,
    ).length;
    const repeat = Array.from(customerOrderMap.values()).filter((count) => count > 1).length;

    const repeatRate =
      customerOrderMap.size > 0 ? Math.round((repeat / customerOrderMap.size) * 1000) / 10 : 0;
    const retentionRate =
      customerOrderMap.size > 0 ? Math.round((active / customerOrderMap.size) * 1000) / 10 : 0;

    return {
      newStudents: totalCust,
      activeCustomers: active,
      repeatCustomers: repeat,
      repeatRate,
      retentionRate,
    };
  }, [orders, analytics, now]);

  // 5. Dish Velocity
  const topDishes = useMemo<DishVelocityItem[]>(() => {
    const dishMap = new Map<string, { orders: number; volume: number; outlet: string }>();

    orders.forEach((o) => {
      const branch = branches.find((b) => b.id === o.branch_id);
      const outletName = branch?.name || "Campus Outlet";

      if (Array.isArray(o.items)) {
        o.items.forEach((it) => {
          const name = it.item_name_snapshot || it.name || "Dish Item";
          const qty = Number(it.quantity) || 1;
          const price = Number(it.price_snapshot || it.price) || 0;
          const current = dishMap.get(name) || {
            orders: 0,
            volume: 0,
            outlet: outletName,
          };
          dishMap.set(name, {
            orders: current.orders + qty,
            volume: current.volume + qty * price,
            outlet: outletName,
          });
        });
      }
    });

    return Array.from(dishMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  }, [orders, branches]);

  // 6. Category velocity
  const topCategories = useMemo<CategoryVelocityItem[]>(() => {
    const catMap = new Map<string, number>();

    brands.forEach((br) => {
      if (Array.isArray(br.cuisine_types)) {
        br.cuisine_types.forEach((c) => {
          catMap.set(c, (catMap.get(c) || 0) + 1);
        });
      }
    });

    const total = Array.from(catMap.values()).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    return Array.from(catMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        sharePct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [brands]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <span>📊 Platform Analytics Intelligence</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-violet-950/70 border border-violet-800/60 text-violet-400">
            Real-Time Engine
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Deep telemetry across platform GMV, take rates, daily volume, customer retention curves,
          and menu velocity.
        </p>
      </div>

      <FinancialLedgerSection
        gmv={gmv}
        netRevenue={netRevenue}
        platformCommission={platformCommission}
        restaurantPayout={restaurantPayout}
        subscriptionRev={subscriptionRev}
        refunds={refunds}
        discounts={discounts}
      />

      <OrderVelocitySection
        ordersDay={ordersDay}
        ordersWeek={ordersWeek}
        ordersMonth={ordersMonth}
        aov={aov}
        completionRate={completionRate}
        cancellationRate={cancellationRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OutletDistributionSection
          totalMerchants={merchants.length}
          activeBranches={activeBranches}
          inactiveBranches={inactiveBranches}
          branchPerformance={branchPerformance}
        />

        <CustomerCohortsSection customerStats={customerStats} />
      </div>

      <MenuIntelligenceSection
        ordersLoading={ordersLoading || loading}
        topDishes={topDishes}
        topCategories={topCategories}
      />
    </div>
  );
}
