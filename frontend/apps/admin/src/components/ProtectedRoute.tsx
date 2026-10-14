import { Navigate } from "react-router-dom";
import { getAccessToken } from "../api/client";

/** Requires an access token; the separate session marker is not authoritative. */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const hasToken = !!getAccessToken();

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
