import { createContext, useContext, useMemo } from "react";
import type {
  Branch,
  MerchantHierarchyItem,
  Brand,
  MerchantRecord,
  BranchManagerResponse,
  BranchManagerCreateRequest,
} from "../api/admin";
import type { ToastState } from "../types/dashboard";

export interface DashboardContextValue {
  branches: Branch[];
  branchesLoading: boolean;
  branchManagers: BranchManagerResponse[];
  branchManagersLoading: boolean;
  loadBranchManagers: () => Promise<void>;
  handleCreateBranchManager: (
    payload: BranchManagerCreateRequest,
  ) => Promise<BranchManagerResponse>;
  handleAssignBranchManager: (userId: string, branchId: string) => Promise<BranchManagerResponse>;
  branchSearch: string;
  setBranchSearch: (v: string) => void;
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  togglingBranch: string | null;
  copiedField: string | null;
  toast: ToastState | null;
  showToast: (msg: string, type: "success" | "error") => void;
  copyToClipboard: (text: string, successMsg?: string, fieldId?: string) => Promise<void>;
  downloadCredentialsTxt: (
    name: string,
    email: string,
    pass: string,
    branchId?: string,
    role?: string,
    branchManagerEmail?: string,
    branchManagerPass?: string,
  ) => void;
  loadBranches: () => void;
  handleToggleBranch: (branch: Branch) => Promise<void>;
  handleOpenMenuForBranch: (branchId: string) => void;
  handleOpenCredentialsModal: (
    branch: Branch,
    role?: "BranchManager" | "MerchantOwner",
    initialEmail?: string,
  ) => void;
  handleOpenMerchantCredentialsModal: (merchant: MerchantRecord) => void;
  getManagerEmail: (branch: Branch) => string;
  hierarchy: MerchantHierarchyItem[];
  hierarchyLoading: boolean;
  loadHierarchy: () => void;
  merchants: MerchantRecord[];
  brands: Brand[];
  handleOpenCreateBrandModal: (merchantId?: string) => void;
  handleOpenCreateBranchModal: (brandId?: string) => void;
  handleCreateBrand: (payload: {
    merchant_id: string;
    name: string;
    description?: string;
    cuisine_types?: string[];
  }) => Promise<void>;
  handleCreateBranch: (payload: {
    brand_id: string;
    name: string;
    address_text: string;
    opening_time?: string;
    closing_time?: string;
    is_active?: boolean;
  }) => Promise<void>;
  handleOpenEditMerchant: (merchant: MerchantRecord) => void;
  handleOpenEditBrand: (brand: Brand) => void;
  handleOpenEditBranch: (branch: Branch) => void;
  handleRequestDelete: (kind: "brand" | "branch", id: string, name: string) => void;
}

export type DashboardDataContextValue = Pick<
  DashboardContextValue,
  | "branches"
  | "branchesLoading"
  | "branchManagers"
  | "branchManagersLoading"
  | "branchSearch"
  | "selectedBranchId"
  | "togglingBranch"
  | "copiedField"
  | "toast"
  | "hierarchy"
  | "hierarchyLoading"
  | "merchants"
  | "brands"
>;
export type DashboardActionsContextValue = Omit<
  DashboardContextValue,
  keyof DashboardDataContextValue
>;

export const DashboardDataContext = createContext<DashboardDataContextValue | null>(null);
export const DashboardActionsContext = createContext<DashboardActionsContextValue | null>(null);

export function useDashboardData(): DashboardDataContextValue {
  const value = useContext(DashboardDataContext);
  if (!value) throw new Error("useDashboardData must be used inside Dashboard");
  return value;
}

export function useDashboardActions(): DashboardActionsContextValue {
  const value = useContext(DashboardActionsContext);
  if (!value) throw new Error("useDashboardActions must be used inside Dashboard");
  return value;
}

export function useDashboard(): DashboardContextValue {
  const data = useDashboardData();
  const actions = useDashboardActions();
  return useMemo(() => ({ ...data, ...actions }), [data, actions]);
}
