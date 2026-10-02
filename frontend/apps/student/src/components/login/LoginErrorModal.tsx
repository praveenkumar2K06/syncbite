interface LoginErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMsg: string;
  attemptedEmail: string;
  onRetry: () => void;
}

export function LoginErrorModal({
  isOpen,
  onClose,
  errorMsg,
  attemptedEmail,
  onRetry,
}: LoginErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(23, 35, 43, 0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-cream border-[3px] border-navy animate-scale-in select-none overflow-hidden"
        style={{ boxShadow: "8px 8px 0 #17232B" }}
      >
        {/* Top Warning Bar */}
        <div className="bg-raspberry border-b-[3px] border-navy px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-cream border-2 border-navy flex items-center justify-center -rotate-6 shadow-[2px_2px_0_#17232B]">
              <span className="text-raspberry font-black text-lg leading-none">!</span>
            </div>
            <span className="font-impact text-cream text-lg sm:text-xl uppercase tracking-wider">
              Authentication Notice
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 bg-cream border-2 border-navy text-navy font-bold text-xl flex items-center justify-center transition-all hover:bg-golden active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0_#17232B]"
            aria-label="Close error dialog"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 flex flex-col gap-4">
          {/* Badges / Pill row */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="border-2 border-navy bg-golden px-3 py-1 -rotate-2 inline-flex items-center gap-1.5"
              style={{ boxShadow: "2px 2px 0 #17232B" }}
            >
              <span className="text-navy text-[10px] font-black uppercase tracking-widest">
                Account Status
              </span>
            </div>
            <div
              className="border-2 border-navy bg-white px-2.5 py-1 rotate-1"
              style={{ boxShadow: "2px 2px 0 #17232B" }}
            >
              <span className="text-raspberry text-[10px] font-black uppercase tracking-wider">
                Action Required
              </span>
            </div>
          </div>

          {/* Big Punchline Title */}
          <div className="border-l-4 border-raspberry pl-4 py-1">
            <h2
              className="font-impact text-navy uppercase leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 5.5vw, 2.35rem)" }}
            >
              {errorMsg || "Authentication Failed"}
            </h2>
          </div>

          {/* Attempted Email Banner */}
          {attemptedEmail ? (
            <div className="border-2 border-navy bg-raspberry/10 p-3 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-raspberry text-cream flex items-center justify-center font-bold text-xs shrink-0">
                ✕
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold text-navy/50 tracking-wider">
                  Attempted Email
                </p>
                <p className="font-mono text-xs sm:text-sm font-bold text-navy truncate">
                  {attemptedEmail}
                </p>
              </div>
            </div>
          ) : null}

          {/* Explanatory Callout */}
          <div
            className="border-2 border-navy bg-cream-100 p-4 space-y-2.5"
            style={{ boxShadow: "3px 3px 0 #17232B" }}
          >
            <p className="text-xs sm:text-sm text-navy/80 font-medium leading-relaxed">
              Please check your email address and password. If you don't have an account yet, switch to the <strong>Create Account</strong> tab to register.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onRetry}
              className="w-full bg-raspberry border-2 border-navy text-cream font-impact text-xl uppercase tracking-wider py-4 transition-all duration-75 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
              style={{ boxShadow: "4px 4px 0 #17232B" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "6px 6px 0 #17232B")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "4px 4px 0 #17232B")}
            >
              <span>Try Again</span>
              <span className="text-xl">→</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-navy/40 hover:text-navy uppercase tracking-widest py-1 text-center transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
