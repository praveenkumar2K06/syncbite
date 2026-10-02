import React from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.SubmitEvent) => void;
  name: string;
  onNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function ProfileModal({
  isOpen,
  onClose,
  onSubmit,
  name,
  onNameChange,
  phone,
  onPhoneChange,
  inputRef,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: "rgba(14,26,32,0.85)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full md:max-w-sm animate-slide-up">
        <div
          className="bg-cream border-t-2 md:border-2 border-navy"
          style={{ boxShadow: "5px 5px 0 #BCFF4F" }}
        >
          {/* Picker header */}
          <div className="bg-navy flex items-center justify-between px-5 py-3.5 border-b-2 border-cream/10">
            <p className="font-bold text-cream text-sm uppercase tracking-wider leading-none">
              Profile Details
            </p>
            <button
              onClick={onClose}
              className="text-cream/40 hover:text-cream font-bold text-lg transition-colors w-7 h-7 flex items-center justify-center border border-cream/10"
            >
              ×
            </button>
          </div>

          <form onSubmit={onSubmit} className="px-5 py-5 space-y-4">
            <div>
              <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block mb-1.5">
                Your Name
              </label>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="John Doe"
                className="w-full border-2 border-navy bg-cream px-3 py-3 text-sm font-medium text-navy placeholder:text-navy/20 focus:outline-none focus:border-raspberry transition-colors"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full border-2 border-navy bg-cream px-3 py-3 text-sm font-medium text-navy placeholder:text-navy/20 focus:outline-none focus:border-raspberry transition-colors"
                autoComplete="tel"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-raspberry border-2 border-navy text-cream font-impact text-xl uppercase tracking-wider py-3.5 transition-all duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
              style={{ boxShadow: "3px 3px 0 #17232B" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "5px 5px 0 #17232B")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "3px 3px 0 #17232B")}
            >
              Sign In →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
