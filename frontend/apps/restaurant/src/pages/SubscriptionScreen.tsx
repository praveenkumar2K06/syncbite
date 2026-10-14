import { useState, useEffect, useCallback } from "react";
import {
  getMerchantSubscriptionApi,
  createOrUpdateSubscriptionApi,
  renewSubscriptionApi,
  getMerchantInvoicesApi,
  toUserMessage,
  type MerchantSubscription,
  type SubscriptionInvoice,
} from "@/api";
import { usePortal } from "@/context/PortalContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CreditCardIcon,
  RefreshCwIcon,
  Calendar01Icon,
  FlashIcon,
} from "@hugeicons/core-free-icons";
import { PlanPricingCards, SUBSCRIPTION_PLANS } from "@/components/subscription/PlanPricingCards";
import { SubscriptionInvoicesTable } from "@/components/subscription/SubscriptionInvoicesTable";
import { SubscriptionModals } from "@/components/subscription/SubscriptionModals";

export default function SubscriptionScreen() {
  const { showToast } = usePortal();
  const [sub, setSub] = useState<MerchantSubscription | null>(null);
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Upgrade/Change Plan modal
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>("PROFESSIONAL");
  const [selectedCycle, setSelectedCycle] = useState<string>("MONTHLY");

  // Renew modal
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewMonths, setRenewMonths] = useState<number>(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [subData, invData] = await Promise.all([
        getMerchantSubscriptionApi().catch(() => null),
        getMerchantInvoicesApi().catch(() => []),
      ]);
      setSub(subData);
      setInvoices(invData);
      if (subData) {
        setSelectedTier(subData.plan_tier);
        setSelectedCycle(subData.billing_cycle || "MONTHLY");
      }
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleUpdatePlan = async () => {
    setSubmitting(true);
    try {
      const updated = await createOrUpdateSubscriptionApi({
        plan_tier: selectedTier,
        billing_cycle: selectedCycle,
      });
      setSub(updated);
      setPlanModalOpen(false);
      showToast(`Subscription plan updated to ${selectedTier}.`);
      void loadData();
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRenew = async () => {
    setSubmitting(true);
    try {
      const renewed = await renewSubscriptionApi({
        plan_tier: sub?.plan_tier,
        duration_months: renewMonths,
      });
      setSub(renewed);
      setRenewModalOpen(false);
      showToast(`Subscription renewed for ${renewMonths} month(s).`);
      void loadData();
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const currentPlanMeta =
    SUBSCRIPTION_PLANS.find((p) => p.tier === sub?.plan_tier) || SUBSCRIPTION_PLANS[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={CreditCardIcon} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Subscription & Invoices
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage merchant tier, branch limits, renewal dates and billing receipts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadData} className="gap-1.5 text-xs">
              <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setRenewModalOpen(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <HugeiconsIcon icon={Calendar01Icon} className="w-3.5 h-3.5" />
              Renew Subscription
            </Button>
          </div>
        </div>

        {/* Active Plan Card */}
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
            Loading subscription status…
          </div>
        ) : sub ? (
          <Card className="border-border shadow-xs overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-500 text-white font-bold text-xs">
                    ● {sub.status || "ACTIVE"}
                  </Badge>
                  <span className="text-xs text-slate-300 font-mono uppercase tracking-wider">
                    {sub.billing_cycle || "MONTHLY"} BILLING
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  {currentPlanMeta.name} ({sub.plan_tier})
                </h2>
                <p className="text-xs text-slate-300 max-w-lg">
                  Empowering your restaurants with reduced {sub.commission_rate_percentage}% take
                  rate and up to {sub.max_branches} active branch outlets.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-xl border border-white/10 text-right min-w-36">
                  <p className="text-[10px] text-slate-300 uppercase font-semibold">Valid Until</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {new Date(sub.valid_until).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <Button
                  onClick={() => setPlanModalOpen(true)}
                  className="bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs h-9 gap-1.5"
                >
                  <HugeiconsIcon icon={FlashIcon} className="w-3.5 h-3.5 text-amber-500" />
                  Change Plan
                </Button>
              </div>
            </div>

            <div className="p-4 bg-muted/30 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Platform Commission</span>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {sub.commission_rate_percentage}%
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">Physical Outlets Limit</span>
                <p className="font-bold text-foreground text-sm mt-0.5">
                  {sub.max_branches} Branches
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">Billing Term</span>
                <p className="font-bold text-foreground text-sm mt-0.5 capitalize">
                  {sub.billing_cycle.toLowerCase()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">Auto Renewal</span>
                <p className="font-bold text-emerald-600 text-sm mt-0.5">Enabled</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="border-border p-6 text-center">
            <h3 className="font-bold text-base">No active subscription found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Please select a merchant plan below to start processing live campus orders.
            </p>
            <Button
              size="sm"
              onClick={() => setPlanModalOpen(true)}
              className="mt-4 text-xs font-semibold"
            >
              Choose Plan
            </Button>
          </Card>
        )}

        {/* Pricing Tiers Comparison Grid */}
        <PlanPricingCards
          currentTier={sub?.plan_tier}
          onSelectTier={(tier) => {
            setSelectedTier(tier);
            setPlanModalOpen(true);
          }}
        />

        {/* Invoices Table */}
        <SubscriptionInvoicesTable invoices={invoices} />

        {/* Change Plan and Renew Dialogs */}
        <SubscriptionModals
          planModalOpen={planModalOpen}
          onPlanModalOpenChange={setPlanModalOpen}
          selectedTier={selectedTier}
          onSelectTier={setSelectedTier}
          onUpdatePlan={handleUpdatePlan}
          renewModalOpen={renewModalOpen}
          onRenewModalOpenChange={setRenewModalOpen}
          currentTier={sub?.plan_tier}
          renewMonths={renewMonths}
          onSelectRenewMonths={setRenewMonths}
          onRenew={handleRenew}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
