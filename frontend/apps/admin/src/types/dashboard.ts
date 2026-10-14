import type { MenuItem } from "../api/admin";

export type Tab =
  | "overview"
  | "analytics"
  | "merchants"
  | "brands"
  | "branches"
  | "restaurants"
  | "menu"
  | "categories"
  | "onboard"
  | "games"
  | "customers"
  | "orders"
  | "payments"
  | "banners"
  | "subscriptions"
  | "notifications"
  | "flags"
  | "logs";

export interface CreateBrandModalState {
  open: boolean;
  merchantId?: string;
}

export interface CreateBranchModalState {
  open: boolean;
  brandId?: string;
}

export interface ItemFormData {
  name: string;
  category_id: string;
  new_category_name: string;
  base_price: string;
  description: string;
  image_url: string;
  is_veg: boolean;
  is_available: boolean;
}

export interface ItemModalState {
  open: boolean;
  mode: "create" | "edit";
  item?: MenuItem;
}

export type {
  CredentialModalState,
  OnboardFormData,
  OnboardSuccessState,
  ToastState,
} from "@syncbite/shared";
