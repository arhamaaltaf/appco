import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-display font-semibold text-foreground ${className}`}>
      <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-accent shadow-glow">
        <span className="absolute inset-0.5 rounded-[5px] bg-background/40" />
        <span className="relative font-display text-sm font-bold text-foreground">A</span>
      </span>
      <span className="tracking-tight">Appco</span>
    </Link>
  );
}
