export type SubscriptionTier = "BASIC" | "PROFESSIONAL" | "ENTERPRISE";
export type SubscriptionBillingCycle = "MONTHLY" | "ANNUAL";
export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface SubscriptionPlanDefinition {
  id: string;
  name: string;
  tier: SubscriptionTier;
  code: string;
  price_monthly: number;
  price_annual: number;
  commission_rate_pct: number;
  max_branches: number;
  features: string[];
  is_active: boolean;
  subscriber_count?: number;
}

export const SHARED_SUBSCRIPTION_PLANS: SubscriptionPlanDefinition[] = [
  {
    id: "plan-campus-starter",
    name: "Campus Starter",
    tier: "BASIC",
    code: "STARTER",
    price_monthly: 999,
    price_annual: 9990,
    commission_rate_pct: 7.0,
    max_branches: 1,
    features: [
      "1 Campus Branch Outlet",
      "7% Platform Commission Rate",
      "Kitchen Kanban Board",
      "Digital Menu & Inventory",
      "Daily Automated Settlements",
    ],
    is_active: true,
  },
  {
    id: "plan-growth-outlet",
    name: "Growth Multi-Store",
    tier: "PROFESSIONAL",
    code: "GROWTH",
    price_monthly: 2499,
    price_annual: 24990,
    commission_rate_pct: 5.0,
    max_branches: 5,
    features: [
      "Up to 5 Campus Branch Outlets",
      "Reduced 5% Commission Rate",
      "Multi-Kitchen Prep Stations",
      "Automated Out-of-Stock Alerting",
      "Priority Merchant Support",
    ],
    is_active: true,
  },
  {
    id: "plan-enterprise-chain",
    name: "Campus Franchise",
    tier: "ENTERPRISE",
    code: "ENTERPRISE",
    price_monthly: 4999,
    price_annual: 49990,
    commission_rate_pct: 3.5,
    max_branches: 20,
    features: [
      "Up to 20 Campus Outlets",
      "Lowest 3.5% Commission Rate",
      "Dedicated Account Manager",
      "Custom Multi-Brand Catalog",
      "API & POS Integration Support",
    ],
    is_active: true,
  },
];

export interface SharedMerchantSubscription {
  id: string;
  merchant_id: string;
  merchant_name: string;
  plan_tier: SubscriptionTier;
  plan_name: string;
  billing_cycle: SubscriptionBillingCycle;
  status: SubscriptionStatus;
  commission_rate_percentage: number;
  max_branches: number;
  current_period_start: string;
  current_period_end: string;
  valid_until?: string;
  last_payment_amount: number;
  commission_earned: number;
  invoice_id: string;
  cancelled_at?: string;
  cancel_reason?: string;
  cancel_timing?: "IMMEDIATE" | "PERIOD_END";
  notes?: string;
  updated_at?: string;
}

export interface AdminSubscriptionResponse {
  id: string;
  merchant_id: string;
  business_name?: string | null;
  merchant_name?: string | null;
  plan_tier: string;
  billing_cycle: string;
  status: string;
  commission_rate_percentage: number;
  max_branches: number;
  valid_until: string;
  created_at: string;
  updated_at: string;
  reason?: string | null;
  notes?: string | null;
}

export interface AdminSubscriptionModifyRequest {
  plan_tier?: string | null;
  billing_cycle?: string | null;
  status?: string | null;
  commission_rate_percentage?: number | null;
  valid_until?: string | null;
  duration_months?: number | null;
  reason?: string | null;
}

export interface MerchantSubscription {
  id: string;
  merchant_id: string;
  plan_tier: string;
  billing_cycle: string;
  status: string;
  commission_rate_percentage: number;
  max_branches: number;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionInvoice {
  invoice_number: string;
  merchant_id: string;
  subscription_id: string;
  plan_tier: string;
  amount: number;
  billing_cycle: string;
  valid_until: string;
  issued_at: string;
}

export interface PlatformCommission {
  id: string;
  order_id: string;
  merchant_id: string;
  gross_order_amount: number;
  commission_rate_percentage: number;
  commission_amount: number;
  merchant_net_payout: number;
  created_at: string;
}
