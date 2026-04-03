---
name: webvise-qa
description: "Production quality audit for web projects. 7-category QA with pass/fail criteria. Use when auditing a site, checking quality, running lighthouse, verifying deployment. Triggers: 'qa', 'quality check', 'audit', 'review site', 'check lighthouse', 'verify deployment', 'check quality'."
---

# webvise:qa — Production Quality Audit

## Purpose

Structured 7-category quality audit that produces a pass/fail report. Can be invoked standalone on any web project or automatically by the `webvise:deliver` skill during its QA phase.

Each category has explicit pass criteria. The audit produces a markdown report with PASS/FAIL per category and specific issue details with file paths and line numbers where possible.

## When to Use

- After building a site, before client handoff
- When verifying a deployment (production or preview)
- For periodic quality checks on a live site
- When `webvise:deliver` invokes this at Phase 5
- When asked to "audit", "qa", "check quality", or "review site"

## Invocation Modes

### Full Audit (default)
Run all 7 categories. This is the default when no specific category is requested.

### Targeted Audit
Run specific categories only. Examples:
- "run QA on hover states only" -> Category C only
- "check SEO and accessibility" -> Categories B and E
- "audit performance" -> Category A only

### Input
Accept one of:
- A production URL (e.g., `https://example.com`)
- A localhost URL (e.g., `http://localhost:3000`)
- No URL — start the local dev server and audit against it

## QA Categories

There are 7 categories. Each has a pass criteria and a specific checklist.

---

### A. Performance (Lighthouse)

**Pass criteria:** All 4 Lighthouse categories score 90+

#### Core Web Vitals
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] INP (Interaction to Next Paint) < 200ms

#### Images
- [ ] All images use `next/image` (no raw `<img>` tags)
- [ ] `sizes` attribute set on responsive images
- [ ] `quality` prop set where appropriate
- [ ] WebP/AVIF format used (Next.js handles this automatically with next/image)
- [ ] `priority` prop on above-the-fold hero images
- [ ] Below-fold images lazy loaded (default next/image behavior)

#### Fonts
- [ ] Loaded via `next/font` (no external CSS font links)
- [ ] `display: swap` configured
- [ ] Font subsets specified
- [ ] No FOUT/FOIT visible on page load

#### JavaScript Bundle
- [ ] Server Components used by default
- [ ] `"use client"` only on components that need interactivity
- [ ] No unnecessary client components wrapping server content
- [ ] Heavy below-fold components use `dynamic()` import
- [ ] No barrel exports pulling entire modules

#### CSS
- [ ] Tailwind CSS purge working (no unused styles in production)
- [ ] No inline styles where Tailwind classes suffice
- [ ] No duplicate class names on elements

For detailed optimization checklist, read `references/lighthouse-checklist.md`.

---

### B. Accessibility (WCAG 2.1 AA)

**Pass criteria:** Zero critical/serious axe-core violations

- [ ] Skip-to-content link present and functional
- [ ] All images have meaningful alt text (not "image", not empty on informational images)
- [ ] Decorative images use `alt=""` or `aria-hidden="true"`
- [ ] Focus indicators visible on ALL interactive elements (keyboard tab through entire page)
- [ ] Color contrast ratios meet AA: 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold)
- [ ] All interactive elements have `aria-label` where visible text is insufficient
- [ ] Heading hierarchy is sequential: h1 then h2 then h3, no skips (h1 -> h3 is invalid)
- [ ] Exactly one `<h1>` per page
- [ ] `lang` attribute on `<html>` matches current locale
- [ ] Form inputs have associated `<label>` elements (or `aria-label`)
- [ ] Touch targets >= 44px on mobile (buttons, links, form controls)
- [ ] No content conveyed by color alone (use icons, text, or patterns too)
- [ ] ARIA roles used correctly (no `role="button"` on `<div>` when `<button>` would work)
- [ ] Modal dialogs trap focus and return focus on close
- [ ] Error messages are announced to screen readers (`aria-live` or `role="alert"`)

---

### C. Hover States & Interactions

**Pass criteria:** Every clickable element has a visible hover state

This is the MOST COMMONLY MISSED category. Every interactive element must have a visible change on hover.

#### Process
1. Enumerate every interactive element on every page
2. For each one, verify a visible hover state exists
3. List them out explicitly — do not assume

