# SyncBite Monorepo

SyncBite is a pnpm + Turborepo monorepo of three React 19 + Vite 8 + Tailwind CSS v4 single-page apps that share domain types and an API client with the **`syncbite_backend`** FastAPI/PostgreSQL backend (a sibling checkout, expected at `http://127.0.0.1:8000`).

## Layout

```
apps/
  student/      @syncbite/student     port 8443   customer ordering app
  restaurant/   @syncbite/restaurant  port 8444   merchant / restaurant portal
  admin/        @syncbite/admin       port 8445   platform admin dashboard
packages/
  shared/       @syncbite/shared      types, utils, API client factory & domain modules
```

Each app is independently runnable and has its own `package.json`, `vite.config.ts`, `tsconfig.json`, and `src/`. App-specific guidance lives in its own `AGENTS.md` — see "Where to look" below.

## Prerequisites

- Node.js v22 or newer.
- pnpm, pinned by `packageManager` in the root `package.json` (currently `12.9.1`). Enable it with
  `corepack enable && corepack prepare pnpm@12.9.1 --activate`, or `npm i -g pnpm@12.9.1`.

## Commands (run from the repo root)

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all workspace dependencies. |
| `pnpm dev` | Run every app's dev server in parallel (Turbo, uncached, persistent). |
| `pnpm build` | `tsc -b && vite build` per app; `packages/shared` builds first via `^build`. |
| `pnpm typecheck` | `tsc --noEmit` per workspace. |
| `pnpm lint` | `oxlint` across all workspaces. |
| `pnpm format` | `oxfmt` across all workspaces. |

Target a single workspace with a filter, e.g. `pnpm --filter @syncbite/admin dev` (also works for `build`, `typecheck`, `lint`, `format`). Do **not** use `npm` or `yarn` in this repo.

## Where to look

- `apps/student/AGENTS.md`, `apps/restaurant/AGENTS.md`, `apps/admin/AGENTS.md` — app structure and conventions.
- `packages/shared/AGENTS.md` — shared types, utilities, and the API client contract.
- `README.md` — full setup, backend bring-up, ports, and environment variables.

## Conventions

- **Imports.** `@/` resolves to each app's `src/`; `@syncbite/shared` resolves to `packages/shared/src` (aliased in both `vite.config.ts` and `tsconfig.json`). Import from the package root `@syncbite/shared` — the package does not currently expose subpath exports.
- **Put shared code in `packages/shared`.** Do not duplicate domain types, formatters, or order helpers across apps; add them to shared `types/` or `utils/` and import them. All three apps already depend on `@syncbite/shared`.
- **API layer.** Use the shared `createApiClient` (token storage, automatic 401 refresh queue, structured `ApiError`). Each app instantiates it once with its own token keys in `src/api/client.ts`, then exposes typed domain modules under `src/api/`. Never call `fetch` directly from components.
- **Env & proxy.** Dev requests use the relative `/api/v1` path through the Vite dev proxy to `VITE_API_PROXY_TARGET` (default `http://127.0.0.1:8000`). Leave `VITE_API_URL` blank in development; never hardcode hosts, ports, or paths in source — read them from `import.meta.env`. Copy each app's `.env.example` → `.env` (`.env` is gitignored).
- **Routing.** React Router `createBrowserRouter`; route screens are lazy-loaded. Auth gating lives in `ProtectedRoute` / guarded layout components.
- **Styling.** Tailwind CSS v4 via the `@tailwindcss/vite` plugin. Global CSS and theme tokens live in each app's `src/index.css` (`@import 'tailwindcss';`). No Tailwind or PostCSS config file is used.
- **UI primitives.** Reuse `src/components/ui/*` (shadcn-style, Base UI, `class-variance-authority`, `cn`) instead of hand-rolling controls.
- **Code style.** TypeScript strict (`tsconfig.base.json`), ESM, double quotes. Keep `pnpm lint` clean and format with oxfmt. Avoid `any`; prefer explicit types.

## Rules & gotchas

- Keep the Turborepo block at the bottom of this file. Turbo re-adds it on qualifying invocations and it must stay committed.
- The `dev` task is uncached and persistent — never rely on its cache. `build` depends on `^build`, so `packages/shared` is built before the apps that consume it.
- `.env*` is gitignored except `.env.example`. Only ever edit/commit `.env.example`.
- The student app falls back to mock data when the backend is unreachable; admin and restaurant expect a live backend.
- The backend repo (`syncbite_backend`) is a sibling checkout, not part of this repo. `openapi.json` at the root is a checked-in copy of its schema.
- No test runner is configured; verification is `pnpm typecheck && pnpm build && pnpm lint`.