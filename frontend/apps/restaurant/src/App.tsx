import { lazy, Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useSearchParams,
} from "react-router-dom";
import { GLOBAL_CSS } from "@/constants";
import { useRestaurantPortal } from "@/hooks/useRestaurantPortal";
import { useMenu } from "@/hooks/useMenu";
import { useBranchSettings } from "@/hooks/useBranchSettings";
import { PortalContext, usePortal } from "@/context/PortalContext";
import { OrdersProvider, useOrdersContext } from "@/context/OrdersContext";
import AppLayout from "@/components/layout/AppLayout";
import MenuModals from "@/components/menu/MenuModals";
import Toast from "@/components/common/Toast";
import LoginScreen from "@/pages/LoginScreen";
import BranchSetupNotice from "@/pages/BranchSetupNotice";
import { Toaster } from "./components/ui/sonner";

// ─── Code-Split Route Modules ────────────────────────────────────────────────
const HomeScreen = lazy(() => import("@/pages/HomeScreen"));
const MenuScreen = lazy(() => import("@/pages/MenuScreen"));
const CategoriesScreen = lazy(() => import("@/pages/CategoriesScreen"));
const OrdersScreen = lazy(() => import("@/pages/OrdersScreen"));
const SettingsScreen = lazy(() => import("@/pages/SettingsScreen"));
const MerchantScreen = lazy(() => import("@/pages/MerchantScreen"));
const BrandsScreen = lazy(() => import("@/pages/BrandsScreen"));
const BranchesScreen = lazy(() => import("@/pages/BranchesScreen"));
const InventoryScreen = lazy(() => import("@/pages/InventoryScreen"));
const KitchensScreen = lazy(() => import("@/pages/KitchensScreen"));
const FinancesScreen = lazy(() => import("@/pages/FinancesScreen"));
const SubscriptionScreen = lazy(() => import("@/pages/SubscriptionScreen"));
const NotificationsScreen = lazy(() => import("@/pages/NotificationsScreen"));

// ─── Loading splash ──────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
      }}
    >
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>Loading your restaurant…</p>
    </div>
  );
}

function PageSuspenseFallback() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-background">
      <p className="text-xs text-muted-foreground animate-pulse">Loading view…</p>
    </div>
  );
}

// ─── Login route ─────────────────────────────────────────────────────────────

function LoginRoute() {
  const portal = usePortal();

  // Already signed-in:
  // For MerchantOwner: always go to dashboard (they have executive management controls).
  // For other users: if branch is loaded, send to dashboard.
  if (portal.boot === "signed-in") {
    if (portal.isMerchantOwner || portal.branch) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <LoginScreen onSubmit={portal.handleLogin} />
      {portal.boot === "signed-in" && !portal.isMerchantOwner && !portal.branch && (
        <BranchSetupNotice
          error={portal.loadError}
          owned={portal.ownedBranches}
          onSave={(id) => portal.loadPortal(id.trim())}
          onSignOut={portal.signOut}
        />
      )}
    </>
  );
}

// ─── Protected layout (auth gate + AppLayout shell) ──────────────────────────

function ProtectedLayoutInner() {
  const portal = usePortal();
  const { branch } = portal;
  const { activeCount } = useOrdersContext();

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <AppLayout branch={branch} activeCount={activeCount}>
        <Suspense fallback={<PageSuspenseFallback />}>
          <Outlet />
        </Suspense>
      </AppLayout>

      {portal.toast && (
        <Toast
          msg={portal.toast.msg}
          type={portal.toast.type}
          onClose={() => portal.setToast(null)}
        />
      )}
    </>
  );
}

function ProtectedLayout() {
  const portal = usePortal();

  // Restoring session → show spinner.
  if (portal.boot === "restoring" || portal.loading) {
    return <LoadingScreen />;
  }

  // Not signed in → redirect to login.
  if (portal.boot === "signed-out") {
    return <Navigate to="/login" replace />;
  }

  // For non-MerchantOwners: must have an assigned branch loaded.
  if (!portal.isMerchantOwner && !portal.branch) {
    return <Navigate to="/login" replace />;
  }

  return (
    <OrdersProvider branchId={portal.branchId} showToast={portal.showToast}>
      <ProtectedLayoutInner />
    </OrdersProvider>
  );
}

// ─── Screen components wired to modular page hooks ────────────────────────────

