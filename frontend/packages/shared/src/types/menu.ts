/**
 * Menu, Dishes, Categories, and Modifiers Types
 * Shared across Student, Restaurant, and Admin applications.
 */

export type FoodType = "veg" | "non-veg" | "nonveg" | "egg";

export interface MenuModifier {
  id: string;
  menu_item_id: string;
  name: string;
  price_delta: number;
}

/** Backend database representation of a menu item */
export interface BackendMenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string | null;
  base_price: number;
  image_url?: string | null;
  is_available: boolean;
  is_veg: boolean;
  modifiers?: MenuModifier[];
  created_at?: string;
  updated_at?: string;
}

/** Default MenuItem entity */
export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  is_available: boolean;
  is_veg: boolean;
  modifiers: MenuModifier[];
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategory {
  id: string;
  menu_id: string;
  name: string;
  display_order: number;
  items: MenuItem[];
  created_at?: string;
  updated_at?: string;
}

export interface BackendMenuCategory {
  id: string;
  menu_id: string;
  name: string;
  display_order: number;
  items: BackendMenuItem[];
  created_at?: string;
  updated_at?: string;
}

export interface Menu {
  id: string;
  branch_id: string;
  name: string;
  is_active: boolean;
  categories: MenuCategory[];
  created_at?: string;
  updated_at?: string;
}

export interface NewMenuItemDraft {
  name: string;
  price: number;
  category: string;
  description: string;
  foodType: FoodType;
  image_url?: string | null;
}

export type StudentItemCategory = "popular" | "meals" | "snacks" | "beverages" | (string & {});

/** Student-facing view model for menu items */
export interface StudentMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: StudentItemCategory;
  image: string;
  isVeg: boolean;
}

/** Student-facing view model for restaurants */
export interface RestaurantViewModel {
  id: string;
  name: string;
  category: string;
  image: string;
  isOpen: boolean;
  prepTime: string;
  location: string;
  rating: number;
  menu: StudentMenuItem[];
  brand_id?: string;
  brand_name?: string;
  banner_url?: string | null;
  is_campus?: boolean;
  opening_time?: string;
  closing_time?: string;
}
