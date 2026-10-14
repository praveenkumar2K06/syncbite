import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";

/** Redirects to /login if no authenticated user. */
export default function ProtectedRoute() {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
