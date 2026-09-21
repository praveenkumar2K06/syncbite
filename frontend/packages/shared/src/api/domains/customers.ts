import type { ApiClientInstance } from "../client";
import type {
  AdminCustomerResponse,
  AdminCustomerDetailResponse,
  AdminCustomerUpdateRequest,
} from "../../types/admin";
import type { CustomerProfile } from "../../types/customers";

export interface ListCustomersParams {
  search?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}

export async function listCustomersApi(
  client: ApiClientInstance,
  params?: ListCustomersParams,
): Promise<AdminCustomerResponse[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.is_active !== undefined) query.append("is_active", String(params.is_active));
  if (params?.skip !== undefined) query.append("skip", String(params.skip));
  if (params?.limit !== undefined) query.append("limit", String(params.limit));

  const qStr = query.toString();
  return client<AdminCustomerResponse[]>(`/admin/customers${qStr ? `?${qStr}` : ""}`);
}

export async function getCustomerDetailsApi(
  client: ApiClientInstance,
  customerId: string,
): Promise<AdminCustomerDetailResponse> {
  return client<AdminCustomerDetailResponse>(`/admin/customers/${customerId}`);
}

export async function updateCustomerApi(
  client: ApiClientInstance,
  customerId: string,
  payload: AdminCustomerUpdateRequest,
): Promise<AdminCustomerDetailResponse> {
  return client<AdminCustomerDetailResponse>(`/admin/customers/${customerId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getCustomerProfileApi(client: ApiClientInstance): Promise<CustomerProfile> {
  return client<CustomerProfile>("/customers/me");
}

export async function updateCustomerProfileApi(
  client: ApiClientInstance,
  profile: {
    full_name?: string;
    phone_number?: string;
  },
): Promise<CustomerProfile> {
  return client<CustomerProfile>("/customers/me", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}
