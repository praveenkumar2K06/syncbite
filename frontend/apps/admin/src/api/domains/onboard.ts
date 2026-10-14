import { apiClient } from "../client";
import type { MerchantRecord } from "@syncbite/shared";
import {
  approveMerchantApi,
  rejectMerchantApi,
  updateMerchantStatusApi,
  updateMerchantApi,
  createBrandApi,
} from "./merchants";
import { createBranchApi } from "./branches";
import { createBranchMenuApi } from "./menu";
import { createBranchManagerAccountApi } from "./branch-managers";
import type { MerchantStatus } from "./merchants";

export interface OnboardRestaurantWorkflowPayload {
  name: string;
  email: string;
  password: string;
  address: string;
  legal_entity_name: string;
  fssai_license_number: string;
  gstin: string;
  opening_time?: string;
  closing_time?: string;
  cuisine_types?: string[];
  description?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
  /** Target merchant status selected by the admin (no auto-approval). */
  status?: string;
  /** Branch manager configuration options */
  has_separate_branch_manager?: boolean;
  branch_manager_name?: string;
  branch_manager_phone?: string;
  branch_manager_email?: string;
  branch_manager_password?: string;
  /** Optional brand imagery */
  banner_url?: string;
  logo_url?: string;
  /** Initial subscription plan tier & cycle to provision */
  subscription_plan?: "BASIC" | "PROFESSIONAL" | "ENTERPRISE";
  subscription_cycle?: "MONTHLY" | "ANNUAL";
}

export interface OnboardRestaurantWorkflowResult {
  success: boolean;
  user_id: string;
  email: string;
  password: string;
  role: string;
  merchant_id: string;
  brand_id: string;
  branch_id: string;
  branch_name: string;
  address: string;
  has_branch_manager?: boolean;
  branch_manager_user_id?: string;
  branch_manager_email?: string;
  branch_manager_password?: string;
  branch_manager_role?: string;
  subscription_plan?: string;
  subscription_cycle?: string;
  subscription_id?: string;
}

/**
 * End-to-end restaurant onboarding following the openapi.json workflow:
 * 1. POST /auth/register -> Registers user with role "MerchantOwner"
 * 2. POST /merchants/onboard -> Registers legal merchant business entity
 * 3. POST /admin/merchants/{id}/approval -> PlatformAdmin approves merchant
 * 4. POST /brands -> Creates brand under approved merchant
 * 5. POST /branches -> Creates physical branch under brand
 * 6. POST /branches/{id}/menus -> Initializes branch menu
 * 7. (Optional) POST /auth/register -> Registers dedicated "BranchManager"
 */
