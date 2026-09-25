import { useState, useMemo } from "react";
import type { Brand, MerchantRecord, Branch } from "../api/admin";
import BrandHeader from "./brands/BrandHeader";
import BrandFilters, { type BranchFilterType } from "./brands/BrandFilters";
import BrandCardGrid from "./brands/BrandCardGrid";
import BrandDetailModal from "./brands/BrandDetailModal";

interface BrandsTabProps {
  brands: Brand[];
  merchants: MerchantRecord[];
  branches: Branch[];
  loading?: boolean;
  onRefresh: () => void;
  onOpenCreateBrandModal: (merchantId?: string) => void;
  onEditBrand: (brand: Brand) => void;
  onDeleteBrand: (brand: Brand) => void;
  onOpenMenuForBranch: (branchId: string) => void;
  onManageMerchantCredentials?: (merchant: MerchantRecord) => void;
  onCopy?: (text: string, successMsg?: string) => void;
}

export default function BrandsTab({
  brands,
  merchants,
  branches,
  loading = false,
  onRefresh,
  onOpenCreateBrandModal,
  onEditBrand,
  onDeleteBrand,
  onOpenMenuForBranch,
  onManageMerchantCredentials,
  onCopy,
}: BrandsTabProps) {
  const [search, setSearch] = useState("");
  const [selectedMerchantFilter, setSelectedMerchantFilter] = useState<string>("ALL");
  const [branchStatusFilter, setBranchStatusFilter] = useState<BranchFilterType>("ALL");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Merchant lookup map
  const merchantMap = useMemo(() => {
    const map = new Map<string, MerchantRecord>();
    merchants.forEach((m) => map.set(m.id, m));
    return map;
  }, [merchants]);

  // Filtered brands
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      if (selectedMerchantFilter !== "ALL" && brand.merchant_id !== selectedMerchantFilter) {
        return false;
      }

      const brandBranches = branches.filter((b) => b.brand_id === brand.id);
      const activeBranches = brandBranches.filter((b) => b.is_active);

      if (branchStatusFilter === "HAS_BRANCHES" && brandBranches.length === 0) return false;
      if (branchStatusFilter === "NO_BRANCHES" && brandBranches.length > 0) return false;
      if (branchStatusFilter === "LIVE_ONLY" && activeBranches.length === 0) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const parentMerchant = merchantMap.get(brand.merchant_id);
      return (
        brand.name.toLowerCase().includes(q) ||
        (brand.description && brand.description.toLowerCase().includes(q)) ||
        (brand.cuisine_types && brand.cuisine_types.some((c) => c.toLowerCase().includes(q))) ||
        (parentMerchant && parentMerchant.business_name.toLowerCase().includes(q))
      );
    });
  }, [brands, selectedMerchantFilter, branchStatusFilter, search, merchantMap, branches]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <BrandHeader
        brandsCount={brands.length}
        onOpenCreateBrandModal={() => onOpenCreateBrandModal()}
        onRefresh={onRefresh}
      />

      <BrandFilters
        search={search}
        onSearchChange={setSearch}
        selectedMerchantFilter={selectedMerchantFilter}
        onSelectMerchantFilter={setSelectedMerchantFilter}
        branchStatusFilter={branchStatusFilter}
        onBranchStatusFilterChange={setBranchStatusFilter}
        merchants={merchants}
        filteredCount={filteredBrands.length}
        totalCount={brands.length}
      />

      <BrandCardGrid
        loading={loading}
        brands={filteredBrands}
        merchantMap={merchantMap}
        branches={branches}
        onOpenCreateBrandModal={() => onOpenCreateBrandModal()}
        onSelectBrand={setSelectedBrand}
        onEditBrand={onEditBrand}
        onDeleteBrand={onDeleteBrand}
        onOpenMenuForBranch={onOpenMenuForBranch}
        onManageMerchantCredentials={onManageMerchantCredentials}
        onCopy={onCopy}
      />

      <BrandDetailModal
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
        merchantMap={merchantMap}
        branches={branches}
        onEditBrand={onEditBrand}
        onManageMerchantCredentials={onManageMerchantCredentials}
        onCopy={onCopy}
      />
    </div>
  );
}
