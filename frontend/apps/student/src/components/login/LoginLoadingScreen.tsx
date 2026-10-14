import { LOADING_STEPS } from "./constants";

interface LoginLoadingScreenProps {
  barWidth: number;
  loadingStep: number;
  email: string;
  quip: string;
}

export function LoginLoadingScreen({
  barWidth,
  loadingStep,
  email,
  quip,
}: LoginLoadingScreenProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <div className="bg-navy flex items-center justify-between px-5 py-3 border-b-2 border-navy flex-shrink-0">
        <span className="font-impact text-xl text-cream uppercase tracking-wider">SyncBite</span>
        <div className="border-2 border-golden bg-golden/20 px-2.5 py-1">
          <span className="text-golden text-[10px] font-bold uppercase tracking-widest">
            Signing in
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-navy/10 border-b-2 border-navy/10 flex-shrink-0 overflow-hidden">
        <div
          className="h-full bg-raspberry transition-all ease-out"
          style={{ width: `${barWidth}%`, transitionDuration: "0.5s" }}
        />
      </div>

      <div className="flex-1 flex flex-col px-5 py-8 gap-6 animate-fade-up">
        <div>
          <p className="text-[10px] font-bold text-navy/30 uppercase tracking-[0.35em] mb-2">
            Authentication
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

        {/* Steps */}
        <div
          className="border-2 border-navy overflow-hidden"
          style={{ boxShadow: "4px 4px 0 #17232B" }}
        >
          {LOADING_STEPS.map((label, i) => {
            const done = i < loadingStep;
            const active = i === loadingStep;
            return (
              <div
                key={label}
                className={`flex items-center gap-3 px-4 py-3.5 border-b-2 border-navy/10 last:border-0 transition-colors duration-300 ${
                  done ? "bg-sage/10" : active ? "bg-raspberry/5" : ""
                }`}
              >
                <div
                  className="w-5 h-5 border-2 border-navy flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                  style={{
                    background: done ? "#4F8B68" : active ? "#D92D57" : "transparent",
                    borderColor: done ? "#4F8B68" : active ? "#D92D57" : "#17232B",
                  }}
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

        <div
          className="border-2 border-navy px-4 py-3 bg-cream-100"
          style={{ boxShadow: "3px 3px 0 #17232B" }}
        >
          <p className="text-[10px] text-navy/30 font-bold uppercase tracking-widest mb-0.5">
            Signing in as
          </p>
          <p className="font-impact text-navy text-lg uppercase">{email}</p>
        </div>

        <p className="font-display italic text-navy/40 text-sm">{quip}</p>

        <div className="mt-auto overflow-hidden py-2 border-t border-navy/10">
          <div className="flex whitespace-nowrap animate-ticker-h">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="text-navy/20 text-[10px] font-bold uppercase tracking-[0.3em] mx-5"
              >
                SIGNING IN · VERIFYING · SECURING ACCESS ·
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
