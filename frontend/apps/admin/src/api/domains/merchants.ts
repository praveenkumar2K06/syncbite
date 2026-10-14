import { apiClient } from "../client";
import {
  approveMerchantApi as sharedApproveMerchantApi,
  rejectMerchantApi as sharedRejectMerchantApi,
  updateMerchantStatusApi as sharedUpdateMerchantStatusApi,
  updateMerchantProfileApi as sharedUpdateMerchantProfileApi,
  getMerchantApi as sharedGetMerchantApi,
  listBrandsApi as sharedListBrandsApi,
  createBrandApi as sharedCreateBrandApi,
  updateBrandApi as sharedUpdateBrandApi,
  deleteBrandApi as sharedDeleteBrandApi,
  listAdminMerchantsApi as sharedListAdminMerchantsApi,
  getHierarchyApi as sharedGetHierarchyApi,
  getBranchesApi as sharedGetBranchesApi,
  type MerchantRecord,
  type Brand,
  type Branch,
  type MerchantStatus,
  type MerchantHierarchyItem,
  type BrandUpdateRequest,
  type MerchantUpdateRequest,
} from "@syncbite/shared";

export type { MerchantStatus, MerchantHierarchyItem };

export async function approveMerchantApi(merchantId: string, reason?: string) {
  return sharedApproveMerchantApi(apiClient, merchantId, reason);
}

export async function rejectMerchantApi(merchantId: string, reason: string) {
  return sharedRejectMerchantApi(apiClient, merchantId, reason);
}

export async function updateMerchantStatusApi(
  merchantId: string,
  status: MerchantStatus,
): Promise<MerchantRecord> {
  return sharedUpdateMerchantStatusApi(apiClient, merchantId, status);
}

export async function updateMerchantApi(
  merchantId: string,
  payload: MerchantUpdateRequest,
): Promise<MerchantRecord> {
  return sharedUpdateMerchantProfileApi(apiClient, merchantId, payload);
}

export async function getMerchantApi(merchantId: string): Promise<MerchantRecord> {
  return sharedGetMerchantApi(apiClient, merchantId);
}

export async function getBrandsApi(): Promise<Brand[]> {
  return sharedListBrandsApi(apiClient);
}

export async function createBrandApi(payload: {
  name: string;
  merchant_id: string;
  description?: string;
  cuisine_types?: string[];
  logo_url?: string;
  banner_url?: string;
}): Promise<Brand> {
  return sharedCreateBrandApi(apiClient, {
    merchant_id: payload.merchant_id,
    name: payload.name.trim(),
    description: payload.description?.trim() || null,
    cuisine_types:
      payload.cuisine_types && payload.cuisine_types.length > 0 ? payload.cuisine_types : null,
    logo_url: payload.logo_url || null,
    banner_url: payload.banner_url || null,
  });
}

export async function updateBrandApi(brandId: string, payload: BrandUpdateRequest): Promise<Brand> {
  return sharedUpdateBrandApi(apiClient, brandId, payload);
}

export async function deleteBrandApi(brandId: string): Promise<void> {
  return sharedDeleteBrandApi(apiClient, brandId);
}

export async function listAdminMerchantsApi(status?: MerchantStatus): Promise<MerchantRecord[]> {
  return sharedListAdminMerchantsApi(apiClient, status);
}

export async function getHierarchyApi(): Promise<{
  merchants: MerchantRecord[];
  brands: Brand[];
  branches: Branch[];
  hierarchy: MerchantHierarchyItem[];
}> {
  return sharedGetHierarchyApi(
    apiClient,
    (c) => sharedGetBranchesApi(c, { limit: 100 }),
    (c) => sharedListBrandsApi(c),
  );
}
