import { motion } from "framer-motion";
import { UserPlus, CreditCard, CheckCircle2 } from "lucide-react";
import { Section, SectionEyebrow, SectionHeading, SectionSub } from "@/components/site/section";

const steps = [
  {
    icon: UserPlus,
    title: "Sign up",
    body: "Create your account with your company email. Takes about 30 seconds.",
    time: "0:00",
  },
  {
    icon: CreditCard,
    title: "Pick a plan",
    body: "Choose Starter, Growth, or Enterprise. Change or cancel anytime.",
    time: "0:45",
  },
  {
    icon: CheckCircle2,
    title: "Your ERP is ready",
    body: "We provision an isolated instance and hand you the keys.",
    time: "< 5:00",
  },
];

export function HowItWorks() {
  return (
    <Section id="how">
      <SectionEyebrow>How it works</SectionEyebrow>
      <SectionHeading>Three steps between you and a running ERP.</SectionHeading>
      <SectionSub>No servers to configure, no databases to migrate, no downtime windows to schedule.</SectionSub>

      <div className="relative mt-16">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface shadow-elevated">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <div className="font-mono text-xs text-muted-foreground">{s.time}</div>
                <h3 className="mt-1 font-display text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
