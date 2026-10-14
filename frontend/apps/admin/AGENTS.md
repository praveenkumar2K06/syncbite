# @syncbite/admin — Platform Admin Dashboard

The platform operator console: overview KPIs, analytics, merchants/brands/branches, menu & categories, onboarding, customers, orders, payments & refunds, banners, subscriptions, notifications, feature flags, and audit logs. Dev server runs on port **8445** (`http://localhost:8445`).

Monorepo-wide conventions (imports, API client, env/proxy, styling, commands) live in the root `AGENTS.md` — read that first. This file covers only admin-app specifics.

## Run

```bash
pnpm --filter @syncbite/admin dev         # from repo root
# or: cd apps/admin && pnpm dev
```

Copy `.env.example` → `.env` before running. `VITE_RESTAURANT_PORTAL_URL` is printed onto generated manager credential files, so it must match the deployed restaurant portal.

## Structure

- `src/main.tsx` — entrypoint; imports `index.css` and mounts `App.tsx` into `#root`.
- `src/App.tsx` — React Router tree: `/login` plus a nested `/dashboard/*` tree of lazy-loaded pages behind `ProtectedRoute`.
- `src/pages/` — `LoginPage`, `Dashboard` (shell with sidebar/topbar + `<Outlet/>`), `DashboardProvider`, and `dashboard/*Page.tsx` (one page per route: `overview`, `analytics`, `merchants`, `brands`, `branches`, `menu`, `categories`, `onboard`, `customers`, `orders`, `payments`, `banners`, `subscriptions`, `notifications`, `flags`, `logs`).
- `src/features/` — the bulk of the UI: one folder per dashboard domain (`overview`, `analytics`, `merchants`, `brands`, `branches`, `menu`, `customers`, `orders`, `payments`, `banners`, `subscriptions`, `notifications`, `flags`, `audit`, `onboard`) plus a top-level `*Tab.tsx` per domain that composes them.
- `src/api/` — `client/` (`client.ts`, `tokens.ts`, storage adapter), `domains/*` (auth, merchants, branches, branch-managers, menu, orders, payments, subscriptions, coupons, customers, banners, notifications, onboard, flags, audit, analytics), and `admin.ts` as the barrel. `apiClient` is built from the shared `createApiClient` with admin token keys.
- `src/context/DashboardContext.ts` — dashboard shell state (active tab, modals, navigation).
- `src/hooks/` — `useAsyncData`, `useDashboardEntities`, `useDashboardFeedback`, `useBranchManagers`.
- `src/components/` — `layout/` (`AdminSidebar`, `AdminTopBar`), `common/` (`StatCard`, `Toast`), `modals/` (incl. `branch-login/*` for manager credential workflows), `ui/*` primitives, and `ProtectedRoute.tsx`.
- `src/lib/utils.ts`, `src/utils/` — `cn` helper plus formatters, branch-hours, credentials, entity-search, errors, and storage helpers.
- `src/types/dashboard.ts` — tab and dashboard state types.
- `src/config.ts` — env-driven deployment values (`RESTAURANT_PORTAL_URL`).

## Conventions

- One route = one lazy page in `src/App.tsx` under `/dashboard/*`; `/dashboard/restaurants` redirects to `/dashboard/branches`. Add new tabs in `src/types/dashboard.ts` and wire both the route and the sidebar.
- Composed UI lives in `src/features/<domain>/` and is assembled by the matching `src/features/<Domain>Tab.tsx`; pages stay thin.
- All backend access goes through `src/api/domains/*` on the shared client. Never call `fetch` from components.
- Errors surface as structured `ApiError` (from `@syncbite/shared`); use the helpers in `src/utils/errors.ts` for user-facing messages.
- Reuse `src/components/ui/*` and `src/components/common/*` primitives (Base UI, `class-variance-authority`, hugeicons, `cn`); `apps/admin/.oxlintrc.json` disables `react/only-export-components`, `react/set-state-in-effect`, and `react/preserve-manual-memoization`.
