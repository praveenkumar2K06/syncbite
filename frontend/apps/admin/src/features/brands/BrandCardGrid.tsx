import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tag01Icon,
  Building02Icon,
  Store01Icon,
  Edit01Icon,
  Delete02Icon,
  MoreVerticalIcon,
  Menu01Icon,
  PlusSignIcon,
  EyeIcon,
  Copy01Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  Key01Icon,
} from "@hugeicons/core-free-icons";
import type { Brand, MerchantRecord, Branch } from "../../api/admin";
import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu";

interface BrandCardGridProps {
  loading: boolean;
  brands: Brand[];
  merchantMap: Map<string, MerchantRecord>;
  branches: Branch[];
  onOpenCreateBrandModal: () => void;
  onSelectBrand: (brand: Brand) => void;
  onEditBrand: (brand: Brand) => void;
  onDeleteBrand: (brand: Brand) => void;
  onOpenMenuForBranch: (branchId: string) => void;
  onManageMerchantCredentials?: (merchant: MerchantRecord) => void;
  onCopy?: (text: string, msg?: string) => void;
}

export default function BrandCardGrid({
  loading,
  brands,
  merchantMap,
  branches,
  onOpenCreateBrandModal,
  onSelectBrand,
  onEditBrand,
  onDeleteBrand,
  onOpenMenuForBranch,
  onManageMerchantCredentials,
  onCopy,
}: BrandCardGridProps) {
  // Track inline expanded branches per brand
  const [expandedBrandBranches, setExpandedBrandBranches] = useState<Record<string, boolean>>({});

  const toggleBrandBranches = (brandId: string) => {
    setExpandedBrandBranches((prev) => ({
      ...prev,
      [brandId]: !prev[brandId],
    }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-56 rounded-2xl bg-muted/50" />
        ))}
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-12 text-center">
        <div className="rounded-2xl bg-muted p-3 text-muted-foreground">
          <HugeiconsIcon icon={Tag01Icon} size={32} />
        </div>
        <div className="text-base font-semibold text-foreground">No brands found</div>
        <div className="max-w-sm text-xs text-muted-foreground">
          No brands matched your search filters. Try clearing filters or create a new brand concept.
        </div>
        <Button variant="pink" size="sm" onClick={onOpenCreateBrandModal} className="mt-2">
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
          <span>Create New Brand</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {brands.map((brand) => {
        const parentMerchant = merchantMap.get(brand.merchant_id);
        const brandBranches = branches.filter((b) => b.brand_id === brand.id);
        const activeBranchesCount = brandBranches.filter((b) => b.is_active).length;
        const isBranchesExpanded = expandedBrandBranches[brand.id] ?? false;

        // Show top 2 branches when collapsed, all when expanded
        const visibleBranches = isBranchesExpanded ? brandBranches : brandBranches.slice(0, 2);

        return (
          <Card
            key={brand.id}
            className="group flex flex-col justify-between border-border bg-card shadow-md transition-all hover:border-primary/50"
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="size-8 shrink-0 rounded-lg border border-border object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={Tag01Icon} size={16} />
                      </div>
                    )}
                    <h3
                      className="truncate text-base font-bold tracking-tight text-foreground"
                      title={brand.name}
                    >
                      {brand.name}
                    </h3>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <HugeiconsIcon
                      icon={Building02Icon}
                      size={13}
                      className="shrink-0 text-muted-foreground"
                    />
                    <span
                      className="truncate font-medium text-foreground"
                      title={parentMerchant ? parentMerchant.business_name : "Direct Outlet"}
                    >
                      {parentMerchant ? parentMerchant.business_name : "Direct Outlet"}
                    </span>
                  </div>
                </div>

                {/* Status Chip */}
                <Badge
                  variant={activeBranchesCount > 0 ? "approved" : "default"}
                  className="shrink-0 font-mono text-[11px]"
                  title={`${activeBranchesCount} of ${brandBranches.length} branches currently online`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeBranchesCount > 0 ? "bg-emerald-400" : "bg-muted-foreground"
                    }`}
                  />
                  {activeBranchesCount} / {brandBranches.length} Live
                </Badge>
              </div>

              {brand.description && (
                <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {brand.description}
                </p>
              )}

              {/* Cuisine Tags */}
              {brand.cuisine_types && brand.cuisine_types.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {brand.cuisine_types.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-pink-950/30 text-pink-300 border border-pink-800/40"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent className="p-4 pt-2">
              {/* Branches summary */}
              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Store01Icon} size={13} className="text-cyan-400" />
                    <span>Outlets ({brandBranches.length})</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    ID: {brand.id.slice(0, 8)}…
                  </span>
                </div>

                {brandBranches.length === 0 ? (
                  <div className="py-1 text-[11px] italic text-muted-foreground">
                    No physical branches registered yet
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {visibleBranches.map((br) => (
                      <div
                        key={br.id}
                        className="flex items-center justify-between rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs transition-colors hover:border-primary/40"
                      >
                        <span
                          className="max-w-[140px] truncate font-medium text-foreground"
                          title={br.name}
                        >
                          {br.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-semibold ${
                              br.is_active ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {br.is_active ? "Online" : "Offline"}
                          </span>
                          <Button
                            variant="amberSubtle"
                            size="xs"
                            onClick={() => onOpenMenuForBranch(br.id)}
                            title="Open Menu Management"
                          >
                            <HugeiconsIcon icon={Menu01Icon} size={11} />
                            <span>Menu</span>
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Expand/Collapse extra branches toggle */}
                    {brandBranches.length > 2 && (
                      <button
                        type="button"
                        onClick={() => toggleBrandBranches(brand.id)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium flex items-center justify-center gap-1 pt-1 cursor-pointer"
                      >
                        {isBranchesExpanded ? (
                          <>
                            <HugeiconsIcon icon={ChevronUpIcon} size={12} />
                            <span>Show less</span>
                          </>
                        ) : (
                          <>
                            <HugeiconsIcon icon={ChevronDownIcon} size={12} />
                            <span>+{brandBranches.length - 2} more branches</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-2 border-t border-border p-4 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onSelectBrand(brand)}
                title="View full brand details in drawer"
              >
                <HugeiconsIcon icon={EyeIcon} size={13} />
                <span>Details</span>
              </Button>

              <div className="flex items-center gap-1.5">
                <Button variant="cyanSubtle" size="sm" onClick={() => onEditBrand(brand)}>
                  <HugeiconsIcon icon={Edit01Icon} size={13} />
                  <span>Edit</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="secondary" size="iconSm" title="More brand actions">
                        <HugeiconsIcon icon={MoreVerticalIcon} size={13} />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" side="bottom" sideOffset={6}>
                    <DropdownMenuItem
                      onClick={() => onCopy?.(brand.id, "Brand ID copied!")}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <HugeiconsIcon icon={Copy01Icon} size={13} />
                      <span>Copy Brand ID</span>
                    </DropdownMenuItem>
                    {parentMerchant && onManageMerchantCredentials && (
                      <DropdownMenuItem
                        onClick={() => onManageMerchantCredentials(parentMerchant)}
                        className="flex items-center gap-2 cursor-pointer text-violet-300 focus:text-violet-200"
                      >
                        <HugeiconsIcon icon={Key01Icon} size={13} />
                        <span>Merchant Credentials</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDeleteBrand(brand)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={13} />
                      <span>Delete Brand</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
