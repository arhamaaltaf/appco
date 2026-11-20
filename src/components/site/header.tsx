import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { accountsEnabled } from "@/lib/accounts";

const nav = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "How it works", href: "/#how" },
  { label: "FAQ", href: "/#faq" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {accountsEnabled && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/sign-in">Sign in</Link>
            </Button>
          )}
          <Button asChild variant="ghost" size="sm">
            <Link to="/demo">Book a demo</Link>
          </Button>
          <Button asChild size="sm" className="bg-gradient-accent text-primary-foreground shadow-glow">
            <Link to="/signup">Start free trial</Link>
          </Button>
        </div>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {accountsEnabled && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/sign-in" onClick={() => setOpen(false)}>Sign in</Link>
                </Button>
              )}
              <Button asChild variant="outline" size="sm">
                <Link to="/demo">Book a demo</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-accent text-primary-foreground">
                <Link to="/signup" onClick={() => setOpen(false)}>Start free trial</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
