import { motion } from "framer-motion";
import { Zap, Shield, Boxes, Rocket } from "lucide-react";
import { Section, SectionEyebrow, SectionHeading, SectionSub } from "@/components/site/section";

const features = [
  {
    icon: Zap,
    title: "Automated provisioning",
    body: "Sign up and get a dedicated ERP instance in minutes. No manual setup, no consultants, no email tickets.",
  },
  {
    icon: Shield,
    title: "Dedicated, isolated instances",
    body: "Every customer runs on their own instance — not a shared multi-tenant database. Your data stays yours.",
  },
  {
    icon: Boxes,
    title: "Modules that matter",
    body: "HR & Payroll and Expense Management are our focus. Accounting, Inventory, and CRM ship included.",
    tags: ["HR & Payroll", "Expenses", "Accounting", "Inventory", "CRM"],
  },
  {
    icon: Rocket,
    title: "Fast onboarding",
    body: "Ready in under 5 minutes. Invite your team, import data, and start operating the same day.",
  },
];

export function Features() {
  return (
    <Section id="features">
      <SectionEyebrow>What you get</SectionEyebrow>
      <SectionHeading>An ERP without the ERP project.</SectionHeading>
      <SectionSub>
        We handle infrastructure, updates, backups, and provisioning so your team can focus on running the business.
      </SectionSub>
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-primary/40"
          >
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
              <f.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-muted-foreground">{f.body}</p>
            {f.tags && (
              <div className="mt-5 flex flex-wrap gap-2">
                {f.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
