# @syncbite/student — Customer App

The customer-facing food-ordering SPA. Talks to the `syncbite_backend` backend and **falls back to rich mock data when the backend is unreachable**, so the UI stays usable offline. Dev server runs on port **8443** (`http://localhost:8443`).

Monorepo-wide conventions (imports, API client, env/proxy, styling, commands) live in the root `AGENTS.md` — read that first. This file covers only student-app specifics.

## Run

```bash
pnpm --filter @syncbite/student dev       # from repo root
# or: cd apps/student && pnpm dev
```

Hot reload is on. Copy `.env.example` → `.env` before running; `VITE_GOOGLE_CLIENT_ID` is used for Google sign-in.

## Structure

- `src/main.tsx` — entrypoint; imports `index.css` and mounts `App.tsx` into `#root`.
- `src/App.tsx` — React Router route tree (`createBrowserRouter`), lazy-loaded screens, `HumorProvider` + `AppProvider`, and the `ProtectedRoute` gate.
- `src/context/AppContext.tsx` — the app-wide store: auth, restaurants, cart, orders, order mode, polling, and the platform-freeze kill switch. Read/write app state through `useAppContext()`.
- `src/api/` — typed backend modules created on the shared client (`client.ts` plus `auth`, `branches`, `cart`, `checkout`, `coupons`, `orders`, `reviews`, `search`; `index.ts` is the barrel). Includes adapters that map backend DTOs to UI types.
- `src/components/` — feature folders (`home`, `browse`, `restaurant`, `checkout`, `confirmation`, `orders`, `profile`, `login`) plus shells (`AppLayout`, `Navbar`, `BottomNav`, `CartBar`, `ProtectedRoute`, `PageSkeletonLoader`, `ScrollToTop`, `icons.tsx`, `HumorSystem.tsx`).
- `src/pages/` — one screen per route: `HomePage`, `BrowsePage`, `RestaurantPage`, `CheckoutPage`, `ConfirmationPage`, `OrdersPage`, `ProfilePage`, `LoginPage`.
- `src/data.ts` — frontend-only UI config (time slots, date tabs); not backend data.
- `src/types.ts` — the app's UI-facing types.
- `src/index.css` — global CSS + Tailwind v4 import and theme tokens.
- `src/imports/pasted_text/` — design briefs kept for reference; not code.

## Conventions

- Provider order matters: `HumorProvider` wraps `AppProvider` wraps the router.
- Route screens are lazy-loaded; keep the `Suspense` boundary in `App.tsx` when adding routes.
- The auth gate is split: `LoginRoute` redirects signed-in users away from `/login`, and `ProtectedRoute` guards `browse`, `restaurant/:id`, `checkout`, `confirmation/:orderId`, `orders`, and `profile`.
- Cart and order mutations are optimistic-first, then reconciled with the backend; keep UI state in `AppContext` rather than duplicating it in screens.
- The mock-data fallback is deliberate — don't remove it or turn unreachable-backend states into hard errors.
- Aesthetic is intentionally "retro-brutalist campus": Tailwind utilities live directly in JSX; global/theme CSS belongs in `index.css`.
