---
name: webvise-deliver
description: "Full service delivery workflow for client websites. 6-phase gated process: Discover > Plan > Build > SEO > QA > Deliver. Handles WP migrations, landing pages, and SEO. Triggers: 'deliver site', 'migrate wordpress', 'build client site', 'webvise delivery', 'new client project', 'wp to next', 'client website', 'migration'."
---

# webvise:deliver — Service Delivery Workflow

## 1. Purpose

End-to-end delivery workflow for building client websites to Webvise production standards. Handles WordPress to Next.js migrations, fresh landing pages, and SEO optimization as a combined workflow. Produces client-ready, production-grade output.

## 2. When to Use

- Starting a new client website project
- Migrating a WordPress site to Next.js
- Building a landing page for a client
- Any project that needs the full discovery-to-delivery workflow

## 3. Prerequisites

Before starting, read `~/.claude/skills/webvise-conventions/SKILL.md` and its references for stack, design system, and code conventions. This skill does NOT auto-load conventions — you must read them explicitly.

## 4. Design Approach for Client Projects

CRITICAL — this is NOT a rebrand:

- **KEEP** the client's logo, colors, and fonts (their brand identity)
- **FIX/IMPROVE** layouts, paddings, spacing, structure, responsiveness
- **APPLY** Webvise conventions for code quality: zero border-radius, ring-based elevation, generous spacing, stagger animations, server components by default
- Most clients don't have strong branding, so there's room for structural improvement
- If the client has no clear design system, apply Webvise's design tokens as defaults

## 5. Phase Overview

6 sequential phases. Each ends with a gate check. Track progress in `delivery-status.md` at the project root.

After completing each phase, update `delivery-status.md`:

```markdown
# Delivery Status

## Phase 1: DISCOVER — COMPLETE
- Pages found: 12
- Brand elements captured: logo, 3 colors, 1 font
- Gate: Site map confirmed by user

## Phase 2: PLAN — IN PROGRESS
- ...
```

---

## 6. Phase 1: DISCOVER

**Input:** Live URL of the existing site (WordPress or any CMS).

### Steps

1. Browse the live site using browser tools (agent-browser, Playwright MCP, or similar)
2. Start at the homepage, then follow EVERY link in the navigation
3. Follow EVERY link in the footer
4. Check for pages not linked in nav (sitemap.xml, robots.txt for hints)
5. For EACH page found, document:
   - URL and page title
   - Page purpose (homepage, about, services, contact, blog, legal, etc.)
   - Content sections (headings, text blocks, images, forms)
   - Interactive elements (buttons, dropdowns, accordions, sliders, forms)
   - Hover states visible on interactive elements
6. Extract brand elements:
   - Logo (download or screenshot)
   - Colors: inspect CSS for primary, secondary, accent, background colors
   - Fonts: check font-family declarations
   - Imagery style: photos, illustrations, icons
7. Document the complete navigation structure (header nav, footer nav, sidebar if any)

### Output

Site map document listing ALL pages with their content inventory.

### Gate Check

Present the site map to the user. Ask: "I found {N} pages. Are any missing?" Do NOT proceed until user confirms.

For detailed discovery protocol, read `references/phase-discover.md`.

---

## 7. Phase 2: PLAN

### Steps

1. Map each source page to a Next.js route under `app/[locale]/(marketing)/`
2. Create a redirect map: old WordPress URLs to new Next.js routes (301 redirects)
3. Define the translation key structure for each page's content
4. Create a component inventory:
   - Which components from webvise:conventions can be reused (SectionWrapper, StaggerChildren, Button, Card, etc.)
   - Which new components are needed
5. Define content migration plan:
   - Which text goes into `messages/{locale}.json` (UI strings, labels)
   - Which content goes into `content/{type}/{slug}.json` (blog posts, case studies)
6. Identify forms and their submission handling
7. Estimate the i18n scope: how many locales needed?

### Output

Route map, redirect map, component inventory, content migration plan.

### Gate Check

Present the plan to the user. Ask: "Does this route structure and component plan look right?" Do NOT proceed until confirmed.

---

## 8. Phase 3: BUILD

Before building, read `~/.claude/skills/webvise-conventions/SKILL.md` and its reference files for exact conventions.

### Steps

1. **Scaffold the Next.js project:**
   - Use the Webvise stack (Next.js 15+, React 19+, TypeScript, Tailwind CSS 4+, shadcn/ui)
   - Set up Biome for formatting
   - Configure next-intl if i18n needed
   - Set up the project structure per conventions

