import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { getSignupStatus, type StatusResponse } from "@/lib/api";
import { StageList, type StageKey } from "./stage-list";
import { Button } from "@/components/ui/button";

const ADMIN_REFRESH_EVENT = "appco:admin-refresh";

const tips = [
  "Each appco workspace is a fully isolated ERPNext instance — no shared databases.",
  "You can invite unlimited teammates during your free trial.",
  "HR, Payroll, Expenses, Accounting, Inventory, and CRM ship enabled by default.",
  "Automatic daily backups start the moment your instance is live.",
  "Custom domains and SSO can be enabled from workspace settings.",
];

function stageFromProgress(progress?: number): StageKey {
  if (typeof progress !== "number") return "queued";
  if (progress >= 100) return "finalizing";
  if (progress >= 60) return "installing";
  if (progress >= 10) return "creating";
  return "queued";
}

function formatElapsed(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainderSeconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainderSeconds).padStart(2, "0")}`;
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
    const t = window.setInterval(() => setElapsed((Date.now() - started.current) / 1000), 250);
    const tip = window.setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 6000);
    return () => {
      clearInterval(t);
      clearInterval(tip);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    let timeout: number | undefined;
    async function poll() {
      try {
        const s = await getSignupStatus(jobId);
        if (!alive) return;
        setStatus(s);
        if (s.status === "ready" || s.status === "failed") return;
      } catch {
        // swallow, keep polling
      }
      timeout = window.setTimeout(poll, 2000);
    }
    poll();
    return () => {
      alive = false;
      window.clearTimeout(timeout);
    };
  }, [jobId]);

  const backendProgress = typeof status.progress === "number" ? status.progress : 0;
  const elapsedProgress = Math.min(95, Math.max(5, elapsed * 1.8));
  const progressValue = status.status === "ready" ? 100 : Math.max(backendProgress, elapsedProgress);
  const progress = Math.max(0, Math.min(100, progressValue));
  const isReady = status.status === "ready";
  const isFailed = status.status === "failed";
  const currentStage = stageFromProgress(progress);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem("appco:last-signup-ready-at", String(Date.now()));
    } catch {
      // A browser storage restriction should not interrupt workspace access.
    }
    window.dispatchEvent(new Event(ADMIN_REFRESH_EVENT));
  }, [isReady]);

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
          Sign in to {companyName}'s new workspace with the work email and password you used to sign up.
        </p>
        <div className="mt-6 rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground">
          {status.siteUrl}
        </div>
        <Button
          asChild
          className="mt-6 w-full bg-gradient-accent text-primary-foreground shadow-glow"
          size="lg"
        >
          <a href={status.siteUrl} target="_blank" rel="noopener noreferrer">
            Open your workspace <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </motion.div>
    );
  }

  if (isFailed) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-destructive/40 bg-surface p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">
          We hit a snag setting up your workspace.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {status.error ?? "We couldn't finish provisioning. Please try again or contact support if the problem continues."}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onReset} className="flex-1">
            Try again
          </Button>
          <Button asChild variant="ghost" className="flex-1">
            <a href="/contact">Contact support</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-elevated">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Provisioning</div>
            <h2 className="mt-1 font-display text-2xl font-semibold text-foreground">
              Setting up your workspace
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              This usually takes a few minutes — up to 5 minutes for larger setups.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background/70 px-3 py-2 text-right">
            <div className="font-mono text-xs text-muted-foreground">Elapsed</div>
            <div className="font-mono text-lg text-foreground">
              {formatElapsed(elapsed)}
            </div>
          </div>
        </div>

        <StageList current={currentStage} progress={progress} elapsedSeconds={elapsed} />

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
        Keep this tab open to get your workspace link when it's ready.
      </p>
    </div>
  );
}
