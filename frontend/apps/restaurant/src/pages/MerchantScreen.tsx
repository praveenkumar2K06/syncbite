import { useState, useEffect, useCallback } from "react";
import {
  getMerchantProfileApi,
  onboardMerchantApi,
  updateMerchantProfileApi,
  toUserMessage,
  type MerchantRecord,
} from "@/api";
import { usePortal } from "@/context/PortalContext";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LegalDocument01Icon,
  AlertCircleIcon,
  PencilEdit02Icon,
  RefreshCwIcon,
} from "@hugeicons/core-free-icons";
import { EditMerchantDialog } from "@/components/merchant/EditMerchantDialog";
import { MerchantOnboardingForm } from "@/components/merchant/MerchantOnboardingForm";
import { MerchantProfileView, getStatusBadge } from "@/components/merchant/MerchantProfileView";
import type { MerchantFormData } from "@/components/merchant/MerchantFormFields";

export { getStatusBadge };

const INITIAL_FORM: MerchantFormData = {
  business_name: "",
  legal_entity_name: "",
  fssai_license_number: "",
  gstin: "",
  bank_account_number: "",
  bank_ifsc_code: "",
};

export default function MerchantScreen() {
  const { showToast, user } = usePortal();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [merchant, setMerchant] = useState<MerchantRecord | null>(null);
  const [loadError, setLoadError] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  // Onboard form state
  const [form, setForm] = useState<MerchantFormData>({ ...INITIAL_FORM });

  // Edit form state
  const [editForm, setEditForm] = useState<MerchantFormData>({ ...INITIAL_FORM });

  const loadMerchant = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getMerchantProfileApi();
      setMerchant(data);
      setEditForm({
        business_name: data.business_name || "",
        legal_entity_name: data.legal_entity_name || "",
        fssai_license_number: data.fssai_license_number || "",
        gstin: data.gstin || "",
        bank_account_number: data.bank_account_number || "",
        bank_ifsc_code: data.bank_ifsc_code || "",
      });
    } catch (err) {
      const msg = toUserMessage(err);
      if (msg.toLowerCase().includes("not found") || msg.includes("404")) {
        setMerchant(null);
      } else {
        setLoadError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMerchant();
  }, [loadMerchant]);

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name.trim() || !form.legal_entity_name.trim()) {
      showToast("Business name and legal entity name are required.", "error");
      return;
    }
    if (!form.fssai_license_number.trim()) {
      showToast("14-digit FSSAI license number is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await onboardMerchantApi({
        business_name: form.business_name.trim(),
        legal_entity_name: form.legal_entity_name.trim(),
        fssai_license_number: form.fssai_license_number.trim(),
        gstin: form.gstin.trim() || null,
        bank_account_number: form.bank_account_number.trim() || null,
        bank_ifsc_code: form.bank_ifsc_code.trim().toUpperCase() || null,
      });
      setMerchant(res);
      showToast("Merchant application submitted successfully!");
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant) return;

    setSubmitting(true);
    try {
      const res = await updateMerchantProfileApi(merchant.id, {
        business_name: editForm.business_name.trim(),
        legal_entity_name: editForm.legal_entity_name.trim(),
        fssai_license_number: editForm.fssai_license_number.trim(),
        gstin: editForm.gstin.trim() || null,
        bank_account_number: editForm.bank_account_number.trim() || null,
        bank_ifsc_code: editForm.bank_ifsc_code.trim().toUpperCase() || null,
      });
      setMerchant(res);
      setEditOpen(false);
      showToast("Merchant profile updated successfully.");
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
          Loading merchant profile…
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={LegalDocument01Icon} className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Merchant Management
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Business registration, legal identity, FSSAI compliance and bank settlement
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadMerchant} className="gap-1.5 text-xs">
              <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5" />
              Refresh
            </Button>
            {merchant && (
              <Button
                size="sm"
                onClick={() => setEditOpen(true)}
                className="gap-1.5 text-xs font-semibold"
              >
                <HugeiconsIcon icon={PencilEdit02Icon} className="w-3.5 h-3.5" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {loadError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-start gap-2.5">
            <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to load merchant information</p>
              <p className="mt-0.5 text-destructive/90">{loadError}</p>
            </div>
          </div>
        )}

        {/* Existing Merchant View or Onboarding Wizard */}
        {merchant ? (
          <MerchantProfileView
            merchant={merchant}
            userEmail={user?.email}
            onEdit={() => setEditOpen(true)}
            onCopy={copyToClipboard}
          />
        ) : (
          <MerchantOnboardingForm
            form={form}
            onChange={(fields) => setForm((prev) => ({ ...prev, ...fields }))}
            onSubmit={handleOnboardSubmit}
            submitting={submitting}
          />
        )}

        {/* Edit Merchant Dialog Modal */}
        <EditMerchantDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          form={editForm}
          onChange={(fields) => setEditForm((prev) => ({ ...prev, ...fields }))}
          onSubmit={handleEditSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
