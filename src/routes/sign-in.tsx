import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { accountLoginEndpoint, accountsEnabled } from "@/lib/accounts";

const errors = {
  credentials: "Check your email, workspace, and password, then try again.",
  workspace: "Enter your workspace address to continue.",
  expired: "Your sign-in expired. Please try again.",
  unavailable: "Workspace sign-in is temporarily unavailable. Please try again shortly.",
  verify: "Your workspace requires another verification step. Contact your workspace administrator for help.",
};

const signInSearch = z.object({
  workspace: z.string().max(253).optional().catch(undefined),
  error: z.enum(["credentials", "workspace", "expired", "unavailable", "verify"]).optional().catch(undefined),
});

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search) => signInSearch.parse(search),
  head: () => ({ meta: [{ title: "Sign in - Appco" }] }),
  component: SignInPage,
});

function SignInPage() {
  const { workspace, error } = Route.useSearch();
  return (
    <div className="relative min-h-[65vh]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="relative mx-auto w-full max-w-md px-6 py-16 sm:py-24">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-elevated sm:p-8">
          <h1 className="font-display text-3xl font-semibold">Sign in to your workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use the email and password for your ERPNext workspace.</p>
          {accountsEnabled ? (
            <form action={accountLoginEndpoint} method="post" className="mt-6 space-y-4">
              {error && <p role="alert" className="text-sm text-destructive">{errors[error]}</p>}
              <div className="space-y-2">
                <Label htmlFor="sign-in-email">Email</Label>
                <Input id="sign-in-email" name="email" type="email" autoComplete="username" maxLength={254} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign-in-password">Password</Label>
                <Input id="sign-in-password" name="password" type="password" autoComplete="current-password" maxLength={512} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sign-in-workspace">Workspace address</Label>
                <Input
                  id="sign-in-workspace"
                  name="workspace"
                  defaultValue={workspace}
                  placeholder="company.internpk.info"
                  maxLength={253}
                  autoCapitalize="none"
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="sign-in-workspace-help"
                  required={error === "workspace"}
                />
                <p id="sign-in-workspace-help" className="text-xs text-muted-foreground">
                  Optional if your email is linked to a single workspace.
                </p>
              </div>
              <Button type="submit" className="w-full">Sign in</Button>
            </form>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">Appco sign-in is currently unavailable. Please try again later.</p>
          )}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Need a workspace? <Link to="/signup" className="text-primary underline">Start a free trial</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
