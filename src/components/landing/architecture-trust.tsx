import { Section, SectionEyebrow, SectionHeading, SectionSub } from "@/components/site/section";
import { Building2, Database, Lock } from "lucide-react";

export function ArchitectureTrust() {
  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <SectionEyebrow>Isolation by design</SectionEyebrow>
          <SectionHeading>Every customer, their own instance.</SectionHeading>
          <SectionSub>
            Your ERP runs on infrastructure dedicated to your company — separate database, separate app,
            separate backups. No shared tables, no noisy neighbors, no accidental crossover.
          </SectionSub>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            Encrypted at rest and in transit · Daily backups · EU or US hosting
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-hero" />
          <div className="grid gap-3">
            {[
              { name: "Acme GmbH", region: "eu-west", color: "oklch(0.66 0.19 267)" },
              { name: "Northwind Ltd.", region: "us-east", color: "oklch(0.72 0.17 295)" },
              { name: "Voltera SA", region: "eu-central", color: "oklch(0.7 0.18 200)" },
            ].map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg surface-elevated">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{c.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{c.region}</div>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
                  <Database className="h-3.5 w-3.5" style={{ color: c.color }} />
                  <span className="font-mono text-xs text-muted-foreground">isolated instance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
