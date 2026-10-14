import type { SubscriptionTier } from "@syncbite/shared";

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier?: SubscriptionTier;
  code: string;
  price_monthly: number;
  price_annual: number;
  commission_rate_pct: number;
  max_branches: number;
  features: string[];
  is_active: boolean;
  subscriber_count: number;
}

export interface MerchantSubscriptionItem {
  id: string;
  merchant_id: string;
  merchant_name: string;
  plan_tier?: SubscriptionTier;
  plan_name: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  billing_cycle: "MONTHLY" | "ANNUAL";
  current_period_start: string;
  current_period_end: string;
  valid_until?: string;
  commission_rate_percentage?: number;
  max_branches?: number;
  last_payment_amount: number;
  commission_earned: number;
  invoice_id: string;
  cancelled_at?: string;
  cancel_reason?: string;
  cancel_timing?: "IMMEDIATE" | "PERIOD_END";
  notes?: string;
}

export interface ChangePlanModalState {
  open: boolean;
  subscription: MerchantSubscriptionItem | null;
  targetPlanName: string;
  billingCycle: "MONTHLY" | "ANNUAL";
  effectiveTiming: "IMMEDIATE" | "NEXT_CYCLE";
  notes: string;
}

export interface CancelSubscriptionModalState {
  open: boolean;
  subscription: MerchantSubscriptionItem | null;
  reason: string;
  timing: "IMMEDIATE" | "PERIOD_END";
  notes: string;
}
