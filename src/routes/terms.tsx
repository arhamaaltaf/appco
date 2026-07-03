import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionEyebrow, SectionHeading } from "@/components/site/section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Forge ERP" },
      { name: "description", content: "Terms of service for Forge ERP hosted ERPNext instances." },
      { property: "og:title", content: "Terms — Forge ERP" },
      { property: "og:description", content: "Terms of service for Forge ERP." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <Section>
      <SectionEyebrow>Terms</SectionEyebrow>
      <SectionHeading>Fair terms, no surprises.</SectionHeading>
      <div className="mt-8 max-w-3xl space-y-4 text-muted-foreground">
        <p>
          These terms govern your use of Forge ERP hosted instances. This is a placeholder summary — the
          full, binding terms are provided at signup and available on request.
        </p>
        <p>
          You own your data. You can export it at any time. We provide the service on a monthly or annual
          basis and either party may terminate at the end of a billing period.
        </p>
        <p>Questions? Contact legal@forgeerp.app.</p>
      </div>
    </Section>
  );
}
