import type { ApiClientInstance } from "../client";
import type {
  AdminSubscriptionModifyRequest,
  AdminSubscriptionResponse,
  MerchantSubscription,
  PlatformCommission,
  SubscriptionInvoice,
} from "../../types/subscription";

export async function getMerchantSubscriptionApi(
  client: ApiClientInstance,
): Promise<MerchantSubscription> {
  return client<MerchantSubscription>("/merchants/me/subscription");
}

export async function createOrUpdateSubscriptionApi(
  client: ApiClientInstance,
  payload: {
    plan_tier: string;
    billing_cycle?: string;
  },
): Promise<MerchantSubscription> {
  return client<MerchantSubscription>("/merchants/me/subscription", {
    method: "POST",
    body: JSON.stringify({
      plan_tier: payload.plan_tier,
      billing_cycle: payload.billing_cycle ?? "MONTHLY",
    }),
  });
}

export async function renewSubscriptionApi(
  client: ApiClientInstance,
  payload: {
    plan_tier?: string | null;
    duration_months?: number;
  },
): Promise<MerchantSubscription> {
  return client<MerchantSubscription>("/merchants/me/subscription/renew", {
    method: "POST",
    body: JSON.stringify({
      plan_tier: payload.plan_tier || null,
      duration_months: payload.duration_months ?? 1,
    }),
  });
}

export async function getMerchantCommissionsApi(
  client: ApiClientInstance,
): Promise<PlatformCommission[]> {
  return client<PlatformCommission[]>("/merchants/me/commissions");
}

export async function getMerchantInvoicesApi(
  client: ApiClientInstance,
): Promise<SubscriptionInvoice[]> {
  return client<SubscriptionInvoice[]>("/merchants/me/invoices");
}

export interface ListSubscriptionsQuery {
  merchant_id?: string;
  status?: string;
  plan_tier?: string;
  skip?: number;
  limit?: number;
}

export async function listAdminSubscriptionsApi(
  client: ApiClientInstance,
  query: ListSubscriptionsQuery = {},
): Promise<AdminSubscriptionResponse[]> {
  const params = new URLSearchParams();
  if (query.merchant_id) params.set("merchant_id", query.merchant_id);
  if (query.status && query.status !== "ALL") params.set("status", query.status);
  if (query.plan_tier && query.plan_tier !== "ALL") params.set("plan_tier", query.plan_tier);
  if (query.skip !== undefined) params.set("skip", String(query.skip));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const qs = params.toString();
  return client<AdminSubscriptionResponse[]>(`/admin/subscriptions${qs ? `?${qs}` : ""}`);
}

export async function getAdminSubscriptionHistoryApi(
  client: ApiClientInstance,
  query: { merchant_id?: string; skip?: number; limit?: number } = {},
): Promise<AdminSubscriptionResponse[]> {
  const params = new URLSearchParams();
  if (query.merchant_id) params.set("merchant_id", query.merchant_id);
  if (query.skip !== undefined) params.set("skip", String(query.skip));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const qs = params.toString();
  return client<AdminSubscriptionResponse[]>(`/admin/subscriptions/history${qs ? `?${qs}` : ""}`);
}

export async function getMerchantSubscriptionHistoryApi(
  client: ApiClientInstance,
  merchantId: string,
  query: { skip?: number; limit?: number } = {},
): Promise<AdminSubscriptionResponse[]> {
  const params = new URLSearchParams();
  if (query.skip !== undefined) params.set("skip", String(query.skip));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const qs = params.toString();
  return client<AdminSubscriptionResponse[]>(
    `/admin/merchants/${merchantId}/subscriptions${qs ? `?${qs}` : ""}`,
  );
}

export async function modifySubscriptionApi(
  client: ApiClientInstance,
  subscriptionId: string,
  payload: AdminSubscriptionModifyRequest,
): Promise<AdminSubscriptionResponse> {
  return client<AdminSubscriptionResponse>(`/admin/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function modifyMerchantSubscriptionApi(
  client: ApiClientInstance,
  merchantId: string,
  payload: AdminSubscriptionModifyRequest,
): Promise<AdminSubscriptionResponse> {
  return client<AdminSubscriptionResponse>(`/admin/merchants/${merchantId}/subscription`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function setMerchantSubscriptionApi(
  client: ApiClientInstance,
  merchantId: string,
  payload: AdminSubscriptionModifyRequest,
): Promise<AdminSubscriptionResponse> {
  return client<AdminSubscriptionResponse>(`/admin/merchants/${merchantId}/subscription`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
