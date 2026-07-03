import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            Built on ERPNext — hosted, isolated, automatic
          </div>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Your own ERP system,
            <br />
            <span className="text-gradient-accent">live in minutes.</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground sm:text-xl">
            Sign up, pick a plan, and get a dedicated ERPNext instance provisioned
            for your company. No servers to manage, no infrastructure to touch.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-gradient-accent text-primary-foreground shadow-glow">
              <Link to="/signup">
                Get your workspace <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/demo">Book a demo</Link>
            </Button>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            14-day free trial · No credit card required · Ready in under 5 minutes
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="rounded-2xl border border-border bg-surface shadow-elevated">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                acme.forgeerp.app / dashboard
              </span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-4">
              {[
                { label: "Revenue MTD", value: "€184,320", trend: "+12.4%" },
                { label: "Active employees", value: "47", trend: "+3" },
                { label: "Open invoices", value: "12", trend: "-2" },
                { label: "Inventory items", value: "1,284", trend: "+18" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg surface-elevated p-4">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="mt-2 font-display text-2xl font-semibold text-foreground">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-primary">{s.trend}</div>
                </div>
              ))}
              <div className="col-span-full mt-2 h-40 rounded-lg surface-elevated p-4">
                <div className="mb-2 text-xs text-muted-foreground">Cash flow</div>
                <svg viewBox="0 0 400 100" className="h-28 w-full">
                  <defs>
                    <linearGradient id="chart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.66 0.19 267)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="oklch(0.66 0.19 267)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,70 L40,60 L80,65 L120,45 L160,50 L200,30 L240,35 L280,20 L320,25 L360,15 L400,10 L400,100 L0,100 Z"
                    fill="url(#chart)"
                  />
                  <path
                    d="M0,70 L40,60 L80,65 L120,45 L160,50 L200,30 L240,35 L280,20 L320,25 L360,15 L400,10"
                    fill="none"
                    stroke="oklch(0.66 0.19 267)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
