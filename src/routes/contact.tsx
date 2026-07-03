import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionEyebrow, SectionHeading, SectionSub } from "@/components/site/section";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Forge ERP" },
      { name: "description", content: "Get in touch with the Forge ERP team. Sales, support, and partnerships." },
      { property: "og:title", content: "Contact — Forge ERP" },
      { property: "og:description", content: "Reach the Forge ERP team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <Section>
      <SectionEyebrow>Contact</SectionEyebrow>
      <SectionHeading>Talk to a human.</SectionHeading>
      <SectionSub>We answer emails within one business day.</SectionSub>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { label: "Sales", email: "sales@forgeerp.app" },
          { label: "Support", email: "support@forgeerp.app" },
          { label: "Partnerships", email: "partners@forgeerp.app" },
        ].map((c) => (
          <a
            key={c.email}
            href={`mailto:${c.email}`}
            className="group rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/40"
          >
            <Mail className="h-5 w-5 text-primary" />
            <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
            <div className="mt-1 font-display text-lg text-foreground group-hover:text-primary">{c.email}</div>
          </a>
        ))}
      </div>
    </Section>
  );
}
