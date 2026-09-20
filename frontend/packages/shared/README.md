# @syncbite/shared

Shared domain models, TypeScript interfaces, and utilities for the SyncBite monorepo (`apps/student`, `apps/restaurant`, `apps/admin`).

## Overview

This workspace package centralizes:

- **Domain Types**: User/Auth, Branch, Merchant, Menu, Order, Cart, Checkout, Review, Search, and Admin schemas mirroring the `syncbite_backend` backend API.
- **Utility Functions**: Rupee currency formatting, relative and localized dates, order state machine helpers, string utilities, slug generation, credentials generation, class name merging, and standardized `ApiError`.

## Usage

### Direct import from root

```ts
import {
  type MenuItem,
  type Order,
  type Branch,
  formatCurrency,
  formatRelativeTime,
  BackendOrderStatus,
} from "@syncbite/shared";
```

### Subpath imports

```ts
// Import types only
import type { BackendOrder, MenuCategory, TokenResponse } from "@syncbite/shared/types";

// Import utilities only
import { formatCurrency, formatRelativeTime, slugify, cn } from "@syncbite/shared/utils";
```

## Structure

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── admin.ts       # AuditLog, FeatureFlag, Analytics, Onboarding
│   │   ├── auth.ts        # BackendUser, TokenResponse, UserRole, Storage Keys
│   │   ├── branch.ts      # Branch, Brand, Merchant, MerchantRecord
│   │   ├── cart.ts        # CartItem, Checkout, PaymentIntent, Coupons
│   │   ├── common.ts      # ToastState, ApiErrorPayload, Pagination, ApiResponse
│   │   ├── menu.ts        # MenuItem, MenuCategory, Menu, MenuModifier, FoodType
│   │   ├── order.ts       # BackendOrder, OrderItem, BackendOrderStatus, PortalOrderStatus
│   │   ├── review.ts      # Review, RatingSummary
│   │   ├── search.ts      # SearchResultItem, SearchResponse
│   │   └── index.ts       # Re-exports all types
│   ├── utils/
│   │   ├── api-error.ts   # ApiError class and type guard
│   │   ├── cn.ts          # Class name merging utility
│   │   ├── currency.ts    # formatCurrency, formatCompactCurrency, fmt, formatMoney
│   │   ├── date.ts        # formatRelativeTime, formatDate, formatTime, toTimeInput
│   │   ├── order.ts       # toPortalStatus, nextOrderAction, canCancelOrder, ORDER_TABS
│   │   ├── string.ts      # slugify, generateSecurePassword, displayName, truncate
│   │   ├── validation.ts  # isValidEmail, isValidPhone, etc.
│   │   └── index.ts       # Re-exports all utilities
│   └── index.ts           # Root re-export
├── package.json
├── tsconfig.json
└── README.md
```

```

```
