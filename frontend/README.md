# SyncBite - Monorepo Setup Guide

This is a monorepo containing three frontend applications for the SyncBite food ordering platform, built with React + Vite + Tailwind CSS v4 and orchestrated with Turbo.

## Repository Structure

```
SyncBite/
├── apps/
│   ├── admin/        # Admin dashboard: restaurants & manager credentials
│   ├── restaurant/   # Restaurant portal (merchant interface)
│   └── student/      # Student app for ordering food
├── packages/
│   └── shared/       # Shared TypeScript types and utilities (@syncbite/shared)
├── .gitignore
├── .turbo/           # Turbo build cache (generated)
├── package.json      # Root package.json + workspace scripts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json        # Turbo task configuration
```

Each app is independently runnable and contains its own `package.json`, `vite.config.ts`, `tsconfig.json`, and `src/`.

## Prerequisites

- **Node.js**: v22 or compatible.
- **pnpm**: v12.9.1, as pinned by `packageManager` in the root `package.json`.

> **Version note:** use the `packageManager` value above as the single source of truth. If you rely on an external tool manager, configure it to install the same pnpm version.

## Quick Start

### 0. Enable pnpm (if not already available)

We recommend using Corepack with the pinned version. Depending on your environment, you may need elevated permissions.

```bash
corepack enable
corepack prepare pnpm@12.9.1 --activate
```

If you encounter permission issues on system Node, use `npm i -g pnpm@12.9.1`.

### 1. Install dependencies

From the root directory, install all workspace Node dependencies:

```bash
pnpm install
```

This installs dependencies for every app in the monorepo.

### 2. Set up environment variables

Only `.env.example` files are tracked — every `.env` file is gitignored because it can hold sensitive configurations and proxy targets.

| App | `.env.example` | Key variables |
|-----|----------------|---------------|
| `apps/admin` | Yes | `VITE_API_URL`, `VITE_API_PROXY_TARGET`, `VITE_RESTAURANT_PORTAL_URL` |
| `apps/student` | Yes | `VITE_GOOGLE_CLIENT_ID`, `VITE_API_URL`, `VITE_API_PROXY_TARGET` |
| `apps/restaurant` | Yes | `VITE_API_URL`, `VITE_API_PROXY_TARGET`, `VITE_BRANCH_ID` |

All three apps now have an `.env.example`. Set each one up:

```bash
cp apps/admin/.env.example apps/admin/.env
cp apps/student/.env.example apps/student/.env
cp apps/restaurant/.env.example apps/restaurant/.env
```

All three apps honour `PORT` and `VITE_API_PROXY_TARGET` from the shell environment as well as from `.env`; shell wins. The restaurant app also declares its `VITE_*` keys in `src/vite-env.d.ts`, so they are typed.

#### Admin app variables

- `VITE_API_URL`: Backend base URL for **direct** API calls. **Leave blank in development** so requests go through the Vite proxy on a relative path; set an absolute URL (e.g. `https://api.syncbite.app/api/v1`) only for staging/production.
- `VITE_API_PROXY_TARGET`: Target for the Vite dev proxy (`/api/v1` → backend). Defaults to `http://127.0.0.1:8000`.
- `VITE_RESTAURANT_PORTAL_URL`: Where restaurant managers sign in. Printed onto generated credential files, so it must match the deployed restaurant portal (default `http://localhost:8444`).

#### Student app variables

- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID from Google Cloud Console → APIs & Services → Credentials.
- `VITE_API_URL`: Backend base URL for direct API calls. **Leave blank in development** so requests use the proxy; set an absolute URL for staging/production.
- `VITE_API_PROXY_TARGET`: Target for the Vite dev proxy (`/api` → backend). Defaults to `http://127.0.0.1:8000`.

#### Restaurant app variables

- `VITE_API_URL`: Backend base URL for direct API calls. **Leave blank in development** — this is deliberate, so API calls use the relative path `/api/v1` through the Vite dev proxy, avoiding CORS errors and hardcoded hosts. Set an absolute URL only for staging/production.
- `VITE_API_PROXY_TARGET`: Target for the Vite dev proxy (`/api` → backend). Defaults to `http://127.0.0.1:8000`.
- `VITE_BRANCH_ID`: Optional outlet (branch) ID. Leave blank to resolve the outlet from the signed-in manager account; set it only if this portal is pinned to a single outlet. The backend has no "my branch" endpoint, so this value (or the account-scoped cache) is how the portal knows which restaurant it manages.

### 3. Backend setup (Required for full functionality)

These frontend apps talk to the `syncbite_backend` backend, expected as a sibling checkout. Make sure it is set up and running:

```bash
# Navigate to backend
cd ../syncbite_backend

# Set up environment
cp .env.example .env

# Start via Docker (recommended)
docker compose up --build

# Apply migrations
docker compose exec app alembic upgrade head

# Verify health
curl http://localhost:8000/health
```

You should see: `{"status":"ok","version":"1.0.0"}`

The student app falls back to rich mock data if the backend is unreachable, so the UI stays usable while the backend is down. The admin and restaurant portals expect a live backend.

#### Initial admin user (optional)

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@syncbite.app",
    "password": "admin123",
    "role": "PlatformAdmin"
  }'
