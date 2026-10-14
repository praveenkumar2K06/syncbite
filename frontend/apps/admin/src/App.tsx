import { lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Dashboard route pages (lazy loaded with React Suspense)
const OverviewPage = lazy(() => import("./pages/dashboard/OverviewPage"));
const AnalyticsPage = lazy(() => import("./pages/dashboard/AnalyticsPage"));
const MerchantsPage = lazy(() => import("./pages/dashboard/MerchantsPage"));
const BrandsPage = lazy(() => import("./pages/dashboard/BrandsPage"));
const BranchesPage = lazy(() => import("./pages/dashboard/BranchesPage"));
const MenuPage = lazy(() => import("./pages/dashboard/MenuPage"));
const CategoriesPage = lazy(() => import("./pages/dashboard/CategoriesPage"));
const OnboardPage = lazy(() => import("./pages/dashboard/OnboardPage"));
const GamesPage = lazy(() => import("./pages/dashboard/GamesPage"));
const CustomersPage = lazy(() => import("./pages/dashboard/CustomersPage"));
const OrdersPage = lazy(() => import("./pages/dashboard/OrdersPage"));
const PaymentsPage = lazy(() => import("./pages/dashboard/PaymentsPage"));
const BannersPage = lazy(() => import("./pages/dashboard/BannersPage"));
const SubscriptionsPage = lazy(() => import("./pages/dashboard/SubscriptionsPage"));
const NotificationsPage = lazy(() => import("./pages/dashboard/NotificationsPage"));
const FeatureFlagsPage = lazy(() => import("./pages/dashboard/FeatureFlagsPage"));
const AuditLogsPage = lazy(() => import("./pages/dashboard/AuditLogsPage"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Navigate to="/dashboard/overview" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: "overview", element: <OverviewPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "merchants", element: <MerchantsPage /> },
      { path: "brands", element: <BrandsPage /> },
      { path: "branches", element: <BranchesPage /> },
      { path: "restaurants", element: <Navigate to="/dashboard/branches" replace /> },
      { path: "menu", element: <MenuPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "onboard", element: <OnboardPage /> },
      { path: "games", element: <GamesPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "payments", element: <PaymentsPage /> },
      { path: "banners", element: <BannersPage /> },
      { path: "subscriptions", element: <SubscriptionsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "flags", element: <FeatureFlagsPage /> },
      { path: "logs", element: <AuditLogsPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard/overview" replace />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
