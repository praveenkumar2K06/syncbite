# SyncBite — Restaurant Platform Monorepo

SyncBite is a multi-tenant restaurant ordering and management platform. This
repository is the **monorepo** that combines the API and the web clients:

- **`backend/`** — FastAPI + SQLAlchemy + Alembic API. Covers auth, the tenant
  hierarchy (merchants → brands → branches), the menu/inventory/kitchen catalog,
  customer ordering, cart, orders, the payment ledger, coupons, store credit,
  the merchant payout engine, reviews, search, notifications and gamification.
- **`frontend/`** — pnpm + Turborepo workspace with three React/Vite apps:
  **Admin** (platform operations), **Restaurant** (merchant portal) and
  **Student** (ordering app), all sharing a typed `@syncbite/shared` package.

## Repository structure

```
.
├── backend/                 # FastAPI service
│   ├── app/                 # application package (modules, models, schemas)
│   ├── alembic/             # database migrations
│   ├── tests/               # pytest suite
│   ├── architecture/        # engineering specifications
│   └── ...
└── frontend/                # pnpm/Turborepo workspace
    ├── apps/
    │   ├── admin/           # platform admin dashboard
    │   ├── restaurant/      # restaurant merchant portal
    │   └── student/         # student ordering app
    └── packages/
        └── shared/          # shared types, API client and UI kit
```

## Technology stack

| Layer      | Technology                                                        |
|------------|-------------------------------------------------------------------|
| Backend    | Python, FastAPI, SQLAlchemy 2, Alembic, Pydantic, PostgreSQL, Redis |
| Realtime   | WebSockets (order lifecycle), Celery-style payout scheduler       |
| Frontend   | TypeScript, React 18, Vite, Tailwind CSS, TanStack Query, Zustand |
| Tooling    | pnpm, Turborepo, Ruff, Black, pytest, ESLint, Prettier, GitHub Actions |

## Getting started

### Prerequisites
- Python 3.11+
- Node.js 18+ and [pnpm](https://pnpm.io)
- PostgreSQL and Redis (or use Docker Compose)

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then fill in your own secrets
alembic upgrade head
uvicorn app.main:app --reload # http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev                      # runs every app via Turborepo
```

## Environment variables

Secrets are **never** committed. Each package ships an `.env.example` describing
the required variables. In particular `JWT_SECRET_KEY` must be provided in
production — the backend refuses to start with the placeholder value.

## Continuous integration

`.github/workflows/ci.yml` runs the backend (ruff + black + pytest) and the
frontend (typecheck + lint + build) jobs on every push and pull request.
