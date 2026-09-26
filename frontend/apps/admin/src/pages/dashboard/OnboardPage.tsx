import { useState, type FormEvent } from "react";
import { onboardRestaurantWorkflowApi } from "../../api/admin";
import type { OnboardFormData, OnboardSuccessState } from "../../types/dashboard";
import { generateSecurePassword } from "../../utils/formatters";
import { useDashboard } from "../../context/DashboardContext";
import OnboardTab from "../../features/OnboardTab";

function createInitialOnboardForm(): OnboardFormData {
  return {
    name: "",
    email: "",
    password: generateSecurePassword("Owner"),
    address: "VIT Vellore Campus",
    legal_entity_name: "",
    fssai_license_number: "",
    gstin: "",
    opening_time: "08:00",
    closing_time: "23:00",
    cuisine_types: "Beverages, Quick Bites",
    description: "",
    bank_account_number: "",
    bank_ifsc_code: "",
    status: "PENDING_VERIFICATION",
    has_separate_branch_manager: true,
    branch_manager_name: "",
    branch_manager_email: "",
    branch_manager_password: generateSecurePassword("Manager"),
    branch_manager_phone: "",
    subscription_plan: "BASIC",
    subscription_cycle: "MONTHLY",
  };
}

function createOnboardEmail(name: string, role: "owner" | "manager") {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .replace(/\.{2,}/g, ".");

  return slug ? `${slug}.${role}@syncbite.com` : "";
}

export default function OnboardPage() {
  const {
    copiedField,
    handleOpenMenuForBranch,
    copyToClipboard,
    downloadCredentialsTxt,
    showToast,
    loadBranches,
    loadHierarchy,
  } = useDashboard();
  const [onboardForm, setOnboardForm] = useState<OnboardFormData>(createInitialOnboardForm);
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [onboardSuccess, setOnboardSuccess] = useState<OnboardSuccessState | null>(null);

  async function handleOnboardSubmit(event: FormEvent) {
    event.preventDefault();
    if (!onboardForm.name.trim())
      return showToast("Restaurant / Outlet name is required.", "error");
    if (!onboardForm.legal_entity_name.trim())
      return showToast("Registered Legal Entity Name is required.", "error");
    const cleanFssai = onboardForm.fssai_license_number.trim();
    if (!/^\d{14}$/.test(cleanFssai))
      return showToast(
        "14-digit FSSAI license number is required (must be exactly 14 digits).",
        "error",
      );
    const cleanGstin = onboardForm.gstin.trim().toUpperCase();
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleanGstin))
      return showToast("Valid 15-character GSTIN is required (e.g. 33AAAAA0000A1Z5).", "error");
    if (!onboardForm.address.trim())
      return showToast("Campus location / address is required.", "error");
    if (!onboardForm.email.trim()) return showToast("Owner login email is required.", "error");
    if (onboardForm.password.trim().length < 8)
      return showToast("Owner password must be at least 8 characters.", "error");
    if (onboardForm.has_separate_branch_manager && !onboardForm.branch_manager_email?.trim())
      return showToast("Branch manager login email is required.", "error");
    if (
      onboardForm.has_separate_branch_manager &&
      (onboardForm.branch_manager_password?.trim().length ?? 0) < 8
    )
      return showToast("Branch manager password must be at least 8 characters.", "error");

    setOnboardLoading(true);
    try {
      const cuisineList = onboardForm.cuisine_types
        ? onboardForm.cuisine_types
            .split(",")
            .map((cuisine) => cuisine.trim())
            .filter(Boolean)
        : ["Campus Dining"];
      const result = await onboardRestaurantWorkflowApi({
        name: onboardForm.name.trim(),
        email: onboardForm.email.trim(),
        password: onboardForm.password.trim(),
        address: onboardForm.address.trim(),
        legal_entity_name: onboardForm.legal_entity_name.trim(),
        fssai_license_number: cleanFssai,
        gstin: cleanGstin,
        opening_time: onboardForm.opening_time?.trim() || "08:00:00",
        closing_time: onboardForm.closing_time?.trim() || "23:00:00",
        cuisine_types: cuisineList,
        description:
          onboardForm.description?.trim() || `${onboardForm.name.trim()} outlet at VIT Campus`,
        bank_account_number: onboardForm.bank_account_number?.trim() || undefined,
        bank_ifsc_code: onboardForm.bank_ifsc_code?.trim() || undefined,
        status: onboardForm.status || "PENDING_VERIFICATION",
        has_separate_branch_manager: onboardForm.has_separate_branch_manager,
        branch_manager_name: onboardForm.branch_manager_name?.trim() || undefined,
        branch_manager_email: onboardForm.branch_manager_email?.trim() || undefined,
        branch_manager_password: onboardForm.branch_manager_password?.trim() || undefined,
        branch_manager_phone: onboardForm.branch_manager_phone?.trim() || undefined,
        subscription_plan: onboardForm.subscription_plan || "BASIC",
        subscription_cycle: onboardForm.subscription_cycle || "MONTHLY",
      });

      setOnboardSuccess({
        branch_name: result.branch_name,
        email: result.email,
        password: result.password,
        branch_id: result.branch_id,
        brand_id: result.brand_id,
        merchant_id: result.merchant_id,
        role: result.role,
        status: onboardForm.status || "PENDING_VERIFICATION",
        has_branch_manager: result.has_branch_manager,
        branch_manager_email: result.branch_manager_email,
        branch_manager_password: result.branch_manager_password,
        branch_manager_role: result.branch_manager_role,
        subscription_plan: result.subscription_plan,
        subscription_cycle: result.subscription_cycle,
        subscription_id: result.subscription_id,
      });
      setOnboardForm(createInitialOnboardForm());
      loadBranches();
      loadHierarchy();
      showToast(
        `🎉 "${result.branch_name}" onboarded & assigned ${result.subscription_plan || "BASIC"} plan!`,
        "success",
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Onboarding failed.", "error");
    } finally {
      setOnboardLoading(false);
    }
  }

  function handleOnboardFormChange(nextForm: OnboardFormData) {
    setOnboardForm((currentForm) => {
      if (nextForm.name === currentForm.name) return nextForm;

      const previousOwnerEmail = createOnboardEmail(currentForm.name, "owner");
      const previousManagerEmail = createOnboardEmail(currentForm.name, "manager");
      const nextOwnerEmail = createOnboardEmail(nextForm.name, "owner");
      const nextManagerEmail = createOnboardEmail(nextForm.name, "manager");

      return {
        ...nextForm,
        email:
          !currentForm.email || currentForm.email === previousOwnerEmail
            ? nextOwnerEmail
            : nextForm.email,
        branch_manager_email:
          !currentForm.branch_manager_email ||
          currentForm.branch_manager_email === previousManagerEmail
            ? nextManagerEmail
            : nextForm.branch_manager_email,
      };
    });
  }

  return (
    <OnboardTab
      onboardForm={onboardForm}
      onboardLoading={onboardLoading}
      onboardSuccess={onboardSuccess}
      copiedField={copiedField}
      onChangeForm={handleOnboardFormChange}
      onSubmit={handleOnboardSubmit}
      onOpenMenuForBranch={handleOpenMenuForBranch}
      onDismissSuccess={() => setOnboardSuccess(null)}
      onCopy={copyToClipboard}
      onDownloadTxt={downloadCredentialsTxt}
    />
  );
}
