import React from "react";
import type { MenuItem } from "@/types";

interface MultiOutletConflictModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function MultiOutletConflictModal({
  isOpen,
  onCancel,
  onConfirm,
}: MultiOutletConflictModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-cream border-2 border-navy max-w-sm w-full p-6 shadow-[6px_6px_0_#17232B]">
        <h3 className="font-impact text-2xl uppercase text-navy mb-2">Replace Current Cart?</h3>
        <p className="text-navy/70 text-sm mb-6 leading-relaxed">
          Your cart already contains items from another stall. You can only order from one food
          outlet per checkout on campus.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border-2 border-navy bg-cream text-navy font-bold text-xs uppercase tracking-wider hover:bg-cream-100 cursor-pointer"
          >
            Keep Existing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 border-2 border-navy bg-raspberry text-cream font-impact text-base uppercase tracking-wider hover:bg-navy transition-colors cursor-pointer"
          >
            Clear & Add
          </button>
        </div>
      </div>
    </div>
  );
}

interface ItemCustomizationModalProps {
  item: MenuItem | null;
  noteInput: string;
  onNoteInputChange: (val: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function ItemCustomizationModal({
  item,
  noteInput,
  onNoteInputChange,
  onCancel,
  onSave,
}: ItemCustomizationModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-cream border-2 border-navy max-w-md w-full p-6 shadow-[6px_6px_0_#17232B]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-impact text-2xl uppercase text-navy leading-none mb-1">
              Kitchen Notes
            </h3>
            <p className="text-navy/60 text-xs font-semibold">{item.name}</p>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 flex items-center justify-center border-2 border-navy text-navy font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-navy/70 mb-3">
          Special instructions for the cooks (e.g., "Less spicy", "No onions", "Extra chutney"):
        </p>

        <textarea
          rows={3}
          value={noteInput}
          onChange={(e) => onNoteInputChange(e.target.value)}
          placeholder="e.g. Extra spicy, packaging separate..."
          className="w-full p-3 border-2 border-navy bg-cream-100 text-sm text-navy placeholder:text-navy/30 focus:outline-hidden mb-5 font-sans"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border-2 border-navy bg-cream text-navy font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2.5 border-2 border-navy bg-sage text-white font-impact text-base uppercase tracking-wider hover:bg-navy transition-colors cursor-pointer"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}

interface FloatingCartBarProps {
  cartCount: number;
  cartTotal: number;
  onCheckout: () => void;
}

export function FloatingCartBar({ cartCount, cartTotal, onCheckout }: FloatingCartBarProps) {
  if (cartCount <= 0) return null;

  return (
    <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <button
        onClick={onCheckout}
        className="flex items-center gap-4 bg-raspberry text-cream px-6 py-4 border-2 border-navy shadow-[4px_4px_0_#17232B] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#17232B] transition-all duration-75 cursor-pointer"
      >
        <div className="bg-navy w-7 h-7 flex items-center justify-center text-sm font-bold text-cream border border-cream/20">
          {cartCount}
        </div>
        <span className="font-impact text-lg tracking-wider uppercase">View Cart</span>
        <span className="font-bold text-golden">₹{cartTotal}</span>
        <span>→</span>
      </button>
    </div>
  );
}
