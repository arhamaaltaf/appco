import { motion } from "framer-motion";
import { Boxes, CheckCircle2, Clock, Database, Sparkles } from "lucide-react";

export type StageKey = "queued" | "creating" | "installing" | "finalizing";

const stages: { key: StageKey; label: string; hint: string; icon: typeof Clock }[] = [
  { key: "queued", label: "Getting things ready…", hint: "Preparing the provisioning job", icon: Clock },
  { key: "creating", label: "Creating your workspace…", hint: "Reserving a dedicated instance", icon: Database },
  { key: "installing", label: "Installing your ERP modules…", hint: "Bootstrapping ERPNext and its core apps", icon: Boxes },
  { key: "finalizing", label: "Almost there…", hint: "Running final checks and opening access", icon: Sparkles },
];

function formatElapsed(seconds: number) {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function StageList({
  current,
  progress,
  elapsedSeconds,
}: {
  current: StageKey;
  progress: number;
  elapsedSeconds: number;
}) {
  const stage = stages.find((s) => s.key === current) ?? stages[0];
  const Icon = stage.icon;

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Current step</div>
          <div className="mt-1 text-base font-semibold text-foreground">{stage.label}</div>
          <div className="mt-1 text-sm text-muted-foreground">{stage.hint}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{Math.round(progress)}% complete</span>
        <span className="font-mono">{formatElapsed(elapsedSeconds)} elapsed</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-gradient-accent"
          animate={{ width: `${Math.max(4, progress)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span>This usually takes a few minutes — up to 5 minutes for larger setups.</span>
      </div>
    </div>
  );
}
