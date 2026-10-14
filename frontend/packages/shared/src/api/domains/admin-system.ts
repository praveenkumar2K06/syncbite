import type { ApiClientInstance } from "../client";
import type {
  AdminSetPasswordRequest,
  AdminSetPasswordResponse,
  AuditLog,
  BannerCreate,
  BannerResponse,
  FeatureFlag,
  PaymentResponse,
  PaymentTransactionResponse,
  PlatformAnalytics,
  RefundOverrideRequest,
  RefundOverrideResponse,
} from "../../types/admin";

export async function getAnalyticsApi(client: ApiClientInstance): Promise<PlatformAnalytics> {
  return client<PlatformAnalytics>("/admin/analytics/overview");
}

export async function getAuditLogsApi(client: ApiClientInstance, limit = 50): Promise<AuditLog[]> {
  return client<AuditLog[]>(`/admin/audit-logs?limit=${limit}`);
}

export async function getFeatureFlagsApi(client: ApiClientInstance): Promise<FeatureFlag[]> {
  return client<FeatureFlag[]>("/admin/feature-flags");
}

export async function toggleFeatureFlagApi(
  client: ApiClientInstance,
  key: string,
  enabled: boolean,
  value?: string | null,
): Promise<FeatureFlag> {
  const body: { enabled: boolean; value?: string | null } = { enabled, value: value ?? null };
  return client<FeatureFlag>(`/admin/feature-flags/${key}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export const updateFeatureFlagApi = toggleFeatureFlagApi;

export async function adminSetPasswordApi(
  client: ApiClientInstance,
  payload: AdminSetPasswordRequest,
): Promise<AdminSetPasswordResponse> {
  return client<AdminSetPasswordResponse>("/admin/set-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getBannersApi(client: ApiClientInstance): Promise<BannerResponse[]> {
  return client<BannerResponse[]>("/admin/banners");
}

export async function createBannerApi(
  client: ApiClientInstance,
  payload: BannerCreate,
): Promise<BannerResponse> {
  return client<BannerResponse>("/admin/banners", {
    method: "POST",
    body: JSON.stringify({
      title: payload.title.trim(),
      image_url: payload.image_url.trim(),
      target_url: payload.target_url?.trim() || null,
      display_order: payload.display_order ?? 0,
      is_active: payload.is_active ?? true,
    }),
  });
}

export async function deleteBannerApi(client: ApiClientInstance, bannerId: string): Promise<void> {
  return client<void>(`/admin/banners/${bannerId}`, {
    method: "DELETE",
  });
}

export async function getPaymentByIdApi(
  client: ApiClientInstance,
  id: string,
): Promise<PaymentResponse> {
  return client<PaymentResponse>(`/payments/${id}`);
}

export async function issueRefundApi(
  client: ApiClientInstance,
  paymentId: string,
  amount: number,
  reason = "ORDER_CANCELLED",
): Promise<PaymentTransactionResponse> {
  return client<PaymentTransactionResponse>(`/payments/${paymentId}/refund`, {
    method: "POST",
    body: JSON.stringify({ amount, reason }),
  });
}

export async function issueRefundOverrideApi(
  client: ApiClientInstance,
  payload: RefundOverrideRequest,
): Promise<RefundOverrideResponse> {
  return client<RefundOverrideResponse>("/admin/refunds/override", {
    method: "POST",
    body: JSON.stringify({
      payment_id: payload.payment_id,
      amount: Number(payload.amount),
      reason: payload.reason || "Administrative override",
    }),
  });
}
