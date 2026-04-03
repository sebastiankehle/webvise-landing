# Design Tokens Reference

Complete CSS custom property definitions from `apps/web/src/index.css`.

## Light Mode Tokens (`:root`)

| Token | OKLCH Value | Usage |
|---|---|---|
| `--background` | `oklch(0.985 0.003 80)` | Primary canvas / page background |
| `--foreground` | `oklch(0.13 0.01 250)` | Primary text (near-black, never pure black) |
| `--card` | `oklch(1 0.003 80)` | Card surfaces |
| `--card-foreground` | `oklch(0.13 0.01 250)` | Card text |
| `--popover` | `oklch(1 0.003 80)` | Popover/dropdown surfaces |
| `--popover-foreground` | `oklch(0.13 0.01 250)` | Popover text |
| `--primary` | `oklch(0.13 0.01 250)` | Primary UI actions (dark-on-light) |
| `--primary-foreground` | `oklch(0.985 0.003 80)` | Text on primary surfaces |
| `--secondary` | `oklch(0.96 0.005 80)` | Secondary surfaces and buttons |
| `--secondary-foreground` | `oklch(0.13 0.01 250)` | Text on secondary surfaces |
| `--muted` | `oklch(0.96 0.005 80)` | Muted backgrounds, hover states |
| `--muted-foreground` | `oklch(0.48 0.01 250)` | Secondary text, metadata, descriptions |
| `--accent` | `oklch(0.96 0.005 80)` | Accent surfaces |
| `--accent-foreground` | `oklch(0.13 0.01 250)` | Text on accent surfaces |
| `--destructive` | `oklch(0.58 0.22 27)` | Error states, destructive actions |
| `--border` | `oklch(0.90 0.005 80)` | Default border color |
| `--input` | `oklch(0.90 0.005 80)` | Input field borders |
| `--ring` | `oklch(0.48 0.01 250)` | Focus ring color |
| `--brand` | `oklch(0.75 0.18 55)` | Brand orange -- singular accent |
| `--brand-subtle` | `oklch(0.75 0.18 55 / 8%)` | Low-opacity brand tint for backgrounds |
| `--surface-dark` | `oklch(0.13 0.01 250)` | Dark section base |
| `--surface-dark-secondary` | `oklch(0.18 0.01 250)` | Dark section secondary surface |
| `--radius` | `0rem` | Base radius (all components sharp) |

### Chart Colors (Light)

| Token | Value |
|---|---|
| `--chart-1` | `oklch(0.75 0.18 55)` |
| `--chart-2` | `oklch(0.65 0.14 55)` |
| `--chart-3` | `oklch(0.55 0.10 55)` |
| `--chart-4` | `oklch(0.55 0.04 250)` |
| `--chart-5` | `oklch(0.45 0.03 250)` |

### Sidebar Tokens (Light)

| Token | Value |
|---|---|
| `--sidebar` | `oklch(0.985 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` |
| `--sidebar-primary` | `oklch(0.205 0 0)` |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` |
| `--sidebar-accent` | `oklch(0.97 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.205 0 0)` |
| `--sidebar-border` | `oklch(0.922 0 0)` |
| `--sidebar-ring` | `oklch(0.708 0 0)` |

## Dark Mode Tokens (`.dark`)

| Token | Value |
|---|---|
| `--background` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.985 0 0)` |
| `--card` | `oklch(0.205 0 0)` |
| `--card-foreground` | `oklch(0.985 0 0)` |
| `--popover` | `oklch(0.205 0 0)` |
| `--popover-foreground` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.87 0 0)` |
| `--primary-foreground` | `oklch(0.205 0 0)` |
| `--secondary` | `oklch(0.269 0 0)` |
| `--secondary-foreground` | `oklch(0.985 0 0)` |
| `--muted` | `oklch(0.269 0 0)` |
| `--muted-foreground` | `oklch(0.708 0 0)` |
| `--accent` | `oklch(0.371 0 0)` |
| `--accent-foreground` | `oklch(0.985 0 0)` |
| `--destructive` | `oklch(0.704 0.191 22.216)` |
| `--border` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(1 0 0 / 15%)` |
| `--ring` | `oklch(0.556 0 0)` |

### Chart Colors (Dark)

| Token | Value |
|---|---|
| `--chart-1` | `oklch(0.809 0.105 251.813)` |
| `--chart-2` | `oklch(0.623 0.214 259.815)` |
| `--chart-3` | `oklch(0.546 0.245 262.881)` |
| `--chart-4` | `oklch(0.488 0.243 264.376)` |
| `--chart-5` | `oklch(0.424 0.199 265.638)` |

### Sidebar Tokens (Dark)

