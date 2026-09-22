import { apiClient } from "../client";
import {
  listAdminSubscriptionsApi as sharedListAdminSubscriptionsApi,
  getAdminSubscriptionHistoryApi as sharedGetAdminSubscriptionHistoryApi,
  getMerchantSubscriptionHistoryApi as sharedGetMerchantSubscriptionHistoryApi,
  modifySubscriptionApi as sharedModifySubscriptionApi,
  modifyMerchantSubscriptionApi as sharedModifyMerchantSubscriptionApi,
  setMerchantSubscriptionApi as sharedSetMerchantSubscriptionApi,
  type AdminSubscriptionResponse,
  type AdminSubscriptionModifyRequest,
  type ListSubscriptionsQuery,
} from "@syncbite/shared";

export type { AdminSubscriptionResponse, AdminSubscriptionModifyRequest, ListSubscriptionsQuery };

/**
 * GET /api/v1/admin/subscriptions
 * List all merchant subscriptions with filters
 */
export async function listAdminSubscriptionsApi(
  query: ListSubscriptionsQuery = {},
): Promise<AdminSubscriptionResponse[]> {
  return sharedListAdminSubscriptionsApi(apiClient, query);
}

/**
 * GET /api/v1/admin/subscriptions/history
 * List subscription history across merchants
 */
export async function getAdminSubscriptionHistoryApi(
  query: { merchant_id?: string; skip?: number; limit?: number } = {},
): Promise<AdminSubscriptionResponse[]> {
  return sharedGetAdminSubscriptionHistoryApi(apiClient, query);
}

/**
 * GET /api/v1/admin/merchants/{merchant_id}/subscriptions
 * Retrieve subscription history for a specific merchant
 */
export async function getMerchantSubscriptionHistoryApi(
  merchantId: string,
  query: { skip?: number; limit?: number } = {},
): Promise<AdminSubscriptionResponse[]> {
  return sharedGetMerchantSubscriptionHistoryApi(apiClient, merchantId, query);
}

/**
 * PATCH /api/v1/admin/subscriptions/{subscription_id}
 * Directly modify a merchant's subscription parameters
 */
export async function modifySubscriptionApi(
  subscriptionId: string,
  payload: AdminSubscriptionModifyRequest,
): Promise<AdminSubscriptionResponse> {
  return sharedModifySubscriptionApi(apiClient, subscriptionId, payload);
}

/**
 * PATCH /api/v1/admin/merchants/{merchant_id}/subscription
 * Modify the active subscription or create/assign a new subscription for a merchant
 */
export async function modifyMerchantSubscriptionApi(
  merchantId: string,
  payload: AdminSubscriptionModifyRequest,
): Promise<AdminSubscriptionResponse> {
  return sharedModifyMerchantSubscriptionApi(apiClient, merchantId, payload);
}

/**
 * PUT /api/v1/admin/merchants/{merchant_id}/subscription
 * Set or override merchant subscription with custom terms
 */
export async function setMerchantSubscriptionApi(
  merchantId: string,
  payload: AdminSubscriptionModifyRequest,
): Promise<AdminSubscriptionResponse> {
  return sharedSetMerchantSubscriptionApi(apiClient, merchantId, payload);
}
