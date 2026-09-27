import React from "react";
import StatCard from "../../components/common/StatCard";
import { fmt } from "../../utils/formatters";

interface OverviewKpiGridProps {
  loading: boolean;
  totalCustomers: number;
  merchantsCount: number;
  brandsCount: number;
  branchesCount: number;
  activeBranches: number;
  totalOrders: number;
  todayOrders: number | string;
  todayRevenue: number | string;
  monthlyRevenue: number | string;
  commissions: number;
  refundAmount: number | string;
  activeSubscriptions: number | string;
  pendingApprovalsCount: number;
  pendingIssues: number | string;
}

export default function OverviewKpiGrid({
  loading,
  totalCustomers,
  merchantsCount,
  brandsCount,
  branchesCount,
  activeBranches,
  totalOrders,
  todayOrders,
  todayRevenue,
  monthlyRevenue,
  commissions,
  refundAmount,
  activeSubscriptions,
  pendingApprovalsCount,
  pendingIssues,
}: OverviewKpiGridProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-2">
        <span>📊 Platform KPIs & Core Metrics</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {/* 1. Total Customers */}
          <StatCard
            label="Total Customers"
            value={totalCustomers.toLocaleString("en-IN")}
            sub="Registered campus users"
            color="rgba(56,189,248,0.2)"
            icon={<span className="text-base">👥</span>}
          />
          {/* 2. Total Merchants */}
          <StatCard
            label="Total Merchants"
            value={merchantsCount}
            sub="Registered business entities"
            color="rgba(168,85,247,0.2)"
            icon={<span className="text-base">🏢</span>}
          />
          {/* 3. Total Brands */}
          <StatCard
            label="Total Brands"
            value={brandsCount}
            sub="Parent food concepts"
            color="rgba(236,72,153,0.2)"
            icon={<span className="text-base">🏷️</span>}
          />
          {/* 4. Total Branches */}
          <StatCard
            label="Total Branches"
            value={branchesCount}
            sub="Physical food outlets"
            color="rgba(249,115,22,0.2)"
            icon={<span className="text-base">🍽</span>}
          />
          {/* 5. Active Branches */}
          <StatCard
            label="Active Branches"
            value={activeBranches}
            sub={`${branchesCount - activeBranches} offline outlets`}
            color="rgba(16,185,129,0.2)"
            icon={<span className="text-base">✓</span>}
          />
          {/* 6. Total Orders */}
          <StatCard
            label="Total Orders"
            value={totalOrders.toLocaleString("en-IN")}
            sub="All-time orders"
            color="rgba(245,158,11,0.2)"
            icon={<span className="text-base">📦</span>}
          />
          {/* 7. Today's Orders */}
          <StatCard
            label="Today's Orders"
            value={
              typeof todayOrders === "number" ? todayOrders.toLocaleString("en-IN") : todayOrders
            }
            sub={
              typeof todayOrders === "number"
                ? "Orders placed today"
                : "Daily breakdown unavailable"
            }
            color="rgba(34,197,94,0.2)"
            icon={<span className="text-base">🕒</span>}
          />
          {/* 8. Today's Revenue */}
          <StatCard
            label="Today's Revenue"
            value={typeof todayRevenue === "number" ? fmt(todayRevenue) : todayRevenue}
            sub={
              typeof todayRevenue === "number"
                ? "Daily sales volume"
                : "Daily breakdown unavailable"
            }
            color="rgba(14,165,233,0.2)"
            icon={<span className="text-base">⚡</span>}
          />
          {/* 9. Gross Revenue */}
          <StatCard
            label="Gross Revenue"
            value={typeof monthlyRevenue === "number" ? fmt(monthlyRevenue) : monthlyRevenue}
            sub="Total platform GMV"
            color="rgba(139,92,246,0.2)"
            icon={<span className="text-base">₹</span>}
          />
          {/* 10. Platform Commission */}
          <StatCard
            label="Platform Commission"
            value={fmt(commissions)}
            sub="Platform take rate"
            color="rgba(244,63,94,0.2)"
            icon={<span className="text-base">📈</span>}
          />
          {/* 11. Refund Amount */}
          <StatCard
            label="Refund Amount"
            value={typeof refundAmount === "number" ? fmt(refundAmount) : refundAmount}
            sub={
              typeof refundAmount === "number"
                ? "Settled customer refunds"
                : "Refund breakdown unavailable"
            }
            color="rgba(239,68,68,0.2)"
            icon={<span className="text-base">↩️</span>}
          />
          {/* 12. Active Subscriptions */}
          <StatCard
            label="Active Subscriptions"
            value={activeSubscriptions}
            sub={
              typeof activeSubscriptions === "number"
                ? "Tiered merchant plans"
                : "See Subscriptions tab"
            }
            color="rgba(99,102,241,0.2)"
            icon={<span className="text-base">📜</span>}
          />
          {/* 13. Pending Approvals */}
          <StatCard
            label="Pending Approvals"
            value={pendingApprovalsCount}
            sub={pendingApprovalsCount > 0 ? "Requires admin review" : "All cleared"}
            color="rgba(245,158,11,0.2)"
            icon={<span className="text-base">⏳</span>}
          />
          {/* 14. Pending Issues */}
          <StatCard
            label="Pending Issues"
            value={pendingIssues}
            sub={
              typeof pendingIssues === "number"
                ? "Disputes & escalations"
                : "Dispute tracking unavailable"
            }
            color="rgba(100,116,139,0.2)"
            icon={<span className="text-base">⚠️</span>}
          />
        </div>
      )}
    </div>
  );
}