| Token | Value |
|---|---|
| `--sidebar` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `oklch(0.488 0.243 264.376)` |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` |
| `--sidebar-accent` | `oklch(0.269 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.985 0 0)` |
| `--sidebar-border` | `oklch(1 0 0 / 10%)` |
| `--sidebar-ring` | `oklch(0.556 0 0)` |

## Section-Dark Tokens (`.section-dark`)

Applied locally to invert sections within a light-mode page.

| Token | Value |
|---|---|
| `--background` | `oklch(0.13 0.01 250)` |
| `--foreground` | `oklch(0.94 0.005 80)` |
| `--card` | `oklch(0.18 0.01 250)` |
| `--card-foreground` | `oklch(0.94 0.005 80)` |
| `--muted` | `oklch(0.20 0.01 250)` |
| `--muted-foreground` | `oklch(0.62 0.01 250)` |
| `--border` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(1 0 0 / 12%)` |
| `--accent` | `oklch(0.20 0.01 250)` |
| `--accent-foreground` | `oklch(0.94 0.005 80)` |
| `--secondary` | `oklch(0.20 0.01 250)` |
| `--secondary-foreground` | `oklch(0.94 0.005 80)` |

Background gradient:
```css
background: linear-gradient(165deg, oklch(0.14 0.015 250), oklch(0.11 0.008 250));
```

## Tailwind Theme Registration (`@theme inline`)

```css
@theme inline {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-brand: var(--brand);
  --color-brand-subtle: var(--brand-subtle);
  --color-surface-dark: var(--surface-dark);
  --color-surface-dark-secondary: var(--surface-dark-secondary);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}
```

## Typography Scale

| Context | Classes | Example |
|---|---|---|
| Hero title | `font-display text-3xl md:text-[52px] leading-[1.12] tracking-tight` | Main page headline |
| Section heading | `font-display text-3xl md:text-4xl tracking-tight` | Section titles |
| Card heading | `font-display text-xl` | Card titles, pricing tier names |
| Brand wordmark | `font-display text-[22px]` | "webvise" in navbar and footer |
| Body text | `text-lg text-muted-foreground leading-relaxed` | Hero subtitle, section descriptions |
| Card body | `text-sm text-muted-foreground leading-relaxed` | Card descriptions, service taglines |
| Default UI text | `text-xs/relaxed` | Cards, dialogs, inputs, general UI |
| Micro labels | `font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50` | Footer section headings |
| Nav links | `text-[13px] uppercase tracking-wider` | Desktop navigation items |
| Metadata | `text-xs text-muted-foreground` | Dates, reading times, legal copy |

### Typography Rules

- Never use pure black. Text is `--foreground` (`oklch(0.13 0.01 250)`).
- Relaxed line-height for body: `leading-relaxed` (1.625) or `/relaxed` suffix.
- Tight leading for display: `leading-[1.12]` on hero titles.
- Tight tracking on display: `tracking-tight` on headings.
- Wide tracking on labels: `tracking-wider` or `tracking-widest` on uppercase micro-copy.
- `text-balance` on hero headlines.

## Spacing Constants

### Layout Constants

| Element | Value | Tailwind |
|---|---|---|
| Max content width | `1320px` | `max-w-[1320px]` |
| Horizontal page padding | `1.5rem` | `px-6` |
| Navbar height (mobile) | `4rem` | `h-16` |
| Navbar height (desktop) | `5rem` | `h-20` |

### Section Spacing

| Context | Mobile | Desktop | Tailwind |
|---|---|---|---|
| Hero section | `py-24` (6rem) | `py-44` (11rem) | `py-24 md:py-44` |
| Standard section | `py-20` (5rem) | `py-36` (9rem) | `py-20 md:py-36` |
| Footer content | `py-20` (5rem) | `py-24` (6rem) | `py-20 md:py-24` |

### Component Spacing

| Context | Value | Tailwind |
|---|---|---|
| Grid gap (hero) | `4rem` | `gap-16` |
| Grid gap (footer columns) | `3rem` | `gap-12` |
| Card internal padding | `2rem / 2.5rem` | `p-8 md:p-10` |
| Card content padding | `1rem` | `px-4` |
| Heading to body text | `1rem` | `mt-4` |
| Heading to card grid | `3.5rem` | `mt-14` |
| Body to CTA | `3rem` | `mt-12` |
| List item spacing | `0.75rem` | `space-y-3` |
| Button gap (inline) | `1rem` | `gap-4` |
| Section heading to subtitle | `1rem` | `mt-4` |

## Animation Values

### Stagger Reveal

| Property | Value |
|---|---|
| Duration | `0.6s` |
| Easing | `cubic-bezier(0.21, 0.47, 0.32, 0.98)` |
| Stagger delay | `70ms` per child |
| Max children | 9 (delays: 0ms through 560ms) |
| Initial Y offset | `20px` |
| Trigger margin | `-60px` |

### Single-Element Reveal

| Property | Value |
|---|---|
| Duration | `0.7s` |
| Easing | `cubic-bezier(0.21, 0.47, 0.32, 0.98)` |
| Initial Y offset | `24px` |

### Logo Hover

| Property | Value |
|---|---|
| Segment duration | `0.2s` per segment |
| Stagger | `50ms` between segments (8 total) |
| Easing | `ease-out` |
| Reset transition | `0.15s ease-out` on `fill-opacity` |

### Transition Defaults

| Element | Properties | Duration |
|---|---|---|
| Buttons | `transition-all` | 150ms (default) |
| Nav links | `transition-colors` | 150ms (default) |
| Navbar background | `transition-all` | `duration-500` |
| Dropdown panel | `transition-all` | `duration-200 ease-out` |
| Hover states | `transition-colors` | 150ms (default) |
