---
name: webvise-conventions
description: "Webvise engineering practices for client projects. Tech stack, code patterns, project structure, SEO, and quality standards. Use when starting a client project, building UI, or needing Webvise stack reference. Triggers: 'webvise project', 'new client site', 'webvise stack', 'conventions', 'client project'."
metadata:
  synced-from: "webvise-landing @ 2026-04-10"
---

# Webvise Engineering Conventions

## 1. Purpose

This skill encodes how Webvise builds client projects — the tech stack, code patterns, project structure, and quality standards. It does NOT impose Webvise's own visual identity on clients.

**Key distinction:**
- **Engineering practices** (this skill) → apply to ALL client projects
- **Webvise visual design** (brand orange, Inter + Geist Mono two-font system, zero radius) → Webvise's own site only, authoritative source is `/DESIGN_SYSTEM.md` at repo root; `references/design-tokens.md` is a pointer to it

## 2. When to Use

- Starting any new client project
- Building UI components for a client
- Setting up a new repository
- Reviewing code for Webvise engineering standards
- Needing reference for how Webvise structures projects

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15+ with App Router | SSR, SSG, RSC, file-based routing |
| UI | React 19+ | Server Components, Actions |
| Language | TypeScript (strict mode) | Type safety across the stack |
| Styling | Tailwind CSS 4+ with `@theme inline` | Utility-first, design token support |
| Components | shadcn/ui with `@base-ui/react` primitives | Accessible, customizable, no lock-in |
| Animations | `motion/react` for scroll-triggered reveals | Lightweight, performant |
| Formatting | Biome (tabs, double quotes, sorted Tailwind classes) | Fast, consistent |
| i18n | `next-intl` with locale prefix `"as-needed"` | If multilingual needed |
| Deployment | Vercel | Zero-config, edge network |
| Analytics | Vercel Analytics + Vercel Speed Insights | Performance monitoring |
| Error tracking | Sentry | Production error visibility |
| User analytics | PostHog | Product analytics, event tracking |

**Font choice is per-client.** Load the client's brand font via `next/font/google` or `next/font/local` with CSS variable injection.

## 4. Project Structure

```
src/
  app/[locale]/(marketing)/       # Marketing pages (homepage, about, services, etc.)
  app/[locale]/(dashboard)/       # App pages (if the project has an app side)
  components/
    ui/                           # shadcn/ui base components
    marketing/                    # Marketing-specific components
      sections/                   # Page sections (hero, benefits, etc.)
  data/                           # Typed data modules
  lib/                            # Utilities (cn, seo, etc.)
  i18n/                           # Routing config, request locale
  messages/                       # Translation JSON per locale
content/                          # JSON content (blog posts, case studies)
public/                           # Static assets (images, fonts, favicons)
```

For monorepo projects, wrap this in `apps/web/` with shared packages under `packages/`.

## 5. Engineering Practices (Apply to All Projects)

### 5.1 Server Components by Default

- Every component is a Server Component unless it needs interactivity
- Add `"use client"` only for: useState, useEffect, event handlers, browser APIs, client-only libraries
- This is the single biggest performance win — zero client JS for most pages

### 5.2 Component Patterns

- **CVA** (`class-variance-authority`) for component variants (buttons, badges, etc.)
- **`cn()`** utility from `@/lib/utils` for conditional class merging
- **`@base-ui/react`** primitives for accessible foundations (dialogs, dropdowns, etc.)
- **SectionWrapper** pattern for consistent page sections:
  ```tsx
  <section className="py-20 md:py-36">
    <div className="mx-auto max-w-[1320px] px-6">
      {children}
    </div>
  </section>
  ```

### 5.3 Spacing Philosophy

Generous whitespace is structural, not decorative:
- Sections: `py-20 md:py-36` (standard), `py-24 md:py-44` (hero)
- Max content: `max-w-[1320px] px-6`
- Card padding: `p-8 md:p-10`
- The mobile→desktop jump is intentional — breathe more on large screens

### 5.4 Elevation Without Shadows

