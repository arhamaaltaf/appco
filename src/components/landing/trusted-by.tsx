const logos = ["NORTHWIND", "acme.co", "LUMEN", "Voltera", "PARALLAX", "kepler/"];

export function TrustedBy() {
  return (
    <div className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by teams shipping faster
        </div>
        <div className="grid grid-cols-3 items-center justify-items-center gap-8 md:grid-cols-6">
          {logos.map((l) => (
            <div
              key={l}
              className="font-display text-lg font-semibold tracking-tight text-muted-foreground/70 grayscale transition-all hover:text-foreground hover:grayscale-0"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
