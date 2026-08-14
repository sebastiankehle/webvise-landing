# webvise Design System

Portable specification for webvise web, sales, proposal, and print assets. Values below were taken from `apps/web/src/index.css` and the vault Print-Kit on 2026-08-14.

If the repo is available, compare this file with `apps/web/src/index.css` before building. The live stylesheet wins when values differ; update this file in the same change.

## Contents

1. Brand invariants
2. Default light tokens
3. Inverted surfaces
4. Typography
5. Radius system
6. Web surfaces and motion
7. Print foundation
8. Composition rules
9. Prohibited substitutions

## 1. Brand invariants

- Use the default light theme unless the brief requests another current site theme.
- Use OKLCH values, not converted hex approximations.
- Use Geist for the default CI. Use weights 400 and 500 only.
- Use orange as the sole brand accent. Let neutral surfaces, type, space, and lines carry the layout.
- Keep cards borderless on the web unless a documented pattern calls for a line. Print cards may use the Print-Kit hairline.
- Use a 10 px base radius. Larger hero surfaces may use the documented 14–18 px print exceptions.
- Keep the webvise mark and wordmark primary. Client branding requires an explicit brief and permission.

## 2. Default light tokens

Copy these values exactly for a standalone default-CI asset:

```css
:root {
  --background: oklch(0.9885 0.0025 250);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.958 0.0025 250);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.958 0.0025 250);
  --muted-foreground: oklch(0.44 0 0);
  --accent: oklch(0.958 0.0025 250);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.58 0.22 27);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --brand: oklch(0.75 0.18 55);
  --brand-hover: oklch(0.68 0.19 50);
  --brand-text: oklch(0.75 0.18 55);
  --brand-icon: oklch(0.75 0.18 55);
  --brand-border: oklch(0.82 0.12 62);
  --brand-surface: oklch(0.97 0.035 70);
  --brand-foreground: oklch(0.985 0 0);
  --brand-subtle: oklch(0.75 0.18 55 / 8%);
  --success: oklch(0.54 0.18 148);
  --grid-line: oklch(0.145 0 0 / 11%);
  --grid-line-strong: oklch(0.145 0 0 / 17%);
  --radius: 0.625rem;
}
```

### Data colors

```css
--chart-1: oklch(0.75 0.18 55);
--chart-2: oklch(0.623 0.214 259.815);
--chart-3: oklch(0.546 0.245 262.881);
--chart-4: oklch(0.488 0.243 264.376);
--chart-5: oklch(0.424 0.199 265.638);
```

Use chart colors only for data. Do not turn the blue chart sequence into a general brand palette.

## 3. Inverted surfaces

Use the inverted set for one deliberate dark section, cover, closing CTA, or proof band:

```css
--surface-inverted: oklch(0.11 0.008 250);
--surface-inverted-secondary: oklch(0.14 0.015 250);
--surface-inverted-foreground: oklch(0.94 0.005 80);
--surface-inverted-muted: oklch(0.2 0.01 250);
--surface-inverted-muted-foreground: oklch(0.62 0.01 250);
--surface-inverted-brand: oklch(0.75 0.18 55);
--surface-inverted-brand-hover: oklch(0.68 0.19 50);
--surface-inverted-brand-border: oklch(0.42 0.08 55);
--surface-inverted-brand-surface: oklch(0.22 0.035 55);
--surface-inverted-brand-foreground: oklch(0.985 0 0);
--surface-inverted-border: oklch(1 0 0 / 10%);
--surface-inverted-grid-line: oklch(1 0 0 / 6%);
--surface-inverted-grid-line-strong: oklch(1 0 0 / 10%);
```

Do not make every page dark. The default rhythm is light content with a limited inverted moment.

## 4. Typography

### Families

```css
--theme-font-sans: var(--font-geist-sans), Geist, sans-serif;
--theme-font-display: var(--font-geist-sans), Geist, sans-serif;
--font-mono: var(--font-geist-mono), ui-monospace, monospace;
```

Standalone output must embed Geist. Do not use Google Fonts or rely on a local system copy.

### Weights

The default CI deliberately collapses every named weight to two real values:

```css
--font-weight-thin: 400;
--font-weight-extralight: 400;
--font-weight-light: 400;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 500;
--font-weight-bold: 500;
--font-weight-extrabold: 500;
--font-weight-black: 500;
```

- Body: 400.
- Strong, headings, labels, and display: 500.
- Never synthesize 600–900.
- Display letter-spacing: `-0.015em` on the site.
- Body letter-spacing: `0` with `liga` and `calt` enabled.
- Print uses tabular numerals and Geist stylistic set `ss01`.

### Print type scale

| Role | Size | Line height | Tracking | Weight |
|---|---:|---:|---:|---:|
| Display | 34 px | 1.12 | -0.032em | 500 |
| Large display | 46 px | 1.06 | -0.038em | 500 |
| Section heading | 19 px | 1.25 | -0.024em | 500 |
| Lede | 13 px | 1.72 | normal | 400 |
| Body | 11 px | 1.72 | normal | 400 |
| Card heading | 11.5 px | normal | -0.012em | 500 |
| Card body | 10 px | 1.66 | normal | 400 |
| Kicker | 9 px | normal | 0.15em | 500 |
| Sub-label | 8.5 px | normal | 0.14em | 500 |
| Footer | 9 px | normal | 0.01em | 400 |

Uppercase is reserved for small structural labels. Do not set headings or calls to action in all caps.

## 5. Radius system

The site base is `0.625rem` = 10 px:

```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 10px;
--radius-xl: 8px;
--radius-2xl: 10px;
--radius-3xl: 22px;
--radius-4xl: 26px;
```

