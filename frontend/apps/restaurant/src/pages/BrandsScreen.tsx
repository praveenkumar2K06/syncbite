import { useState, useEffect, useCallback } from "react";
import {
  createBrandApi,
  updateBrandApi,
  deleteBrandApi,
  getMerchantOwnerBrandsAndBranchesApi,
  getBrandApi,
  toUserMessage,
  type Brand,
} from "@/api";
import { usePortal } from "@/context/PortalContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Confirm from "@/components/common/Confirm";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building02Icon,
  PlusSignIcon,
  RefreshCwIcon,
  Search01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { BrandCard } from "@/components/brands/BrandCard";
import { BrandDialog, type BrandFormData } from "@/components/brands/BrandDialog";

const INITIAL_FORM: BrandFormData = {
  name: "",
  description: "",
  logo_url: "",
  banner_url: "",
  cuisineInput: "",
};

export default function BrandsScreen() {
  const { showToast, user, branch } = usePortal();
  const isMerchantOwner = user?.role === "MerchantOwner";
  const [brands, setBrands] = useState<Brand[]>([]);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create / Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<BrandFormData>({ ...INITIAL_FORM });

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadBrands = useCallback(async () => {
    setLoading(true);
    try {
      if (isMerchantOwner) {
        const { merchant, brands: ownedBrands } = await getMerchantOwnerBrandsAndBranchesApi(
          user?.id,
        );
        setMerchantId(merchant?.id || null);
        setBrands(ownedBrands);
      } else {
        if (branch?.brandId) {
          const brandData = await getBrandApi(branch.brandId);
          setBrands([brandData]);
        } else {
          setBrands([]);
        }
      }
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, isMerchantOwner, user?.id, branch?.brandId]);

  useEffect(() => {
    void loadBrands();
  }, [loadBrands]);

  const openCreate = () => {
    setEditingBrand(null);
    setForm({ ...INITIAL_FORM });
    setModalOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setForm({
      name: brand.name,
      description: brand.description || "",
      logo_url: brand.logo_url || "",
      banner_url: brand.banner_url || "",
      cuisineInput: (brand.cuisine_types || []).join(", "),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Brand name is required.", "error");
      return;
    }

    const cuisines = form.cuisineInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      if (editingBrand) {
        const updated = await updateBrandApi(editingBrand.id, {
          name: form.name.trim(),
          description: form.description.trim() || null,
          logo_url: form.logo_url.trim() || null,
          banner_url: form.banner_url.trim() || null,
          cuisine_types: cuisines.length ? cuisines : null,
        });
        setBrands((prev) => prev.map((b) => (b.id === editingBrand.id ? { ...b, ...updated } : b)));
        showToast("Brand updated successfully.");
      } else {
        const created = await createBrandApi({
          merchant_id: merchantId,
          name: form.name.trim(),
          description: form.description.trim() || null,
          logo_url: form.logo_url.trim() || null,
          banner_url: form.banner_url.trim() || null,
          cuisine_types: cuisines.length ? cuisines : null,
        });
        setBrands((prev) => [created, ...prev]);
        showToast("Brand created successfully.");
      }
      setModalOpen(false);
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteBrandApi(deletingId);
      setBrands((prev) => prev.filter((b) => b.id !== deletingId));
      showToast("Brand deleted.");
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
    }
  };

  const filtered = brands.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      (b.description && b.description.toLowerCase().includes(q)) ||
      (b.cuisine_types && b.cuisine_types.some((c) => c.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Building02Icon} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Brand Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isMerchantOwner
                  ? "Manage all consumer-facing culinary brands under your merchant entity"
                  : "View the consumer-facing culinary brand associated with your assigned outlet"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadBrands} className="gap-1.5 text-xs">
              <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5" />
              Refresh
            </Button>
            {isMerchantOwner && (
              <Button size="sm" onClick={openCreate} className="gap-1.5 text-xs font-semibold">
                <HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />
                Create Brand
              </Button>
            )}
          </div>
        </div>

        {!isMerchantOwner && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-xs text-blue-900 dark:text-blue-200">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400"
            />
            <span>
              <strong className="font-semibold">Assigned Outlet Brand:</strong> Showing the brand
              portfolio for {branch?.name || "your outlet"}. Creating and modifying brands is
              reserved for the Merchant Owner.
            </span>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <Input
              placeholder="Search brands by name or cuisine…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
          <Badge variant="outline" className="text-xs text-muted-foreground ml-auto">
            {brands.length} {brands.length === 1 ? "Brand" : "Brands"}{" "}
            {isMerchantOwner ? "Under You" : "Total"}
          </Badge>
        </div>

        {/* Brands List */}
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
            Loading brands…
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
              <HugeiconsIcon icon={Building02Icon} className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base text-foreground">No brands found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search
                ? "No brands match your search query."
                : isMerchantOwner
                  ? "Create your first restaurant brand to organize your physical outlets and branches."
                  : "No brand identity is currently linked to this outlet."}
            </p>
            {!search && isMerchantOwner && (
              <Button size="sm" onClick={openCreate} className="mt-4 gap-1.5 text-xs font-semibold">
                <HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />
                Add Your First Brand
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <BrandCard
                key={b.id}
                brand={b}
                isMerchantOwner={isMerchantOwner}
                onEdit={openEdit}
                onDelete={(id) => {
                  setDeletingId(id);
                  setConfirmOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Brand Create/Edit Dialog */}
        <BrandDialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          editingBrand={editingBrand}
          form={form}
          onChange={(fields) => setForm((prev) => ({ ...prev, ...fields }))}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        {/* Delete Confirmation */}
        {confirmOpen && (
          <Confirm
            msg="Delete Brand"
            body="Are you sure you want to delete this brand? This action will remove the brand profile and may impact associated branches."
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