2. **Build pages in priority order:**
   - Homepage FIRST (establishes the design direction)
   - Key pages (about, services, contact) SECOND
   - ALL remaining pages THIRD — do NOT skip any page from the discover phase

3. **For EACH page:**
   - Use Server Components by default
   - Extract all text into translation keys
   - Apply the client's brand colors/fonts (NOT Webvise's brand)
   - Use Webvise layout patterns (SectionWrapper, max-w-[1320px], generous spacing)
   - Implement proper heading hierarchy (h1 then h2 then h3)

4. **CRITICAL — Hover states:**
   - Every `<a>` tag MUST have a hover state
   - Every `<button>` MUST have a hover state
   - Every clickable card MUST have a hover state
   - Every nav item MUST have a hover state
   - Every footer link MUST have a hover state
   - Every social icon MUST have a hover state
   - DO NOT FORGET HOVER STATES — this is the #1 missed item

5. **CRITICAL — ALL subpages:**
   - Cross-reference against the discover phase site map
   - Every page listed in discover MUST have a corresponding page built
   - After building, count: discover found N pages, build created M pages. M must equal N.

6. **Responsive design:**
   - Mobile-first with md: breakpoint for desktop
   - Test at 375px, 768px, 1440px mentally while building
   - Section spacing scales: py-20 mobile to py-36 desktop

### Output

All pages built, `pnpm build` succeeds, zero TypeScript errors.

### Gate Check

Verify: (1) page count matches discover, (2) `pnpm build` passes, (3) no TS errors. Update delivery-status.md.

For detailed build checklist, read `references/phase-build.md`.

---

## 9. Phase 4: SEO

Before this phase, read `~/.claude/skills/webvise-conventions/references/seo-patterns.md`.

### Steps

1. **Add `generateMetadata` to EVERY page:**
   - Unique title and description
   - Open Graph tags (title, description, image, url, siteName, locale)
   - Twitter card tags
   - Alternates via `generateAlternates()` helper

2. **Add JSON-LD structured data:**
   - Homepage: Organization + WebSite
   - Content pages: WebPage + BreadcrumbList
   - FAQ sections: FAQPage
   - Service pages: Service (if applicable)

3. **Create `sitemap.ts`:**
   - Include ALL pages
   - Include hreflang alternates for all locales

4. **Create `robots.ts`:**
   - Allow all crawlers
   - Point to sitemap

5. **Set up redirects:**
   - All old WordPress URLs to new routes (301)
   - Common WordPress paths (/wp-admin, /wp-login.php) to homepage or 404

6. **Verify no duplicate titles or descriptions across pages**

### Output

Complete SEO setup on every page.

### Gate Check

Every page has metadata, JSON-LD validates, sitemap includes all routes.

For detailed SEO implementation, read `references/phase-seo.md`.

---

## 10. Phase 5: QA

Invoke the webvise:qa skill (`/webvise-qa`) with full audit mode.

### Steps

1. Run the full 7-category audit from webvise:qa
2. All 7 categories must pass
3. If any category fails:
   - Fix the specific issues listed in the failure report
   - Re-run the failed category
   - Repeat until all pass
4. Pay special attention to:
   - Hover states (most commonly missed)
   - Content parity (every page from discover must be present)
   - Accessibility (heading hierarchy, alt text, contrast)

### Output

QA report showing 7/7 categories passing.

### Gate Check

webvise:qa returns 7/7 passing. If not, fix and re-run.

---

## 11. Phase 6: DELIVER

### Steps

1. **Deploy to Vercel:**
   - Preview deployment first
   - Verify preview loads correctly
   - Deploy to production

2. **Post-deployment verification:**
   - Run Lighthouse on production URL — all scores 90+
   - Verify analytics firing (Vercel Analytics, Speed Insights)
   - Verify error tracking configured (Sentry)
   - Test all forms on production
   - Test all redirects on production

3. **Create handoff document:**
   - Pages built and their routes
   - How to update content (which files to edit)
   - How to add new blog posts
   - Environment variables needed
   - Deployment process

### Output

Live production URL, Lighthouse 90+, handoff document.

### Gate Check

Production live, Lighthouse passing, handoff document complete.

---

## 12. Completion

When all 6 phases pass:

1. Update delivery-status.md with final status: ALL PHASES COMPLETE
2. Present summary to user:
   - Production URL
   - Page count (discover found X, built X)
   - Lighthouse scores
   - QA results (7/7)
   - Handoff document location