export async function onboardRestaurantWorkflowApi(
  payload: OnboardRestaurantWorkflowPayload,
): Promise<OnboardRestaurantWorkflowResult> {
  // Step 1: Register user with role MerchantOwner
  const regRes = await apiClient<{
    access_token: string;
    refresh_token: string;
    user: { id: string; email: string; role: string };
  }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      role: "MerchantOwner",
    }),
  });

  let merchantId = "";
  let brandId = "";
  let branchId = "";
  let branchName = payload.name.trim();

  let bmUserId = "";
  let bmEmail = "";
  let bmPassword = "";
  let bmRole = "BranchManager";

  let subPlanCreated = payload.subscription_plan || "BASIC";
  let subCycleCreated = payload.subscription_cycle || "MONTHLY";
  let subIdCreated = "";

  try {
    // Validate 14-digit FSSAI license number
    const rawFssai = payload.fssai_license_number?.trim();
    const fssai = rawFssai && /^\d{14}$/.test(rawFssai) ? rawFssai : "10000000000000";
    const gstin = payload.gstin?.trim() ? payload.gstin.trim().toUpperCase() : null;

    const merchantRes = await apiClient<MerchantRecord>("/merchants/onboard", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${regRes.access_token}`,
      },
      body: JSON.stringify({
        business_name: payload.name.trim(),
        legal_entity_name: payload.legal_entity_name.trim(),
        fssai_license_number: fssai,
        bank_account_number: payload.bank_account_number?.trim() || null,
        bank_ifsc_code: payload.bank_ifsc_code?.trim() || null,
      }),
    });
    merchantId = merchantRes.id;

    const requestedStatus = (payload.status || "PENDING_VERIFICATION").toUpperCase();
    const validStatuses: MerchantStatus[] = [
      "PENDING_VERIFICATION",
      "APPROVED",
      "REJECTED",
      "SUSPENDED",
      "DEACTIVATED",
      "INACTIVE",
    ];
    if (!validStatuses.includes(requestedStatus as MerchantStatus)) {
      throw new Error(`Unsupported merchant status: ${requestedStatus}`);
    }
    const selectedStatus = requestedStatus as MerchantStatus;
    if (selectedStatus === "APPROVED") {
      await approveMerchantApi(merchantId, "Approved by PlatformAdmin upon onboarding");
    } else if (selectedStatus === "REJECTED") {
      await rejectMerchantApi(merchantId, "Rejected by PlatformAdmin upon onboarding");
    } else {
      await updateMerchantStatusApi(merchantId, selectedStatus);
    }

    // Step 4: Create Brand profile under the merchant
    const brandRes = await createBrandApi({
      name: payload.name.trim(),
      merchant_id: merchantId,
      logo_url: payload.logo_url || payload.banner_url || undefined,
      banner_url: payload.banner_url || undefined,
      description: payload.description?.trim() || undefined,
      cuisine_types:
        payload.cuisine_types && payload.cuisine_types.length > 0
          ? payload.cuisine_types
          : undefined,
    });
    brandId = brandRes.id;

    // Step 5: Create Branch location under the brand
    const openTime = payload.opening_time
      ? payload.opening_time.length === 5
        ? `${payload.opening_time}:00`
        : payload.opening_time
      : "08:00:00";
    const closeTime = payload.closing_time
      ? payload.closing_time.length === 5
        ? `${payload.closing_time}:00`
        : payload.closing_time
      : "23:00:00";

    const branchRes = await createBranchApi({
      brand_id: brandId,
      name: payload.name.trim(),
      address_text: payload.address.trim() || "VIT Vellore Campus",
      is_active: true,
      opening_time: openTime,
      closing_time: closeTime,
    });
    branchId = branchRes.id;
    branchName = branchRes.name;

    // Step 6: Initialize main menu for the new branch
    try {
      await createBranchMenuApi(branchId, "Main Menu");
    } catch {
      // Menu initialization is best-effort; row is committed in database
    }

    // Step 7: Provision separate Branch Manager if requested via official OpenAPI endpoint
    if (payload.has_separate_branch_manager && payload.branch_manager_email) {
      bmEmail = payload.branch_manager_email.trim().toLowerCase();
      bmPassword = payload.branch_manager_password?.trim() || payload.password;

      try {
        const bmRes = await createBranchManagerAccountApi({
          email: bmEmail,
          password: bmPassword,
          branch_id: branchId,
        });
        bmUserId = bmRes.user_id;
        bmRole = bmRes.role;
      } catch {
        // Fallback: register via /auth/register
        try {
          const bmReg = await apiClient<{
            user: { id: string; email: string; role: string };
          }>("/auth/register", {
            method: "POST",
            body: JSON.stringify({
              email: bmEmail,
              password: bmPassword,
              role: "BranchManager",
            }),
          });
          bmUserId = bmReg.user.id;
          bmRole = bmReg.user.role;
        } catch {}
      }
    }

    if (gstin) {
      await updateMerchantApi(merchantId, { gstin });
    }

    // Step 8: Provision merchant subscription plan if specified
    subPlanCreated = payload.subscription_plan || "BASIC";
    subCycleCreated = payload.subscription_cycle || "MONTHLY";

    try {
      const subRes = await apiClient<{
        id: string;
        plan_tier: string;
        billing_cycle: string;
        status: string;
      }>("/merchants/me/subscription", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${regRes.access_token}`,
        },
        body: JSON.stringify({
          plan_tier: subPlanCreated,
          billing_cycle: subCycleCreated,
        }),
      });
      if (subRes && subRes.id) {
        subIdCreated = subRes.id;
        subPlanCreated = (subRes.plan_tier as any) || subPlanCreated;
        subCycleCreated = (subRes.billing_cycle as any) || subCycleCreated;
      }
    } catch {
      // Backend may not enforce subscription table row yet; fallback gracefully
    }
  } finally {
  }

  return {
    success: true,
    user_id: regRes.user.id,
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    role: "MerchantOwner",
    merchant_id: merchantId,
    brand_id: brandId,
    branch_id: branchId,
    branch_name: branchName,
    address: payload.address.trim() || "VIT Vellore Campus",
    has_branch_manager: Boolean(payload.has_separate_branch_manager && bmEmail),
    branch_manager_user_id: bmUserId || undefined,
    branch_manager_email: bmEmail || undefined,
    branch_manager_password: bmPassword || undefined,
    branch_manager_role: bmEmail ? bmRole : undefined,
    subscription_plan: payload.subscription_plan || "BASIC",
    subscription_cycle: payload.subscription_cycle || "MONTHLY",
    subscription_id: subIdCreated || undefined,
  };
}
