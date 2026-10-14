import { useState, useMemo, useEffect, useCallback } from "react";
import type { MerchantRecord } from "../api/admin";
import type { SubscriptionPlan, MerchantSubscriptionItem } from "./subscriptions/types";
import SubscriptionSummaryCards from "./subscriptions/SubscriptionSummaryCards";
import SubscriptionPlansGrid from "./subscriptions/SubscriptionPlansGrid";
import MerchantSubscriptionsTable from "./subscriptions/MerchantSubscriptionsTable";
import ChangePlanModal from "./subscriptions/ChangePlanModal";
import CancelSubscriptionModal from "./subscriptions/CancelSubscriptionModal";
import {
  listAdminSubscriptionsApi,
  modifySubscriptionApi,
  modifyMerchantSubscriptionApi,
  type AdminSubscriptionResponse,
} from "../api/domains/subscriptions";
import { SHARED_SUBSCRIPTION_PLANS, toUserMessage, type SubscriptionTier } from "@syncbite/shared";

export type { SubscriptionPlan, MerchantSubscriptionItem };

interface SubscriptionsTabProps {
  merchants: MerchantRecord[];
  onShowToast: (msg: string, type: "success" | "error") => void;
}

const INITIAL_PLANS: SubscriptionPlan[] = SHARED_SUBSCRIPTION_PLANS.map((p) => ({
  id: p.id,
  name: p.name,
  tier: p.tier,
  code: p.code,
  price_monthly: p.price_monthly,
  price_annual: p.price_annual,
  commission_rate_pct: p.commission_rate_pct,
  max_branches: p.max_branches,
  features: p.features,
  is_active: p.is_active,
  subscriber_count: 0,
}));

function mapBackendToItem(
  sub: AdminSubscriptionResponse,
  merchantNameMap: Map<string, string>,
): MerchantSubscriptionItem {
  const tier = (sub.plan_tier || "BASIC") as SubscriptionTier;
  const cycle = (sub.billing_cycle || "MONTHLY") as "MONTHLY" | "ANNUAL";
  const planDef =
    SHARED_SUBSCRIPTION_PLANS.find((p) => p.tier === tier) || SHARED_SUBSCRIPTION_PLANS[0]!;

  const name =
    sub.business_name ||
    sub.merchant_name ||
    merchantNameMap.get(sub.merchant_id) ||
    "Merchant Outlet";

  const price = cycle === "ANNUAL" ? planDef.price_annual : planDef.price_monthly;

  return {
    id: sub.id,
    merchant_id: sub.merchant_id,
    merchant_name: name,
    plan_tier: tier,
    plan_name: planDef.name,
    status: (sub.status as any) || "ACTIVE",
    billing_cycle: cycle,
    current_period_start: sub.created_at || new Date().toISOString(),
    current_period_end: sub.valid_until || new Date().toISOString(),
    valid_until: sub.valid_until,
    commission_rate_percentage: sub.commission_rate_percentage ?? planDef.commission_rate_pct,
    max_branches: sub.max_branches ?? planDef.max_branches,
    last_payment_amount: price,
    commission_earned: 0,
    invoice_id: `INV-${new Date(sub.created_at || Date.now()).getFullYear()}-${sub.merchant_id.slice(0, 6).toUpperCase()}`,
  };
}

