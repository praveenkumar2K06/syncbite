export function ScatterBlocks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* Big raspberry rect — top right, tilted */}
      <div className="absolute -top-6 -right-8 w-40 h-28 bg-raspberry border-2 border-navy opacity-90 rotate-6" />
      {/* Golden block — left mid */}
      <div className="absolute top-1/3 -left-6 w-16 h-20 bg-golden border-2 border-navy -rotate-3" />
      {/* Lime rect — bottom left */}
      <div
        className="absolute bottom-24 -left-4 w-24 h-12 border-2 border-navy rotate-2"
        style={{ background: "#BCFF4F" }}
      />
      {/* Sage block — bottom right */}
      <div className="absolute bottom-16 -right-4 w-20 h-16 bg-sage border-2 border-navy -rotate-6 opacity-80" />
      {/* Small raspberry square */}
      <div className="absolute top-1/2 right-3 w-8 h-8 bg-raspberry border-2 border-navy rotate-12" />
      {/* Golden dot */}
      <div className="absolute top-1/4 left-8 w-5 h-5 bg-golden border-2 border-navy -rotate-6" />
      {/* Navy bordered empty box */}
      <div className="absolute top-16 right-16 w-10 h-10 border-2 border-navy/20 rotate-3" />
      {/* Lime line bars */}
      <div className="absolute bottom-40 right-5 space-y-1.5">
        <div
          className="w-8 h-1.5 rotate-1 border border-navy/20"
          style={{ background: "#BCFF4F" }}
        />
        <div
          className="w-5 h-1.5 -rotate-1 border border-navy/20"
          style={{ background: "#BCFF4F" }}
        />
        <div
          className="w-6 h-1.5 rotate-2 border border-navy/20"
          style={{ background: "#BCFF4F" }}
        />
      </div>
    </div>
  );
}

export function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginHeader() {
  return (
    <div className="relative z-10 bg-navy flex items-center justify-between px-5 py-4 border-b-2 border-navy flex-shrink-0">
      <span className="font-impact text-2xl text-cream uppercase tracking-wider">SyncBite</span>
      <div
        className="border-2 border-golden bg-golden px-2.5 py-1 -rotate-1"
        style={{ boxShadow: "2px 2px 0 #17232B" }}
      >
        <span className="text-navy text-[10px] font-bold uppercase tracking-widest">
          Food & Fun Synced
        </span>
      </div>
    </div>
  );
}

export function LoginHero({ tagline }: { tagline: string }) {
  return (
    <div className="relative z-10 px-5 pt-8 pb-4">
      {/* Tagline sticker */}
      <div
        className="inline-block border-2 border-golden bg-golden px-3 py-1 mb-5 rotate-1"
        style={{ boxShadow: "3px 3px 0 rgba(255,253,248,0.3)" }}
      >
        <span className="font-display italic text-navy text-xs font-bold">{tagline}</span>
      </div>

      {/* Headline */}
      <div className="mb-2">
        <div className="inline-block relative mb-1">
          <span
            className="font-impact text-navy uppercase block leading-[0.88]"
            style={{ fontSize: "clamp(3.8rem, 17vw, 8rem)" }}
          >
            Sign in.
          </span>
        </div>
        {/* "EAT." — on raspberry block */}
        <div className="relative inline-block mb-1">
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-raspberry/60" />
          <span
            className="relative font-impact uppercase block leading-[0.88] text-cream px-2"
            style={{ fontSize: "clamp(3.8rem, 17vw, 8rem)", background: "#D92D57" }}
          >
            Eat.
          </span>
        </div>
        <div>
          <span
            className="font-impact uppercase block leading-[0.88]"
            style={{ fontSize: "clamp(3.8rem, 17vw, 8rem)", color: "#BCFF4F" }}
          >
            Repeat.
          </span>
        </div>
      </div>

      <p className="font-display italic text-navy/40 text-sm mt-3">
        One click. Your food. No queue.
      </p>
    </div>
  );
}

export function LoginFooterTicker() {
  return (
    <div className="relative z-10 overflow-hidden border-t-2 border-navy/10 py-2.5 mt-4">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="text-navy/20 text-[10px] font-bold uppercase tracking-[0.3em] mx-6"
          >
            CRAVE IT · SYNC WITH GAMES & MOVIES · ZERO QUEUE · HOT ON TIME ·
          </span>
        ))}
      </div>
    </div>
  );
}
