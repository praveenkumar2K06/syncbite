import React from "react";
import type { OnboardFormData, OnboardSuccessState } from "../types/dashboard";
import OnboardSuccessCard from "./OnboardSuccessCard";
import OutletLegalSection from "./onboard/OutletLegalSection";
import ComplianceSection from "./onboard/ComplianceSection";
import HoursCuisineSection from "./onboard/HoursCuisineSection";
import OwnerAccountSection from "./onboard/OwnerAccountSection";
import BranchManagerSection from "./onboard/BranchManagerSection";
import SubscriptionPlanSection from "./onboard/SubscriptionPlanSection";
import { Form, FieldGroup } from "../components/ui/form";

interface OnboardTabProps {
  onboardForm: OnboardFormData;
  onboardLoading: boolean;
  onboardSuccess: OnboardSuccessState | null;
  copiedField: string | null;
  onChangeForm: (updated: OnboardFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenMenuForBranch: (branchId: string) => void;
  onDismissSuccess: () => void;
  onCopy: (text: string, successMsg?: string, fieldId?: string) => void;
  onDownloadTxt: (
    name: string,
    email: string,
    pass: string,
    branchId?: string,
    role?: string,
    branchManagerEmail?: string,
    branchManagerPass?: string,
  ) => void;
}

export default function OnboardTab({
  onboardForm,
  onboardLoading,
  onboardSuccess,
  copiedField,
  onChangeForm,
  onSubmit,
  onOpenMenuForBranch,
  onDismissSuccess,
  onCopy,
  onDownloadTxt,
}: OnboardTabProps) {
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      <OnboardSuccessCard
        onboardSuccess={onboardSuccess}
        copiedField={copiedField}
        onOpenMenuForBranch={onOpenMenuForBranch}
        onDismissSuccess={onDismissSuccess}
        onCopy={onCopy}
        onDownloadTxt={onDownloadTxt}
      />

      {/* Onboard Form */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-5 border border-slate-800"
        style={{ background: "#111827" }}
      >
        <div>
          <h2 className="text-base font-semibold text-white">
            Onboard New Campus Restaurant Outlet
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Provisions a legal Merchant entity, brand profile, physical branch outlet, and issues
            distinct credentials for Merchant Owner and Branch Manager.
          </p>
        </div>

        <Form onSubmit={onSubmit}>
          <FieldGroup className="gap-6">
            <OutletLegalSection
              onboardForm={onboardForm}
              onChangeForm={onChangeForm}
              copiedField={copiedField}
              onCopy={onCopy}
            />

            <ComplianceSection
              onboardForm={onboardForm}
              onChangeForm={onChangeForm}
              copiedField={copiedField}
              onCopy={onCopy}
            />

            <HoursCuisineSection
              onboardForm={onboardForm}
              onChangeForm={onChangeForm}
              copiedField={copiedField}
              onCopy={onCopy}
            />

            <OwnerAccountSection
              onboardForm={onboardForm}
              onChangeForm={onChangeForm}
              copiedField={copiedField}
              onCopy={onCopy}
            />

            <BranchManagerSection
              onboardForm={onboardForm}
              onChangeForm={onChangeForm}
              copiedField={copiedField}
              onCopy={onCopy}
            />

            <SubscriptionPlanSection onboardForm={onboardForm} onChangeForm={onChangeForm} />
          </FieldGroup>

          <button
            type="submit"
            disabled={onboardLoading}
            className="mt-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow: "0 0 20px rgba(249,115,22,0.3)",
            }}
          >
            {onboardLoading ? (
              <span>⏳ Provisioning Merchant, Branch & Manager via Backend…</span>
            ) : (
              <span>🚀 Onboard Restaurant & Issue Credentials Packet</span>
            )}
          </button>
        </Form>
      </div>
    </div>
  );
}
