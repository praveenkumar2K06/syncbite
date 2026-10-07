import { formatMoney } from "@/lib/portal";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

export interface PlanConfig {
  tier: string;
  name: string;
  price: number;
  popular?: boolean;
  commissionRate: number;
  maxBranches: number;
  features: string[];
}

export const SUBSCRIPTION_PLANS: PlanConfig[] = [
  {
    tier: "BASIC",
    name: "Campus Starter",
    price: 999,
    commissionRate: 7,
    maxBranches: 1,
    features: [
      "1 Campus Branch Outlet",
      "7% Platform Commission Rate",
      "Kitchen Kanban Board",
      "Digital Menu & Inventory",
      "Daily Automated Settlements",
    ],
  },
  {
    tier: "PROFESSIONAL",
    name: "Growth Multi-Store",
    price: 2499,
    popular: true,
    commissionRate: 5,
    maxBranches: 5,
    features: [
      "Up to 5 Campus Branch Outlets",
      "Reduced 5% Commission Rate",
      "Multi-Kitchen Prep Stations",
      "Automated Out-of-Stock Alerting",
      "Priority Merchant Support",
    ],
  },
  {
    tier: "ENTERPRISE",
    name: "Campus Franchise",
    price: 4999,
    commissionRate: 3.5,
    maxBranches: 20,
    features: [
      "Up to 20 Campus Outlets",
      "Lowest 3.5% Commission Rate",
      "Dedicated Account Manager",
      "Custom Multi-Brand Catalog",
      "API & POS Integration Support",
    ],
  },
];

interface PlanPricingCardsProps {
  currentTier?: string;
  onSelectTier: (tier: string) => void;
}

export function PlanPricingCards({ currentTier, onSelectTier }: PlanPricingCardsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-foreground">Available Merchant Plans</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Choose a tier that fits your campus scale and franchise operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.tier;

          return (
            <Card
              key={plan.tier}
              className={`border transition-all flex flex-col justify-between ${
                plan.popular
                  ? "border-primary/80 shadow-md ring-1 ring-primary/30"
                  : isCurrent
                    ? "border-emerald-500/80 bg-emerald-500/[0.02]"
                    : "border-border"
              }`}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {plan.name}
                  </span>
                  {plan.popular && (
                    <Badge className="bg-primary text-primary-foreground text-[10px] font-bold">
                      Recommended
                    </Badge>
                  )}
                  {isCurrent && !plan.popular && (
                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">
                    {formatMoney(plan.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {plan.commissionRate}% commission · Max {plan.maxBranches} outlet
                  {plan.maxBranches > 1 ? "s" : ""}
                </p>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2 border-t border-border/60 pt-3 text-xs">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                      />
                      <span className="text-muted-foreground">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    variant={isCurrent ? "outline" : plan.popular ? "default" : "secondary"}
                    disabled={isCurrent}
                    onClick={() => onSelectTier(plan.tier)}
                    className="w-full text-xs font-semibold h-8"
                  >
                    {isCurrent ? "Current Active Plan" : `Switch to ${plan.tier}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
