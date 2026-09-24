import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginApi } from "../api/admin";
import { ApiError, setTokens } from "../api/client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await adminLoginApi(email, password);
      if (data.user.role !== "PlatformAdmin") {
        setError("Access denied — PlatformAdmin role required.");
        return;
      }
      setTokens(data.access_token, data.refresh_token);
      navigate("/dashboard/overview", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Login failed. Check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] opacity-30 bg-[size:40px_40px]" />

      <div className="relative w-full max-w-md px-6 animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-primary shadow-2xl shadow-primary/25">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9" />
              <path
                d="M2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">SyncBite Admin</h1>
          <p className="text-sm mt-1 text-muted-foreground">Super Admin Control Panel</p>
        </div>

        {/* Card */}
        <Card className="border-border/80 shadow-2xl shadow-black/20">
          <CardHeader>
            <CardTitle>Sign in to continue</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-medium mb-2 text-muted-foreground">
                  Email address
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@syncbite.com"
                  className="h-11 px-4 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-2 text-muted-foreground">
                  Password
                </label>
                <Input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 px-4 text-sm"
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-lg text-sm bg-destructive/10 border border-destructive/30 text-destructive">
                  {error}
                </div>
              )}

              <Button
                id="admin-login-btn"
                type="submit"
                disabled={loading}
                variant="orange"
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="text-xs text-center mt-6 text-muted-foreground">
              PlatformAdmin credentials required. Contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
