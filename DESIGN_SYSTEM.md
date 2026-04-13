# Design System

Source of truth for webvise's visual language. All components, pages, and patterns must follow this system.

## Typography

All text elements must use typography components from `apps/web/src/components/ui/typography.tsx`. Never use raw HTML heading elements (`<h1>`, `<h2>`, etc.) with manual `font-display` classes.

### Components

| Component | Element | Size | Weight | Use |
|-----------|---------|------|--------|-----|
| `Display` | `h1` | 32/48px, leading 1.08, tracking -0.04em | `font-display` | Hero headlines (text-balanced) |
| `H1` | `h1` | 32/48px, leading 1.08, tracking -0.04em | `font-display` | Page titles |
| `H2` | `h2` | 28/40px, leading 1.1, tracking -0.03em | `font-display` | Section headings |
| `DisplayH2` | `h2` | 32/36px, leading 1.2, tracking -0.03em | `font-display` | Large split headings, problem statements |
| `H3` | `h3` | 20px (xl), leading 1.25, tracking -0.02em | `font-display` | Card titles, subsections |
| `H4` | `h4` | 16px (base) | `font-display` | Minor subsection headers |
| `Lead` | `p` | 16px, leading 1.6 | default | Section subtitles, descriptions (muted) |
| `Body` | `p` | 15px, leading 1.6 | default | Body copy |
| `Muted` | `p` | 14px (sm), leading 1.6 | default | Secondary text (muted) |
| `Small` | `span` | 14px (sm) | default | Inline secondary text (muted) |
| `Caption` | `span` | 12px (xs) | default | Metadata, timestamps (muted) |
| `Label` | `span` | 12px (xs) | default | Semantic labels (muted) |
| `Mono` | `span` | 12px (xs) | `font-mono` | Step numbers, tech labels (muted) |
| `Stat` | `span` | 30px/48px, tracking tight | `font-display` | Metric values, price displays (brand color) |
| `QuoteMark` | `span` | 48px (5xl), leading none | `font-display` | Decorative quotation marks (brand/30) |
| `InlineLink` | `a` | 14px (sm) | default | Inline text links with underline |

### Rules

1. **Never use raw heading elements** with `font-display` outside `typography.tsx`
2. **Never override sizing** via className. If you need a different size, use or create a named variant
3. **Canonical leading for H1** is `1.08`. If you see `leading-[1.05]`, it's wrong
4. **All muted text** must use `Muted`, `Small`, `Caption`, or `Label` -- not raw `text-sm text-muted-foreground`
5. **`Stat` defaults to brand color**. Override with `className="text-foreground"` for non-brand contexts
6. **Logo text** (`font-display text-[22px]`) is the only exception -- it lives in navbar/footer and is not a typography component

### Semantic Guidance

- `Caption` vs `Label`: identical styles, but `Caption` is for descriptive metadata, `Label` is for form-like labels
- `Small` vs `Muted`: `Small` renders a `<span>`, `Muted` renders a `<p>`. Use `Small` inline, `Muted` for blocks
- `Display` vs `H1`: `Display` adds `text-balance`. Use for hero sections only
- `DisplayH2` vs `H2`: `DisplayH2` is larger (36px) with more line height. Use for prominent split-text sections

## Layout

### Container

All marketing sections use the same container:

```
max-w-[1320px] mx-auto px-6
```

### SectionWrapper

`apps/web/src/components/marketing/section-wrapper.tsx`

Standard section component with consistent vertical padding:

```tsx
<SectionWrapper id="section-id" alternate={false} dark={false}>
  {children}
</SectionWrapper>
```

| Prop | Effect |
|------|--------|
| `id` | Required. Section anchor ID |
| `alternate` | White background (`bg-white`) |
| `dark` | Dark section with `section-dark` class |
| (default) | `bg-background` |

Padding: `py-20 md:py-36`

### Grid Patterns

**3-column header** (services, case studies, about):
```
grid items-start gap-12 md:grid-cols-3 md:gap-16
```
Content spans `md:col-span-2`, sidebar takes 1 column.

**2-column paired narrative** (challenge/solution, approach/outcome):
```
grid gap-16 md:grid-cols-2 md:gap-20
```

**Bordered grid** (pain points, features, metrics):
```
grid gap-px overflow-hidden border border-border/40 md:grid-cols-{n}
```
Items use `border-border/40 not-last:border-b` for internal borders.

**Card grid** (related content, case studies):
```
grid gap-6 md:grid-cols-2
```

## Borders

Standard border: `border border-border/40`
Internal dividers: `border-border/40 not-last:border-b`
Hover state: `hover:border-brand/30`

## Colors

- **Brand**: `text-brand`, `bg-brand` -- primary accent color
- **Foreground**: `text-foreground` -- primary text
- **Muted foreground**: `text-muted-foreground` -- secondary text
- **Background**: `bg-background` -- default page background
- **Muted**: `bg-muted/30` -- subtle hover backgrounds
- **Brand/30**: `text-brand/30` -- decorative elements (quote marks)

## Spacing

- Section vertical padding: `py-20 md:py-36`
- Header padding: `pb-24 pt-24 md:pb-36 md:pt-36`
- Content gap after heading: `mt-10` or `mt-14`
- Text gap after heading: `mt-5`
- Card internal padding: `p-6 md:p-8` or `p-8 md:p-10`

## Interactive Patterns

### Tool/Tech Badges
```tsx
<span className="border border-border/40 px-3 py-1.5 text-sm transition-all hover:border-brand hover:bg-brand hover:text-white">
```

### Card Links
```tsx
<Link className="group border border-border/40 transition-colors hover:border-brand/30">
  <H3 className="transition-colors group-hover:text-brand">
```

### Testimonial Quote Card
```tsx
<QuoteMark>&ldquo;</QuoteMark>
<Lead className="mt-4 text-lg leading-relaxed">{quote}</Lead>
<Small className="text-foreground">{author}</Small>
<Caption className="mt-0.5 block">{role}</Caption>
```

### Metrics Grid
```tsx
<dl className="grid gap-px overflow-hidden border border-border/40 md:grid-cols-4">
  <div className="border-border/40 not-last:border-b p-8 text-center md:not-last:border-r md:not-last:border-b-0">
    <dd><Stat>{value}</Stat></dd>
    <dt><Muted className="mt-2">{label}</Muted></dt>
  </div>
</dl>
```

## Page Structure

### Service Subpages
1. Header (3-col: title+caption+lead | tools box)
2. Pain Points (bordered 3-col grid)
3. Approach / Outcome (2-col paired narrative)
4. Features (bordered 2-col grid, alternate bg)
5. Testimonial (centered quote from related case study, alternate bg)
6. Deliverables (numbered list)
7. Metrics (4-col grid from related case studies)
8. FAQ (2-col: heading | accordion, alternate bg)
9. Founder card
10. Related case studies (image cards)
11. Related services (icon cards)

### Case Study Subpages
1. Header (3-col: title+caption+lead+metadata | tech stack box)
2. Hero image + Testimonial quote card (3-col: image span-2 | quote)
3. Challenge / Solution (2-col paired narrative)
4. Metrics (4-col bordered grid)
5. Image gallery
6. Related case studies (image cards)
