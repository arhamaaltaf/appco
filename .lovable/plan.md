
## Assumptions (flag if wrong)

- Brand name placeholder: **"Forge ERP"** — easy to find/replace later.
- Accent color: electric indigo (`oklch(0.62 0.19 265)`) on a near-black dark surface, with a light-mode variant. One accent only.
- Typography: Inter Tight (display) + Inter (body) — modern SaaS, not generic.
- No backend, no Supabase, no auth. All network calls go to `import.meta.env.VITE_API_URL` with sensible mock fallbacks so the UI is fully demoable out of the box.
- Motion via `framer-motion` (subtle: fade/slide-in on scroll, hover lifts, progress transitions).

## Routes (TanStack Start, file-based)

```
src/routes/
  __root.tsx           header + footer shell, dark theme default
  index.tsx            landing (hero, logos, features, how-it-works, pricing, testimonials, FAQ)
  signup.tsx           create-workspace form + provisioning status view
  demo.tsx             simple "book a demo" page (calendar embed placeholder + contact form)
  about.tsx            short company page
  contact.tsx          contact form
  docs.tsx             placeholder docs landing
  privacy.tsx          placeholder legal
  terms.tsx            placeholder legal
```

Each route sets its own `head()` (title, description, og:title, og:description). No `og:image` on `__root`.

## Landing page composition (`/`)

1. **Hero** — large headline "Your own ERP system, live in minutes.", sub "Built on ERPNext — hosted, isolated, and provisioned automatically. Zero servers to manage." Primary CTA → `/signup`, secondary → `/demo`. Subtle animated gradient orb behind the headline.
2. **Trusted-by strip** — 6 monochrome placeholder wordmarks.
3. **Features grid** — 4 cards: Automated provisioning, Dedicated isolated instances, Modules (HR & Payroll, Expenses front-and-center; Accounting/Inventory/CRM listed as included), Fast onboarding.
4. **How it works** — 3-step horizontal visual: Sign up → Pick a plan → Workspace ready (<5 min). Animated connector line.
5. **Architecture trust block** — simple diagram: "Your company → your own ERP instance", repeated for two more customers, visually separated. One paragraph of reassurance copy. No systems diagram.
6. **Pricing** — 3 tiers (Starter / Growth / Enterprise), monthly/annual toggle (annual = ~2 months free). Feature checklist per tier. Each CTA links to `/signup?plan=starter|growth|enterprise`.
7. **Testimonials** — 3 placeholder quote cards.
8. **FAQ** — accordion with the 4 required questions plus 2 extras (billing, cancellation).
9. **Footer** — link columns (Product, Company, Legal), newsletter input (POSTs to `${VITE_API_URL}/newsletter`, mocked), social icons.

## Signup flow (`/signup`)

State machine in a single route component:

```
idle → submitting → provisioning → ready | error
```

- **Form step**: Company name, Work email, Password (min 8), Plan (radio, pre-filled from `?plan=` query). Validation with `zod` + `react-hook-form` (already in project). Submit → `POST ${VITE_API_URL}/signup` → expects `{ jobId }`.
- **Provisioning step**: full-viewport reassuring layout with:
  - Animated stage list with 4 stages: "Creating your workspace" → "Installing modules" → "Configuring your instance" → "Almost ready". Current stage animates; completed stages get a check.
  - A soft progress bar (indeterminate until backend returns percentage).
  - Rotating tips ("Did you know? Each instance runs in complete isolation…") every 6s.
  - Elapsed time counter.
  - Polls `GET ${VITE_API_URL}/signup/status/:jobId` every 2s. Response shape assumed: `{ status: 'pending'|'provisioning'|'ready'|'failed', stage?: string, progress?: number, siteUrl?: string, error?: string }`. Stage strings mapped to the 4 UI stages.
- **Ready**: success card with confetti-free tasteful check, workspace URL, "Open your workspace" button that `window.location.assign(siteUrl)`.
- **Error**: friendly error card with retry (re-POST) and contact-support link.

If `VITE_API_URL` is unset, use an in-memory mock that resolves after ~15s so the UX is demoable — clearly commented, easy to remove.

## API layer

`src/lib/api.ts` — thin fetch wrapper:
- `signup(payload)` → `{ jobId }`
- `getSignupStatus(jobId)` → status object
- `subscribeNewsletter(email)` → `{ ok: true }`
- `bookDemo(payload)` → `{ ok: true }`

Reads `import.meta.env.VITE_API_URL`. Falls back to mock module (`src/lib/api.mock.ts`) when unset. All calls typed with zod-parsed responses.

## Design system

Update `src/styles.css`:
- Default the app to `.dark` on `<html>` (dark-first, light supported).
- Rewrite `:root` / `.dark` tokens for the palette: near-black background, elevated surface, indigo accent, muted foreground, subtle border.
- Add `--font-display` and `--font-sans` tokens; load Inter + Inter Tight via `<link>` in `__root.tsx` head.
- Add `--gradient-hero` and `--shadow-elevated` utility tokens.

No hard-coded color classes in components — everything through semantic tokens.

## Components to add

```
src/components/
  site/
    header.tsx            sticky, blurred, nav + CTA
    footer.tsx
    logo.tsx
    section.tsx           consistent vertical rhythm wrapper
  landing/
    hero.tsx
    trusted-by.tsx
    features.tsx
    how-it-works.tsx
    architecture-trust.tsx
    pricing.tsx
    testimonials.tsx
    faq.tsx
    newsletter.tsx
  signup/
    signup-form.tsx
    provisioning-status.tsx
    stage-list.tsx
```

Header/footer rendered in `__root.tsx` around `<Outlet />`.

## Technical notes

- Install `framer-motion` via `bun add framer-motion`. `zod` and `react-hook-form` are already present via shadcn form.
- No new routes under `src/routes/api/` — this is frontend-only.
- No Supabase client, no `requireSupabaseAuth`, no cloud enablement.
- All head metadata per-route; root sets only defaults + fonts + favicon.
- Responsive: mobile-first, hamburger nav under `md`, pricing cards stack, hero text scales.
- Accessibility: labeled inputs, focus rings via `--ring`, accordion via existing shadcn primitive, reduced-motion respected in framer-motion variants.

## Out of scope

- Real provisioning, auth, persistence, email sending.
- Docs content beyond a placeholder landing.
- i18n.
