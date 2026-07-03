import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

export type StageKey = "creating" | "installing" | "configuring" | "finalizing";

const stages: { key: StageKey; label: string; hint: string }[] = [
  { key: "creating", label: "Creating your workspace", hint: "Reserving a dedicated instance" },
  { key: "installing", label: "Installing modules", hint: "HR, Payroll, Expenses, Accounting, Inventory, CRM" },
  { key: "configuring", label: "Configuring your instance", hint: "Applying defaults and access controls" },
  { key: "finalizing", label: "Almost ready", hint: "Warming up and running health checks" },
];

export function StageList({ current }: { current: StageKey }) {
  const idx = stages.findIndex((s) => s.key === current);
  return (
    <ol className="space-y-3">
      {stages.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li
            key={s.key}
            className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
              active ? "border-primary/50 bg-primary/5" : "border-border bg-surface"
            }`}
          >
            <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-border bg-background">
              {done ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : active ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              )}
            </div>
            <div className="flex-1">
              <motion.div
                animate={{ opacity: active ? 1 : done ? 0.9 : 0.5 }}
                className="text-sm font-medium text-foreground"
              >
                {s.label}
              </motion.div>
              <div className="text-xs text-muted-foreground">{s.hint}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
