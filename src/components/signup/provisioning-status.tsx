import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { getSignupStatus, type StatusResponse } from "@/lib/api";
import { StageList, type StageKey } from "./stage-list";
import { Button } from "@/components/ui/button";

const tips = [
  "Each Forge workspace is a fully isolated ERPNext instance — no shared databases.",
  "You can invite unlimited teammates during your free trial.",
  "HR, Payroll, Expenses, Accounting, Inventory, and CRM ship enabled by default.",
  "Automatic daily backups start the moment your instance is live.",
  "Custom domains and SSO can be enabled from workspace settings.",
];

function stageFromStatus(s: StatusResponse): StageKey {
  const raw = s.stage ?? s.status;
  if (raw === "installing" || s.status === "installing") return "installing";
  if (raw === "configuring" || s.status === "configuring") return "configuring";
  if (raw === "finalizing") return "finalizing";
  return "creating";
}

export function ProvisioningStatus({
  jobId,
  companyName,
  onReset,
}: {
  jobId: string;
  companyName: string;
  onReset: () => void;
}) {
  const [status, setStatus] = useState<StatusResponse>({ status: "pending" });
  const [elapsed, setElapsed] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const started = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started.current) / 1000)), 1000);
    const tip = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 6000);
    return () => {
      clearInterval(t);
      clearInterval(tip);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    let timeout: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const s = await getSignupStatus(jobId);
        if (!alive) return;
        setStatus(s);
        if (s.status === "ready" && s.siteUrl) {
          // Small delay so the success animation is visible before redirect.
          setTimeout(() => window.location.assign(s.siteUrl!), 2500);
          return;
        }
        if (s.status === "failed") return;
      } catch {
        // swallow, keep polling
      }
      timeout = setTimeout(poll, 2000);
    }
    poll();
    return () => {
      alive = false;
      clearTimeout(timeout);
    };
  }, [jobId]);

  const progress = Math.max(0.05, Math.min(status.progress ?? (elapsed / 60), 0.98));
  const isReady = status.status === "ready";
  const isFailed = status.status === "failed";

  if (isReady) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md rounded-2xl border border-primary/40 bg-surface p-10 text-center shadow-glow"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-accent shadow-glow">
          <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">Your workspace is ready.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Redirecting you to {companyName}'s new home.
        </p>
        <div className="mt-6 rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground">
          {status.siteUrl}
        </div>
        <Button
          asChild
          className="mt-6 w-full bg-gradient-accent text-primary-foreground shadow-glow"
          size="lg"
        >
          <a href={status.siteUrl}>
            Open your workspace <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </motion.div>
    );
  }

  if (isFailed) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-destructive/40 bg-surface p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">Something went wrong.</h2>
        <p className="mt-2 text-sm text-muted-foreground">{status.error ?? "We couldn't finish provisioning."}</p>
        <div className="mt-6 flex gap-2">
          <Button variant="outline" onClick={onReset} className="flex-1">Try again</Button>
          <Button asChild variant="ghost" className="flex-1">
            <a href="/contact">Contact us</a>
          </Button>
        </div>
      </div>
    );
  }

  const currentStage = stageFromStatus(status);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-elevated">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Provisioning</div>
            <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
              Building {companyName}
            </h2>
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-muted-foreground">Elapsed</div>
            <div className="font-mono text-lg text-foreground">
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
              {String(elapsed % 60).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-background">
          <motion.div
            className="h-full bg-gradient-accent"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <StageList current={currentStage} />

        <div className="mt-6 min-h-[3rem] rounded-lg border border-dashed border-border bg-background/40 p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Did you know?</div>
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="mt-1 text-sm text-foreground"
            >
              {tips[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        You can keep this tab open — we'll redirect you the moment your workspace is ready.
      </p>
    </div>
  );
}
