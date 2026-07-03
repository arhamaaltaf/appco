import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("error");
    setState("loading");
    try {
      await subscribeNewsletter(email);
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm gap-2">
      <Input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-surface"
        aria-label="Email"
      />
      <Button type="submit" disabled={state === "loading"} variant="secondary">
        {state === "done" ? "Subscribed" : state === "loading" ? "…" : "Notify me"}
      </Button>
    </form>
  );
}
