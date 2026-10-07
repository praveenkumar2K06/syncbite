import { formatMoney } from "@/lib/portal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SUBSCRIPTION_PLANS } from "./PlanPricingCards";

interface SubscriptionModalsProps {
  planModalOpen: boolean;
  onPlanModalOpenChange: (open: boolean) => void;
  selectedTier: string;
  onSelectTier: (tier: string) => void;
  onUpdatePlan: () => Promise<void>;
  renewModalOpen: boolean;
  onRenewModalOpenChange: (open: boolean) => void;
  currentTier?: string;
  renewMonths: number;
  onSelectRenewMonths: (months: number) => void;
  onRenew: () => Promise<void>;
  submitting: boolean;
}

export function SubscriptionModals({
  planModalOpen,
  onPlanModalOpenChange,
  selectedTier,
  onSelectTier,
  onUpdatePlan,
  renewModalOpen,
  onRenewModalOpenChange,
  currentTier,
  renewMonths,
  onSelectRenewMonths,
  onRenew,
  submitting,
}: SubscriptionModalsProps) {
  return (
    <>
      {/* Change Plan Dialog */}
      <Dialog open={planModalOpen} onOpenChange={onPlanModalOpenChange}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Change Subscription Tier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-xs">
            <p className="text-muted-foreground">
              Upgrading or changing tier adjusts your branch limits and commission fee starting
              immediately.
            </p>
            <div className="space-y-2">
              {SUBSCRIPTION_PLANS.map((p) => (
                <div
                  key={p.tier}
                  onClick={() => onSelectTier(p.tier)}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                    selectedTier === p.tier
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:bg-muted/30"
                  }`}
                >
                  <div>
                    <span className="font-bold text-foreground">
                      {p.name} ({p.tier})
                    </span>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      {p.commissionRate}% fee · Max {p.maxBranches} branches
                    </p>
                  </div>
                  <span className="font-bold text-foreground">{formatMoney(p.price)}/mo</span>
                </div>
              ))}
            </div>

            <DialogFooter className="pt-3">
              <Button variant="outline" size="sm" onClick={() => onPlanModalOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" disabled={submitting} onClick={onUpdatePlan} className="font-bold">
                {submitting ? "Updating…" : `Confirm ${selectedTier}`}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog open={renewModalOpen} onOpenChange={onRenewModalOpenChange}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Renew Merchant Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-xs">
            <p className="text-muted-foreground">
              Extend your active {currentTier || "BASIC"} subscription validity.
            </p>
            <div className="space-y-1.5">
              <span className="font-medium text-foreground">Renewal Duration</span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onSelectRenewMonths(m)}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      renewMonths === m
                        ? "border-primary bg-primary/10 font-bold text-primary"
                        : "border-border text-muted-foreground hover:bg-muted/30"
                    }`}
                  >
                    {m} Month{m > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button variant="outline" size="sm" onClick={() => onRenewModalOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" disabled={submitting} onClick={onRenew} className="font-bold">
                {submitting ? "Renewing…" : "Confirm Renewal"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
