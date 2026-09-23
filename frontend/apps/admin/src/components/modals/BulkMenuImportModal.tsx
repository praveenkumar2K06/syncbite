import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

interface BulkMenuImportModalProps {
  open: boolean;
  onClose: () => void;
  branchName: string;
  onImport: (
    items: Array<{ name: string; price: number; categoryName: string; isVeg: boolean }>,
  ) => Promise<void>;
}

export default function BulkMenuImportModal({
  open,
  onClose,
  branchName,
  onImport,
}: BulkMenuImportModalProps) {
  const [csvText, setCsvText] = useState(
    "Category, Dish Name, Price, Veg/NonVeg\nMain Course, Paneer Butter Masala, 180, Veg\nBeverages, Cold Coffee, 70, Veg\nQuick Bites, Chicken Roll, 120, NonVeg",
  );
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleProcess() {
    setError(null);
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      setError("Please provide at least a header row and one item row.");
      return;
    }

    const parsed: Array<{ name: string; price: number; categoryName: string; isVeg: boolean }> = [];

    // Skip first line if it looks like a header
    const dataLines =
      lines[0].toLowerCase().includes("dish") || lines[0].toLowerCase().includes("category")
        ? lines.slice(1)
        : lines;

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;
      const parts = line.split(",").map((s) => s.trim());
      if (parts.length < 3) {
        setError(
          `Line ${i + 1} has insufficient columns. Required format: Category, Name, Price, Veg/NonVeg`,
        );
        return;
      }
      const categoryName = parts[0];
      const name = parts[1];
      const price = parseFloat(parts[2]);
      const isVeg =
        (parts[3] || "veg").toLowerCase().includes("veg") &&
        !(parts[3] || "").toLowerCase().includes("non");

      if (!name || isNaN(price)) {
        setError(`Line ${i + 1} has invalid name or price.`);
        return;
      }

      parsed.push({ name, price, categoryName, isVeg });
    }

    setImporting(true);
    try {
      await onImport(parsed);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to process bulk import.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl bg-[#0f172a] text-slate-100 border border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <span>📥</span> Bulk Menu Import — {branchName}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Paste CSV or comma-separated values to batch-import dishes and categories into this
            outlet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
            Format: Category, Dish Name, Price, Veg/NonVeg
          </div>

          <textarea
            rows={8}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Category, Dish Name, Price, Veg/NonVeg"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
          />

          {error && (
            <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={importing}
            onClick={handleProcess}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors cursor-pointer flex items-center gap-2"
          >
            {importing ? "Importing…" : "Batch Import Dishes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
