/**
 * Restaurant-facing endpoints of the shared SyncBite backend (`syncbite_v2`).
 *
 * Tenant model on the backend is Merchant -> Brand -> Branch. A restaurant
 * portal logs in as `BranchManager` (accounts are provisioned by the super
 * admin), so the frontend must supply the `branch_id` it manages.
 */

import { apiClient, clearTokens, setTokens } from "./client";

const BRANCH_ID_KEY = "sat_rest_branch_id";

import {
  type BackendUser,
  type TokenResponse,
  type Branch,
  type Brand,
  type Merchant,
  type MenuModifier,
  type MenuItem,
  type MenuCategory,
  type Menu,
  type OrderItem,
  type OrderStatusLog,
  type Order,
  type Review,
  type RatingSummary,
  type MerchantRecord,
  type MerchantOnboardRequest,
  type MerchantUpdateRequest,
  type BrandCreateRequest,
  type BrandUpdateRequest,
  type BranchCreateRequest,
  type KitchenUnit,
  type KitchenCreateRequest,
  type KitchenUpdateRequest,
  type InventoryItem,
  type MerchantSubscription,
  type SubscriptionInvoice,
  type PlatformCommission,
  type NotificationLog,
  loginApi as sharedLogin,
  getMeApi as sharedGetMe,
  getBranchByIdApi as sharedGetBranch,
  listBranchesApi as sharedListBranches,
  getBrandByIdApi as sharedGetBrand,
  getMerchantApi as sharedGetMerchant,
  getMerchantProfileApi as sharedGetMerchantProfile,
  onboardMerchantApi as sharedOnboardMerchant,
  updateMerchantProfileApi as sharedUpdateMerchantProfile,
  listBrandsApi as sharedListBrands,
  createBrandApi as sharedCreateBrand,
  updateBrandApi as sharedUpdateBrand,
  deleteBrandApi as sharedDeleteBrand,
  createBranchApi as sharedCreateBranch,
  updateBranchApi as sharedUpdateBranch,
  setBranchOpenApi as sharedSetBranchOpen,
  deleteBranchApi as sharedDeleteBranch,
  getBranchMenuApi as sharedGetBranchMenu,
  createBranchMenuApi as sharedCreateBranchMenu,
  createCategoryApi as sharedCreateCategory,
  updateCategoryApi as sharedUpdateCategory,
  deleteCategoryApi as sharedDeleteCategory,
  createMenuItemApi as sharedCreateMenuItem,
  getMenuItemApi as sharedGetMenuItem,
  updateMenuItemApi as sharedUpdateMenuItem,
  getOrdersApi as sharedGetOrders,
  updateOrderStatusApi as sharedUpdateOrderStatus,
  cancelOrderApi as sharedCancelOrder,
  getBranchReviewsApi as sharedGetBranchReviews,
  getBranchRatingSummaryApi as sharedGetBranchRatingSummary,
  listBranchKitchensApi as sharedListBranchKitchens,
  createKitchenApi as sharedCreateKitchen,
  updateKitchenApi as sharedUpdateKitchen,
  deleteKitchenApi as sharedDeleteKitchen,
  getBranchInventoryApi as sharedGetBranchInventory,
  initItemInventoryApi as sharedInitItemInventory,
  updateStockApi as sharedUpdateStock,
  getMerchantSubscriptionApi as sharedGetMerchantSubscription,
  createOrUpdateSubscriptionApi as sharedCreateOrUpdateSubscription,
  renewSubscriptionApi as sharedRenewSubscription,
  getMerchantCommissionsApi as sharedGetMerchantCommissions,
  getMerchantInvoicesApi as sharedGetMerchantInvoices,
  getMyNotificationsApi as sharedGetMyNotifications,
} from "@syncbite/shared";

export type {
  BackendUser,
  TokenResponse,
  Branch,
  Brand,
  Merchant,
  MenuModifier,
  MenuItem,
  MenuCategory,
  Menu,
  OrderItem,
  OrderStatusLog,
  Order,
  Review,
  RatingSummary,
  MerchantRecord,
  MerchantOnboardRequest,
  MerchantUpdateRequest,
  BrandCreateRequest,
  BrandUpdateRequest,
  BranchCreateRequest,
  KitchenUnit,
  KitchenCreateRequest,
  KitchenUpdateRequest,
  InventoryItem,
  MerchantSubscription,
  SubscriptionInvoice,
  PlatformCommission,
  NotificationLog,
};

// ─── Branch context ───────────────────────────────────────────────────────────

