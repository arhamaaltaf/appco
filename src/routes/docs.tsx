import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionEyebrow, SectionHeading, SectionSub } from "@/components/site/section";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
<<<<<<< Updated upstream
      { title: "Docs — Appco" },
      { name: "description", content: "Guides, API references, and admin documentation for Appco." },
      { property: "og:title", content: "Docs — Appco" },
      { property: "og:description", content: "Guides and references for Appco." },
=======
      { title: "Docs — appco" },
      { name: "description", content: "Guides, API references, and admin documentation for appco." },
      { property: "og:title", content: "Docs — appco" },
      { property: "og:description", content: "Guides and references for appco." },
>>>>>>> Stashed changes
    ],
  }),
  component: Docs,
});

function Docs() {
  const topics = [
    { title: "Getting started", body: "Provision your first workspace, invite users, and configure defaults." },
    { title: "HR & Payroll", body: "Employee lifecycle, pay runs, and statutory reporting." },
    { title: "Expense Management", body: "Submitting, approving, and reimbursing expenses." },
    { title: "Accounting", body: "Chart of accounts, invoicing, and reconciliation." },
    { title: "Inventory", body: "Warehouses, stock movements, and reorder rules." },
    { title: "API reference", body: "REST endpoints, authentication, and webhooks." },
  ];
  return (
    <Section>
      <SectionEyebrow>Documentation</SectionEyebrow>
      <SectionHeading>Everything you need to run your instance.</SectionHeading>
      <SectionSub>Docs are being migrated from our old wiki. Reach out to support if you can't find what you need.</SectionSub>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <div key={t.title} className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/40">
            <h3 className="font-display text-lg font-semibold text-foreground">{t.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