```

If you see `EMAIL_ALREADY_EXISTS`, that's expected on subsequent runs.

See the backend's own README for more detailed setup instructions.

## Development

### Run all apps in parallel

From the root directory:

```bash
pnpm dev
```

Turbo runs the `dev` script for every workspace package concurrently. Each app defaults to a distinct port:

| App | Default port | URL | Dev proxy |
|-----|--------------|-----|-----------|
| Student | 8443 | http://localhost:8443 | `/api/v1` → backend |
| Restaurant | 8444 | http://localhost:8444 | `/api` → backend |
| Admin | 8445 | http://localhost:8445 | `/api/v1` → backend |

### Run a specific app

```bash
pnpm --filter @syncbite/student dev
pnpm --filter @syncbite/restaurant dev
pnpm --filter @syncbite/admin dev
```

### Dev proxy targets

All apps default `VITE_API_PROXY_TARGET` to `http://127.0.0.1:8000`.

The Admin app proxies `/api/v1` to the backend. User credentials and password overrides are managed directly via the official backend endpoints (`/api/v1/admin/set-password` and `/api/v1/admin/users/{user_id}/set-password`).


## Build & Other Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all dev servers in parallel (Turbo, uncached) |
| `pnpm build` | Build all apps for production (`tsc -b && vite build`) |
| `pnpm typecheck` | Type-check all workspaces (`tsc --noEmit`) |
| `pnpm lint` | Lint all workspaces (`oxlint`) |
| `pnpm format` | Format all workspaces (`oxfmt`) |

### Per-app scripts

All apps provide a uniform set of scripts in `apps/<app>/package.json`:

| App | `dev` | `build` | `typecheck` | `lint` | `format` | `preview` |
|-----|-------|---------|-------------|--------|----------|-----------|
| `admin` | `vite` | `tsc -b && vite build` | `tsc --noEmit` | `oxlint` | `oxfmt` | `vite preview` |
| `student` | `vite` | `tsc -b && vite build` | `tsc --noEmit` | `oxlint` | `oxfmt` | `vite preview` |
| `restaurant` | `vite` | `tsc -b && vite build` | `tsc --noEmit` | `oxlint` | `oxfmt` | `vite preview` |

All app builds run a TypeScript project build (`tsc -b`) followed by `vite build`.

```bash
cd apps/<app-name>
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm format
pnpm preview
```

## Tech Stack

- **UI**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4 via the `@tailwindcss/vite` plugin.
- **Monorepo**: pnpm workspaces (`apps/*`) + Turbo
- **Linting / formatting**: `oxlint` (linter) and `oxfmt` (formatter) across all apps (`admin` also includes `.oxlintrc.json`)

Version notes: Admin tracks newer ranges (`react` 19.2.x, `tailwindcss` 4.3.x, `vite` ^8.3, `typescript` ~6.0, `oxlint` ^1.81), while student and restaurant sit on `react` ^19.0, `tailwindcss` ^4.0, `vite` ^8.0.5, `typescript` ^5.7, `oxfmt` ^0.2.

The Admin app additionally depends on `@neondatabase/serverless` for serverless Postgres access.

## Deployment (Firebase Hosting)

Each app builds to its own `dist/` folder and is deployed to a separate Firebase
Hosting target (see `firebase.json` and `.firebaserc`):

| Target | App | Command |
|--------|-----|---------|
| `student` | `apps/student` | `pnpm deploy:student` |
| `restaurant` | `apps/restaurant` | `pnpm deploy:restaurant` |
| `admin` | `apps/admin` | `pnpm deploy:admin` |

Deploy everything at once with `pnpm deploy` (builds via Turbo, then
`firebase deploy --only hosting`). Authenticate first with
`firebase login` (or `FIREBASE_TOKEN` in CI). No credentials are stored in the
repository — Firebase project IDs live in `.firebaserc`, and all secrets stay in
gitignored `.env` files.

## Notes

- All apps alias `@` to `src/` and `@syncbite/shared` to `packages/shared/src` for imports.
- Hot reload is enabled in all apps during development.
- Tailwind is imported from `src/index.css` via `@import 'tailwindcss';`. Global CSS and theme customisation belong there.
- Every workspace follows the conventions in its `AGENTS.md` file (also referenced from `CLAUDE.md`).

## Troubleshooting

- **CORS errors in development**: `VITE_API_URL` is set to an absolute URL instead of blank. Blank it so requests go through the dev proxy.
- **Backend connection**: verify the backend on port 8000 (`curl http://localhost:8000/health`) and check `VITE_API_PROXY_TARGET`.

## Further reading

- [Root AGENTS.md](AGENTS.md) — monorepo-wide agent guide and conventions
- [Student README](apps/student/README.md) — API surface, backend integration, and the mock-data fallback strategy
- [Student AGENTS.md](apps/student/AGENTS.md)
- [Restaurant AGENTS.md](apps/restaurant/AGENTS.md) — the restaurant app's primary guide (it has no README)
- [Admin AGENTS.md](apps/admin/AGENTS.md) — the admin app's primary guide
- [Shared AGENTS.md](packages/shared/AGENTS.md) — `@syncbite/shared` types, utils, and API client contract
- [Admin README](apps/admin/README.md) — still the stock Vite + oxlint template text

