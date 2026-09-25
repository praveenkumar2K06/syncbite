import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tag01Icon,
  Store01Icon,
  Copy01Icon,
  Location01Icon,
  Clock01Icon,
  Edit01Icon,
  Key01Icon,
} from "@hugeicons/core-free-icons";
import type { Brand, MerchantRecord, Branch } from "../../api/admin";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/ui/status-badge";

interface BrandDetailModalProps {
  brand: Brand | null;
  onClose: () => void;
  merchantMap: Map<string, MerchantRecord>;
  branches: Branch[];
  onEditBrand?: (brand: Brand) => void;
  onManageMerchantCredentials?: (merchant: MerchantRecord) => void;
  onCopy?: (text: string, msg?: string) => void;
}

export default function BrandDetailModal({
  brand,
  onClose,
  merchantMap,
  branches,
  onEditBrand,
  onManageMerchantCredentials,
  onCopy,
}: BrandDetailModalProps) {
  if (!brand) return null;

  const parentMerchant = merchantMap.get(brand.merchant_id);
  const brandBranches = branches.filter((b) => b.brand_id === brand.id);
  const onlineCount = brandBranches.filter((b) => b.is_active).length;

  return (
    <Sheet open={Boolean(brand)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-border bg-popover p-0 text-popover-foreground sm:max-w-lg"
      >
        <SheetHeader className="shrink-0 border-b border-border bg-muted/30 p-5 pr-14">
          <SheetTitle className="flex items-center gap-2.5 text-base font-bold tracking-tight">
            <span className="flex size-8 items-center justify-center rounded-lg border border-pink-500/20 bg-pink-500/10 text-pink-400">
              <HugeiconsIcon icon={Tag01Icon} size={18} />
            </span>
            <span className="truncate">{brand.name}</span>
          </SheetTitle>
          <SheetDescription className="text-xs">
            Brand profile and associated outlets
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-5 text-xs">
          {/* Core Metadata Card */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">Concept Identity</span>
              {onCopy && (
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => onCopy(brand.id, "Brand ID copied!")}
                >
                  <HugeiconsIcon icon={Copy01Icon} size={11} />
                  <span>Copy ID</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border pt-1">
              <div>
                <div className="text-[11px] text-muted-foreground">Brand ID</div>
                <div className="mt-0.5 truncate font-mono text-[11px] text-foreground">
                  {brand.id}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Parent Merchant</div>
                <div className="mt-0.5 flex items-center justify-between gap-1.5">
                  <span className="truncate font-medium text-foreground">
                    {parentMerchant?.business_name || "Direct Outlet"}
                  </span>
                  {parentMerchant && onManageMerchantCredentials && (
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => onManageMerchantCredentials(parentMerchant)}
                      title="Manage merchant owner credentials & reset password"
                      className="shrink-0 border-violet-500/30 bg-violet-500/15 text-violet-200 hover:bg-violet-500/25 text-[10px] h-6 px-1.5"
                    >
                      <HugeiconsIcon icon={Key01Icon} size={11} />
                      <span>Credentials</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {brand.description && (
              <div className="border-t border-border pt-2">
                <div className="text-[11px] text-muted-foreground">Description</div>
                <p className="mt-0.5 leading-relaxed text-muted-foreground">{brand.description}</p>
              </div>
            )}

            {brand.cuisine_types && brand.cuisine_types.length > 0 && (
              <div className="border-t border-border pt-2">
                <div className="mb-1.5 text-[11px] text-muted-foreground">Cuisine Specialties</div>
                <div className="flex flex-wrap gap-1">
                  {brand.cuisine_types.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-pink-950/30 text-pink-300 border border-pink-800/40"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Associated Outlets */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <HugeiconsIcon icon={Store01Icon} size={14} className="text-cyan-400" />
                <span>Physical Outlets ({brandBranches.length})</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {onlineCount} Online
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {brandBranches.length === 0 ? (
                <div className="py-2 italic text-muted-foreground">
                  No physical outlets registered under this brand.
                </div>
              ) : (
                brandBranches.map((br) => (
                  <div
                    key={br.id}
                    className="flex flex-col gap-1.5 rounded-xl border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{br.name}</span>
                      <StatusBadge status={br.is_active ? "ONLINE" : "OFFLINE"} />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={11}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span className="truncate">{br.address_text || "VIT Campus"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={11}
                        className="shrink-0 text-muted-foreground"
                      />
                      <span>
                        {br.opening_time?.slice(0, 5)} - {br.closing_time?.slice(0, 5)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="shrink-0 flex-row items-center justify-between border-t border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            {onEditBrand && (
              <Button
                variant="cyanSubtle"
                size="sm"
                onClick={() => {
                  onClose();
                  onEditBrand(brand);
                }}
              >
                <HugeiconsIcon icon={Edit01Icon} size={13} />
                <span>Edit Brand</span>
              </Button>
            )}
            {parentMerchant && onManageMerchantCredentials && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onClose();
                  onManageMerchantCredentials(parentMerchant);
                }}
                className="border-violet-500/30 bg-violet-500/15 text-violet-200 hover:bg-violet-500/25"
              >
                <HugeiconsIcon icon={Key01Icon} size={13} />
                <span>Merchant Credentials</span>
              </Button>
            )}
          </div>
          <Button variant="default" size="sm" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
