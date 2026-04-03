# Webvise Skills Guide

Three Claude Code skills that encode how Webvise delivers client projects. They ensure consistent quality, eliminate re-explanation, and produce client-ready output.

## Skills Overview

| Skill | Command | Purpose |
|---|---|---|
| **Conventions** | `/webvise-conventions` | Tech stack, code patterns, project structure, quality standards |
| **QA** | `/webvise-qa` | 7-category quality audit with pass/fail |
| **Deliver** | `/webvise-deliver` | Full 6-phase delivery workflow (Discover to Deploy) |

## Quick Start

### Starting a new client project

```
/webvise-deliver
```

Give it the client's WordPress URL. The skill walks through 6 phases:

1. **Discover** — Browses the site, maps ALL pages, extracts brand (logo, colors, fonts)
2. **Plan** — Maps old routes to new Next.js routes, creates component inventory
3. **Build** — Builds every page with proper hover states, responsive design, client branding
4. **SEO** — Metadata, JSON-LD, sitemap, redirects from old WordPress URLs
5. **QA** — Runs the full 7-category audit (invokes webvise-qa)
6. **Deliver** — Deploys to Vercel, runs Lighthouse, creates handoff document

Each phase has a gate check. Claude will confirm with you before proceeding.

### Running a quality audit

```
/webvise-qa
```

Works on any project — not just Webvise deliveries. Runs 7 categories:

| Category | What it checks |
|---|---|
| A. Performance | Lighthouse 90+ all categories, LCP, CLS, INP |
| B. Accessibility | WCAG 2.1 AA, focus indicators, contrast, heading hierarchy |
| C. Hover States | Every clickable element has a visible hover state |
| D. Content Parity | All source pages migrated (migration projects only) |
| E. SEO | Metadata, JSON-LD, sitemap, canonical URLs, hreflang |
| F. Responsive | Layout at 375px, 768px, 1440px |
| G. Analytics | Vercel Analytics, Speed Insights, Sentry, PostHog |

You can also run targeted audits:

```
/webvise-qa just check hover states
```

### Loading conventions for a fresh build

```
/webvise-conventions
```

Use this when you're building something from scratch and want Claude to follow Webvise's engineering practices: the tech stack, project structure, code patterns, and quality bar.

This does NOT impose Webvise's visual design (brand orange, Geist fonts) on client projects. It encodes the engineering: Server Components by default, shadcn/ui, Tailwind 4, Biome formatting, SEO patterns, etc.

## How They Work Together

```
webvise-deliver
  |
  |-- Phase 3 (Build): reads webvise-conventions for stack/patterns
  |-- Phase 4 (SEO): reads conventions/references/seo-patterns.md
  |-- Phase 5 (QA): invokes webvise-qa for full audit
```

You can also use each skill independently:

- Starting a project from scratch? Use `/webvise-conventions` alone
- Just need a quality check? Use `/webvise-qa` alone
- Full client delivery? Use `/webvise-deliver` (includes the other two)

## Progress Tracking

The deliver skill creates a `delivery-status.md` file in the project root that tracks which phases are complete:

```markdown
# Delivery Status

## Phase 1: DISCOVER -- COMPLETE
- Pages found: 8
- Brand elements: logo, 2 colors, 1 font
- Gate: Confirmed by user

## Phase 2: PLAN -- COMPLETE
- Routes mapped: 8
- Redirects: 12

## Phase 3: BUILD -- IN PROGRESS
- Pages built: 5/8
```

## Key Pain Points These Skills Solve

### Hover states getting lost
The QA skill has an entire category (C) dedicated to hover states. The build phase in deliver explicitly lists every element type and its expected hover pattern. Claude must check every interactive element.

### Subpages getting missed
The discover phase maps ALL pages. The build phase requires a count verification: "discover found N pages, build created M pages, M must equal N." The QA content parity check verifies every source page has a corresponding new page.

### Quality inconsistency
The QA skill defines concrete pass/fail thresholds (Lighthouse 90+, WCAG AA, etc.) instead of vague "make it good." Every project goes through the same 7-category audit.

### Re-explaining conventions
The conventions skill carries the full stack reference. Claude reads it once per session and knows: Next.js 15, React 19, TypeScript, Tailwind 4, shadcn/ui, Biome, Server Components by default, etc.

## Keeping Conventions in Sync

When the webvise-landing design system or stack evolves:

```bash
cd /path/to/webvise-landing
./scripts/sync-conventions.sh
```

This updates the `synced-from` date in the conventions skill and reminds you to review the reference files.

## File Locations

Skills live in the repo and are symlinked to `~/.claude/skills/` for global access.

```
.claude/skills/                       # In the webvise-landing repo (source of truth)
  webvise-conventions/
    SKILL.md                          # Engineering practices
    references/
      design-tokens.md               # Webvise's own design tokens (example reference)
      component-patterns.md          # Component architecture patterns
      seo-patterns.md                # SEO implementation patterns

  webvise-qa/
    SKILL.md                          # 7-category QA audit
    references/
      lighthouse-checklist.md         # Detailed performance checklist
      content-parity-checklist.md     # Migration parity verification

  webvise-deliver/
    SKILL.md                          # 6-phase delivery workflow
    references/
      phase-discover.md               # Site crawling protocol
      phase-build.md                  # Build checklist + hover state table
      phase-seo.md                    # SEO implementation patterns

~/.claude/skills/                     # Symlinks for global access
  webvise-conventions -> {repo}/.claude/skills/webvise-conventions
  webvise-qa          -> {repo}/.claude/skills/webvise-qa
  webvise-deliver     -> {repo}/.claude/skills/webvise-deliver
```
