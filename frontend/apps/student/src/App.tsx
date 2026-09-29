import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { HumorProvider } from "@/components/HumorSystem";
import AppLayout from "@/components/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageSkeletonLoader from "@/components/PageSkeletonLoader";

const HomePage = lazy(() => import("@/pages/HomePage"));
const BrowsePage = lazy(() => import("@/pages/BrowsePage"));
const GamesPage = lazy(() => import("@/pages/GamesPage"));
const TheaterPage = lazy(() => import("@/pages/TheaterPage"));
const RestaurantPage = lazy(() => import("@/pages/RestaurantPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const ConfirmationPage = lazy(() => import("@/pages/ConfirmationPage"));
const OrdersPage = lazy(() => import("@/pages/OrdersPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));

function LoginRoute() {
  const { user } = useAppContext();
  if (user) {
    return <Navigate to="/home" replace />;
  }
  return (
    <Suspense fallback={<PageSkeletonLoader />}>
      <LoginPage />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <HomePage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "browse", element: <BrowsePage /> },
          { path: "games", element: <GamesPage /> },
          { path: "theater", element: <TheaterPage /> },
          { path: "restaurant/:id", element: <RestaurantPage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "confirmation/:orderId", element: <ConfirmationPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/home" replace />,
  },
]);

export default function App() {
  return (
    <HumorProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </HumorProvider>
  );
}