#### Generic Checks (apply to ALL projects)
- [ ] Every `<a>` tag has a hover state (color change, underline, or opacity shift)
- [ ] Every `<button>` has a hover state
- [ ] Every clickable card has a hover state (background, border, or shadow change)
- [ ] Every form submit button has a hover state
- [ ] Navigation items have hover states (header nav links)
- [ ] Footer links have hover states
- [ ] Social media icons have hover states
- [ ] Dropdown/menu items have hover states
- [ ] Tab triggers have hover states
- [ ] Accordion triggers have hover states
- [ ] CTA buttons have distinct, obvious hover states (not subtle)
- [ ] Icon buttons have hover states
- [ ] Breadcrumb links have hover states
- [ ] Pagination controls have hover states
- [ ] Tag/badge links have hover states (if clickable)

#### Verification Method
For each page:
1. Open the page
2. List every element with `cursor-pointer`, `<a>`, `<button>`, or `onClick`
3. For each element, check for `hover:` classes in Tailwind or `:hover` in CSS
4. Flag any element missing a hover state

#### Webvise-specific Hover Patterns
These apply only when `webvise:conventions` is loaded:
- Buttons: `[&]:hover:bg-brand/80` for brand CTAs, `hover:bg-muted` for ghost/outline
- Cards/cells: `hover:bg-muted/30` or `hover:bg-muted/40`
- Social icons: hover `border-brand/40 text-brand`
- Tool tags: hover `border-brand bg-brand text-white`
- Nav dropdown cells: `hover:bg-muted/40`

---

### D. Content Parity (Migration Projects Only)

**Pass criteria:** ALL pages from source site present, all content transferred

NOTE: This category only applies to migration projects (rebuilding an existing site). Skip for greenfield builds and mark as SKIP in the report.

#### Page Inventory
- [ ] Every page from the source site has a corresponding page in the new site
- [ ] No pages were accidentally dropped
- [ ] Navigation structure matches source (all nav links work)

#### Content Transfer
- [ ] All text content transferred: headings, body copy, lists
- [ ] All images transferred or replaced with equivalent quality
- [ ] Meta titles and descriptions preserved (intent, not necessarily verbatim)
- [ ] CTAs present with correct link targets
- [ ] Tables and structured data preserved

#### Legal & Identity
- [ ] Legal pages present: privacy policy, terms of service
- [ ] Imprint/Impressum present (required for EU sites)
- [ ] Contact information matches exactly (address, phone, email)
- [ ] Social media links present and correct
- [ ] Company logo and branding consistent

#### Functional Parity
- [ ] All forms work: contact, newsletter, etc.
- [ ] Downloads and PDFs still accessible
- [ ] Email links use correct `mailto:` format
- [ ] Phone links use correct `tel:` format
- [ ] External links open in new tab where appropriate

For detailed parity verification process, read `references/content-parity-checklist.md`.

---

### E. SEO Completeness

**Pass criteria:** Every page has complete metadata and structured data

