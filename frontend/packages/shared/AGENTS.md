# @syncbite/shared

Shared domain types, utilities, and the API client contract used by `apps/student`, `apps/restaurant`, and `apps/admin`. This is the single place for anything two or more apps would otherwise duplicate.

Monorepo-wide conventions live in the root `AGENTS.md` — read that first.

## Build & check

```bash
pnpm --filter @syncbite/shared build      # rm -rf dist && tsc  (emits dist/)
pnpm --filter @syncbite/shared typecheck  # tsc --noEmit
pnpm --filter @syncbite/shared dev        # tsc --watch --preserveWatchOutput
pnpm --filter @syncbite/shared lint
pnpm --filter @syncbite/shared format
```

Apps consume this package from **source**: `vite.config.ts` and `tsconfig.json` both alias `@syncbite/shared` → `packages/shared/src`. The compiled `dist/` (via `tsc`, with declarations) is what `package.json` points at for the published entry. Keep both in mind — changing `src/` affects the apps immediately in dev, but `dist/` only refreshes on `build`.

## Structure

- `src/index.ts` — root barrel (`export * from "./types" | "./utils" | "./api"`).
- `src/types/` — domain models mirroring the backend: `auth`, `branch`, `menu`, `order`, `cart`, `customers`, `subscription`, `admin`, `review`, `search`, `common`, plus `index.ts`.
- `src/utils/` — `currency`, `date`, `order` (order state machine helpers), `string`, `cn`, `api-error`, `user-message`, `validation`, plus `index.ts`.
- `src/api/client.ts` — `createApiClient`, `createLocalStorageAdapter`, and the `StorageAdapter` / `ApiClientConfig` / `ApiClientInstance` types. Handles token storage, automatic 401 refresh queueing, and throws structured `ApiError`.
- `src/api/domains/` — typed per-domain endpoint modules (`auth`, `branches`, `menu`, `orders`, `cart`, `checkout`, `coupons`, `customers`, `inventory`, `merchants`, `notifications`, `reviews`, `search`, `subscriptions`, `admin-system`), re-exported from `src/api/index.ts`.

## Conventions & gotchas

- **Import from the package root**: `import { formatCurrency, type Order } from "@syncbite/shared";`. The package currently exposes only the `.` entry — subpath imports like `@syncbite/shared/utils` are **not** supported even though the README suggests them.
- **Adding shared code**: put new domain types in `src/types/<domain>.ts` and re-export from `src/types/index.ts`; put new helpers in `src/utils/<name>.ts` and re-export from `src/utils/index.ts`. Never break the existing barrel exports apps rely on.
- **Client config is per-app**: only the factory lives here. Each app instantiates it with its own token keys (student `sat_access_token`, restaurant `sat_rest_access_token`, admin's `tokens.ts`).
- **Stricter compiler settings than the apps**: this package enables `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`, `noImplicitReturns`, and `noImplicitOverride`. Code must satisfy them.
- `ApiError` and `ApiErrorPayload` are the canonical error types; use `user-message.ts` (`toUserMessage`) to turn them into user-facing text rather than matching on raw strings.
- This package is `private` and versioned with the workspace; there is no publish step.