The unusual `xl` and `2xl` values are intentional mappings from the live theme. Do not replace them with Tailwind defaults.

Print uses 10 px for cards and notes. The approved Bau one-pager uses 12 px for images, 14 px for offer blocks and the CTA, and 18 px for its hero.

## 6. Web surfaces and motion

### Borderless card

```css
:root {
  --surface-card-fill: oklch(1 0 0);
  --surface-card-fill-hover: oklch(0.993 0.0015 250);
}

.surface-card {
  background-color: var(--surface-card-fill);
  border-radius: var(--radius-2xl);
}

a.surface-card,
button.surface-card {
  transition: background-color 0.2s ease;
}
```

No default border or shadow. Use surface contrast first.

### Media frame

```css
.media-frame {
  overflow: hidden;
  border-radius: var(--radius-2xl) 0 var(--radius-2xl) 0;
}
```

### Constructed grid hatch

```css
.grid-hatch {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 8px,
    var(--grid-hatch-color, var(--grid-line)) 8px,
    var(--grid-hatch-color, var(--grid-line)) 8.5px
  );
}
```

Use this as a quiet structural texture, not as a full-page motif.

### Motion

- Card hover: background color, `0.2s ease`.
- Stagger reveal: `0.6s cubic-bezier(0.21, 0.47, 0.32, 0.98)`, starting at `translateY(20px)` and `opacity: 0`.
- Stagger interval: 70 ms.
- Single reveal: `0.7s` with the same easing, starting at `translateY(24px)`.
- Disable reveal transforms and animations under `prefers-reduced-motion: reduce`.

Do not add motion to print files. Do not invent spring or blur effects unless the live component pattern calls for them.

## 7. Print foundation

### Exact print tokens

```css
:root {
  --background: oklch(0.9885 0.0025 250);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --muted: oklch(0.958 0.0025 250);
  --muted-foreground: oklch(0.44 0 0);
  --border: oklch(0.922 0 0);
  --grid-line: oklch(0.145 0 0 / 11%);
  --grid-line-strong: oklch(0.145 0 0 / 17%);
  --brand: oklch(0.75 0.18 55);
  --brand-border: oklch(0.82 0.12 62);
  --brand-surface: oklch(0.97 0.035 70);
  --inv: oklch(0.11 0.008 250);
  --inv-fg: oklch(0.94 0.005 80);
  --inv-muted-fg: oklch(0.62 0.01 250);
  --inv-border: oklch(1 0 0 / 10%);
  --inv-grid: oklch(1 0 0 / 6%);
  --radius: 10px;
  --w-normal: 400;
  --w-medium: 500;
  --page-x: 68px;
  --page-t: 60px;
  --page-b: 46px;
  --gap-section: 42px;
  --gap-block: 24px;
  --gap-item: 14px;
}
```

### A4 portrait sheet

```css
.sheet {
  width: 794px;
  height: 1123px;
  margin: 32px auto;
  padding: var(--page-t) var(--page-x) var(--page-b);
  overflow: hidden;
}

@media print {
  .sheet {
    margin: 0;
    box-shadow: none;
    page-break-after: always;
  }
}

@page { size: A4; margin: 0; }
```

Screen preview shadow only:

```css
box-shadow:
  0 1px 3px oklch(0.145 0 0 / 6%),
  0 12px 32px oklch(0.145 0 0 / 8%);
```

Use the numbered service deck as the mechanical source for A4 landscape. Keep the same tokens and type rules; do not rotate portrait spacing blindly.

### Print components

- Header: 20 px bottom padding, 1 px grid line, 42 px bottom gap.
- Footer: 18 px top padding, 1 px grid line, 9 px type.
- Note: brand surface, brand border, 10 px radius, `18px 22px` padding.
- Card: white, 1 px grid line, 10 px radius, `20px 22px` padding.
- Quote: white, 1 px grid line, 10 px radius, `18px 22px` padding.
- Matrix rows: 14 px vertical padding; grid line between rows; no outer box.
- Two-column grid: `1fr 1fr`, 48 px column gap, 24 px row gap.
- Three-column grid: three equal columns, 36 px column gap, 24 px row gap.

### Arrow icon

Geist does not contain U+2192. Never type a right-arrow character in print output. Use `<i class="ar"></i>` with the masked SVG from the Print-Kit.

### Print delivery checks

- Embed Geist in the HTML.
- Print with no browser margins and exact colors.
- Match the PDF page count to the number of `.sheet` elements.
- Run `pdffonts`; only `Geist-Regular` and `Geist-Medium` may appear.
- Reject clipped content, hidden overflow, extra pages, and external font requests.

## 8. Composition rules

- Lead with one clear promise, not a collage of modules.
- Use one dominant type scale per page and one secondary information layer.
- Prefer white space, alignment, and thin rules over decorative containers.
- Keep proof next to the claim it supports.
- Use cards for bounded units, not for every paragraph.
- Use a dark surface once for contrast: cover, proof band, or closing CTA.
- Keep orange scarce enough that it still signals action or emphasis.
- Use real content density. Do not stretch a short idea across many empty pages.
- Match the format: landscape for short service narratives; portrait for offers, one-pagers, and long reading.

## 9. Prohibited substitutions

- No Inter, Arial, or generic sans-serif in default-CI output.
- No font weight above 500.
- No warm cream background; use `oklch(0.9885 0.0025 250)`.
- No arbitrary hex orange; use `oklch(0.75 0.18 55)`.
- No Tailwind default radii in place of the mappings above.
- No heavy shadows on web cards.
- No border around every web surface.
- No typed right-arrow glyph in print.
- No DEKRA green, logo, rate, or client detail outside an approved DEKRA asset.
- No claim copied from an example without checking the Proof stack.