export function getBranchId(userId?: string | null): string | null {
  const configured = import.meta.env.VITE_BRANCH_ID;
  const configValue = configured ? configured.trim() : "";
  if (!userId) return configValue || null;

  const cached = localStorage.getItem(BRANCH_ID_KEY);
  if (cached) {
    const sep = cached.indexOf(":");
    if (sep > 0) {
      const owner = cached.slice(0, sep);
      const branchId = cached.slice(sep + 1);
      if (owner === userId && branchId) return branchId;
      localStorage.removeItem(BRANCH_ID_KEY);
    } else {
      localStorage.removeItem(BRANCH_ID_KEY);
    }
  }
  return configValue || null;
}

export function rememberBranchId(branchId: string, userId?: string | null) {
  localStorage.setItem(BRANCH_ID_KEY, userId ? `${userId}:${branchId}` : branchId);
}

export function clearBranchId() {
  localStorage.removeItem(BRANCH_ID_KEY);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginApi(email: string, password: string): Promise<TokenResponse> {
  const data = await sharedLogin(apiClient, email, password);
  setTokens(data.access_token, data.refresh_token);
  localStorage.setItem("sat_rest_user", JSON.stringify(data.user));
  return data;
}

export async function getMeApi(): Promise<BackendUser> {
  return sharedGetMe(apiClient);
}

export function logoutApi() {
  clearTokens();
}

// ─── Branch ───────────────────────────────────────────────────────────────────

export async function getBranchApi(branchId: string): Promise<Branch> {
  return sharedGetBranch(apiClient, branchId);
}

export async function listBranchesApi(brandId?: string | null): Promise<Branch[]> {
  return sharedListBranches(apiClient, brandId);
}

export async function getBrandApi(brandId: string): Promise<Brand> {
  return sharedGetBrand(apiClient, brandId);
}

export async function getMerchantApi(merchantId: string): Promise<Merchant> {
  return sharedGetMerchant(apiClient, merchantId);
}

export async function getMerchantOwnerBrandsAndBranchesApi(_userId?: string): Promise<{
  merchant: MerchantRecord | null;
  brands: Brand[];
  branches: Branch[];
}> {
  const merchant = await getMerchantProfileApi();
  const brands = await listBrandsApi(merchant.id);
  const brandIds = new Set(brands.map((b) => b.id));
  let branches: Branch[] = [];
  if (brandIds.size > 0) {
    const allBranches = await listBranchesApi();
    branches = allBranches.filter((br) => brandIds.has(br.brand_id));
  }

  return { merchant, brands, branches };
}

export async function resolveMyBranchIdsApi(userId?: string): Promise<Branch[]> {
  const { branches } = await getMerchantOwnerBrandsAndBranchesApi(userId);
  return branches;
}

export async function updateBranchApi(
  branchId: string,
  payload: {
    name?: string;
    address_text?: string;
    opening_time?: string;
    closing_time?: string;
    is_active?: boolean;
  },
): Promise<Branch> {
  return sharedUpdateBranch(apiClient, branchId, payload);
}

export async function setBranchOpenApi(branchId: string, isActive: boolean): Promise<Branch> {
  return sharedSetBranchOpen(apiClient, branchId, isActive);
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export async function getBranchMenuApi(branchId: string): Promise<Menu> {
  return sharedGetBranchMenu(apiClient, branchId);
}

export async function createBranchMenuApi(branchId: string, name = "Main Menu"): Promise<Menu> {
  return sharedCreateBranchMenu(apiClient, branchId, name);
}

export async function createCategoryApi(
  branchId: string,
  name: string,
  displayOrder = 0,
): Promise<MenuCategory> {
  return sharedCreateCategory(apiClient, branchId, name, displayOrder);
}

export async function updateCategoryApi(
  categoryId: string,
  payload: {
    name?: string | null;
    display_order?: number | null;
  },
): Promise<MenuCategory> {
  return sharedUpdateCategory(apiClient, categoryId, payload);
}

export async function deleteCategoryApi(
  categoryId: string,
  fallbackCategoryId?: string | null,
): Promise<void> {
  return sharedDeleteCategory(apiClient, categoryId, fallbackCategoryId);
}

export async function createMenuItemApi(
  branchId: string,
  payload: {
    category_id: string;
    name: string;
    description?: string | null;
    base_price: number;
    image_url?: string | null;
    is_available?: boolean;
    is_veg?: boolean;
  },
): Promise<MenuItem> {
  return sharedCreateMenuItem(apiClient, branchId, payload);
}

export async function getMenuItemApi(itemId: string): Promise<MenuItem> {
  return sharedGetMenuItem(apiClient, itemId);
}

export async function updateMenuItemApi(
  itemId: string,
  payload: {
    name?: string;
    description?: string | null;
    base_price?: number;
    image_url?: string | null;
    is_available?: boolean;
    is_veg?: boolean;
    category_id?: string;
  },
): Promise<MenuItem> {
  return sharedUpdateMenuItem(apiClient, itemId, payload);
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getBranchOrdersApi(branchId: string, status?: string): Promise<Order[]> {
  return sharedGetOrders(apiClient, { branch_id: branchId, status });
}

export async function updateOrderStatusApi(orderId: string, status: string): Promise<Order> {
  return sharedUpdateOrderStatus(apiClient, orderId, status);
}

export async function cancelOrderApi(orderId: string): Promise<Order> {
  return sharedCancelOrder(apiClient, orderId);
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function getBranchReviewsApi(branchId: string): Promise<Review[]> {
  return sharedGetBranchReviews(apiClient, branchId);
}

export async function getBranchRatingSummaryApi(branchId: string): Promise<RatingSummary> {
  return sharedGetBranchRatingSummary(apiClient, branchId);
}

// ─── Merchant Management & Onboarding ─────────────────────────────────────────

export async function getMerchantProfileApi(): Promise<MerchantRecord> {
  return sharedGetMerchantProfile(apiClient);
}

export async function onboardMerchantApi(payload: MerchantOnboardRequest): Promise<MerchantRecord> {
  return sharedOnboardMerchant(apiClient, payload);
}

export async function updateMerchantProfileApi(
  merchantId: string,
  payload: MerchantUpdateRequest,
): Promise<MerchantRecord> {
  return sharedUpdateMerchantProfile(apiClient, merchantId, payload);
}

// ─── Brand Management ────────────────────────────────────────────────────────

export async function listBrandsApi(merchantId?: string | null): Promise<Brand[]> {
  return sharedListBrands(apiClient, merchantId);
}

export async function createBrandApi(payload: BrandCreateRequest): Promise<Brand> {
  return sharedCreateBrand(apiClient, payload);
}

export async function updateBrandApi(brandId: string, payload: BrandUpdateRequest): Promise<Brand> {
  return sharedUpdateBrand(apiClient, brandId, payload);
}

export async function deleteBrandApi(brandId: string): Promise<void> {
  return sharedDeleteBrand(apiClient, brandId);
}

// ─── Branch Management Operations ────────────────────────────────────────────

export async function createBranchApi(payload: BranchCreateRequest): Promise<Branch> {
  return sharedCreateBranch(apiClient, payload);
}

export async function deleteBranchApi(branchId: string): Promise<void> {
  return sharedDeleteBranch(apiClient, branchId);
}

// ─── Kitchen Management ──────────────────────────────────────────────────────

export async function listBranchKitchensApi(branchId: string): Promise<KitchenUnit[]> {
  return sharedListBranchKitchens(apiClient, branchId);
}

export async function createKitchenApi(payload: KitchenCreateRequest): Promise<KitchenUnit> {
  return sharedCreateKitchen(apiClient, payload);
}

export async function updateKitchenApi(
  kitchenId: string,
  payload: KitchenUpdateRequest,
): Promise<KitchenUnit> {
  return sharedUpdateKitchen(apiClient, kitchenId, payload);
}

export async function deleteKitchenApi(kitchenId: string): Promise<void> {
  return sharedDeleteKitchen(apiClient, kitchenId);
}

// ─── Inventory Management ────────────────────────────────────────────────────

export async function getBranchInventoryApi(branchId: string): Promise<InventoryItem[]> {
  return sharedGetBranchInventory(apiClient, branchId);
}

export async function initItemInventoryApi(
  branchId: string,
  menuItemId: string,
  initialQuantity = 0,
): Promise<InventoryItem> {
  return sharedInitItemInventory(apiClient, branchId, menuItemId, initialQuantity);
}

export async function updateStockApi(
  inventoryId: string,
  payload: {
    quantity: number;
    is_in_stock?: boolean | null;
    reason?: string;
  },
): Promise<InventoryItem> {
  return sharedUpdateStock(apiClient, inventoryId, payload);
}

// ─── Subscription & Financials ───────────────────────────────────────────────

export async function getMerchantSubscriptionApi(): Promise<MerchantSubscription> {
  return sharedGetMerchantSubscription(apiClient);
}

export async function createOrUpdateSubscriptionApi(payload: {
  plan_tier: string;
  billing_cycle?: string;
}): Promise<MerchantSubscription> {
  return sharedCreateOrUpdateSubscription(apiClient, payload);
}

export async function renewSubscriptionApi(payload: {
  plan_tier?: string | null;
  duration_months?: number;
}): Promise<MerchantSubscription> {
  return sharedRenewSubscription(apiClient, payload);
}

export async function getMerchantCommissionsApi(): Promise<PlatformCommission[]> {
  return sharedGetMerchantCommissions(apiClient);
}

export async function getMerchantInvoicesApi(): Promise<SubscriptionInvoice[]> {
  return sharedGetMerchantInvoices(apiClient);
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function getMyNotificationsApi(): Promise<NotificationLog[]> {
  return sharedGetMyNotifications(apiClient);
}
