# Webvise Marketing Site Rebuild

**Date:** 2026-03-06
**Status:** APPROVED — Consensus reached (Planner + Architect + Critic)
**Complexity:** HIGH

---

## RALPLAN-DR Summary

### Principles

1. **Coexistence over migration** — Marketing pages must coexist with existing dashboard/auth/todos/ai routes without breaking them. Zero regressions on existing functionality.
2. **Static-first performance** — Marketing pages are purely presentational. Use SSG/RSC with no client-side data fetching (no tRPC). Target 90+ Lighthouse.
3. **Separation of concerns** — Marketing layout, components, and content data live in their own directories, clearly separated from dashboard concerns.
4. **i18n-ready but English-only** — Install the infrastructure (next-intl) now, but do not over-engineer. English-only at launch; translation files are the only thing needed to add languages later.
5. **Design system fidelity** — peec.ai monochrome aesthetic is the north star. All components follow the defined color palette (#000, #fff, #f7f7f7, #595959, #6d6d6d), spacing (40/80px rhythm), and typography (Geist headings, Inter body).

### Decision Drivers (Top 3)

1. **Route isolation** — Marketing pages (/, /services/*) must have a completely different layout (sticky marketing nav, footer) than dashboard pages (sidebar header, user menu). The root layout currently wraps everything with the dashboard Header.
2. **i18n integration strategy** — next-intl requires either middleware-based locale routing or a lighter "server-only" mode. The choice affects URL structure and complexity.
3. **Content management** — Service page data (pricing, features, process steps) must be structured for reuse across homepage sections and subpages without duplication.

### Viable Options

#### Decision 1: Layout Split Strategy

**Option A: Route Group Layouts (RECOMMENDED)**
- Create `(marketing)` and `(dashboard)` route groups under `app/`
- `(marketing)/layout.tsx` has sticky nav + footer, no tRPC/auth providers
- `(dashboard)/layout.tsx` keeps existing Header + Providers
- Root `layout.tsx` becomes minimal (html/body/fonts/ThemeProvider only)
- **Pros:** Clean separation, no conditional logic, each layout is self-contained, follows Next.js conventions
- **Cons:** Requires moving existing route files into `(dashboard)/` group, one-time file reorganization

**Option B: Conditional Layout in Root**
- Single layout.tsx with path-based conditional rendering (marketing nav vs dashboard nav)
- **Pros:** No file moves needed
- **Cons:** Brittle conditional logic, mixing concerns, harder to maintain, root layout becomes complex client component
- **INVALIDATED:** Violates principle #3 (separation of concerns). Conditional rendering in root layout creates coupling between marketing and dashboard. Also forces the root layout to become a client component to read pathname, losing RSC benefits.

#### Decision 2: i18n Strategy

**Option A: next-intl Server-Only Mode (RECOMMENDED)**
- Use `next-intl` with server-only configuration (no middleware, no locale prefix in URLs)
- Messages loaded via `getRequestConfig` in `i18n/request.ts`
- English-only JSON message file at `messages/en.json`
- No URL changes needed (`/` stays `/`, not `/en/`)
- **Pros:** Zero URL impact, minimal config, no middleware complexity, easy to add locale prefix later
- **Cons:** Adding locale-prefixed URLs later requires adding middleware (but this is additive, not destructive)

**Option B: next-intl with Middleware + Locale Prefix**
- Full middleware-based setup with `[locale]` segment in URL paths
- **Pros:** Full i18n from day one, clean URL structure per locale
- **Cons:** Adds `[locale]` segment to ALL routes (including dashboard), middleware complexity, overkill for English-only launch, breaks existing typed routes
- **INVALIDATED:** English-only launch makes locale prefixes unnecessary overhead. Adding middleware that intercepts all routes risks breaking existing dashboard/auth flows. Violates principle #1 (coexistence).

#### Decision 3: Content Data Organization

**Option A: TypeScript Data Files (RECOMMENDED)**
- Structured `.ts` files in `data/` directory (e.g., `data/services.ts`, `data/testimonials.ts`, `data/pricing.ts`)
- Typed with interfaces, importable by both homepage sections and service subpages
- **Pros:** Type-safe, IDE autocompletion, colocated with code, no build tooling needed, easy to refactor
- **Cons:** Content changes require code deployment (acceptable for a marketing site at this scale)

**Option B: MDX Content Files**
- Service pages as MDX files with frontmatter
- **Pros:** More editorial-friendly, markdown for long-form content
- **Cons:** Requires @next/mdx setup, adds build complexity, overkill for structured data like pricing/features, harder to share data between homepage sections and subpages
- **Not invalidated but deprioritized:** Adds tooling complexity without clear benefit at this scale. Can be adopted later for blog/case studies.

---

## Context

### Current State
- `apps/web/src/app/layout.tsx` — Root layout with Geist fonts, Providers (ThemeProvider + QueryClient + ReactQueryDevtools), and dashboard Header component
- `apps/web/src/app/page.tsx` — Health check placeholder ("use client", uses tRPC) — will be replaced entirely
- `apps/web/src/components/header.tsx` — Dashboard navigation (Home, Dashboard, Todos, AI Chat) with ModeToggle and UserMenu
- `apps/web/src/components/providers.tsx` — Bundles ThemeProvider + QueryClientProvider + ReactQueryDevtools + Toaster in one "use client" component
- `apps/web/src/components/theme-provider.tsx` — Thin "use client" wrapper around next-themes `ThemeProvider`
- `apps/web/src/index.css` — Tailwind v4 + shadcn theme tokens (already monochrome oklch palette, dark mode via `.dark` class)
- Existing routes: `/dashboard`, `/login`, `/todos`, `/ai`, `/api/auth/[...all]`, `/api/trpc/[trpc]`, `/api/ai`
- ThemeProvider uses `next-themes` with class strategy — already works for dark/light mode
- `typedRoutes: true` in next.config.ts — new routes will be auto-typed
- `next.config.ts` currently: env import, NextConfig with typedRoutes/reactCompiler/transpilePackages, default export

### What Must NOT Change
- Dashboard, login, todos, AI routes and their functionality
- API routes (auth, tRPC, ai)
- Existing shadcn/ui components

### Process Steps: Authoritative Definition
The peec.ai spec defines 5 stages: Discovery, Planning, Execution, Optimization, Launch. The plan's 4-step process flow (Discovery, Design, Build, Launch) was a simplification. **The spec's 5 stages are authoritative.** All references to process steps in data files, homepage sections, and service pages must use the 5-stage model: Discovery, Planning, Execution, Optimization, Launch.

---

## Work Objectives

1. Restructure app directory with route groups to separate marketing and dashboard layouts
2. Build marketing layout (sticky nav, footer) and all homepage sections
3. Create 5 service subpages with consistent design
4. Integrate contact form with Resend API
5. Set up i18n infrastructure with next-intl
6. Embed Cal.com booking widget

---

## Guardrails

### Must Have
- All 10 homepage sections rendering with real content
- 5 service subpages at `/services/{slug}`
- Sticky marketing navbar (80px height, 1200px max-width)
- Contact form that sends email via Resend
- Cal.com embed on contact section or dedicated booking flow
- Dark/light mode working on all marketing pages
- Mobile-responsive (mobile, tablet, desktop breakpoints)
- i18n message files structure in place (English)
- 90+ Lighthouse performance score
- Existing routes unbroken
- Bundle boundary guard: ESLint rule preventing marketing pages from importing dashboard dependencies

### Must NOT Have
- tRPC usage in marketing pages
- Database queries from marketing pages
- Locale prefix in URLs (no `/en/`)
- Gradients, glassmorphism, or colored accents (monochrome only)
- Client-side JavaScript where RSC suffices
- Breaking changes to existing dashboard routes

---

## Task Flow

### Step 1: Route Group Restructure + Provider Decomposition + Marketing Layout

**What:** Reorganize the `app/` directory into `(marketing)` and `(dashboard)` route groups. Decompose the monolithic `providers.tsx` into scoped providers. Slim down root layout. Create marketing layout with sticky nav and footer.

**File changes:**

1. **Create** `src/components/dashboard-providers.tsx` — New "use client" component:
   - Import `QueryClientProvider` from `@tanstack/react-query`, `queryClient` from `@/utils/trpc`, `ReactQueryDevtools` from `@tanstack/react-query-devtools`
   - Wraps children with `QueryClientProvider` + `ReactQueryDevtools`
   - This isolates tRPC/React Query to the dashboard route group only
   ```tsx
   "use client";
   import { queryClient } from "@/utils/trpc";
   import { QueryClientProvider } from "@tanstack/react-query";
   import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

   export default function DashboardProviders({ children }: { children: React.ReactNode }) {
     return (
       <QueryClientProvider client={queryClient}>
         {children}
         <ReactQueryDevtools initialIsOpen={false} />
       </QueryClientProvider>
     );
   }
   ```

2. **Modify** `src/app/layout.tsx` — Strip down to minimal shell:
   - Keep: `<html>`, `<body>`, font variables
   - Use `ThemeProvider` directly (from existing `src/components/theme-provider.tsx`) with `attribute="class" defaultTheme="system" enableSystem disableTransitionOnColor`
   - Add `<Toaster />` here (accessible to both marketing contact form and dashboard)
   - Remove: `<Header />`, grid layout, `QueryClientProvider`, `ReactQueryDevtools`
   - Remove import of the old monolithic `Providers` component

3. **Create** `src/app/(dashboard)/layout.tsx`:
   - Import `DashboardProviders` (the new component from step 1.1)
   - Import existing `Header` component
   - Wrap children with `DashboardProviders` + grid layout from current root layout
   - This becomes the layout for all existing routes

4. **Move** existing route files into `(dashboard)/`:
   - `src/app/dashboard/` -> `src/app/(dashboard)/dashboard/`
   - `src/app/login/` -> `src/app/(dashboard)/login/`
   - `src/app/todos/` -> `src/app/(dashboard)/todos/`
   - `src/app/ai/` -> `src/app/(dashboard)/ai/`
   - API routes stay at `src/app/api/` (outside both groups)

5. **Create** `src/app/(marketing)/layout.tsx`:
   - Sticky marketing navbar component (80px height)
   - Footer component
   - No tRPC providers, no QueryClient
   - `max-w-[1200px] mx-auto` content wrapper

6. **Move** `src/app/page.tsx` -> `src/app/(marketing)/page.tsx` (will be rewritten in Step 3)

7. **Create** `src/components/marketing/navbar.tsx`:
   - Sticky header, 80px height, transparent/white bg
   - Logo (left), nav links (center: Services dropdown, Pricing, Contact), CTA button (right)
   - Mobile hamburger menu
   - ModeToggle integration
   - Smooth scroll links for homepage sections

8. **Create** `src/components/marketing/footer.tsx`:
   - Company info, service links, contact info, legal links
   - Consistent monochrome styling

9. **Update dashboard Header "/" link behavior:**
   - The existing `Header` component has a "Home" link pointing to `/`. After restructure, `/` is the marketing homepage, not the dashboard.
   - **Decision: This is intentional.** The dashboard "Home" link should navigate to the marketing homepage. If the team later wants a "Dashboard Home" link, it should point to `/dashboard` explicitly. No change needed now, but document this behavior for awareness.

10. **Add ESLint bundle boundary guard** — Add an `overrides` entry in the ESLint config scoped to `**/app/(marketing)/**` with a `no-restricted-imports` rule preventing imports from:
    - `@/utils/trpc`
    - `@tanstack/react-query`
    - `@trpc/client`
    This enforces at lint time that marketing pages cannot accidentally pull in dashboard dependencies.

**Acceptance criteria:**
- `pnpm --filter web build` succeeds with no errors
- `/dashboard`, `/login`, `/todos`, `/ai` routes render exactly as before
- `/` route renders with marketing layout (navbar + footer, no dashboard header)
- API routes still functional
- `DashboardProviders` wraps only dashboard routes (verify: React DevTools shows no QueryClientProvider on marketing pages)
- `Toaster` is present in root layout (available to both route groups)
- ESLint rule fires if a marketing page imports `@/utils/trpc`

**Note on typedRoutes:** After moving route files, run `pnpm dev` or `pnpm --filter web build` to regenerate Next.js typed route definitions. Any type errors referencing old route paths should resolve after regeneration.

---

### Step 2: Content Data Layer + i18n Infrastructure

**What:** Set up structured content data files and next-intl for internationalization.

**File changes:**

1. **Install dependencies:** `pnpm --filter web add next-intl resend @calcom/embed-react`

2. **Create** `src/i18n/request.ts` — next-intl server config:
   ```
   getRequestConfig returning messages from en.json
   ```

3. **Create** `src/i18n/routing.ts` — minimal routing config (single locale, no prefix)

4. **Create** `src/messages/en.json` — All marketing copy organized by section:
   - `hero`, `benefits`, `metrics`, `services`, `process`, `testimonials`, `pricing`, `contact`, `faq`, `nav`, `footer`

5. **Update** `next.config.ts` — Integrate `createNextIntlPlugin` while preserving existing config:
   ```ts
   import "@webvise-app/env/web";
   import type { NextConfig } from "next";
   import createNextIntlPlugin from "next-intl/plugin";

   const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

   const nextConfig: NextConfig = {
     typedRoutes: true,
     reactCompiler: true,
     transpilePackages: ["shiki"],
   };

   export default withNextIntl(nextConfig);
   ```
   Key points:
   - The `import "@webvise-app/env/web"` side-effect import stays at the top (before any config logic)
   - `createNextIntlPlugin` is called with the explicit path to `request.ts`
   - `withNextIntl` wraps the final export, preserving all existing config options
   - `typedRoutes`, `reactCompiler`, and `transpilePackages` remain unchanged inside the config object

6. **Create** `src/data/services.ts` — Typed service definitions:
   ```ts
   interface Service {
     slug: string;
     title: string;
     description: string;
     price: string;
     timeline: string;
     features: string[];
     process: ProcessStep[];
     deliverables: string[];
   }
   ```
   All 5 services with complete data.

7. **Create** `src/data/testimonials.ts` — Testimonial entries
8. **Create** `src/data/pricing.ts` — Pricing tier data (references services)
9. **Create** `src/data/faq.ts` — FAQ entries
10. **Create** `src/data/process.ts` — Process steps using the **authoritative 5-stage model**: Discovery, Planning, Execution, Optimization, Launch

**Acceptance criteria:**
- `import { services } from '@/data/services'` resolves and is fully typed
- `next-intl` config loads without errors
- `useTranslations('hero')` works in a test component
- All content data files export typed arrays/objects
- `process.ts` exports exactly 5 stages (Discovery, Planning, Execution, Optimization, Launch)
- Build still succeeds
- The env import side-effect (`@webvise-app/env/web`) still runs at build time (verify env validation works)

---

### Step 3: Homepage Sections (All 10)

**What:** Build all 10 homepage sections as individual RSC components, compose them in the marketing page.

**File changes:**

1. **Rewrite** `src/app/(marketing)/page.tsx` — Server component composing all sections:
   - Import and render all 10 section components in order
   - Each section has an `id` for smooth scroll targeting
   - `export const metadata` with proper SEO title/description

2. **Create section components** in `src/components/marketing/sections/`:
   - `hero.tsx` — Full-width hero with headline, subheadline, dual CTAs (Contact, Book a Call)
   - `tech-stack.tsx` — Logo grid of technologies (Next.js, React, Tailwind, etc.)
   - `benefits.tsx` — 2-column grid of benefit cards with icons
   - `metrics.tsx` — Stats/numbers row (projects completed, satisfaction rate, etc.)
   - `services.tsx` — 5 service cards linking to subpages, price + timeline summary
   - `process.tsx` — **5-step** process flow (Discovery -> Planning -> Execution -> Optimization -> Launch)
   - `testimonials.tsx` — Client testimonial cards
   - `pricing.tsx` — Pricing comparison table/cards for all 5 services
   - `contact.tsx` — Contact form + Cal.com booking embed (side by side on desktop)
   - `faq.tsx` — Accordion-style FAQ section

3. **Create** `src/components/marketing/section-wrapper.tsx` — Shared section container:
   - Consistent vertical padding (80px top/bottom)
   - Max-width 1200px
   - Section ID for anchor links
   - Alternating background support (#fff / #f7f7f7 in light mode)

**Acceptance criteria:**
- Homepage renders all 10 sections in correct order
- Each section is scrollable to via `#section-id` anchor
- Process section displays 5 stages matching the authoritative spec
- 2-column grid on desktop (>=1024px), 1-column on mobile
- All content pulled from data files and/or i18n messages
- Dark mode renders correctly for all sections
- No client-side JS except where interactivity required (FAQ accordion, mobile nav, contact form)

---

### Step 4: Service Subpages

**What:** Create 5 service detail pages with consistent layout driven by the services data.

**File changes:**

1. **Create** `src/app/(marketing)/services/[slug]/page.tsx`:
   - Dynamic route using `generateStaticParams` for SSG
   - Looks up service from `data/services.ts` by slug
   - Renders: hero banner, service description, features list, process steps (5-stage), deliverables, pricing CTA, related services
   - `generateMetadata` for per-page SEO

2. **Create** `src/components/marketing/service-page/`:
   - `service-hero.tsx` — Service title, tagline, price/timeline badges
   - `service-features.tsx` — Feature grid with icons
   - `service-process.tsx` — Process steps specific to that service (5-stage model)
   - `service-cta.tsx` — Bottom CTA section (Contact form link + Book a Call)

3. **Validate** `generateStaticParams` returns all 5 slugs:
   - `branding-design`
   - `full-stack-development`
   - `automation-ai`
   - `ai-seo`
   - `website-redesign`

**Acceptance criteria:**
- All 5 service URLs resolve and render: `/services/branding-design`, `/services/full-stack-development`, `/services/automation-ai`, `/services/ai-seo`, `/services/website-redesign`
- Each page shows correct service data (title, price, timeline, features)
- Pages are statically generated (check `.next/server/app/services/` after build)
- Back navigation to homepage works
- Design consistent with homepage sections
- `generateMetadata` produces unique title/description per service

**Note on typedRoutes:** The new `/services/[slug]` routes will be picked up by Next.js typed routes after running `pnpm dev` or `pnpm --filter web build`. No manual route type registration is needed.

---

### Step 5: Contact Form + Resend Integration

**What:** Build the contact form with server-side email sending via Resend API.

**File changes:**

1. **Create** `src/app/api/contact/route.ts` — POST endpoint:
   - Validate request body with Zod (name, email, company, service interest, message)
   - Send email via Resend SDK
   - Rate limiting (basic: check timestamp in memory or use headers)
   - Return success/error JSON response

2. **Create** `src/components/marketing/contact-form.tsx` — Client component:
   - Form fields: name, email, company (optional), service dropdown, message
   - Client-side validation with Zod
   - Submit via fetch to `/api/contact`
   - Loading/success/error states
   - Uses existing shadcn/ui components (Input, Button, Label)

3. **Create** `src/components/marketing/cal-embed.tsx` — Client component:
   - Cal.com inline embed using `@calcom/embed-react`
   - Lazy-loaded (dynamic import) for performance

4. **Add** `RESEND_API_KEY` and `CONTACT_EMAIL_TO` to `.env.example` (do NOT modify `.env`)

**Acceptance criteria:**
- Contact form renders with all fields
- Form validates on client side (required fields, email format)
- Successful submission sends email via Resend (verifiable in Resend dashboard)
- Error states display user-friendly messages
- Cal.com widget renders and is interactive
- API route returns 400 for invalid input, 200 for success, 500 for Resend errors

---

### Step 6: Polish, Performance, and Responsive QA

**What:** Final pass for responsive design, performance optimization, accessibility, and design system compliance.

**Tasks:**

1. **Responsive audit** — Test all pages at 375px (mobile), 768px (tablet), 1024px+ (desktop)
   - Fix any layout breaks
   - Ensure mobile nav hamburger works
   - Verify touch targets are >= 44px

2. **Performance optimization:**
   - Add `loading="lazy"` to below-fold images
   - Verify all marketing pages are statically generated
   - Check bundle size — no unnecessary client components
   - Verify ESLint bundle boundary guard catches any stray tRPC imports in marketing pages
   - Add appropriate `<meta>` tags and Open Graph data

3. **Design system compliance:**
   - Audit all components against peec.ai palette
   - Verify spacing rhythm (40px/80px)
   - Check typography scale (Geist headings, Inter body)
   - Ensure no color outside the defined palette leaks in

4. **Accessibility:**
   - Semantic HTML (nav, main, section, footer landmarks)
   - Proper heading hierarchy (single h1 per page)
   - Form labels and ARIA attributes on contact form
   - Keyboard navigation for mobile menu and FAQ accordion

5. **Smoke test existing routes:**
   - `/dashboard` — still requires auth, redirects to login
   - `/login` — sign in/up forms work
   - `/todos` — renders correctly
   - `/ai` — renders correctly
   - All API routes respond
   - Verify dashboard Header "/" link navigates to marketing homepage (intentional behavior)

**Acceptance criteria:**
- Lighthouse score >= 90 for Performance, Accessibility, Best Practices, SEO on homepage
- No visual regressions on dashboard routes
- All marketing pages pass axe-core basic audit
- Mobile navigation fully functional
- `pnpm --filter web build` produces zero warnings related to marketing pages
- ESLint `no-restricted-imports` rule active and passing on all marketing files

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Route group migration breaks existing routes | Medium | High | Move files one at a time, run build after each move. API routes stay outside groups. |
| next-intl conflicts with existing middleware or config | Low | Medium | Use server-only mode (no middleware). Test build after adding plugin. |
| next-intl plugin wrapper breaks env import | Low | Medium | Keep `import "@webvise-app/env/web"` as first line before plugin setup. Verify env validation runs post-integration. |
| Cal.com embed increases bundle size significantly | Medium | Low | Dynamic import with `next/dynamic`, load only on contact section. |
| typedRoutes breaks after route restructure | Medium | Medium | Run `pnpm dev` or `pnpm --filter web build` to regenerate route types. Fix any type errors immediately. |
| Root layout refactor breaks Providers chain | Medium | High | Decompose providers explicitly: ThemeProvider + Toaster in root, DashboardProviders (QueryClient + ReactQueryDevtools) in dashboard layout only. Test both layouts independently. |
| Dashboard Header "/" link confuses users | Low | Low | Intentional: "/" is marketing homepage. Document for team. Dashboard landing is at `/dashboard`. |

---

## Verification Steps

1. **Build verification:** `pnpm --filter web build` succeeds
2. **Route verification:** Manually visit all routes (marketing + dashboard) in dev mode
3. **Provider isolation verification:** React DevTools confirms no QueryClientProvider on marketing pages, and QueryClientProvider present on dashboard pages
4. **Responsive verification:** Browser DevTools responsive mode at 375px, 768px, 1200px
5. **Dark mode verification:** Toggle theme on every page
6. **Form verification:** Submit contact form, verify email in Resend dashboard
7. **Performance verification:** Run Lighthouse on homepage and one service page
8. **Regression verification:** Existing dashboard/login/todos/ai routes unchanged
9. **Bundle boundary verification:** Run ESLint on marketing directory, confirm no tRPC/react-query imports leak through
10. **Typed routes verification:** After all route moves, confirm `pnpm dev` regenerates types and no route type errors remain

---

## ADR: Architectural Decision Record

**Decision:** Use Next.js route groups `(marketing)` and `(dashboard)` with decomposed provider tree, next-intl server-only mode, and TypeScript data files for content.

**Drivers:**
1. Must not break existing dashboard routes
2. Marketing pages must be static/SSG for performance
3. i18n infrastructure needed but English-only at launch
4. Provider tree must be scoped — marketing pages must not load tRPC/React Query bundles

**Alternatives Considered:**
1. Conditional layout rendering — Rejected: creates coupling, forces client component root layout
2. Separate Next.js app for marketing — Rejected: over-engineering, domain/deployment complexity
3. next-intl with middleware + locale prefix — Rejected: breaks existing routes, unnecessary for English-only
4. MDX for content — Deprioritized: adds tooling complexity, structured data better served by TypeScript
5. Keep monolithic `providers.tsx` — Rejected: forces marketing pages to load QueryClientProvider and tRPC bundles unnecessarily, violates static-first principle

**Why Chosen:**
Route groups are the idiomatic Next.js solution for multiple layouts within one app. Decomposing the provider tree ensures marketing pages stay lean (no React Query/tRPC in the bundle). Server-only next-intl avoids middleware complexity while providing the translation infrastructure. TypeScript data files give type safety and IDE support without additional tooling.

**Consequences:**
- One-time file reorganization required (moving 4 route directories)
- Dashboard layout must explicitly include its own providers via `DashboardProviders`
- Old monolithic `providers.tsx` can be deleted after migration
- Adding new locales later requires adding next-intl middleware (additive change)
- Dashboard Header "/" link now goes to marketing homepage (intentional)

**Follow-ups:**
- Blog/case studies section (could adopt MDX at that point)
- CMS integration if content update frequency increases
- Analytics integration (Plausible/Vercel Analytics)
- Cookie consent banner for GDPR

---

## Changelog

### v2 (2026-03-06) — Critic/Architect revision

1. **[CRITICAL] Provider tree decomposition (Step 1)** — Added explicit recipe for decomposing `providers.tsx`: create `dashboard-providers.tsx` with QueryClientProvider + ReactQueryDevtools, use ThemeProvider directly in root layout, place Toaster in root layout, scope DashboardProviders to `(dashboard)/layout.tsx`. Includes concrete code snippet for the new component.

2. **[CRITICAL] next-intl plugin integration (Step 2)** — Added concrete `next.config.ts` code showing how `createNextIntlPlugin` wraps the existing config while preserving the `@webvise-app/env/web` side-effect import. Added risk entry for env import compatibility.

3. **[MEDIUM] Process steps count resolved** — Declared the spec's 5-stage model (Discovery, Planning, Execution, Optimization, Launch) as authoritative. Updated all references: `data/process.ts`, homepage process section, and service subpage process sections now use 5 stages instead of 4. Added dedicated section in Context.

4. **[MEDIUM] Dashboard Header "/" link behavior** — Documented that after restructure, the Header "Home" link navigates to the marketing homepage. Marked as intentional. Added to Step 1 file changes, Step 6 smoke tests, Risks table, and ADR Consequences.

5. **[ARCHITECT] Bundle boundary guard** — Added ESLint `no-restricted-imports` rule scoped to `**/app/(marketing)/**` preventing imports from `@/utils/trpc`, `@tanstack/react-query`, `@trpc/client`. Added to Step 1 file changes, Step 6 verification, Guardrails, and Verification Steps.

6. **[ARCHITECT] typedRoutes regeneration** — Added notes in Step 1 and Step 4 clarifying that `pnpm dev` or `pnpm --filter web build` regenerates typed route definitions after route moves. Added to Verification Steps.

### Consensus Notes (Non-blocking — for executor)
- When moving `<Toaster />` to root layout, preserve the `richColors` prop: use `<Toaster richColors />` to match current behavior from `providers.tsx`.
- No ESLint config file exists yet — create one (e.g., `eslint.config.mjs` for flat config) before adding the `no-restricted-imports` rule. The project uses Biome for formatting (`biome.json`), so ESLint is additive for this specific boundary rule only.
- Delete `providers.tsx` after migration is verified working (it will be fully replaced by `dashboard-providers.tsx` + direct ThemeProvider/Toaster in root layout).