- Cards/containers: `ring-1 ring-foreground/10` (subtle integrated boundary)
- No box shadows on standard components
- Shadows only on floating overlays (dropdowns, popovers)
- Background shifts for tonal depth (`--background` → `--card` → `--muted`)
- Glassmorphism for navbars/overlays: `bg-background/80 backdrop-blur-xl`

### 5.5 Scroll Animations

Stagger reveal via `motion/react` `useInView`:
- Children animate in sequentially: opacity 0→1, translateY 20px→0
- Duration: 0.6s, stagger: 70ms per child
- Easing: `cubic-bezier(0.21, 0.47, 0.32, 0.98)`
- Trigger once on scroll into view

### 5.6 Hover States (Critical)

Every interactive element MUST have a visible hover state. This is the #1 missed item:

| Element | Pattern |
|---|---|
| Primary button | `hover:bg-primary/90` or accent variant |
| Ghost/outline button | `hover:bg-muted` |
| Card/cell | `hover:bg-muted/30` with `transition-colors` |
| Nav link | `hover:text-foreground` with `transition-colors` |
| Footer link | `hover:text-foreground` with `transition-colors` |
| Text link | `hover:underline` or color shift |
| Social icon | border + color shift on hover |
| Accordion/tab trigger | `hover:bg-muted/30` |

### 5.7 Icons

- Library: `lucide-react`
- Stroke width: `strokeWidth={1.5}`
- Size: `h-5 w-5` (standard), `h-4 w-4` (small)
- Accent container: `h-10 w-10 border border-{accent}/20 bg-{accent}/5`

## 6. Code Conventions

### Formatting
- **Biome** with: tabs, double quotes, sorted Tailwind classes (`useSortedClasses`)
- No Prettier, no ESLint (Biome replaces both)

### File Naming
- Components: `kebab-case.tsx` (e.g., `section-wrapper.tsx`)
- Pages: `page.tsx` inside route directories
- Layouts: `layout.tsx`
- Data modules: `kebab-case.ts`

### i18n
- `next-intl` with locale prefix `"as-needed"` (default locale has no URL prefix)
- `getTranslations({ locale, namespace })` in server components
- `useTranslations(namespace)` in client components
- Translation keys: `{page}.{section}.{field}` (e.g., `home.hero.title`)

### Data Layer
- UI strings → `messages/{locale}.json`
- Long-form content → `content/{type}/{slug}/{locale}.json` or `{slug}.json`
- Typed data → `src/data/{entity}.ts` (exports with TypeScript types)

## 7. Client Branding

When building for a client:

1. **Extract** their brand: logo, colors (primary, secondary, accent, background, text), fonts
2. **Define as CSS custom properties** using OKLCH or any color space:
   ```css
   :root {
     --brand: {client accent color};
     --background: {client background};
     --foreground: {client text color};
     /* ... */
   }
   ```
3. **Register in Tailwind** via `@theme inline` block
4. **Load client fonts** via `next/font/google` or `next/font/local`
5. **Keep their identity** — don't impose Webvise's visual style
6. **Improve their execution** — better layouts, spacing, performance, accessibility

## 8. Quality Standards

Every project must meet:
- Lighthouse 90+ (all 4 categories)
- WCAG 2.1 AA accessibility
- All hover states implemented
- All pages from source site migrated (if migration)
- Complete SEO (metadata, structured data, sitemap)
- Responsive at 375px, 768px, 1440px

For full quality audit, invoke `/webvise-qa`.

## 9. Reference Files

- **Design system** (authoritative, always current): `/DESIGN_SYSTEM.md` at repo root
- **Design tokens pointer** (summary + pointer to DESIGN_SYSTEM.md): `references/design-tokens.md`
- **Component architecture patterns** (SectionWrapper, Button, Card, Grid, Nav, Footer): `references/component-patterns.md`
- **SEO implementation patterns** (metadata, JSON-LD, sitemap, robots, llms.txt): `references/seo-patterns.md`

The design system documents Webvise's own site -- use it as an EXAMPLE of how to structure a client's design tokens, not as values to apply to client projects. For current token values, typography rules, and component patterns, always read `/DESIGN_SYSTEM.md`.
