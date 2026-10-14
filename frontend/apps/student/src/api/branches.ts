import { apiClient } from "./client";
import type { MenuItem, Restaurant } from "@/types";

import {
  getBranchesApi as sharedGetBranches,
  getBranchByIdApi as sharedGetBranchById,
  getBrandsApi as sharedGetBrands,
  getBrandByIdApi as sharedGetBrandById,
  getBranchMenuApi as sharedGetBranchMenu,
  isBranchOperatingNow,
} from "@syncbite/shared";

import type {
  Branch as BackendBranch,
  Brand as BackendBrand,
  BackendMenuItem,
  BackendMenuCategory,
  Menu as BackendMenu,
} from "@syncbite/shared";

export type { BackendBranch, BackendBrand, BackendMenuItem, BackendMenuCategory, BackendMenu };

export async function getBranchesApi(): Promise<BackendBranch[]> {
  return sharedGetBranches(apiClient);
}

export async function getBranchByIdApi(branchId: string): Promise<BackendBranch> {
  return sharedGetBranchById(apiClient, branchId);
}

export async function getBrandsApi(): Promise<BackendBrand[]> {
  return sharedGetBrands(apiClient);
}

export async function getBrandByIdApi(brandId: string): Promise<BackendBrand> {
  return sharedGetBrandById(apiClient, brandId);
}

export async function getBranchMenuApi(branchId: string): Promise<BackendMenu> {
  return sharedGetBranchMenu(apiClient, branchId);
}

/**
 * Checks whether an address indicates inside campus vs outside campus
 */
export function isCampusInside(addressText: string): boolean {
  if (!addressText) return true;
  const lower = addressText.toLowerCase();
  if (
    lower.includes("outside") ||
    lower.includes("off-campus") ||
    lower.includes("city") ||
    lower.includes("town") ||
    lower.includes("external")
  ) {
    return false;
  }
  return true;
}

export function adaptBackendMenuToItems(menu?: BackendMenu, fallbackImage?: string): MenuItem[] {
  const menuItems: MenuItem[] = [];
  if (menu && menu.categories) {
    for (const cat of menu.categories) {
      const categoryName = cat.name?.trim();
      for (const item of cat.items) {
        menuItems.push({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.base_price,
          category: categoryName,
          image:
            item.image_url ||
            fallbackImage ||
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=340&fit=crop&auto=format",
          isVeg: item.is_veg,
        });
      }
    }
  }
  return menuItems;
}

/**
 * Converts a backend Branch and Menu into the frontend's Restaurant shape.
 */
export function adaptBackendBranchToRestaurant(
  branch: BackendBranch,
  menu?: BackendMenu,
  fallbackRestaurant?: Restaurant,
  brand?: BackendBrand,
): Restaurant {
  const menuItems = adaptBackendMenuToItems(menu, fallbackRestaurant?.image);
  // If backend menu is empty, use fallback items if available
  const finalMenu = menuItems.length > 0 ? menuItems : fallbackRestaurant?.menu || [];
  const bannerImage =
    brand?.banner_url || brand?.logo_url || fallbackRestaurant?.banner_url || null;
  const isInside = isCampusInside(branch.address_text || "");

  const isOperatingHours = isBranchOperatingNow(branch.opening_time, branch.closing_time);
  const isOpen = Boolean(branch.is_active && isOperatingHours);

  // Determine restaurant category from menu or brand name
  let restaurantCategory = "Multi-Cuisine · Dine-in & Takeaway";
  if (finalMenu.length > 0) {
    const cats = Array.from(new Set(finalMenu.map((m) => m.category).filter(Boolean)));
    if (cats.length > 0) {
      restaurantCategory = cats.slice(0, 2).join(" · ");
    }
  } else if (fallbackRestaurant?.category && !fallbackRestaurant.category.toLowerCase().includes("campus")) {
    restaurantCategory = fallbackRestaurant.category;
  }

  return {
    id: branch.id,
    name: branch.name,
    category: restaurantCategory,
    image:
      bannerImage ||
      fallbackRestaurant?.image ||
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=340&fit=crop&auto=format",
    isOpen,
    prepTime: fallbackRestaurant?.prepTime || "15–25 min",
    location: branch.address_text || fallbackRestaurant?.location || "Katpadi, Vellore",
    rating: fallbackRestaurant?.rating || 4.5,
    menu: finalMenu,
    brand_id: branch.brand_id,
    brand_name: brand?.name,
    banner_url: bannerImage,
    is_campus: isInside,
    opening_time: branch.opening_time,
    closing_time: branch.closing_time,
  };
}
