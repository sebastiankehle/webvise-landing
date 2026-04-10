# Component Patterns Reference

> **Design system source of truth:** `/DESIGN_SYSTEM.md` at the repository root.
> Typography, spacing, and visual token values below may drift -- always verify against `DESIGN_SYSTEM.md`.

Exact component architecture and patterns from the webvise-landing codebase.

## SectionWrapper

Server component wrapping all marketing sections.

```tsx
import { cn } from "@/lib/utils";

export default function SectionWrapper({
  id,
  children,
  className,
  alternate = false,
  dark = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  alternate?: boolean;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 md:py-36",
        dark
          ? "section-dark"
          : alternate
            ? "bg-white"
            : "bg-background",
        className,
      )}
    >
      <div className="relative mx-auto max-w-[1320px] px-6">{children}</div>
    </section>
  );
}
```

| Variant | Background | Use |
|---|---|---|
| default | `bg-background` | Standard sections |
| `alternate` | `bg-white` | Subtle tonal shift from `bg-background` |
| `dark` | `.section-dark` class | Inverted high-contrast sections |

## Button Variants

Built with `class-variance-authority` on a `@base-ui/react` primitive.

### Variants

| Variant | Styling | Usage |
|---|---|---|
| `default` | `bg-primary text-primary-foreground` | Standard dark button |
| `outline` | `border-border bg-background` -> hover `bg-muted` | Secondary actions |
| `secondary` | `bg-secondary text-secondary-foreground` | Tertiary actions |
| `ghost` | Transparent -> hover `bg-muted` | Toolbar, inline actions |
| `destructive` | `bg-destructive/10 text-destructive` | Delete, remove |
| `link` | `text-primary underline-offset-4` -> hover underline | Inline text links |

### Brand CTA (composed, not a variant)

```tsx
<Button className="border-transparent bg-brand px-8 font-mono text-white [&]:hover:bg-brand/80" />
```

Brand CTAs use `font-mono` for the Exalt-style uppercase chrome treatment. Hero and navbar CTAs use `size="lg"` with additional `px-6` or `px-8`. See `DESIGN_SYSTEM.md` section 7.1 for full button patterns.

### Sizes

| Size | Height | Padding |
|---|---|---|
| `xs` | `h-6` | `px-2` |
| `sm` | `h-7` | `px-2.5` |
| `default` | `h-8` | `px-2.5` |
| `lg` | `h-9` | `px-2.5` |
| `icon` | `size-8` | -- |
| `icon-xs` | `size-6` | -- |
| `icon-sm` | `size-7` | -- |
| `icon-lg` | `size-9` | -- |

## Card Pattern

| Property | Value |
|---|---|
| Background | `bg-card` |
| Boundary | `ring-1 ring-foreground/10` |
| Corner radius | `rounded-none` (inherited from `--radius: 0rem`) |
| Internal gap | `gap-4` (default), `gap-2` (sm) |
| Padding | `py-4` (default), `py-3` (sm) |
| Content padding | `px-4` (default), `px-3` (sm) |
| Text size | `text-xs/relaxed` |
| Footer | `border-t p-4` |

## Benefit Card Pattern

Grid of feature/benefit cards with icon + title + description.

### Grid Container

```tsx
<div className="grid gap-px border border-border/40 md:grid-cols-3">
  {items.map(item => (
    <div key={item.id} className="bg-background p-8 transition-colors hover:bg-muted/30 md:p-10">
      {/* card content */}
    </div>
  ))}
</div>
```

### Card Content

```tsx
<div className="flex h-10 w-10 items-center justify-center border border-brand/20 bg-brand/5">
  <Icon className="h-5 w-5 text-brand" strokeWidth={1.5} />
</div>
<h3 className="mt-4 font-display text-xl">{title}</h3>
<p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
```

| Property | Value |
|---|---|
| Grid layout | `grid gap-px md:grid-cols-3` |
| Outer border | `border border-border/40` |
| Cell padding | `p-8 md:p-10` |
| Hover | `bg-muted/30` |
| Icon container | `h-10 w-10 border border-brand/20 bg-brand/5` |
| Icon | `h-5 w-5 text-brand` (lucide, `strokeWidth={1.5}`) |

## Grid Patterns

| Pattern | Classes | Usage |
|---|---|---|
| Hero split | `grid md:grid-cols-2 items-center gap-16` | Hero section |
| Benefits grid | `grid md:grid-cols-3 gap-px border border-border/40` | Benefit cards |
| Footer columns | `grid md:grid-cols-12 gap-12` | Footer layout |
| Pricing grid | `grid grid-cols-3` | Pricing dropdown |
| Service grid | `grid grid-cols-2` | Services dropdown |

### Content Width Constraints

