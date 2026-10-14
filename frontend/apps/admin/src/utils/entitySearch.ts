import type { Branch, Brand, MerchantRecord, MerchantHierarchyItem } from "../api/admin";

export function matchesHierarchyQuery(item: MerchantHierarchyItem, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const merchant = item.merchant;
  return Boolean(
    merchant.business_name?.toLowerCase().includes(q) ||
    merchant.legal_entity_name?.toLowerCase().includes(q) ||
    merchant.fssai_license_number?.toLowerCase().includes(q) ||
    merchant.gstin?.toLowerCase().includes(q) ||
    merchant.id?.toLowerCase().includes(q) ||
    item.brands.some(
      ({ brand, branches }) =>
        brand.name.toLowerCase().includes(q) ||
        brand.description?.toLowerCase().includes(q) ||
        branches.some(
          (branch) =>
            branch.name.toLowerCase().includes(q) || branch.address_text.toLowerCase().includes(q),
        ),
    ),
  );
}

export function matchesBranchQuery(
  branch: Branch,
  query: string,
  brandsById: ReadonlyMap<string, Brand>,
  merchantsById: ReadonlyMap<string, MerchantRecord>,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const brand = brandsById.get(branch.brand_id);
  const merchant = brand ? merchantsById.get(brand.merchant_id) : undefined;
  return Boolean(
    branch.name.toLowerCase().includes(q) ||
    branch.address_text?.toLowerCase().includes(q) ||
    brand?.name.toLowerCase().includes(q) ||
    merchant?.business_name.toLowerCase().includes(q),
  );
}
