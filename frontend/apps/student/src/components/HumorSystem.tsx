import { createContext, useCallback, useContext, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export type HumorEvent =
  | "excessive-scroll"
  | "erratic-scroll"
  | "homepage-inactive"
  | "nav-back-forward"
  | "restaurant-revisit"
  | "long-browse-no-order"
  | "add-remove-same-item"
  | "empty-cart-open"
  | "large-quantity"
  | "return-after-inactivity"
  | "order-complete"
  | "reached-bottom";

const MESSAGES: Record<HumorEvent, string> = {
  "excessive-scroll": "Don't tear me down, bro. There's food up here too.",
  "erratic-scroll": "Are we exploring or having an existential crisis?",
  "homepage-inactive": "The food isn't going to choose itself.",
  "nav-back-forward": "Commitment issues detected.",
  "restaurant-revisit": "You've visited this stall more than your actual classes.",
  "long-browse-no-order": "At this point, you're not hungry. You're conducting research.",
  "add-remove-same-item": "Are we ordering or negotiating?",
  "empty-cart-open": "This cart has trust issues.",
  "large-quantity": "Planning a feast or feeding the entire hostel?",
  "return-after-inactivity": "Welcome back. We saved your seat.",
  "order-complete": "Order locked in. Your future self will thank you.",
  "reached-bottom": "Congratulations. You found the bottom of the internet.",
};

// raspberry bg = warm color; golden bg = cool
const RASPBERRY_EVENTS = new Set<HumorEvent>([
  "excessive-scroll",
  "homepage-inactive",
  "restaurant-revisit",
  "add-remove-same-item",
  "large-quantity",
  "order-complete",
]);

const SESSION_KEY = "sat_humor";
const MAX_PER_SESSION = 3;
const COOLDOWN_MS = 45_000;

interface SessionState {
  count: number;
  lastFired: Record<string, number>;
}

function readSession(): SessionState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as SessionState;
  } catch {
    // ignore
  }
  return { count: 0, lastFired: {} };
}

function writeSession(s: SessionState) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    // ignore
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

interface HumorCtx {
  trigger: (event: HumorEvent) => void;
}

const HumorContext = createContext<HumorCtx>({ trigger: () => {} });

export function useHumor(): HumorCtx {
  return useContext(HumorContext);
}

// ── Toast UI ─────────────────────────────────────────────────────────────────

interface ToastState {
  id: number;
  message: string;
  raspberry: boolean;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function HumorProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const counterRef = useRef(0);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback((event: HumorEvent) => {
    const now = Date.now();
    const session = readSession();

    // Max per session
    if (session.count >= MAX_PER_SESSION) return;

    // Cooldown per event type
    const lastFiredAt = session.lastFired[event] ?? 0;
    if (now - lastFiredAt < COOLDOWN_MS) return;

    // Update session
    session.count += 1;
    session.lastFired[event] = now;
    writeSession(session);

    // Show toast
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    counterRef.current += 1;
    const id = counterRef.current;
    setToast({
      id,
      message: MESSAGES[event],
      raspberry: RASPBERRY_EVENTS.has(event),
    });

    dismissTimerRef.current = setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3800);
  }, []);

  return (
    <HumorContext.Provider value={{ trigger }}>
      {children}
      {toast && (
        <div
          key={toast.id}
          className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:max-w-xs z-50 animate-fade-up"
        >
          <div
            className="border-2 border-navy shadow-[3px_3px_0_#17232B] -rotate-[0.5deg] px-4 py-3 flex items-start justify-between gap-3"
            style={
              toast.raspberry
                ? { backgroundColor: "#D92D57", color: "#ffffff" }
                : { backgroundColor: "#E8B84A", color: "#17232B" }
            }
          >
            <span className="font-semibold text-sm leading-snug">{toast.message}</span>
            <button
              onClick={() => {
                if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
                setToast(null);
              }}
              className="flex-shrink-0 text-base font-bold opacity-70 hover:opacity-100 leading-none"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </HumorContext.Provider>
  );
}
