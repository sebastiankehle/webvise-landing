# Phase 3: BUILD — Detailed Checklist

## Page Scaffold

For each new page, use this template:

```tsx
// app/[locale]/(marketing)/page-name/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionWrapper } from "@/components/marketing/section-wrapper";

type Props = { params: Promise<{ locale: string }> };

export default async function PageName({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pageName" });

  return (
    <>
      <SectionWrapper>
        {/* Page content */}
      </SectionWrapper>
    </>
  );
}
```

## Section Component Pattern

```tsx
<SectionWrapper alternate> {/* or dark */}
  <div className="text-center">
    <h2 className="font-display text-3xl tracking-tight md:text-4xl">
      {t("sectionTitle")}
    </h2>
    <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
      {t("sectionDescription")}
    </p>
  </div>
  <StaggerChildren className="mt-14 grid gap-px border border-border/40 md:grid-cols-3">
    {items.map(item => (
      <div key={item.id} className="p-8 transition-colors hover:bg-muted/30 md:p-10">
        {/* Card content */}
      </div>
    ))}
  </StaggerChildren>
</SectionWrapper>
```

## Interactive Component Pattern

Only use `"use client"` when the component needs:
- useState, useEffect, useRef
- Event handlers (onClick, onChange, etc.)
- Browser APIs (window, document)
- Third-party client libraries

```tsx
"use client";

import { useState } from "react";

export function AccordionSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // ...
}
```

## Hover State Reference

For EVERY interactive element, apply one of these patterns:

| Element | Hover Pattern |
|---------|--------------|
| Primary button | `hover:bg-primary/90` or `[&]:hover:bg-brand/80` |
| Ghost button | `hover:bg-muted` |
| Outline button | `hover:bg-muted` |
| Card/cell | `hover:bg-muted/30` or `transition-colors hover:bg-muted/30` |
| Navigation link | `hover:text-foreground` with `transition-colors` |
| Footer link | `hover:text-foreground` with `transition-colors` |
| Social icon | `hover:border-brand/40 hover:text-brand` |
| Text link | `hover:underline` or `hover:text-brand` |
| Accordion trigger | `hover:bg-muted/30` |
| Tag/badge | `hover:border-brand hover:bg-brand hover:text-white` |
| Dropdown item | `hover:bg-muted/40` |
| Icon button | `hover:bg-muted` |
| Breadcrumb link | `hover:text-foreground` |
| Pagination button | `hover:bg-muted` |

EVERY element in this table MUST have `transition-colors` (or `transition`) for smooth state changes.

## Translation Key Naming

Follow this structure for all translation keys:

```
{pageName}.meta.title
{pageName}.meta.description
{pageName}.hero.title
{pageName}.hero.description
{pageName}.hero.cta
{pageName}.{sectionName}.title
{pageName}.{sectionName}.description
{pageName}.{sectionName}.items.{index}.title
{pageName}.{sectionName}.items.{index}.description
```

Example for a services page:

```json
{
  "services": {
    "meta": {
      "title": "Our Services",
      "description": "Professional web development services"
    },
    "hero": {
      "title": "What We Do",
      "description": "Full-service web development and design",
      "cta": "Get Started"
    },
    "offerings": {
      "title": "Our Offerings",
      "items": {
        "0": { "title": "Web Development", "description": "..." },
        "1": { "title": "SEO Optimization", "description": "..." },
        "2": { "title": "Design", "description": "..." }
      }
    }
  }
}
```

## Responsive Patterns

Mobile-first. Write base styles for mobile, add `md:` for desktop.

| Context | Mobile | Desktop |
|---------|--------|---------|
| Hero section | `py-24` | `md:py-44` |
| Standard section | `py-20` | `md:py-36` |
| Footer content | `py-20` | `md:py-24` |
| Card padding | `p-6` | `md:p-10` |
| Grid columns | `grid-cols-1` | `md:grid-cols-3` |
| Text size (hero) | `text-3xl` | `md:text-5xl` |
| Text size (section) | `text-3xl` | `md:text-4xl` |
| Content padding | `px-6` | (handled by max-w container) |

### Grid Reflow Pattern

```tsx
{/* 3-column grid that stacks on mobile */}
<div className="grid grid-cols-1 gap-px md:grid-cols-3">
  {/* items */}
</div>

{/* 2-column grid that stacks on mobile */}
<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
  {/* items */}
</div>

{/* 4-column grid: 2 on mobile, 4 on desktop */}
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
  {/* items */}
</div>
```

### Mobile Navigation

Every site needs a mobile menu. Pattern:

```tsx
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="transition-colors hover:bg-muted md:hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 p-6">
            {/* nav items with hover:bg-muted/30 */}
          </nav>
        </div>
      )}
    </>
  );
}
```

## Heading Hierarchy

Enforce strict sequential headings on every page:

- Exactly ONE `<h1>` per page (the page title or hero heading)
- `<h2>` for section titles
- `<h3>` for subsection titles or card headings within a section
- Never skip levels (no h1 followed by h3)

```tsx
<h1>Page Title</h1>          {/* One per page */}
  <h2>Section Title</h2>     {/* Major sections */}
    <h3>Card Title</h3>      {/* Items within a section */}
    <h3>Card Title</h3>
  <h2>Another Section</h2>
    <h3>Item Title</h3>
```

## Subpage Verification Checklist

After building all pages, run this verification:

1. Open delivery-status.md
2. List every page from Phase 1 DISCOVER
3. For each page, confirm a corresponding route exists in `app/[locale]/(marketing)/`
4. Count: Discover pages = {N}, Built pages = {M}
5. If M < N, identify which pages are missing and build them
6. Only proceed when M = N

### Verification Table Format

```markdown
| # | Discover Page | Route | Status |
|---|--------------|-------|--------|
| 1 | Homepage | / | Built |
| 2 | About | /about | Built |
| 3 | Services | /services | Built |
| 4 | Contact | /contact | Built |
| 5 | Privacy | /privacy | Built |
| 6 | Imprint | /imprint | Built |
| 7 | Blog | /blog | Built |

**Discover: 7 pages | Built: 7 pages | Match: YES**
```

## Build Gate Check

Before marking Phase 3 complete, verify all three:

1. **Page count matches:** discover found N pages, build created N pages
2. **Build passes:** `pnpm build` completes with zero errors
3. **TypeScript passes:** no type errors in any file

Run these commands:

```bash
pnpm build        # Must succeed
pnpm typecheck    # Or: npx tsc --noEmit — must report zero errors
```

Update delivery-status.md with results.
