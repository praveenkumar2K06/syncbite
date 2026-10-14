import { apiClient } from "../client";
import {
  getBranchMenuApi as sharedGetBranchMenuApi,
  createBranchMenuApi as sharedCreateBranchMenuApi,
  createCategoryApi as sharedCreateCategoryApi,
  updateCategoryApi as sharedUpdateCategoryApi,
  deleteCategoryApi as sharedDeleteCategoryApi,
  createMenuItemApi as sharedCreateMenuItemApi,
  updateMenuItemApi as sharedUpdateMenuItemApi,
  toggleMenuItemAvailabilityApi as sharedToggleMenuItemAvailabilityApi,
  type Menu,
  type MenuCategory,
  type MenuItem,
} from "@syncbite/shared";

export async function getBranchMenuApi(branchId: string): Promise<Menu> {
  return sharedGetBranchMenuApi(apiClient, branchId);
}

export async function createBranchMenuApi(branchId: string, name = "Main Menu"): Promise<Menu> {
  return sharedCreateBranchMenuApi(apiClient, branchId, name);
}

export async function createCategoryApi(
  branchId: string,
  name: string,
  displayOrder = 0,
): Promise<MenuCategory> {
  return sharedCreateCategoryApi(apiClient, branchId, name, displayOrder);
}

export async function updateCategoryApi(
  categoryId: string,
  payload: {
    name?: string | null;
    display_order?: number | null;
  },
): Promise<MenuCategory> {
  return sharedUpdateCategoryApi(apiClient, categoryId, payload);
}

export async function deleteCategoryApi(
  categoryId: string,
  fallbackCategoryId?: string | null,
): Promise<void> {
  return sharedDeleteCategoryApi(apiClient, categoryId, fallbackCategoryId);
}

export async function createMenuItemApi(
  branchId: string,
  payload: {
    category_id: string;
    name: string;
    description?: string;
    base_price: number;
    image_url?: string;
    is_available?: boolean;
    is_veg?: boolean;
  },
): Promise<MenuItem> {
  return sharedCreateMenuItemApi(apiClient, branchId, payload);
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
  return sharedUpdateMenuItemApi(apiClient, itemId, payload);
}

export async function toggleMenuItemAvailabilityApi(
  itemId: string,
  isAvailable: boolean,
): Promise<MenuItem> {
  return sharedToggleMenuItemAvailabilityApi(apiClient, itemId, isAvailable);
}
