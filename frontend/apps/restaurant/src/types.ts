export type Screen =
  | "dashboard"
  | "orders"
  | "menu"
  | "categories"
  | "inventory"
  | "kitchens"
  | "branches"
  | "brands"
  | "finances"
  | "subscription"
  | "merchant"
  | "notifications"
  | "settings";

export type BootState = "restoring" | "signed-out" | "signed-in";

export interface NavItem {
  key: Screen;
  label: string;
  icon: string;
  section?: "operations" | "organization" | "financials" | "account";
}

export type { ToastInfo, NewMenuItemDraft, BranchSettingsPatch } from "@syncbite/shared";
