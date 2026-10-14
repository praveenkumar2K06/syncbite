import { apiClient } from "../client";
import {
  listCustomersApi as sharedListCustomers,
  getCustomerDetailsApi as sharedGetCustomerDetails,
  updateCustomerApi as sharedUpdateCustomer,
} from "@syncbite/shared";

import type {
  AdminCustomerResponse,
  AdminCustomerDetailResponse,
  AdminCustomerUpdateRequest,
  ListCustomersParams,
} from "@syncbite/shared";

export type {
  AdminCustomerResponse,
  AdminCustomerDetailResponse,
  AdminCustomerUpdateRequest,
  ListCustomersParams,
};

export async function listCustomersApi(
  params?: ListCustomersParams,
): Promise<AdminCustomerResponse[]> {
  return sharedListCustomers(apiClient, params);
}

export async function getCustomerDetailsApi(
  customerId: string,
): Promise<AdminCustomerDetailResponse> {
  return sharedGetCustomerDetails(apiClient, customerId);
}

export async function updateCustomerApi(
  customerId: string,
  payload: AdminCustomerUpdateRequest,
): Promise<AdminCustomerDetailResponse> {
  return sharedUpdateCustomer(apiClient, customerId, payload);
}
