import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionEyebrow, SectionHeading } from "@/components/site/section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Appco" },
      { name: "description", content: "Terms of service for Appco hosted ERPNext instances." },
      { property: "og:title", content: "Terms — Appco" },
      { property: "og:description", content: "Terms of service for Appco." },
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
          These terms govern your use of Appco hosted instances. This is a placeholder summary — the
          full, binding terms are provided at signup and available on request.
        </p>
        <p>
          You own your data. You can export it at any time. We provide the service on a monthly or annual
          basis and either party may terminate at the end of a billing period.
        </p>
        <p>Questions? Contact legal@appco.app.</p>
      </div>
    </Section>
  );
}
