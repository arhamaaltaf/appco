import { Section, SectionEyebrow, SectionHeading } from "@/components/site/section";

const quotes = [
  {
    quote: "We replaced three tools with Forge in a weekend. Payroll used to take a day — now it's an hour.",
    author: "Ines Vogel",
    role: "COO, Voltera SA",
  },
  {
    quote: "The provisioning experience sold us. We saw our instance live before our coffee got cold.",
    author: "Marcus Cheng",
    role: "Founder, Kepler Labs",
  },
  {
    quote: "Every team has its own weird workflow. Forge bent to ours instead of the other way around.",
    author: "Amelia Ross",
    role: "Head of Ops, Northwind",
  },
];

export function Testimonials() {
  return (
    <Section>
      <SectionEyebrow>Customers</SectionEyebrow>
      <SectionHeading>Teams that stopped fighting their tools.</SectionHeading>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <figure key={q.author} className="rounded-2xl border border-border bg-surface p-6">
            <blockquote className="text-foreground">"{q.quote}"</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-accent font-display text-sm font-semibold text-primary-foreground">
                {q.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{q.author}</div>
                <div className="text-xs text-muted-foreground">{q.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
