# SyncBite Campus (Frontend)

Interactive food ordering and campus dining client for **SyncBite**, featuring brutalist campus aesthetic, humor interaction systems, full cart lifecycle, checkout workflows, and seamless integration with the **SyncBite v2** backend.

---

## 🚀 Overview

SyncBite Campus connects university students with campus dining outlets, cafeterias, and food trucks. The client is built with React, TypeScript, Tailwind CSS, and Lucide Icons, following a retro-brutalist campus aesthetic with dynamic stickers, punchy animations, and an interactive humor engine.

---

## 🏗️ Architecture & Backend Integration

The frontend connects to the **SyncBite v2** modular monolith backend running FastAPI and PostgreSQL at `http://127.0.0.1:8000` via the `/api` proxy.

### Connected API Endpoints (`/api/v1/*`)

| Module                  | Endpoints                                                                                                                                                                          | Frontend Integration                                                                                                                                                                                                                                                              |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Authentication**      | `POST /api/v1/auth/login`<br/>`POST /api/v1/auth/register`<br/>`POST /api/v1/auth/refresh`<br/>`GET /api/v1/auth/me`<br/>`GET /api/v1/customers/me`                                | Automatic token management (`sat_access_token` & `sat_refresh_token`), 401 refresh interception queue, seamless auth/auto-registration on [`LoginPage.tsx`](file:///src/pages/LoginPage.tsx), customer profile syncing on [`ProfilePage.tsx`](file:///src/pages/ProfilePage.tsx). |
| **Branches & Menus**    | `GET /api/v1/branches`<br/>`GET /api/v1/branches/{id}`<br/>`GET /api/v1/branches/{id}/menu`                                                                                        | Dynamic branch discovery and categorised menu rendering in [`HomePage.tsx`](file:///src/pages/HomePage.tsx), [`BrowsePage.tsx`](file:///src/pages/BrowsePage.tsx), and [`RestaurantPage.tsx`](file:///src/pages/RestaurantPage.tsx).                                              |
| **Cart Operations**     | `GET /api/v1/cart`<br/>`POST /api/v1/cart/items`<br/>`PUT /api/v1/cart/items/{id}`<br/>`DELETE /api/v1/cart/items/{id}`<br/>`DELETE /api/v1/cart`<br/>`POST /api/v1/cart/validate` | Background cart state synchronization, optimistic UI updates in [`App.tsx`](file:///src/App.tsx) and [`CartBar.tsx`](file:///src/components/CartBar.tsx).                                                                                                                         |
| **Checkout & Payments** | `POST /api/v1/checkout/validate`<br/>`POST /api/v1/checkout/summary`<br/>`POST /api/v1/payment/intent`<br/>`POST /api/v1/payment/verify`                                           | Multi-step validation, surge/delivery charge calculation, UPI/Card/Cash payment intent creation, and verification in [`CheckoutPage.tsx`](file:///src/pages/CheckoutPage.tsx).                                                                                                    |
| **Orders**              | `POST /api/v1/orders`<br/>`GET /api/v1/orders`<br/>`GET /api/v1/orders/{id}`<br/>`POST /api/v1/orders/{id}/cancel`                                                                 | Real-time order creation, confirmation receipt display in [`ConfirmationPage.tsx`](file:///src/pages/ConfirmationPage.tsx), and live status tracking in [`OrdersPage.tsx`](file:///src/pages/OrdersPage.tsx).                                                                     |
| **Coupons & Deals**     | `POST /api/v1/coupons/validate`<br/>`POST /api/v1/coupons/apply`                                                                                                                   | Real-time coupon code discount validation and calculation in [`CheckoutPage.tsx`](file:///src/pages/CheckoutPage.tsx).                                                                                                                                                            |
| **Reviews & Ratings**   | `GET /api/v1/branches/{id}/reviews`<br/>`POST /api/v1/branches/{id}/reviews`                                                                                                       | Branch review listing and rating submissions.                                                                                                                                                                                                                                     |
| **Search & Typeahead**  | `GET /api/v1/search`<br/>`GET /api/v1/search/suggestions`                                                                                                                          | Fast fuzzy query autocomplete across campus dining outlets and dish names.                                                                                                                                                                                                        |

---

## 🛡️ Standalone Demo & Graceful Fallback Strategy

To ensure zero downtime and uninterrupted local frontend development:

- The application automatically queries the live SyncBite v2 backend endpoints.
- If the backend is unreachable or offline (e.g. initial clone or dev review), the client smoothly falls back to rich mock campus dining data and simulated mock orders.
- 100% of the brutalist styling, humor events, cart interactions, and UI animations remain active and responsive in both modes.

---

## 📋 Backend Features Not in Student Frontend

The **SyncBite v2** backend encompasses specialized systems that exist outside of the student customer interface:

1. **Kitchen Display System (KDS)**: Real-time ticket management, station queues, prep time SLA tracking, and bump-bar actions for kitchen staff.
2. **Merchant Portal & Inventory Management**: Outlet catalog management, stock-level toggling (out-of-stock items), 86-list controls, and branch schedule overrides.
3. **Admin Dashboard & Auditing**: Role-based access control (RBAC), multi-tenant audit logs, platform-wide financial settlement reports, and system telemetry.
4. **Rider / Runner Dispatch & Geo-Tracking**: Live runner routing, batch delivery assignment across campus zones, and rider payout ledger.
5. **Point-of-Sale (POS) Integration**: Offline thermal receipt printing, barcode scanning, and hardware register cash-drawer triggers.
6. **Analytics & Revenue Reporting**: Hourly sales aggregates, category performance, kitchen bottleneck metrics, and coupon attribution analysis.

---

## 🛠️ Development & Build

### Prerequisites

- Node.js 18+
- SyncBite v2 Backend (running on port 8000)

### Installation

```bash
# Install dependencies
npm install

# Start Vite dev server (proxies /api to http://127.0.0.1:8000)
npm run dev

# Run production build
npm run build
```
