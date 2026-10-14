import type { OnboardFormData } from "../../types/dashboard";
import { Badge } from "../../components/ui/badge";

interface Props {
  onboardForm: OnboardFormData;
  onChangeForm: (updated: OnboardFormData) => void;
}

interface PlanOption {
  tier: "BASIC" | "PROFESSIONAL" | "ENTERPRISE";
  name: string;
  badge: string;
  monthlyPrice: number;
  annualPrice: number;
  commission: string;
  outlets: string;
  highlights: string[];
}

const AVAILABLE_PLANS: PlanOption[] = [
  {
    tier: "BASIC",
    name: "Campus Starter",
    badge: "STARTER",
    monthlyPrice: 999,
    annualPrice: 9990,
    commission: "7% Take-rate",
    outlets: "1 Campus Branch",
    highlights: ["Single campus outlet", "Kitchen Kanban Board", "Standard Support"],
  },
  {
    tier: "PROFESSIONAL",
    name: "Growth Multi-Store",
    badge: "POPULAR",
    monthlyPrice: 2499,
    annualPrice: 24990,
    commission: "5% Take-rate",
    outlets: "Up to 5 Branches",
    highlights: ["Priority Listing", "Multi-Kitchen Prep", "Automated Inventory Alerts"],
  },
  {
    tier: "ENTERPRISE",
    name: "Campus Franchise",
    badge: "FRANCHISE",
    monthlyPrice: 4999,
    annualPrice: 49990,
    commission: "3.5% Take-rate",
    outlets: "Up to 20 Branches",
    highlights: ["Lowest platform take-rate", "Dedicated Account Manager", "API/POS Integrations"],
  },
];

export default function SubscriptionPlanSection({ onboardForm, onChangeForm }: Props) {
  const selectedTier = onboardForm.subscription_plan || "BASIC";
  const selectedCycle = onboardForm.subscription_cycle || "MONTHLY";

  const handleSelectTier = (tier: "BASIC" | "PROFESSIONAL" | "ENTERPRISE") => {
    onChangeForm({
      ...onboardForm,
      subscription_plan: tier,
    });
  };

  const handleSelectCycle = (cycle: "MONTHLY" | "ANNUAL") => {
    onChangeForm({
      ...onboardForm,
      subscription_cycle: cycle,
    });
  };

  return (
    <div className="flex flex-col gap-3.5 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
          <span>📜</span> Merchant Subscription Plan & Platform Tier
        </h3>
        {/* Billing cycle pill toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleSelectCycle("MONTHLY")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCycle === "MONTHLY"
                ? "bg-violet-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => handleSelectCycle("ANNUAL")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              selectedCycle === "ANNUAL"
                ? "bg-violet-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 font-bold rounded">
              Save 2 mo
            </span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Select the initial billing tier to provision for this merchant upon onboarding. This sets
        their platform commission take-rate and branch capacity limits.
      </p>

      {/* Plans selector cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-1">
        {AVAILABLE_PLANS.map((plan) => {
          const isSelected = selectedTier === plan.tier;
          const displayPrice = selectedCycle === "ANNUAL" ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.tier}
              onClick={() => handleSelectTier(plan.tier)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-violet-950/40 border-violet-500 ring-2 ring-violet-500/30 shadow-md shadow-violet-950/50"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-violet-300 mt-1 inline-block border border-slate-700">
                      {plan.tier}
                    </span>
                  </div>
                  {plan.badge === "POPULAR" ? (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
                      Popular
                    </Badge>
                  ) : null}
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-white">
                      ₹{displayPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">
                      /{selectedCycle === "ANNUAL" ? "yr" : "mo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="font-semibold text-emerald-400">{plan.commission}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{plan.outlets}</span>
                  </div>
                </div>

                <ul className="mt-3.5 space-y-1.5 border-t border-slate-800/80 pt-3">
                  {plan.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="text-violet-400 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-2">
                <div
                  className={`w-full py-1.5 px-3 rounded-lg text-center text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? "bg-violet-600 text-white"
                      : "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <span>✓</span> Selected Plan
                    </>
                  ) : (
                    "Select Plan"
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
