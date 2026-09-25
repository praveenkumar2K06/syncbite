import { HugeiconsIcon } from "@hugeicons/react";
import { Tag01Icon, PlusSignIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { Button } from "../../components/ui/button";

interface BrandHeaderProps {
  brandsCount: number;
  onOpenCreateBrandModal: () => void;
  onRefresh: () => void;
}

export default function BrandHeader({
  brandsCount,
  onOpenCreateBrandModal,
  onRefresh,
}: BrandHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <HugeiconsIcon icon={Tag01Icon} size={20} />
          </div>
          <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
            <span>Brand Catalog</span>
            <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-300">
              {brandsCount} Brands
            </span>
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Brand-level view – best for marketing concepts, cuisine profiles, and direct outlet
          assignments.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="pink" size="default" onClick={onOpenCreateBrandModal}>
          <HugeiconsIcon icon={PlusSignIcon} size={15} />
          <span>Create Brand</span>
        </Button>

        <Button variant="default" size="default" onClick={onRefresh}>
          <HugeiconsIcon icon={RefreshIcon} size={15} />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
}
