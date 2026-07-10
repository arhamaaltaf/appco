import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookDemo } from "@/lib/api";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
<<<<<<< Updated upstream
      { title: "Book a demo — Appco" },
      { name: "description", content: "See Appco in action. Book a 30-minute walkthrough with our team." },
      { property: "og:title", content: "Book a demo — Appco" },
      { property: "og:description", content: "See Appco in action. 30 minutes, no slides." },
=======
      { title: "Book a demo — appco" },
      { name: "description", content: "See appco in action. Book a 30-minute walkthrough with our team." },
      { property: "og:title", content: "Book a demo — appco" },
      { property: "og:description", content: "See appco in action. 30 minutes, no slides." },
>>>>>>> Stashed changes
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      await bookDemo(form);
      setState("done");
    } catch {
      setState("idle");
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="relative mx-auto grid max-w-5xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            See appco in 30 minutes.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A live walkthrough of provisioning, modules, and admin — tailored to your business. No slides.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>· Live provisioning of a real instance</li>
            <li>· HR, Payroll, Expenses walkthrough</li>
            <li>· Q&A with a product engineer</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-elevated">
          {state === "done" ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-4 font-display text-xl font-semibold">Thanks — we'll be in touch.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Expect an email within one business day to pick a time that works.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">What would you like to see?</Label>
                <Textarea id="message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <Button
                type="submit"
                disabled={state === "loading"}
                className="w-full bg-gradient-accent text-primary-foreground shadow-glow"
                size="lg"
              >
                {state === "loading" ? "Sending…" : "Request demo"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
