import { useState, useEffect, useCallback } from "react";
import {
  listBranchKitchensApi,
  createKitchenApi,
  updateKitchenApi,
  deleteKitchenApi,
  toUserMessage,
  type KitchenUnit,
} from "@/api";
import { usePortal } from "@/context/PortalContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Confirm from "@/components/common/Confirm";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  KitchenUtensilsIcon,
  PlusSignIcon,
  RefreshCwIcon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { KitchenCard } from "@/components/kitchens/KitchenCard";
import { KitchenDialog, type KitchenFormData } from "@/components/kitchens/KitchenDialog";

const INITIAL_FORM: KitchenFormData = {
  name: "",
  is_active: true,
};

export default function KitchensScreen() {
  const { branch, branchId, showToast } = usePortal();
  const [kitchens, setKitchens] = useState<KitchenUnit[]>([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKitchen, setEditingKitchen] = useState<KitchenUnit | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<KitchenFormData>({ ...INITIAL_FORM });

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadKitchens = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    try {
      const data = await listBranchKitchensApi(branchId);
      setKitchens(data);
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [branchId, showToast]);

  useEffect(() => {
    void loadKitchens();
  }, [loadKitchens]);

  const openCreate = () => {
    setEditingKitchen(null);
    setForm({ ...INITIAL_FORM });
    setModalOpen(true);
  };

  const openEdit = (kitchen: KitchenUnit) => {
    setEditingKitchen(kitchen);
    setForm({
      name: kitchen.name,
      is_active: kitchen.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchId || !form.name.trim()) {
      showToast("Station name is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingKitchen) {
        const updated = await updateKitchenApi(editingKitchen.id, {
          name: form.name.trim(),
          is_active: form.is_active,
        });
        setKitchens((prev) =>
          prev.map((k) => (k.id === editingKitchen.id ? { ...k, ...updated } : k)),
        );
        showToast("Kitchen station updated.");
      } else {
        const created = await createKitchenApi({
          branch_id: branchId,
          name: form.name.trim(),
          is_active: form.is_active,
        });
        setKitchens((prev) => [...prev, created]);
        showToast("Kitchen station created.");
      }
      setModalOpen(false);
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (kitchen: KitchenUnit) => {
    const next = !kitchen.is_active;
    setKitchens((prev) => prev.map((k) => (k.id === kitchen.id ? { ...k, is_active: next } : k)));
    try {
      await updateKitchenApi(kitchen.id, { is_active: next });
      showToast(`${kitchen.name} is now ${next ? "active" : "inactive"}.`);
    } catch (err) {
      setKitchens((prev) =>
        prev.map((k) => (k.id === kitchen.id ? { ...k, is_active: kitchen.is_active } : k)),
      );
      showToast(toUserMessage(err), "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteKitchenApi(deletingId);
      setKitchens((prev) => prev.filter((k) => k.id !== deletingId));
      showToast("Kitchen station deleted.");
    } catch (err) {
      showToast(toUserMessage(err), "error");
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={KitchenUtensilsIcon} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Kitchen Management
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage cooking stations and preparation units for{" "}
                <span className="font-semibold text-foreground">
                  {branch?.name || "your branch"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadKitchens} className="gap-1.5 text-xs">
              <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5" />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreate} className="gap-1.5 text-xs font-semibold">
              <HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />
              Add Kitchen Station
            </Button>
          </div>
        </div>

        {/* Station Hierarchy Tree Info Card */}
        <Card className="border-border bg-muted/20">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-background border border-border text-muted-foreground">
                <HugeiconsIcon icon={Store01Icon} className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-foreground">{branch?.name}</span>
                <p className="text-muted-foreground">
                  {kitchens.length} prep station{kitchens.length === 1 ? "" : "s"} configured
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {kitchens.filter((k) => k.is_active).length} Active Stations
            </Badge>
          </CardContent>
        </Card>

        {/* Kitchen List */}
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
            Loading kitchen stations…
          </div>
        ) : kitchens.length === 0 ? (
          <Card className="border-dashed p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
              <HugeiconsIcon icon={KitchenUtensilsIcon} className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base text-foreground">No kitchen stations yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Set up separate prep stations (e.g. Main Kitchen, Bakery, Beverage Station) to
              organize order dispatch.
            </p>
            <Button size="sm" onClick={openCreate} className="mt-4 gap-1.5 text-xs font-semibold">
              <HugeiconsIcon icon={PlusSignIcon} className="w-3.5 h-3.5" />
              Add Your First Station
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitchens.map((k) => (
              <KitchenCard
                key={k.id}
                kitchen={k}
                onToggleActive={handleToggleActive}
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
        <KitchenDialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          editingKitchen={editingKitchen}
          form={form}
          onChange={(fields) => setForm((prev) => ({ ...prev, ...fields }))}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        {/* Delete Confirmation */}
        {confirmOpen && (
          <Confirm
            msg="Delete Kitchen Station"
            body="Are you sure you want to delete this kitchen station? Kitchen staff assigned here will need to be re-routed."
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
