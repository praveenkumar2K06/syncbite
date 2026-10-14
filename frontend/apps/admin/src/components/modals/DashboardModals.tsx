import React from "react";
import CredentialsModal from "./CredentialsModal";
import CreateBrandModal from "./CreateBrandModal";
import CreateBranchModal from "./CreateBranchModal";
import EditMerchantModal from "./EditMerchantModal";
import EditBrandModal from "./EditBrandModal";
import EditBranchModal from "./EditBranchModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import MerchantCredentialsModal from "./MerchantCredentialsModal";
import type {
  CreateBrandModalState,
  CreateBranchModalState,
  CredentialModalState,
} from "../../types/dashboard";
import type {
  Brand,
  Branch,
  MerchantRecord,
  updateMerchantApi,
  updateBrandApi,
  updateBranchApi,
  MerchantStatus,
} from "../../api/admin";

export interface DashboardModalsProps {
  credentials: {
    credModal: CredentialModalState | null;
    credSaving: boolean;
    copiedField: string | null;
    onCloseCredModal: () => void;
    onChangeCredModal: (modal: CredentialModalState) => void;
    onSaveCredentials: (e: React.FormEvent) => Promise<void>;
    onCopy: (text: string, successMsg?: string, fieldId?: string) => Promise<void>;
    onDownloadTxt: (
      name: string,
      email: string,
      pass: string,
      branchId?: string,
      role?: string,
      branchManagerEmail?: string,
      branchManagerPass?: string,
    ) => void;
    onShowToast: (msg: string, type: "success" | "error") => void;
  };
  createBrand: {
    brandModal: CreateBrandModalState;
    brandSaving: boolean;
    merchants: MerchantRecord[];
    onCloseBrandModal: () => void;
    onCreateBrand: (payload: {
      merchant_id: string;
      name: string;
      description?: string;
      cuisine_types?: string[];
    }) => Promise<void>;
  };
  createBranch: {
    branchModal: CreateBranchModalState;
    branchSaving: boolean;
    brands: Brand[];
    onCloseBranchModal: () => void;
    onCreateBranch: (payload: {
      brand_id: string;
      name: string;
      address_text: string;
      opening_time?: string;
      closing_time?: string;
      is_active?: boolean;
    }) => Promise<void>;
  };
  editEntities: {
    editMerchant: MerchantRecord | null;
    editBrand: Brand | null;
    editBranch: Branch | null;
    entitySaving: boolean;
    onCloseEditMerchant: () => void;
    onUpdateMerchant: (
      payload: Parameters<typeof updateMerchantApi>[1] & { status?: MerchantStatus },
    ) => Promise<void>;
    onCloseEditBrand: () => void;
    onUpdateBrand: (payload: Parameters<typeof updateBrandApi>[1]) => Promise<void>;
    onCloseEditBranch: () => void;
    onUpdateBranch: (payload: Parameters<typeof updateBranchApi>[1]) => Promise<void>;
  };
  deletion: {
    deleteTarget: { kind: "brand" | "branch"; id: string; name: string } | null;
    deleting: boolean;
    onCancelDelete: () => void;
    onConfirmDelete: () => Promise<void>;
  };
  merchantCredentials?: {
    merchant: MerchantRecord | null;
    onClose: () => void;
    onCopy: (text: string, successMsg?: string, fieldId?: string) => Promise<void> | void;
  };
}

export default function DashboardModals({
  credentials,
  createBrand,
  createBranch,
  editEntities,
  deletion,
  merchantCredentials,
}: DashboardModalsProps) {
  const {
    credModal,
    credSaving,
    copiedField,
    onCloseCredModal,
    onChangeCredModal,
    onSaveCredentials,
    onCopy,
    onDownloadTxt,
    onShowToast,
  } = credentials;
  const { brandModal, brandSaving, merchants, onCloseBrandModal, onCreateBrand } = createBrand;
  const { branchModal, branchSaving, brands, onCloseBranchModal, onCreateBranch } = createBranch;
  const {
    editMerchant,
    editBrand,
    editBranch,
    entitySaving,
    onCloseEditMerchant,
    onUpdateMerchant,
    onCloseEditBrand,
    onUpdateBrand,
    onCloseEditBranch,
    onUpdateBranch,
  } = editEntities;
  const { deleteTarget, deleting, onCancelDelete, onConfirmDelete } = deletion;
  return (
    <>
      {credModal?.open && (
        <CredentialsModal
          modal={credModal}
          saving={credSaving}
          copiedField={copiedField}
          onClose={onCloseCredModal}
          onChangeModal={onChangeCredModal}
          onSave={onSaveCredentials}
          onCopy={onCopy}
          onDownloadTxt={onDownloadTxt}
          onShowToast={onShowToast}
        />
      )}

      <CreateBrandModal
        open={brandModal.open}
        initialMerchantId={brandModal.merchantId}
        merchants={merchants}
        saving={brandSaving}
        onClose={onCloseBrandModal}
        onSave={onCreateBrand}
      />

      <CreateBranchModal
        open={branchModal.open}
        initialBrandId={branchModal.brandId}
        brands={brands}
        saving={branchSaving}
        onClose={onCloseBranchModal}
        onSave={onCreateBranch}
      />

      <EditMerchantModal
        merchant={editMerchant}
        saving={entitySaving}
        onClose={onCloseEditMerchant}
        onSave={onUpdateMerchant}
      />

      <EditBrandModal
        brand={editBrand}
        saving={entitySaving}
        onClose={onCloseEditBrand}
        onSave={onUpdateBrand}
      />

      <EditBranchModal
        branch={editBranch}
        saving={entitySaving}
        onClose={onCloseEditBranch}
        onSave={onUpdateBranch}
      />

      <ConfirmDeleteModal
        open={deleteTarget !== null}
        entityLabel={deleteTarget?.kind === "brand" ? "Brand" : "Branch"}
        entityName={deleteTarget?.name ?? ""}
        deleting={deleting}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />

      {merchantCredentials?.merchant && (
        <MerchantCredentialsModal
          isOpen={Boolean(merchantCredentials.merchant)}
          onClose={merchantCredentials.onClose}
          merchant={merchantCredentials.merchant}
          onCopy={merchantCredentials.onCopy}
        />
      )}
    </>
  );
}
