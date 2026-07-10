import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionEyebrow, SectionHeading } from "@/components/site/section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Appco" },
      { name: "description", content: "How Appco handles your data, dedicated instances, encryption, and retention." },
      { property: "og:title", content: "Privacy — Appco" },
      { property: "og:description", content: "How Appco handles your data." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <Section>
      <SectionEyebrow>Privacy</SectionEyebrow>
      <SectionHeading>Your data lives on your instance.</SectionHeading>
      <div className="mt-8 max-w-3xl space-y-4 text-muted-foreground">
        <p>
          This page is maintained by Appco to answer common privacy questions about our service. It
          is not a certification and does not replace our Data Processing Agreement.
        </p>
        <p>
          Every customer runs on a dedicated ERPNext instance with its own database and backups. Data is
          encrypted at rest and in transit. Customers can request export or deletion of their data at any
          time.
        </p>
        <p>
          For a complete, up-to-date policy including subprocessors, retention periods, and privacy
          requests, contact privacy@appco.app.
        </p>
      </div>
    </Section>
  );
}
