import type { ApiClientInstance } from "../client";
import type { Menu, MenuCategory, MenuItem } from "../../types/menu";

export async function createBranchMenuApi(
  client: ApiClientInstance,
  branchId: string,
  name = "Main Menu",
): Promise<Menu> {
  return client<Menu>(`/branches/${branchId}/menus`, {
    method: "POST",
    body: JSON.stringify({ name, is_active: true }),
  });
}

export async function createCategoryApi(
  client: ApiClientInstance,
  branchId: string,
  name: string,
  displayOrder = 0,
): Promise<MenuCategory> {
  try {
    return await client<MenuCategory>(`/branches/${branchId}/menu/categories`, {
      method: "POST",
      body: JSON.stringify({ name, display_order: displayOrder }),
    });
  } catch (err) {
    const menu = await client<Menu>(`/branches/${branchId}/menu`).catch(() => null);
    const cat = menu?.categories?.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (cat) return cat;
    throw err;
  }
}

export async function updateCategoryApi(
  client: ApiClientInstance,
  categoryId: string,
  payload: {
    name?: string | null;
    display_order?: number | null;
  },
): Promise<MenuCategory> {
  return client<MenuCategory>(`/menu/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategoryApi(
  client: ApiClientInstance,
  categoryId: string,
  fallbackCategoryId?: string | null,
): Promise<void> {
  const query = fallbackCategoryId
    ? `?fallback_category_id=${encodeURIComponent(fallbackCategoryId)}`
    : "";
  return client<void>(`/menu/categories/${categoryId}${query}`, {
    method: "DELETE",
  });
}

export async function createMenuItemApi(
  client: ApiClientInstance,
  branchId: string,
  payload: {
    category_id: string;
    name: string;
    description?: string | null;
    base_price: number;
    image_url?: string | null;
    is_available?: boolean;
    is_veg?: boolean;
  },
): Promise<MenuItem> {
  return client<MenuItem>(`/branches/${branchId}/menu/items`, {
    method: "POST",
    body: JSON.stringify({
      category_id: payload.category_id,
      name: payload.name.trim(),
      description: payload.description?.trim() || null,
      base_price: Number(payload.base_price),
      image_url: payload.image_url?.trim() || null,
      is_available: payload.is_available ?? true,
      is_veg: payload.is_veg ?? true,
    }),
  });
}

export async function getMenuItemApi(client: ApiClientInstance, itemId: string): Promise<MenuItem> {
  return client<MenuItem>(`/menu/items/${itemId}`);
}

export async function updateMenuItemApi(
  client: ApiClientInstance,
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
  const body: Record<string, unknown> = {};
  if (payload.name !== undefined) body.name = payload.name.trim();
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.base_price !== undefined) body.base_price = Number(payload.base_price);
  if (payload.image_url !== undefined)
    body.image_url = payload.image_url ? payload.image_url.trim() : null;
  if (payload.is_available !== undefined) body.is_available = payload.is_available;
  if (payload.is_veg !== undefined) body.is_veg = payload.is_veg;
  if (payload.category_id !== undefined) body.category_id = payload.category_id;

  try {
    return await client<MenuItem>(`/menu/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  } catch (err) {
    const actual = await getMenuItemApi(client, itemId).catch(() => null);
    if (actual) return actual;
    throw err;
  }
}

export async function toggleMenuItemAvailabilityApi(
  client: ApiClientInstance,
  itemId: string,
  isAvailable: boolean,
): Promise<MenuItem> {
  return updateMenuItemApi(client, itemId, { is_available: isAvailable });
}
