import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin, ADMIN_TOKEN_KEY } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin — Forge ERP" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await adminLogin(email, password);
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elevated">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-accent">
            <Lock className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold">Admin sign in</h1>
            <p className="text-xs text-muted-foreground">Internal access only</p>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading} className="w-full bg-gradient-accent text-primary-foreground shadow-glow">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo: <code className="rounded bg-muted px-1 py-0.5">admin@forgeerp.app</code> /{" "}
            <code className="rounded bg-muted px-1 py-0.5">admin123</code>
          </p>
        </form>
      </div>
    </div>
  );
}