function DashboardRoute() {
  const { branch, setOpen } = usePortal();
  const { orders, metrics } = useOrdersContext();

  return (
    <HomeScreen
      isOpen={branch?.isOpen ?? false}
      onToggle={() => branch && setOpen(!branch.isOpen)}
      orders={orders}
      metrics={metrics}
    />
  );
}

function MenuRoute() {
  const { branchId, showToast } = usePortal();
  const menuCtrl = useMenu({ branchId, showToast });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      menuCtrl.setAddItemOpen(true);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("add");
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams, menuCtrl]);

  return (
    <>
      <MenuScreen
        items={menuCtrl.menu.items}
        categories={menuCtrl.menu.categories}
        categoryIds={menuCtrl.menu.categoryIds}
        categoryOrders={menuCtrl.menu.categoryOrders}
        onToggleItem={menuCtrl.handleToggleItem}
        onEditItem={(item) => {
          menuCtrl.setEditItemData(item);
          menuCtrl.setEditItemOpen(true);
        }}
        onAddItemClick={() => menuCtrl.setAddItemOpen(true)}
      />

      <MenuModals
        addItemOpen={menuCtrl.addItemOpen}
        onCloseAddItem={() => menuCtrl.setAddItemOpen(false)}
        onAddItem={menuCtrl.handleAddItem}
        editItemOpen={menuCtrl.editItemOpen}
        editItemData={menuCtrl.editItemData}
        onCloseEditItem={() => menuCtrl.setEditItemOpen(false)}
        onSaveItem={menuCtrl.handleUpdateItem}
        onRemoveItem={menuCtrl.handleRemoveItem}
        categories={menuCtrl.menu.categories}
        busyItemId={menuCtrl.busyItemId}
      />
    </>
  );
}

function CategoriesRoute() {
  return <CategoriesScreen />;
}

function OrdersRoute() {
  const { branchId } = usePortal();
  const { orders, refreshOrders, handleAdvanceOrder, handleCancelOrder, busyOrderId } =
    useOrdersContext();

  return (
    <OrdersScreen
      orders={orders}
      onAdvance={handleAdvanceOrder}
      onCancel={handleCancelOrder}
      onRefresh={() => branchId && refreshOrders(branchId)}
      busyId={busyOrderId}
    />
  );
}

function InventoryRoute() {
  return <InventoryScreen />;
}

function KitchensRoute() {
  return <KitchensScreen />;
}

function BranchesRoute() {
  return <BranchesScreen />;
}

function BrandsRoute() {
  return <BrandsScreen />;
}

function FinancesRoute() {
  return <FinancesScreen />;
}

function SubscriptionRoute() {
  return <SubscriptionScreen />;
}

function MerchantRoute() {
  return <MerchantScreen />;
}

function NotificationsRoute() {
  return <NotificationsScreen />;
}

function SettingsRoute() {
  const { branch, user, signOut, showToast, setBranch } = usePortal();
  const { savingSettings, handleSaveSettings } = useBranchSettings({
    branchId: branch?.id ?? null,
    branch,
    onBranchUpdated: setBranch,
    showToast,
  });

  return (
    <SettingsScreen
      branch={branch}
      user={user}
      onSave={handleSaveSettings}
      onLogout={signOut}
      saving={savingSettings}
    />
  );
}

// ─── Router definition ────────────────────────────────────────────────────────

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardRoute /> },
      { path: "orders", element: <OrdersRoute /> },
      { path: "menu", element: <MenuRoute /> },
      { path: "categories", element: <CategoriesRoute /> },
      { path: "inventory", element: <InventoryRoute /> },
      { path: "kitchens", element: <KitchensRoute /> },
      { path: "branches", element: <BranchesRoute /> },
      { path: "brands", element: <BrandsRoute /> },
      { path: "finances", element: <FinancesRoute /> },
      { path: "subscription", element: <SubscriptionRoute /> },
      { path: "merchant", element: <MerchantRoute /> },
      { path: "notifications", element: <NotificationsRoute /> },
      { path: "settings", element: <SettingsRoute /> },
    ],
  },
  // Catch-all: redirect unknown paths to dashboard.
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

// ─── Root (provides context, then router) ────────────────────────────────────

export default function App() {
  const portal = useRestaurantPortal();

  return (
    <PortalContext.Provider value={portal}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </PortalContext.Provider>
  );
}