export default function SubscriptionsTab({ merchants, onShowToast }: SubscriptionsTabProps) {
  const [activeTab, setActiveTab] = useState<"PLANS" | "MERCHANT_SUBS">("MERCHANT_SUBS");
  const plans = INITIAL_PLANS;
  const [subStatusFilter, setSubStatusFilter] = useState<
    "ALL" | "ACTIVE" | "CANCELLED" | "EXPIRED"
  >("ALL");

  const [subs, setSubs] = useState<MerchantSubscriptionItem[]>([]);
  const [_loading, setLoading] = useState(false);

  const merchantNameMap = useMemo(() => {
    const map = new Map<string, string>();
    merchants.forEach((m) => {
      map.set(m.id, m.business_name || m.legal_entity_name || "Merchant Entity");
    });
    return map;
  }, [merchants]);

  // Load subscriptions directly from Backend Admin API
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAdminSubscriptionsApi();
      if (Array.isArray(data) && data.length > 0) {
        // Group by merchant_id to only display the single current subscription in the table
        // Prefer ACTIVE status, or latest created_at / valid_until
        const merchantSubMap = new Map<string, AdminSubscriptionResponse>();

        for (const item of data) {
          const existing = merchantSubMap.get(item.merchant_id);
          if (!existing) {
            merchantSubMap.set(item.merchant_id, item);
          } else {
            // Priority: ACTIVE over CANCELLED/EXPIRED, then latest created_at
            if (existing.status !== "ACTIVE" && item.status === "ACTIVE") {
              merchantSubMap.set(item.merchant_id, item);
            } else if (
              (existing.status === item.status || existing.status !== "ACTIVE") &&
              new Date(item.created_at || 0) > new Date(existing.created_at || 0)
            ) {
              merchantSubMap.set(item.merchant_id, item);
            }
          }
        }

        const currentSubs = Array.from(merchantSubMap.values()).map((item) =>
          mapBackendToItem(item, merchantNameMap),
        );
        setSubs(currentSubs);
      } else {
        setSubs([]);
      }
    } catch {
      setSubs([]);
    } finally {
      setLoading(false);
    }
  }, [merchantNameMap]);

  useEffect(() => {
    void fetchSubscriptions();
  }, [fetchSubscriptions]);

  const plansWithCounts = useMemo(() => {
    return plans.map((p) => ({
      ...p,
      subscriber_count: subs.filter((s) => s.plan_name === p.name && s.status === "ACTIVE").length,
    }));
  }, [plans, subs]);

  // Change Plan Modal State
  const [changePlanSub, setChangePlanSub] = useState<MerchantSubscriptionItem | null>(null);

  // Cancel Subscription Modal State
  const [cancelSub, setCancelSub] = useState<MerchantSubscriptionItem | null>(null);

  const totalSubRevenue = useMemo(() => {
    return subs
      .filter((s) => s.status === "ACTIVE")
      .reduce((acc, s) => acc + s.last_payment_amount, 0);
  }, [subs]);

  const totalCommissionsEarned = useMemo(() => {
    return subs.reduce((acc, s) => acc + s.commission_earned, 0);
  }, [subs]);

  const filteredSubs = useMemo(() => {
    if (subStatusFilter === "ALL") return subs;
    return subs.filter((s) => s.status === subStatusFilter);
  }, [subs, subStatusFilter]);

  // ── Handler: Change Plan for Merchant via Backend ────────────────────────
  const handleChangePlanConfirm = async (
    subId: string,
    newPlanName: string,
    billingCycle: "MONTHLY" | "ANNUAL",
    options: { effectiveTiming: "IMMEDIATE" | "NEXT_CYCLE"; notes?: string },
  ) => {
    const targetPlan = plans.find((p) => p.name === newPlanName);
    const targetTier = targetPlan?.tier || "BASIC";
    const subItem = subs.find((s) => s.id === subId);

    try {
      // 1. Call Backend Admin Subscription Modify API
      if (subId && !subId.startsWith("sub-")) {
        await modifySubscriptionApi(subId, {
          plan_tier: targetTier,
          billing_cycle: billingCycle,
          status: "ACTIVE",
          commission_rate_percentage: targetPlan?.commission_rate_pct,
          reason: options.notes || `Admin changed plan to ${newPlanName}`,
        });
      } else if (subItem?.merchant_id) {
        await modifyMerchantSubscriptionApi(subItem.merchant_id, {
          plan_tier: targetTier,
          billing_cycle: billingCycle,
          status: "ACTIVE",
          commission_rate_percentage: targetPlan?.commission_rate_pct,
          reason: options.notes || `Admin changed plan to ${newPlanName}`,
        });
      }

      onShowToast(
        `Plan for "${subItem?.merchant_name || "Merchant"}" changed to ${newPlanName} (${billingCycle.toLowerCase()}) successfully.`,
        "success",
      );
      void fetchSubscriptions();
    } catch (err) {
      onShowToast(
        `Failed to change plan for "${subItem?.merchant_name || "Merchant"}": ${toUserMessage(err)}`,
        "error",
      );
      void fetchSubscriptions();
    }
  };

  // ── Handler: Cancel Subscription via Backend ────────────────────────────
  const handleCancelConfirm = async (
    subId: string,
    reason: string,
    timing: "IMMEDIATE" | "PERIOD_END",
    notes?: string,
  ) => {
    const subItem = subs.find((s) => s.id === subId);

    try {
      if (subId && !subId.startsWith("sub-")) {
        await modifySubscriptionApi(subId, {
          status: "CANCELLED",
          reason: reason || notes || "Cancelled by PlatformAdmin",
        });
      } else if (subItem?.merchant_id) {
        await modifyMerchantSubscriptionApi(subItem.merchant_id, {
          status: "CANCELLED",
          reason: reason || notes || "Cancelled by PlatformAdmin",
        });
      }

      onShowToast(
        `Subscription for "${subItem?.merchant_name || "Merchant"}" cancelled successfully.`,
        "success",
      );
      void fetchSubscriptions();
    } catch (err) {
      onShowToast(
        `Failed to cancel subscription for "${subItem?.merchant_name || "Merchant"}": ${toUserMessage(err)}`,
        "error",
      );
      void fetchSubscriptions();
    }
  };

  // ── Handler: Reactivate Subscription via Backend ────────────────────────
  const handleReactivateConfirm = async (subId: string) => {
    const subItem = subs.find((s) => s.id === subId);

    try {
      if (subId && !subId.startsWith("sub-")) {
        await modifySubscriptionApi(subId, {
          status: "ACTIVE",
          reason: "Reactivated by PlatformAdmin",
        });
      } else if (subItem?.merchant_id) {
        await modifyMerchantSubscriptionApi(subItem.merchant_id, {
          status: "ACTIVE",
          reason: "Reactivated by PlatformAdmin",
        });
      }

      onShowToast(
        `Subscription for "${subItem?.merchant_name || "Merchant"}" reactivated successfully.`,
        "success",
      );
      void fetchSubscriptions();
    } catch (err) {
      onShowToast(
        `Failed to reactivate subscription for "${subItem?.merchant_name || "Merchant"}": ${toUserMessage(err)}`,
        "error",
      );
      void fetchSubscriptions();
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <span>📜 Subscription & Billing Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-violet-950/70 border border-violet-800/60 text-violet-400">
              Platform Tiers
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage merchant subscription plans, cancellations, billing cycles, invoices, and
            platform take-rate ledgers.
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <SubscriptionSummaryCards
        subs={subs}
        plans={plans}
        totalSubRevenue={totalSubRevenue}
        totalCommissionsEarned={totalCommissionsEarned}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("MERCHANT_SUBS")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "MERCHANT_SUBS"
              ? "bg-violet-950/50 text-violet-400 shadow-sm border border-violet-800/60"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>🏢 Subscribed Merchants ({subs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("PLANS")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "PLANS"
              ? "bg-slate-800 text-white shadow-sm border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>🏷️ Platform Subscription Tiers ({plans.length})</span>
        </button>
      </div>

      {/* View: Subscribed Merchants Management */}
      {activeTab === "MERCHANT_SUBS" && (
        <MerchantSubscriptionsTable
          statusFilter={subStatusFilter}
          onStatusFilterChange={setSubStatusFilter}
          subs={filteredSubs}
          onChangePlan={(sub) => setChangePlanSub(sub)}
          onCancel={(sub) => setCancelSub(sub)}
          onReactivate={handleReactivateConfirm}
        />
      )}

      {/* View: Subscription Plans (View-only) */}
      {activeTab === "PLANS" && (
        <SubscriptionPlansGrid
          plans={plansWithCounts}
          onViewSubscribers={() => {
            setActiveTab("MERCHANT_SUBS");
          }}
        />
      )}

      {/* Change Subscription Plan Modal */}
      <ChangePlanModal
        open={Boolean(changePlanSub)}
        subscription={changePlanSub}
        plans={plans}
        onClose={() => setChangePlanSub(null)}
        onConfirm={handleChangePlanConfirm}
      />

      {/* Cancel Subscription Modal */}
      <CancelSubscriptionModal
        open={Boolean(cancelSub)}
        subscription={cancelSub}
        onClose={() => setCancelSub(null)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  );
}
