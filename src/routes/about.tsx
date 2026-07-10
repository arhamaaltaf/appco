import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionEyebrow, SectionHeading, SectionSub } from "@/components/site/section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Appco" },
      { name: "description", content: "We build hosted, isolated ERPNext instances so small and mid-sized teams can run their business without infrastructure work." },
      { property: "og:title", content: "About — Appco" },
      { property: "og:description", content: "We build hosted ERPNext for teams that want to focus on operations, not servers." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Section>
      <SectionEyebrow>About</SectionEyebrow>
      <SectionHeading>ERPNext without the ERP project.</SectionHeading>
      <SectionSub>
        Appco was built by operators tired of shared spreadsheets, half-finished implementations, and
        enterprise sales cycles. We host and provision ERPNext so growing teams get a real ERP in minutes.
      </SectionSub>
      <div className="mt-12 grid gap-6 text-muted-foreground md:grid-cols-2">
        <p>
          Every customer gets a dedicated ERPNext instance. No shared multi-tenant database, no noisy
          neighbors, no accidental crossover between companies. When we ship an update, it rolls out
          instance by instance with automatic backups.
        </p>
        <p>
          We focus on HR & Payroll and Expense Management out of the gate, with Accounting, Inventory,
          and CRM available on every plan. If you outgrow us, you own your data and can export it any
          time — no lock-in games.
        </p>
      </div>
    </Section>
  );
}
