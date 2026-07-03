import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionEyebrow, SectionHeading } from "@/components/site/section";

const faqs = [
  {
    q: "Is my data isolated from other companies?",
    a: "Yes. Each customer runs on a dedicated ERPNext instance with its own database, application server, and backups. There is no shared multi-tenant database.",
  },
  {
    q: "How long does setup take?",
    a: "Most workspaces are provisioned in under five minutes. You'll see a live progress view during signup, and we redirect you the moment your instance is ready.",
  },
  {
    q: "Can I add users later?",
    a: "Absolutely. You can add, remove, and reassign users at any time from your workspace admin. Your plan sets the included seat count; extra seats are billed pro-rata.",
  },
  {
    q: "What happens if I upgrade my plan?",
    a: "Upgrades are immediate — new modules and seats are enabled on your existing instance without downtime. Downgrades take effect at the end of your billing cycle.",
  },
  {
    q: "Which modules are included?",
    a: "HR & Payroll and Expense Management are our focus. Every plan also includes core ERPNext modules: Accounting, Inventory, and CRM. Higher tiers unlock custom workflows and integrations.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your workspace settings; you'll keep access until the end of the paid period and can export all your data on the way out.",
  },
];

export function FAQ() {
  return (
    <Section id="faq">
      <SectionEyebrow>FAQ</SectionEyebrow>
      <SectionHeading>Answers before you ask.</SectionHeading>
      <div className="mt-12 rounded-2xl border border-border bg-surface">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="border-border px-6 last:border-b-0">
              <AccordionTrigger className="text-left font-display text-lg font-medium">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
