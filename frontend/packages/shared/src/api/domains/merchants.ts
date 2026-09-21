import type { ApiClientInstance } from "../client";
import type { Branch, Brand, MerchantRecord } from "../../types/branch";

export type { MerchantRecord };

export interface MerchantOnboardRequest {
  business_name: string;
  legal_entity_name: string;
  fssai_license_number: string;
  gstin?: string | null;
  bank_account_number?: string | null;
  bank_ifsc_code?: string | null;
}

export interface MerchantUpdateRequest {
  business_name?: string;
  legal_entity_name?: string;
  fssai_license_number?: string;
  gstin?: string | null;
  bank_account_number?: string | null;
  bank_ifsc_code?: string | null;
}

export interface BrandCreateRequest {
  merchant_id?: string | null;
  name: string;
  logo_url?: string | null;
  banner_url?: string | null;
  description?: string | null;
  cuisine_types?: string[] | null;
}

export interface BrandUpdateRequest {
  name?: string;
  logo_url?: string | null;
  banner_url?: string | null;
  description?: string | null;
  cuisine_types?: string[] | null;
}

export async function getMerchantApi(
  client: ApiClientInstance,
  merchantId: string,
): Promise<MerchantRecord> {
  return client<MerchantRecord>(`/merchants/${merchantId}`);
}

export async function getMerchantProfileApi(client: ApiClientInstance): Promise<MerchantRecord> {
  return client<MerchantRecord>("/merchants/me");
}

export async function onboardMerchantApi(
  client: ApiClientInstance,
  payload: MerchantOnboardRequest,
): Promise<MerchantRecord> {
  return client<MerchantRecord>("/merchants/onboard", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateMerchantProfileApi(
  client: ApiClientInstance,
  merchantId: string,
  payload: MerchantUpdateRequest,
): Promise<MerchantRecord> {
  return client<MerchantRecord>(`/merchants/${merchantId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function listBrandsApi(
  client: ApiClientInstance,
  merchantId?: string | null,
): Promise<Brand[]> {
  const query = new URLSearchParams();
  if (merchantId) query.set("merchant_id", merchantId);
  query.set("limit", "100");
  const qs = query.toString();
  return client<Brand[]>(`/brands${qs ? `?${qs}` : ""}`);
}

export async function createBrandApi(
  client: ApiClientInstance,
  payload: BrandCreateRequest,
): Promise<Brand> {
  return client<Brand>("/brands", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateBrandApi(
  client: ApiClientInstance,
  brandId: string,
  payload: BrandUpdateRequest,
): Promise<Brand> {
  return client<Brand>(`/brands/${brandId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteBrandApi(client: ApiClientInstance, brandId: string): Promise<void> {
  await client<void>(`/brands/${brandId}`, {
    method: "DELETE",
  });
}

export type MerchantStatus =
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "DEACTIVATED"
  | "INACTIVE";

export async function approveMerchantApi(
  client: ApiClientInstance,
  merchantId: string,
  reason?: string,
): Promise<{ merchant_id: string; status: string; message: string }> {
  return client<{ merchant_id: string; status: string; message: string }>(
    `/admin/merchants/${merchantId}/approval`,
    { method: "POST", body: JSON.stringify({ action: "APPROVE", reason: reason ?? null }) },
  );
}

export async function rejectMerchantApi(
  client: ApiClientInstance,
  merchantId: string,
  reason: string,
): Promise<{ merchant_id: string; status: string; message: string }> {
  return client<{ merchant_id: string; status: string; message: string }>(
    `/admin/merchants/${merchantId}/approval`,
    { method: "POST", body: JSON.stringify({ action: "REJECT", reason }) },
  );
}

export async function updateMerchantStatusApi(
  client: ApiClientInstance,
  merchantId: string,
  status: MerchantStatus,
): Promise<MerchantRecord> {
  return client<MerchantRecord>(`/merchants/${merchantId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function listAdminMerchantsApi(
  client: ApiClientInstance,
  status?: MerchantStatus,
): Promise<MerchantRecord[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return client<MerchantRecord[]>(`/admin/merchants${query}`);
}

export interface MerchantHierarchyItem {
  merchant: MerchantRecord;
  brands: Array<{
    brand: Brand;
    branches: Branch[];
  }>;
}

export async function getHierarchyApi(
  client: ApiClientInstance,
  getBranchesFn: (client: ApiClientInstance) => Promise<Branch[]>,
  getBrandsFn: (client: ApiClientInstance) => Promise<Brand[]>,
): Promise<{
  merchants: MerchantRecord[];
  brands: Brand[];
  branches: Branch[];
  hierarchy: MerchantHierarchyItem[];
}> {
  const [branches, brands, adminMerchants] = await Promise.all([
    getBranchesFn(client),
    getBrandsFn(client),
    listAdminMerchantsApi(client),
  ]);

  const validMerchants: MerchantRecord[] = Array.isArray(adminMerchants) ? [...adminMerchants] : [];

  const existingMerchantIds = new Set(validMerchants.map((m) => m.id));
  const missingMerchantIds = Array.from(
    new Set(
      brands
        .map((b) => b.merchant_id)
        .filter((id): id is string => Boolean(id) && !existingMerchantIds.has(id)),
    ),
  );

  if (missingMerchantIds.length > 0) {
    const fetchedMissing = await Promise.all(
      missingMerchantIds.map((id) => getMerchantApi(client, id)),
    );
    validMerchants.push(...fetchedMissing);
  }

  const branchesByBrand = new Map<string, Branch[]>();
  for (const branch of branches) {
    const items = branchesByBrand.get(branch.brand_id) ?? [];
    items.push(branch);
    branchesByBrand.set(branch.brand_id, items);
  }
  const brandsByMerchant = new Map<string, Brand[]>();
  for (const brand of brands) {
    const items = brandsByMerchant.get(brand.merchant_id) ?? [];
    items.push(brand);
    brandsByMerchant.set(brand.merchant_id, items);
  }

  const hierarchy: MerchantHierarchyItem[] = validMerchants.map((merchant) => {
    const merchantBrands = brandsByMerchant.get(merchant.id) ?? [];
    return {
      merchant,
      brands: merchantBrands.map((brand) => ({
        brand,
        branches: branchesByBrand.get(brand.id) ?? [],
      })),
    };
  });

  return {
    merchants: validMerchants,
    brands,
    branches,
    hierarchy,
  };
}
