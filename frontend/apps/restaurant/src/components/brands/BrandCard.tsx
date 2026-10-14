import type { Brand } from "@/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Building02Icon, PencilEdit02Icon, Delete02Icon } from "@hugeicons/core-free-icons";

interface BrandCardProps {
  brand: Brand;
  isMerchantOwner: boolean;
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
}

export function BrandCard({ brand, isMerchantOwner, onEdit, onDelete }: BrandCardProps) {
  return (
    <Card className="overflow-hidden border-border flex flex-col justify-between">
      <div>
        {/* Banner / Header */}
        <div className="h-28 bg-gradient-to-r from-slate-800 to-slate-900 relative">
          {brand.banner_url ? (
            <img src={brand.banner_url} alt={brand.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <HugeiconsIcon icon={Building02Icon} className="w-10 h-10" />
            </div>
          )}
          <div className="absolute -bottom-5 left-4">
            <div className="w-12 h-12 rounded-lg bg-card border-2 border-background shadow-md overflow-hidden flex items-center justify-center text-foreground font-bold">
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
              ) : (
                brand.name.slice(0, 2).toUpperCase()
              )}
            </div>
          </div>
        </div>

        <CardContent className="pt-8 p-4 space-y-3">
          <div>
            <h3 className="font-bold text-base text-foreground">{brand.name}</h3>
            {brand.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{brand.description}</p>
            )}
          </div>

          {/* Cuisine Tags */}
          {brand.cuisine_types && brand.cuisine_types.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {brand.cuisine_types.map((c, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] font-medium px-2 py-0.5">
                  {c}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      <div className="border-t border-border/60 p-3 bg-muted/20 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground font-medium">
          {isMerchantOwner ? "Merchant Portfolio" : "Assigned Brand"}
        </span>
        {isMerchantOwner && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(brand)}
              className="h-8 gap-1 text-xs"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} className="w-3.5 h-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(brand.id)}
              className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10"
            >
              <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