| Element | Max Width |
|---|---|
| Page content | `max-w-[1320px]` |
| Dropdown panel | `max-w-[720px]` |
| Section intro text | `max-w-2xl` |
| Body paragraph | `max-w-lg` or `max-w-xs` |
| Icon cloud | `max-w-sm` |

## StaggerChildren Component

Client component for scroll-triggered stagger reveals.

```tsx
"use client";

import { useInView } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
}

export default function StaggerChildren({ children, className }: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className={cn(className, isInView ? "stagger-visible" : "stagger-hidden")}
    >
      {children}
    </div>
  );
}
```

Usage: wrap any container whose children should animate in sequentially.

```tsx
<StaggerChildren className="grid md:grid-cols-3 gap-px">
  {items.map(item => <div key={item.id}>...</div>)}
</StaggerChildren>
```

## Navigation Pattern

### Navbar

| Property | Value |
|---|---|
| Height (mobile) | `h-16` |
| Height (desktop) | `h-20` |
| Background (default) | Transparent |
| Background (scrolled) | `bg-background/80 backdrop-blur-xl` |
| Border (scrolled) | `border-b border-border/40` |
| Background transition | `transition-all duration-500` |
| Brand wordmark | `font-display text-[22px]` |

### Mega-Menu Dropdown

| Property | Value |
|---|---|
| Max width | `max-w-[720px]` |
| Background | `bg-background/95 backdrop-blur-xl` |
| Border | `border border-border/40` |
| Shadow | `shadow-xl` |
| Cell padding | `p-5` |
| Cell hover | `bg-muted/40` |
| Cell dividers | `border-border/40` |
| Enter animation | `-translate-y-2 opacity-0` -> `translate-y-0 opacity-100` |
| Transition | `duration-200 ease-out` |

### Nav Links

```
text-sm
```

Nav links use `text-sm` without uppercase or tracking overrides. See `DESIGN_SYSTEM.md` for the current typography scale.

## Footer Pattern

### Structure

- `.section-dark` background (gradient)
- Grid: `md:grid-cols-12 gap-12`
- Brand column spans wider, link columns share remaining space

### Section Headings

```
font-mono text-xs text-muted-foreground/50
```

`font-mono` auto-applies `uppercase` and `letter-spacing: 0` via base CSS -- do not add explicit `uppercase` or `tracking-*` classes. See `DESIGN_SYSTEM.md` section 7.8 for the full two-font system usage table.

### Footer Content

| Property | Value |
|---|---|
| Padding | `py-20 md:py-24` |
| Brand wordmark | `font-display text-[22px]` |
| Link text | `text-sm text-muted-foreground` |
| Bottom bar | `border-t border-border/40` with `py-8` |
| Copyright | `text-xs text-muted-foreground` |

## Input Pattern

| Property | Value |
|---|---|
| Height | `h-8` |
| Background | Transparent (light), `bg-input/30` (dark) |
| Border | `border border-input` |
| Padding | `px-2.5 py-1` |
| Text size | `text-xs` |
| Focus | `border-ring ring-1 ring-ring/50` |
| Error | `border-destructive ring-1 ring-destructive/20` |
| Disabled | `bg-input/50 opacity-50` |

## Dialog Pattern

| Property | Value |
|---|---|
| Max width | `sm:max-w-sm` |
| Background | `bg-popover` |
| Boundary | `ring-1 ring-foreground/10` |
| Padding | `p-4` |
| Gap | `gap-4` |
| Overlay | `bg-black/10 backdrop-blur-xs` |
| Animation | `fade-in` + `zoom-in-95` on open |
| Title | `text-sm font-medium` |
| Description | `text-xs/relaxed text-muted-foreground` |

## Dropdown Menu Pattern

| Property | Value |
|---|---|
| Background | `bg-popover` |
| Boundary | `ring-1 ring-foreground/10` |
| Shadow | `shadow-md` (submenu: `shadow-lg`) |
| Item padding | `px-2 py-1.5` |
| Item text | `text-xs` |
| Separator | `bg-border -mx-1 my-1 h-px` |

## Data Layer Patterns

### JSON Content Files

```
content/{type}/{slug}/{locale}.json
```

Example: `content/blog/my-article/en.json`, `content/blog/my-article/de.json`

### Translation Files

```
messages/{locale}.json
```

Structured by page/section:
```json
{
  "home": {
    "hero": { "title": "...", "subtitle": "..." },
    "benefits": { "title": "...", "items": { ... } }
  },
  "services": {
    "meta": { "title": "...", "description": "..." }
  }
}
```

### Typed Data Modules

```
src/data/{entity}.ts
```

Exports typed arrays/objects:
```tsx
export const services: Service[] = [
  { slug: "web-development", icon: Code2, ... },
];
```
