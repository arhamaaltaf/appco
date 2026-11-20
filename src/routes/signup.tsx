import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { SignupForm, type SignupFormValues } from "@/components/signup/signup-form";
import { ProvisioningStatus } from "@/components/signup/provisioning-status";
import { signup, type PlanId } from "@/lib/api";
import { accountEmail, accountsEnabled, accountStart } from "@/lib/accounts";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  plan: z.enum(["starter", "growth", "enterprise"]).optional(),
});

export const Route = createFileRoute("/signup")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Create your workspace — Appco" },
      { name: "description", content: "Sign up and get your dedicated Appco instance provisioned in minutes." },
      { property: "og:title", content: "Create your workspace — Appco" },
      { property: "og:description", content: "Your own dedicated ERPNext instance, provisioned automatically." },
    ],
  }),
  component: SignupPage,
});

type Stage = { kind: "form" } | { kind: "provisioning"; jobId: string; company: string };

function SignupPage() {
  const { plan } = Route.useSearch();
  const [stage, setStage] = useState<Stage>({ kind: "form" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedInEmail, setSignedInEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (!accountsEnabled) return;
    const controller = new AbortController();
    accountEmail(controller.signal).then(setSignedInEmail).catch((reason: unknown) => {
      if (controller.signal.aborted) return;
      setSignedInEmail(null);
      setError(reason instanceof Error ? reason.message : "Appco sign-in is temporarily unavailable.");
    });
    return () => controller.abort();
  }, []);

  async function handleSubmit(values: SignupFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const { jobId } = await signup(values);
      setStage({ kind: "provisioning", jobId, company: values.companyName });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        {stage.kind === "form" ? (
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1fr_1.1fr] md:items-start">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Free 14-day trial
              </div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Get your workspace.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                We'll create a dedicated ERPNext instance for your company, isolated from every other
                customer. Most workspaces are ready in under 5 minutes.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                <li>· No credit card required</li>
                <li>· HR, Payroll, Expenses, Accounting, Inventory, CRM enabled</li>
                <li>· Cancel anytime; export all your data</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-elevated">
              {accountsEnabled && !signedInEmail ? (
                signedInEmail === undefined ? (
                  <p role="status" className="text-sm text-muted-foreground">Checking your Appco account…</p>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Create your Appco workspace</h2>
                    <p className="text-sm text-muted-foreground">Use your Appco account to set up and open your workspace.</p>
                    <Button asChild className="w-full bg-gradient-accent text-primary-foreground shadow-glow">
                      <a href={accountStart({ mode: "signup", plan })}>Continue with Appco</a>
                    </Button>
                  </div>
                )
              ) : (
                <SignupForm
                  defaultPlan={(plan ?? "growth") as PlanId}
                  signedInEmail={signedInEmail || undefined}
                  submitting={submitting}
                  onSubmit={handleSubmit}
                />
              )}
              {error && (
                <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          </div>
        ) : (
          <ProvisioningStatus
            jobId={stage.jobId}
            companyName={stage.company}
            onReset={() => setStage({ kind: "form" })}
          />
        )}
      </div>
    </div>
  );
}
