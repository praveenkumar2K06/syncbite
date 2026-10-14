import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import {
  getBannersApi,
  createBannerApi,
  deleteBannerApi,
  type BannerResponse,
  type BannerCreate,
} from "../api/admin";
import BannerHeader from "./banners/BannerHeader";
import BannerCardsGrid from "./banners/BannerCardsGrid";
import BannerPreviewModal from "./banners/BannerPreviewModal";
import BannerCreateModal, { type BannerCreateModalState } from "./banners/BannerCreateModal";

interface BannersTabProps {
  onShowToast: (msg: string, type: "success" | "error") => void;
}

export default function BannersTab({ onShowToast }: BannersTabProps) {
  const [banners, setBanners] = useState<BannerResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const loadRequestId = useRef(0);
  const [previewBanner, setPreviewBanner] = useState<BannerResponse | null>(null);

  // Create Modal
  const [createModal, setCreateModal] = useState<BannerCreateModalState>({
    open: false,
    title: "",
    image_url: "",
    target_url: "",
    display_order: 0,
    is_active: true,
    schedule_start: "",
    schedule_end: "",
    submitting: false,
  });

  const loadBanners = useCallback(async () => {
    const requestId = ++loadRequestId.current;
    setLoading(true);
    try {
      const data = await getBannersApi();
      if (Array.isArray(data)) {
        if (requestId === loadRequestId.current) setBanners(data);
      } else {
        if (requestId === loadRequestId.current) setBanners([]);
      }
    } catch {
      if (requestId === loadRequestId.current) onShowToast("Could not load banners.", "error");
    } finally {
      if (requestId === loadRequestId.current) setLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    loadBanners();
    return () => {
      loadRequestId.current += 1;
    };
  }, [loadBanners]);

  const handleCreateBanner = async (e: FormEvent) => {
    e.preventDefault();
    if (!createModal.title.trim()) {
      onShowToast("Banner title is required.", "error");
      return;
    }
    if (!createModal.image_url.trim()) {
      onShowToast("Banner image URL is required.", "error");
      return;
    }

    setCreateModal((prev) => ({ ...prev, submitting: true }));
    try {
      const payload: BannerCreate = {
        title: createModal.title.trim(),
        image_url: createModal.image_url.trim(),
        target_url: createModal.target_url.trim() || null,
        display_order: createModal.display_order,
        is_active: createModal.is_active,
      };

      const res = await createBannerApi(payload);

      setBanners((prev) => [res, ...prev]);
      onShowToast(`Banner "${res.title}" created successfully! ✓`, "success");
      setCreateModal({
        open: false,
        title: "",
        image_url: "",
        target_url: "",
        display_order: 0,
        is_active: true,
        schedule_start: "",
        schedule_end: "",
        submitting: false,
      });
    } catch {
      onShowToast("Failed to create banner.", "error");
      setCreateModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    try {
      await deleteBannerApi(bannerId);
      setBanners((prev) => prev.filter((b) => b.id !== bannerId));
      onShowToast("Banner deleted successfully.", "success");
    } catch {
      onShowToast("Could not delete banner.", "error");
    }
  };

  const handleToggleActive = (banner: BannerResponse) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, is_active: !b.is_active } : b)),
    );
    onShowToast(`Banner is now ${!banner.is_active ? "ACTIVE" : "INACTIVE"}.`, "success");
  };

  const handleModalFieldChange = <K extends keyof BannerCreateModalState>(
    key: K,
    value: BannerCreateModalState[K],
  ) => {
    setCreateModal((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <BannerHeader
        bannersCount={banners.length}
        onOpenCreateModal={() =>
          setCreateModal((prev) => ({
            ...prev,
            open: true,
            title: "",
            image_url: "",
            target_url: "",
            display_order: banners.length + 1,
            is_active: true,
          }))
        }
        onRefresh={loadBanners}
      />

      <BannerCardsGrid
        loading={loading}
        banners={banners}
        onPreviewBanner={setPreviewBanner}
        onToggleActive={handleToggleActive}
        onDeleteBanner={handleDeleteBanner}
      />

      <BannerPreviewModal banner={previewBanner} onClose={() => setPreviewBanner(null)} />

      <BannerCreateModal
        modal={createModal}
        onClose={() => setCreateModal((prev) => ({ ...prev, open: false }))}
        onChangeField={handleModalFieldChange}
        onSubmit={handleCreateBanner}
      />
    </div>
  );
}
