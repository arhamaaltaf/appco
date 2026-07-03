import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Section, SectionEyebrow, SectionHeading, SectionSub } from "@/components/site/section";
import { Button } from "@/components/ui/button";

type Billing = "monthly" | "annual";

const tiers = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For small teams getting off spreadsheets.",
    monthly: 49,
    annual: 39,
    features: ["Up to 5 users", "HR & Payroll", "Expense Management", "Accounting basics", "10 GB storage", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For growing companies running full operations.",
    monthly: 149,
    annual: 119,
    featured: true,
    features: [
      "Up to 25 users",
      "All Starter modules",
      "Inventory & CRM",
      "Custom workflows",
      "100 GB storage",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For established teams with custom requirements.",
    monthly: 449,
    annual: 359,
    features: [
      "Unlimited users",
      "All modules included",
      "SSO / SAML",
      "Custom integrations",
      "1 TB storage",
      "Dedicated CSM & SLA",
    ],
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <Section id="pricing">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <SectionEyebrow>Pricing</SectionEyebrow>
          <SectionHeading>Simple pricing. Every plan is a real instance.</SectionHeading>
          <SectionSub>Change tiers anytime. Annual billing saves you two months.</SectionSub>
        </div>
        <div className="inline-flex rounded-full border border-border bg-surface p-1 text-sm">
          {(["monthly", "annual"] as Billing[]).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`rounded-full px-4 py-1.5 capitalize transition-colors ${
                billing === b ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {b}
              {b === "annual" && <span className="ml-1 text-xs opacity-80">-20%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.id}
            className={`relative flex flex-col rounded-2xl border p-8 ${
              t.featured
                ? "border-primary/50 bg-surface shadow-glow"
                : "border-border bg-surface"
            }`}
          >
            {t.featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-gradient-accent px-3 py-1 text-xs font-medium text-primary-foreground">
                Most popular
              </span>
            )}
            <div className="font-display text-xl font-semibold text-foreground">{t.name}</div>
            <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-5xl font-semibold text-foreground">
                €{billing === "monthly" ? t.monthly : t.annual}
              </span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {billing === "annual" ? "Billed annually" : "Billed monthly"}
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-8 ${t.featured ? "bg-gradient-accent text-primary-foreground shadow-glow" : ""}`}
              variant={t.featured ? "default" : "outline"}
            >
              <Link to="/signup" search={{ plan: t.id }}>
                Start with {t.name}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </Section>
  );
}
