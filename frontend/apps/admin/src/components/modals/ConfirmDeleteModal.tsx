import { AdminDialog } from "../ui/admin-dialog";

interface ConfirmDeleteModalProps {
  open: boolean;
  entityLabel: string; // e.g. "Brand" or "Branch"
  entityName: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export default function ConfirmDeleteModal({
  open,
  entityLabel,
  entityName,
  deleting,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <AdminDialog onClose={onCancel} title={`Delete ${entityLabel}?`} className="sm:max-w-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: "rgba(244,63,94,0.15)", color: "#f43f5e" }}
          >
            🗑
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{entityName}</h3>
            <p className="text-xs text-slate-400">
              This will soft-delete{" "}
              <span className="text-slate-200 font-semibold">{entityName}</span>.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          This action can be reversed only from the database. Are you sure you want to continue?
        </p>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {deleting ? "Deleting..." : `Delete ${entityLabel}`}
          </button>
        </div>
      </div>
    </AdminDialog>
  );
}
