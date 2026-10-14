import { useState, useEffect, useCallback, useMemo } from "react";
import {
  createBranchApi,
  updateBranchApi,
  setBranchOpenApi,
  deleteBranchApi,
  getMerchantOwnerBrandsAndBranchesApi,
  getBranchApi,
  getBrandApi,
  toUserMessage,
  type Branch,
  type Brand,
} from "@/api";
import { usePortal } from "@/context/PortalContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Confirm from "@/components/common/Confirm";
import { fromTimeInput, toTimeInput } from "@/lib/portal";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01Icon,
  PlusSignIcon,
  RefreshCwIcon,
  Search01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { BranchCard } from "@/components/branches/BranchCard";
import { BranchDialog, type BranchFormData } from "@/components/branches/BranchDialog";

const INITIAL_FORM: BranchFormData = {
  brand_id: "",
  name: "",
  address_text: "",
  latitude: "12.9716",
  longitude: "79.1586",
  opening_time: "08:00",
  closing_time: "23:00",
  is_active: true,
};

export default function BranchesScreen() {
  const { branchId: currentBranchId, loadPortal, setOpen, showToast, user } = usePortal();
  const isMerchantOwner = user?.role === "MerchantOwner";
  const assignedOutletId = user?.branch_id || currentBranchId;
  const [branches, setBranches] = useState<Branch[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Create / Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<BranchFormData>({ ...INITIAL_FORM });

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (isMerchantOwner) {
        const { brands: ownedBrands, branches: ownedBranches } =
          await getMerchantOwnerBrandsAndBranchesApi(user?.id);
        setBranches(ownedBranches);
        setBrands(ownedBrands);
      } else {
        const targetId = assignedOutletId;
        if (targetId) {
          const branchRecord = await getBranchApi(targetId).catch(() => null);
          if (branchRecord) {
            setBranches([branchRecord]);
            const brandRecord = await getBrandApi(branchRecord.brand_id).catch(() => null);
            setBrands(brandRecord ? [brandRecord] : []);
          } else {
            setBranches([]);
            setBrands([]);
          }
        } else {
          setBranches([]);
          setBrands([]);
        }
      }
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, isMerchantOwner, user?.id, assignedOutletId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openCreate = () => {
    if (!isMerchantOwner) {
      showToast("Only a Merchant Owner can create new branches.", "error");
      return;
    }
    setEditingBranch(null);
    setForm({
      ...INITIAL_FORM,
      brand_id: brands[0]?.id || "",
    });
    setModalOpen(true);
  };

  const openEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setForm({
      brand_id: branch.brand_id,
      name: branch.name,
      address_text: branch.address_text,
      latitude: branch.latitude !== null ? String(branch.latitude) : "",
      longitude: branch.longitude !== null ? String(branch.longitude) : "",
      opening_time: toTimeInput(branch.opening_time),
      closing_time: toTimeInput(branch.closing_time),
      is_active: branch.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address_text.trim()) {
      showToast("Branch name and address are required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingBranch) {
        const updated = await updateBranchApi(editingBranch.id, {
          name: form.name.trim(),
          address_text: form.address_text.trim(),
          opening_time: fromTimeInput(form.opening_time),
          closing_time: fromTimeInput(form.closing_time),
        });
        if (form.is_active !== editingBranch.is_active) {
          await setBranchOpenApi(editingBranch.id, form.is_active);
        }
        setBranches((prev) =>
          prev.map((b) =>
            b.id === editingBranch.id
              ? {
                  ...b,
                  ...updated,
                  is_active: form.is_active,
                }
              : b,
          ),
        );
        showToast("Branch updated successfully.");
      } else {
        if (!form.brand_id) {
          showToast("Please select a brand for this branch.", "error");
          return;
        }
        const created = await createBranchApi({
          brand_id: form.brand_id,
          name: form.name.trim(),
          address_text: form.address_text.trim(),
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
          opening_time: fromTimeInput(form.opening_time),
          closing_time: fromTimeInput(form.closing_time),
          is_active: form.is_active,
        });
        setBranches((prev) => [created, ...prev]);
        showToast("Branch created successfully.");
      }
      setModalOpen(false);
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (branch: Branch) => {
    const nextStatus = !branch.is_active;
    setBranches((prev) =>
      prev.map((b) => (b.id === branch.id ? { ...b, is_active: nextStatus } : b)),
    );

    if (branch.id === currentBranchId) {
      const updated = await setOpen(nextStatus);
      if (!updated) {
        setBranches((prev) =>
          prev.map((b) => (b.id === branch.id ? { ...b, is_active: branch.is_active } : b)),
        );
      }
      return;
    }

    try {
      await setBranchOpenApi(branch.id, nextStatus);
      showToast(`${branch.name} is now ${nextStatus ? "online" : "offline"}.`);
    } catch (err) {
      setBranches((prev) =>
        prev.map((b) => (b.id === branch.id ? { ...b, is_active: branch.is_active } : b)),
      );
      showToast(toUserMessage(err), "error");
    }
  };

  const handleSelectBranch = (id: string) => {
    loadPortal(id);
    showToast("Active branch switched.");
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteBranchApi(deletingId);
      setBranches((prev) => prev.filter((b) => b.id !== deletingId));
      showToast("Branch deleted.");
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
    }
  };

  const filtered = useMemo(() => {
    return branches.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.address_text.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && b.is_active) ||
        (statusFilter === "inactive" && !b.is_active);
      return matchSearch && matchStatus;
    });
  }, [branches, search, statusFilter]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={Store01Icon} className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Branch Outlets
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Manage physical campus outlets, opening hours, coordinates and active status
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadData} className="gap-1.5 text-xs">
              <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5" />
              Refresh
            </Button>
            {isMerchantOwner && (
              <Button size="sm" onClick={openCreate} className="gap-1.5 text-xs font-semibold">
                <HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />
                Create Branch
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
              <strong className="font-semibold">Assigned Outlet:</strong> You are operating your
              assigned physical outlet location ({branches[0]?.name || "Current Outlet"}). Store
              expansion and branch management are controlled by your Merchant Owner.
            </span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <Input
              placeholder="Search branches by name or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border p-0.5 bg-muted/40 text-xs">
              {(["all", "active", "inactive"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setStatusFilter(mode)}
                  className={`px-3 py-1 rounded text-xs capitalize transition-colors ${
                    statusFilter === mode
                      ? "bg-card text-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Branches Grid */}
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
            Loading branches…
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
              <HugeiconsIcon icon={Store01Icon} className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base text-foreground">No branches found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search
                ? "No branches match your search criteria."
                : isMerchantOwner
                  ? "No physical branches have been created under your brands yet."
                  : "No physical branch is assigned to your account."}
            </p>
            {!search && isMerchantOwner && (
              <Button size="sm" onClick={openCreate} className="mt-4 gap-1.5 text-xs font-semibold">
                <HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />
                Add Your First Branch
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <BranchCard
                key={b.id}
                branch={b}
                brand={brands.find((item) => item.id === b.brand_id)}
                isCurrent={b.id === currentBranchId}
                isMerchantOwner={isMerchantOwner}
                onSelect={handleSelectBranch}
                onToggleStatus={handleToggleStatus}
                onEdit={openEdit}
                onDelete={(id) => {
                  setDeletingId(id);
                  setConfirmOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Create / Edit Dialog */}
        <BranchDialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          editingBranch={editingBranch}
          brands={brands}
          form={form}
          onChange={(fields) => setForm((prev) => ({ ...prev, ...fields }))}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        {/* Delete Confirmation */}
        {confirmOpen && (
          <Confirm
            msg="Delete Branch"
            body="Are you sure you want to deactivate and remove this branch outlet? Active orders and kitchen queues may be affected."
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