#### Per-Page Metadata
For EVERY page, verify:
- [ ] Unique `<title>` tag (not duplicated across pages)
- [ ] `<meta name="description">` with unique content
- [ ] Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`
- [ ] Twitter card tags: `twitter:card`, `twitter:title`, `twitter:description`
- [ ] Canonical URL set via `<link rel="canonical">`

#### Internationalization (if i18n)
- [ ] `hreflang` alternates for all supported locales
- [ ] `x-default` hreflang set
- [ ] Locale in URL structure consistent (e.g., `/de/about`, `/en/about`)

#### Structured Data (JSON-LD)
- [ ] Homepage: `Organization` and `WebSite` schema
- [ ] Content pages: `WebPage` and `BreadcrumbList` schema
- [ ] FAQ pages: `FAQPage` schema
- [ ] Blog posts: `Article` or `BlogPosting` schema
- [ ] Service pages: `Service` schema (if applicable)

#### Technical SEO
- [ ] `sitemap.xml` includes ALL pages with correct alternates
- [ ] `robots.txt` allows indexing (unless staging/preview)
- [ ] No duplicate titles or descriptions across pages
- [ ] 301 redirects in place for all old URLs (if migration)
- [ ] No broken internal links
- [ ] No broken external links
- [ ] No orphan pages (pages not linked from anywhere)
- [ ] Images have descriptive file names (not `IMG_1234.jpg`)

---

### F. Responsive Design

**Pass criteria:** No layout issues at 3 key breakpoints

#### Test Breakpoints
- **375px** — Mobile (iPhone SE)
- **768px** — Tablet (iPad)
- **1440px** — Desktop (standard)

#### Per-Breakpoint Checks
At each breakpoint, verify:
- [ ] No horizontal overflow (no horizontal scrollbar)
- [ ] Touch targets >= 44px on mobile
- [ ] Navigation collapses to mobile menu on small screens
- [ ] Mobile menu opens/closes correctly
- [ ] Images scale properly (no overflow, no excessive whitespace)
- [ ] Text is readable (minimum 14px on mobile, adequate line height)
- [ ] Grid layouts reflow correctly (e.g., 3-col desktop -> 1-col mobile)
- [ ] Section spacing scales appropriately
- [ ] Tables scroll horizontally or reflow on mobile
- [ ] Modals/dialogs fit the viewport on mobile
- [ ] Fixed/sticky elements don't overlap content on mobile
- [ ] Form inputs are full-width on mobile (no tiny inputs)

#### Common Failures
- Hero sections with fixed heights that clip text on mobile
- Absolute positioned elements that overflow on small screens
- Large padding/margin values not scaled down for mobile
- Desktop-only hover interactions with no mobile equivalent (tap)

---

### G. Analytics & Monitoring

**Pass criteria:** All tracking configured and firing

#### Vercel Platform
- [ ] Vercel Analytics script present and loading (`@vercel/analytics`)
- [ ] Vercel Speed Insights present and loading (`@vercel/speed-insights`)

#### Error Handling
- [ ] Global error boundary configured (`global-error.tsx` or `error.tsx`)
- [ ] Error boundaries on key route segments
- [ ] Sentry configured with proper DSN (if used in project)

#### Event Tracking
- [ ] PostHog configured (if used in project)
- [ ] CTA tracking attributes present (`data-ph-capture-attribute-*` or similar)
- [ ] Key user actions tracked (form submissions, CTA clicks)

#### Console Health
- [ ] Console has no errors on page load
- [ ] Console has no warnings related to missing props or hydration
- [ ] No failed network requests on page load

---

## Output Format

After running the audit, produce this structured report:

```markdown
# QA Audit Report

**URL:** {url}
**Date:** {date}
**Result:** {X}/7 categories passing

## Results

| Category | Status | Issues |
|----------|--------|--------|
| A. Performance | PASS/FAIL | {count} issues |
| B. Accessibility | PASS/FAIL | {count} issues |
| C. Hover States | PASS/FAIL | {count} issues |
| D. Content Parity | PASS/FAIL/SKIP | {count} issues |
| E. SEO | PASS/FAIL | {count} issues |
| F. Responsive | PASS/FAIL | {count} issues |
| G. Analytics | PASS/FAIL | {count} issues |

## Failures Detail

### {Category Name} — FAIL
- {specific issue with file path and line number}
- {specific issue with file path and line number}
...

## Passes Detail

### {Category Name} — PASS
- {brief confirmation of what was verified}
```

## Verification Process

For each category, follow this exact sequence:

1. **List** — Write out what needs to be checked for this category
2. **Check** — Actually verify each item (grep code, read files, use browser tools, inspect network)
3. **Record** — Mark each item PASS or FAIL with specific details
4. **Report** — Add to the final report with file paths and line numbers for failures

CRITICAL RULES:
- Do NOT skip categories. Run all 7 (or mark D as SKIP for greenfield).
- Do NOT assume passing. Actually verify each check by reading code or inspecting the browser.
- Do NOT use vague descriptions. Every failure must include a file path or specific element reference.
- When checking hover states, enumerate EVERY interactive element. Do not sample.
- When checking SEO, check EVERY page. Do not check only the homepage.

## Integration with webvise:deliver

When invoked by `webvise:deliver` at Phase 5:
1. Run the full 7-category audit
2. Return the structured report
3. If any category fails, `webvise:deliver` will loop back to fix issues
4. Re-run failed categories after fixes until all pass
