import React, { useEffect, useState } from "react";

export const STEP_LABELS = [
  "Verifying payment",
  "Talking to the kitchen",
  "Bypassing the queue",
  "Locking in your order",
];

interface PaymentSplashProps {
  stage: "processing" | "secured" | "launch";
  total: number;
  restaurantName: string;
}

export function PaymentSplash({ stage, total, restaurantName }: PaymentSplashProps) {
  const [step, setStep] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  // Advance steps + progress bar during processing
  useEffect(() => {
    if (stage !== "processing") return;
    const targets = [22, 48, 72, 92];
    const timers: ReturnType<typeof setTimeout>[] = [];
    targets.forEach((w, i) => {
      timers.push(
        setTimeout(
          () => {
            setBarWidth(w);
            setStep(i);
          },
          200 + i * 430,
        ),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  // Fill bar to 100 when secured
  useEffect(() => {
    if (stage === "secured" || stage === "launch") setBarWidth(100);
  }, [stage]);

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-cream flex flex-col">
      {/* ── TOP BAND ── */}
      <div className="bg-navy border-b-2 border-navy flex items-center justify-between px-5 py-3 flex-shrink-0">
        <span className="font-impact text-xl text-cream uppercase tracking-wider">SyncBite</span>
        <span className="border-2 border-cream/20 text-cream/50 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
          {stage === "processing" ? "Processing" : "Confirmed"}
        </span>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="flex-shrink-0 h-2 bg-navy/10 border-b-2 border-navy/10 overflow-hidden">
        <div
          className="h-full bg-raspberry transition-all ease-out"
          style={{ width: `${barWidth}%`, transitionDuration: barWidth === 100 ? "0.4s" : "0.5s" }}
        />
      </div>

      {/* ── PROCESSING STAGE ── */}
      {stage === "processing" && (
        <div className="flex-1 flex flex-col px-5 py-8 gap-6 animate-fade-up">
          {/* Big headline */}
          <div>
            <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.35em] mb-2">
              Payment in progress
            </p>
            <h1
              className="font-impact text-navy uppercase leading-[0.88]"
              style={{ fontSize: "clamp(3rem, 13vw, 6rem)" }}
            >
              One
              <br />
              moment.
            </h1>
          </div>

          {/* Steps list */}
          <div
            className="border-2 border-navy overflow-hidden"
            style={{ boxShadow: "4px 4px 0 #17232B" }}
          >
            {STEP_LABELS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 px-4 py-3.5 border-b-2 border-navy/10 last:border-0 transition-colors duration-300 ${
                    done ? "bg-sage/10" : active ? "bg-raspberry/5" : ""
                  }`}
                >
                  <div
                    className={`w-5 h-5 border-2 border-navy flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      done
                        ? "bg-sage border-sage"
                        : active
                          ? "bg-raspberry border-raspberry"
                          : "bg-cream"
                    }`}
                  >
                    {done && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <polyline
                          points="1,4 4,7 9,1"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {active && <div className="w-2 h-2 bg-cream animate-pulse-dot" />}
                  </div>
                  <span
                    className={`text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                      done ? "text-sage" : active ? "text-raspberry" : "text-navy/25"
                    }`}
                  >
                    {label}
                  </span>
                  {active && (
                    <span className="ml-auto text-[10px] font-bold text-raspberry/60 uppercase tracking-wider animate-pulse-dot">
                      In progress
                    </span>
                  )}
                  {done && (
                    <span className="ml-auto text-[10px] font-bold text-sage/60 uppercase tracking-wider">
                      Done
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Order summary card */}
          <div
            className="border-2 border-navy px-4 py-3 flex items-center justify-between bg-cream-100"
            style={{ boxShadow: "3px 3px 0 #17232B" }}
          >
            <div>
              <p className="text-[10px] text-navy/30 font-bold uppercase tracking-widest mb-0.5">
                Order from
              </p>
              <p className="font-impact text-navy text-xl uppercase">{restaurantName}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-navy/30 font-bold uppercase tracking-widest mb-0.5">
                Amount
              </p>
              <p className="font-impact text-raspberry text-xl">₹{total}</p>
            </div>
          </div>

          {/* Scrolling ticker */}
          <div className="mt-auto border-2 border-navy/15 overflow-hidden py-2">
            <div className="flex whitespace-nowrap animate-ticker-h">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="text-navy/20 text-[10px] font-bold uppercase tracking-[0.3em] mx-5"
                >
                  SECURING ORDER · TALKING TO KITCHEN · LOCKING IN ·
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SECURED / LAUNCH STAGE ── */}
      {(stage === "secured" || stage === "launch") && (
        <div className="flex-1 flex flex-col px-5 py-8 gap-5">
          <div className="animate-slam-in">
            <p className="text-[10px] font-bold text-sage uppercase tracking-[0.35em] mb-2">
              Order confirmed
            </p>
            <h1
              className="font-impact uppercase leading-[0.88]"
              style={{ fontSize: "clamp(3.5rem, 15vw, 7rem)" }}
            >
              <span className="text-navy block">Order</span>
              <span className="text-raspberry block">Locked</span>
              <span className="text-navy block">In.</span>
            </h1>
          </div>

          {/* Order card — brutalist */}
          <div
            className="border-2 border-navy overflow-hidden animate-fade-up"
            style={{ boxShadow: "5px 5px 0 #17232B", animationDelay: "0.2s" }}
          >
            <div className="bg-navy px-4 py-3 flex items-center justify-between">
              <span className="font-impact text-cream text-lg uppercase tracking-wider">
                {restaurantName}
              </span>
              <span className="bg-sage border border-sage text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />
                Preparing
              </span>
            </div>
            <div className="divide-y-2 divide-navy/10 bg-cream">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-navy/40 text-xs font-bold uppercase tracking-wider">
                  Amount Paid
                </span>
                <span className="font-impact text-raspberry text-2xl">₹{total}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-navy/40 text-xs font-bold uppercase tracking-wider">
                  Status
                </span>
                <span className="font-bold text-sage text-sm uppercase tracking-wider">
                  Confirmed ✓
                </span>
              </div>
            </div>
          </div>

          {/* Big sticker badge */}
          <div
            className="animate-fade-up self-start border-2 border-navy bg-golden px-4 py-2 -rotate-1"
            style={{ boxShadow: "3px 3px 0 #17232B", animationDelay: "0.35s" }}
          >
            <span className="font-impact text-navy text-lg uppercase tracking-wider">
              {stage === "launch" ? "Taking you there →" : "Kitchen notified!"}
            </span>
          </div>

          {/* Decorative brutalist grid */}
          <div
            className="mt-auto grid grid-cols-4 gap-0 border-2 border-navy/10 overflow-hidden animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            {["SKIP", "THE", "WAIT.", "EAT"].map((word, i) => (
              <div
                key={word}
                className={`py-3 flex items-center justify-center border-r-2 border-navy/10 last:border-0 ${
                  i === 2 ? "bg-raspberry/10" : ""
                }`}
              >
                <span
                  className={`font-impact text-xs uppercase tracking-wider ${i === 2 ? "text-raspberry" : "text-navy/25"}`}
                >
                  {word}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
