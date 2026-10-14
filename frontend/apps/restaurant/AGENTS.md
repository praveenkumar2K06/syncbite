# @syncbite/restaurant — Merchant Portal

The restaurant/merchant SPA: dashboard, orders board, menu & inventory management, kitchens, branches/brands, finances, subscription, notifications, and settings. Dev server runs on port **8444** (`http://localhost:8444`).

Monorepo-wide conventions (imports, API client, env/proxy, styling, commands) live in the root `AGENTS.md` — read that first. This file covers only restaurant-app specifics.

## Run

```bash
pnpm --filter @syncbite/restaurant dev    # from repo root
# or: cd apps/restaurant && pnpm dev
```

Copy `.env.example` → `.env` before running. `VITE_BRANCH_ID` optionally pins the portal to a single outlet; otherwise the outlet is resolved from the signed-in manager account (plus a local cache) because the backend has no "my branch" endpoint.

## Structure

- `src/main.tsx` — entrypoint; imports `index.css` and mounts `App.tsx` into `#root`.
- `src/App.tsx` — React Router tree, lazy screens, and the auth/session boot flow. It wires page-level hooks (`useRestaurantPortal`, `useMenu`, `useBranchSettings`, `useOrdersContext`) into screens.
- `src/context/PortalContext.tsx` — portal-wide state (session boot, branch, user, toast). Access via `usePortal()`.
- `src/context/OrdersContext.tsx` — order board state and actions (advance/cancel/refresh, busy flags, active count); polls for new work (`ORDER_POLL_MS` in `constants.ts`). Access via `useOrdersContext()`.
- `src/hooks/` — `useRestaurantPortal`, `useMenu`, `useOrders`, `useBranchSettings` (barrel in `index.ts`).
- `src/api/` — `client.ts` (shared client with restaurant token keys) plus `restaurant.ts`; `index.ts` is the barrel.
- `src/lib/` — `portal.ts` (portal domain helpers/types), `orderUtils.ts`, `orderViewSettings.ts`, `kitchenAudio.ts`, `utils.ts`.
- `src/components/` — feature folders (`home`, `orders`, `menu`, `categories`, `inventory`, `kitchens`, `branches`, `brands`, `finances`, `subscription`, `merchant`, `notifications`, `settings`), `layout/`, `common/`, and `ui/` primitives.
- `src/pages/` — one `*Screen.tsx` per route (`HomeScreen`, `OrdersScreen`, `MenuScreen`, `CategoriesScreen`, `InventoryScreen`, `KitchensScreen`, `BranchesScreen`, `BrandsScreen`, `FinancesScreen`, `SubscriptionScreen`, `MerchantScreen`, `NotificationsScreen`, `SettingsScreen`, `LoginScreen`, `BranchSetupNotice`).
- `src/types.ts`, `src/constants.ts`, `src/config.ts` — route/nav types, shared UI constants (incl. `GLOBAL_CSS`, `ORDER_POLL_MS`), and env-driven config.
- `src/imports/pasted_text/` — portal design specs kept for reference; not code.

## Conventions

- Never start a dev server for a "Figma Make" preview — that scaffolding is gone. Use the commands above.
- The router is defined once in `App.tsx` with one route component per screen; guards (`LoginRoute` / `ProtectedLayout`) enforce session boot states (`restoring` / `signed-out` / `signed-in`). Merchant owners see all branches; other users must have an assigned branch.
- Route composables are deliberately thin: pages read state from `usePortal()` / `useOrdersContext()` and delegate mutations to the hooks — keep new pages on that pattern.
- Orders: optimistic advance/cancel with `busyOrderId` guards and optimistic polling; keep the 20s poll interval and sound-alert behavior in mind.
- Reuse `src/components/ui/*` and `src/components/common/*` primitives (Base UI + `class-variance-authority` + `cn`, sonner toasts) instead of bespoke controls.
