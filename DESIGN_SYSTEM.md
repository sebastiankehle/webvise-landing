# Design System Specification

## 1. Overview & Creative Direction

**Design Philosophy: "Engineered Minimalism"**

This design system is built on the intersection of Swiss-style precision and restrained digital craftsmanship. It achieves distinction through sharp geometry, a monochromatic foundation punctured by a singular warm accent, and generous use of whitespace as a structural element.

The system uses a **strict two-font system** inspired by Exalt Studio: **Inter** for all content (headings, body, links) and **Geist Mono** for all UI chrome (labels, metadata, buttons, badges) with auto-uppercase. **OKLCH** provides perceptually uniform color, and **zero border-radius** is a defining geometric choice. Every surface, component, and interaction is designed to feel engineered rather than decorated.

**Core Principles:**
- **Sharp geometry** - `border-radius: 0` everywhere. No rounded corners. No pills.
- **Restrained color** - A near-monochromatic palette with a single warm orange accent used sparingly for action and emphasis.
- **Tonal depth** - Elevation is achieved through background shifts and subtle rings, not drop shadows.
- **Generous spacing** - Whitespace is a first-class structural element, not leftover space.

---

## 2. Color System

Colors are defined as CSS custom properties using the **OKLCH** color space for perceptual uniformity. All tokens are theme-aware and switch between light and dark modes via the `.dark` class.

### 2.1 Light Mode Tokens

| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(0.985 0.003 80)` | Primary canvas / page background |
| `--foreground` | `oklch(0.13 0.01 250)` | Primary text color (near-black, never pure black) |
| `--card` | `oklch(1 0.003 80)` | Card surfaces, lifted from background |
| `--popover` | `oklch(1 0.003 80)` | Popover / dropdown surfaces |
| `--primary` | `oklch(0.13 0.01 250)` | Primary UI actions (dark-on-light) |
| `--primary-foreground` | `oklch(0.985 0.003 80)` | Text on primary surfaces |
| `--secondary` | `oklch(0.96 0.005 80)` | Secondary surfaces and buttons |
| `--muted` | `oklch(0.96 0.005 80)` | Muted backgrounds, hover states |
| `--muted-foreground` | `oklch(0.48 0.01 250)` | Secondary text, metadata, descriptions |
| `--accent` | `oklch(0.96 0.005 80)` | Accent surfaces |
| `--border` | `oklch(0.90 0.005 80)` | Default border color |
| `--input` | `oklch(0.90 0.005 80)` | Input field borders |
| `--ring` | `oklch(0.48 0.01 250)` | Focus ring color |
| `--destructive` | `oklch(0.58 0.22 27)` | Error states and destructive actions |
| `--brand` | `oklch(0.75 0.18 55)` | Brand orange - the singular accent color |
| `--brand-subtle` | `oklch(0.75 0.18 55 / 8%)` | Low-opacity brand tint for backgrounds |
| `--surface-dark` | `oklch(0.13 0.01 250)` | Dark section base |
| `--surface-dark-secondary` | `oklch(0.18 0.01 250)` | Dark section secondary surface |

### 2.2 Dark Mode Tokens

Dark mode is enabled via the `.dark` class on a parent element. Key shifts:

| Token | Value |
|---|---|
| `--background` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.985 0 0)` |
| `--card` | `oklch(0.205 0 0)` |
| `--primary` | `oklch(0.87 0 0)` |
| `--secondary` | `oklch(0.269 0 0)` |
| `--muted` | `oklch(0.269 0 0)` |
| `--muted-foreground` | `oklch(0.708 0 0)` |
| `--accent` | `oklch(0.371 0 0)` |
| `--border` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(1 0 0 / 15%)` |

### 2.3 Section-Dark Variant

The `.section-dark` class creates a locally inverted color context without toggling global dark mode. It overrides semantic tokens and applies a subtle diagonal gradient background:

```css
.section-dark {
  background: linear-gradient(165deg, oklch(0.14 0.015 250), oklch(0.11 0.008 250));
}
```

Used for: footer sections, CTA banners, and other high-contrast zones within a light-mode page.

### 2.4 Brand Orange Usage Rules

The brand color (`oklch(0.75 0.18 55)`) is a high-energy accent. Use it for:
- Primary CTA buttons (`bg-brand text-white`)
- Active state indicators (e.g., nav underlines)
- Icon containers (`border-brand/20 bg-brand/5`)
- Links that need emphasis (e.g., email addresses, featured links)
- Hover accents on social icons and interactive elements

**Restraint rule:** Brand orange should never dominate the viewport. It appears on action elements and small accent surfaces only. The majority of the interface is neutral.

### 2.5 Chart Colors

For data visualization, five chart tokens are defined (light mode uses warm orange-to-neutral progression, dark mode uses a blue progression):

| Token | Light | Dark |
|---|---|---|
| `--chart-1` | `oklch(0.75 0.18 55)` | `oklch(0.809 0.105 251.813)` |
| `--chart-2` | `oklch(0.65 0.14 55)` | `oklch(0.623 0.214 259.815)` |
| `--chart-3` | `oklch(0.55 0.10 55)` | `oklch(0.546 0.245 262.881)` |
| `--chart-4` | `oklch(0.55 0.04 250)` | `oklch(0.488 0.243 264.376)` |
| `--chart-5` | `oklch(0.45 0.03 250)` | `oklch(0.424 0.199 265.638)` |

---

## 3. Typography

A strict two-font system inspired by Exalt Studio. **Inter** handles all content with medium (500) weight for display and tight negative tracking. **Geist Mono** handles all UI chrome (labels, metadata, buttons, badges) with auto-uppercase enforced via CSS. This creates a clear visual hierarchy between "chrome" (mono/uppercase) and "content" (Inter/mixed-case).

### 3.1 Font Stack

| Role | Font | CSS Variable | Usage |
|---|---|---|---|
| Sans (body) | Inter | `--font-inter` → `--font-sans` | All body text, UI elements |
| Display | Inter | `--font-inter` → `--font-display` | Headlines, brand wordmark, section titles |
| Mono | Geist Mono | `--font-geist-mono` → `--font-mono` | All UI chrome: labels, metadata, buttons, badges, section headers (auto-uppercase via CSS) |

Inter is loaded via `next/font/google` with CSS variable injection in the root layout. Ligatures and contextual alternates are enabled globally via:

```css
body {
  font-feature-settings: "liga" 1, "calt" 1;
  letter-spacing: -0.011em;
}
.font-display {
  font-weight: 500;
  letter-spacing: -0.05em;
}
.font-mono {
  letter-spacing: 0;
  text-transform: uppercase;
}
```

### 3.2 Type Scale & Usage

| Context | Classes | Notes |
|---|---|---|
| Hero title (h1) | `font-display text-[36px] md:text-[64px] leading-[1.05]` | Home hero only; tracking inherited from `.font-display` (-0.05em) |
| Page title (h1) | `font-display text-[32px] md:text-[48px] leading-[1.05]` | Blog, case-studies, about, legal |
| Section heading (h2) | `font-display text-[28px] md:text-[40px] leading-[1.15]` | All `SectionWrapper` intro headings |
| Card/subsection (h3) | `font-display text-xl leading-[1.3] tracking-[-0.04em]` | Benefit/service/blog/case cards |
| Pricing tier name (h3) | `font-display text-2xl tracking-[-0.04em]` | Pricing cards |
| Metrics value | `font-display text-[36px] md:text-[48px] leading-[1] tracking-[-0.04em]` | Big stat numbers |
| Brand wordmark | `font-display text-[22px]` | "webvise" in navbar/footer; tracking inherited |
| Hero subtitle | `text-[18px] max-w-[500px] leading-[1.5]` | ~60 chars per line |
| Section subtitle | `text-[15px] max-w-[520px] leading-[1.6]` | ~65 chars per line |
| Card body | `text-sm leading-[1.6]` | Descriptions in cards |
| Article prose (body) | `text-[16px] leading-[1.7]` | Blog article `<p>` |
| Article prose (list) | `text-[15px] leading-[1.65]` | Blog article `<ul>` |
| Default UI text | `text-xs/relaxed` | Cards, dialogs, inputs |
| UI chrome labels | `font-mono text-xs text-muted-foreground/50` | Section headers, category labels, footer headings (auto-uppercase) |
| Eyebrow labels | `font-mono text-xs text-brand` | Industry tags, role labels, date metadata |
| CTA buttons | `font-mono` added to Button className | All marketing buttons (auto-uppercase) |
| Nav links | `text-sm` | Desktop navigation items (Inter, no uppercase) |
| Metadata | `font-mono text-xs text-muted-foreground` | Dates, reading times, score labels, dimensions |

### 3.3 Weight Hierarchy

| Weight | Use |
|---|---|
| `font-normal` (400) | Body copy, paragraphs, list items |
| `font-medium` (500) | All `.font-display` headings (auto-applied via base CSS), UI emphasis, FAQ questions, navbar labels |
| `font-semibold` (600) | Reserved — not used by default. Only if a specific element needs extra visual weight |
| `font-bold` (700) | Avoid. Too heavy against Inter's optical spacing at display sizes |

### 3.4 Paragraph Width Rule

Body copy is constrained to **~60-65 characters per line** for optimal reading:

| Font size | Max width | Characters/line |
|---|---|---|
| 18px (hero subtitle) | `max-w-[500px]` | ~55 |
| 16px (article prose) | `max-w-2xl` (672px) | ~65 |
| 15px (section subtitle) | `max-w-[520px]` | ~65 |
| 14px (card body) | Natural card flow | - |

### 3.5 Typography Rules

- **Never use pure black.** Text is `--foreground` (`oklch(0.13 ...)`), a warm near-black.
- **Display defaults to weight 500.** `.font-display` automatically applies `font-weight: 500` and `letter-spacing: -0.05em` via base CSS.
- **Tracking hierarchy.** H1/H2 inherit `-0.05em` from `.font-display`. H3 and smaller display text use `tracking-[-0.04em]` (slightly looser). Do not add tracking classes to h1/h2 unless overriding.
- **Tight leading on display.** Hero uses `leading-[1.05]`, section h2 uses `leading-[1.15]`, card h3 uses `leading-[1.3]`.
- **Body line-height is 1.6, not 1.625.** Avoid `leading-relaxed` on new code — use explicit `leading-[1.6]` or `leading-[1.5]`.
- **Paragraphs have an explicit `max-w-[...]`** tuned to their font size. Don't let body copy stretch to full column width.
- **`text-balance`** on hero headlines for even line breaks.
- **Geist Mono** is used for all UI chrome: eyebrow labels, metadata, buttons, badges, section headers. `.font-mono` auto-applies `uppercase` and `letter-spacing: 0`. Never use it for headings, body text, or nav links (those stay in Inter).

---

## 4. Spacing

### 4.1 Layout Constants

| Element | Value | Tailwind |
|---|---|---|
| Max content width | `1320px` | `max-w-[1320px]` |
| Horizontal page padding | `1.5rem` | `px-6` |
| Navbar height (mobile) | `4rem` | `h-16` |
| Navbar height (desktop) | `5rem` | `h-20` |

### 4.2 Section Spacing

| Context | Mobile | Desktop | Tailwind |
|---|---|---|---|
| Hero section | `py-24` (6rem) | `py-44` (11rem) | `py-24 md:py-44` |
| Standard section | `py-20` (5rem) | `py-36` (9rem) | `py-20 md:py-36` |
| Footer content | `py-20` (5rem) | `py-24` (6rem) | `py-20 md:py-24` |

### 4.3 Component Spacing

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

### 4.4 The Breathing Rule

Sections use generous vertical padding that scales up significantly on desktop. If a section feels cramped, increase padding - the design favors expensive whitespace. The jump from mobile to desktop spacing (e.g., `py-20` → `py-36`) is intentional and creates visual openness on larger viewports.

---

## 5. Elevation & Depth

### 5.1 The Zero-Shadow Principle

Depth is **not** achieved through box shadows on standard components. Instead, the system uses:

1. **Ring separators** - `ring-1 ring-foreground/10` on cards, dialogs, and containers. This provides a subtle, integrated boundary.
2. **Background shifts** - Moving between `--background`, `--card`, `--muted`, and `--secondary` to create tonal depth.
3. **Opacity borders** - `border-border/40` for lighter separation in dropdowns, grids, and navigation.
4. **Section-dark** - Full background inversion for high-contrast zones.

### 5.2 When Shadows Are Permitted

Shadows are reserved exclusively for **floating, layered UI** that overlaps other content:
- Dropdown menus: `shadow-lg`
- Dropdown items: `shadow-md`
- These are the only standard shadow uses in the system.

### 5.3 Glassmorphism

Used for navigation and overlays that float above page content:

| Element | Classes |
|---|---|
| Navbar (scrolled) | `bg-background/80 backdrop-blur-xl` |
| Dropdown panel | `bg-background/95 backdrop-blur-xl` |
| Mobile menu | `bg-background/95 backdrop-blur-xl` |
| Dialog overlay | `bg-black/10 backdrop-blur-xs` |

The pattern: semi-transparent background + backdrop blur. The transparency allows content beneath to bleed through subtly, creating environmental depth.

---

## 6. Geometry

### 6.1 Border Radius: Zero

```css
--radius: 0rem;
```

All computed radius tokens (`--radius-sm` through `--radius-4xl`) cascade from this base. Every component uses `rounded-none`. This is a deliberate, defining aesthetic choice - sharp corners create a technical, engineered feel.

**No exceptions.** Buttons, cards, inputs, dialogs, dropdowns, checkboxes, badges - all sharp.

### 6.2 Border Strategy

| Pattern | Classes | Usage |
|---|---|---|
| Card boundary | `ring-1 ring-foreground/10` | Cards, dialogs |
| Section boundary | `border-border/40` | Navbar border, dropdown grid cells |
| Input boundary | `border border-input` | Form fields |
| Brand accent border | `border-brand/20` | Icon containers, featured CTAs |
| Focus indicator | `ring-1 ring-ring/50` | All focusable elements |
| Error indicator | `ring-1 ring-destructive/20` | Invalid form fields |

---

## 7. Components

### 7.1 Buttons

Built with `class-variance-authority` on a `@base-ui/react` primitive.

**Variants:**

| Variant | Styling | Usage |
|---|---|---|
| `default` | `bg-primary text-primary-foreground` | Standard dark button |
| `outline` | `border-border bg-background` → hover `bg-muted` | Secondary actions |
| `secondary` | `bg-secondary text-secondary-foreground` | Tertiary actions |
| `ghost` | Transparent → hover `bg-muted` | Toolbar actions, inline actions |
| `destructive` | `bg-destructive/10 text-destructive` | Delete, remove |
| `link` | `text-primary underline-offset-4` → hover underline | Inline text links |

**Brand CTA buttons** are not a variant - they're composed inline with `font-mono` for the Exalt-style uppercase chrome treatment:
```tsx
<Button className="border-transparent bg-brand px-8 font-mono text-white [&]:hover:bg-brand/80" />
```

**Sizes:**

| Size | Height | Padding |
|---|---|---|
| `xs` | `h-6` | `px-2` |
| `sm` | `h-7` | `px-2.5` |
| `default` | `h-8` | `px-2.5` |
| `lg` | `h-9` | `px-2.5` |
| `icon` | `size-8` | - |
| `icon-xs` | `size-6` | - |
| `icon-sm` | `size-7` | - |
| `icon-lg` | `size-9` | - |

Brand CTAs in the hero and navbar use `size="lg"` with additional `px-6` or `px-8` for wider touch targets and visual weight.

### 7.2 Cards

| Property | Value |
|---|---|
| Background | `bg-card` |
| Boundary | `ring-1 ring-foreground/10` |
| Corner radius | `rounded-none` |
| Internal gap | `gap-4` (default), `gap-2` (sm) |
| Padding | `py-4` (default), `py-3` (sm) |
| Content padding | `px-4` (default), `px-3` (sm) |
| Text size | `text-xs/relaxed` |
| Footer | `border-t p-4` |

### 7.3 Inputs

| Property | Value |
|---|---|
| Height | `h-8` |
| Background | Transparent (light), `bg-input/30` (dark) |
| Border | `border border-input` (full box) |
| Corner radius | `rounded-none` |
| Padding | `px-2.5 py-1` |
| Text size | `text-xs` |
| Focus | `border-ring ring-1 ring-ring/50` |
| Error | `border-destructive ring-1 ring-destructive/20` |
| Disabled | `bg-input/50 opacity-50` |
| Placeholder | `text-muted-foreground` |

### 7.4 Dialogs

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

### 7.5 Dropdowns

| Property | Value |
|---|---|
| Background | `bg-popover` |
| Boundary | `ring-1 ring-foreground/10` |
| Shadow | `shadow-md` (submenu: `shadow-lg`) |
| Item padding | `px-2 py-1.5` |
| Item text | `text-xs` |
| Separator | `bg-border -mx-1 my-1 h-px` |

### 7.6 Navigation Dropdown Panel

The mega-menu style dropdown is a custom component (not shadcn):

| Property | Value |
|---|---|
| Max width | `max-w-[720px]` |
| Background | `bg-background/95 backdrop-blur-xl` |
| Border | `border border-border/40` |
| Shadow | `shadow-xl` |
| Grid cells | `border-border/40` between items |
| Cell padding | `p-5` |
| Hover | `bg-muted/40` |
| Enter animation | `translate-y-0 opacity-100` from `-translate-y-2 opacity-0` |

### 7.7 Benefit Cards (Grid Pattern)

| Property | Value |
|---|---|
| Grid layout | `grid gap-px md:grid-cols-3` |
| Outer border | `border border-border/40` |
| Cell dividers | `border-border/40` between cells (not `gap-px` dividers) |
| Cell padding | `p-8 md:p-10` |
| Hover | `bg-muted/30` |
| Icon container | `h-10 w-10 border border-brand/20 bg-brand/5` |
| Icon | `h-5 w-5 text-brand` (lucide, `strokeWidth={1.5}`) |

### 7.8 UI Chrome Labels (Two-Font System)

All UI chrome uses Geist Mono with auto-uppercase (enforced via `.font-mono` base CSS):

| Pattern | Classes | Usage |
|---|---|---|
| Section header | `font-mono text-muted-foreground/50 text-xs` | Footer columns, tech stack categories, sidebar labels |
| Eyebrow label | `font-mono text-brand text-xs` | Industry tags, roles, date metadata, prev/next |
| Metadata label | `font-mono text-muted-foreground text-xs` | Location, timeline, score labels, dimensions |
| Badge | `font-mono text-[10px]` | Pricing badges, status indicators |
| Button text | `font-mono` on Button className | All marketing CTA buttons |

The `.font-mono` class auto-applies `text-transform: uppercase` and `letter-spacing: 0`. No need for explicit `uppercase` or `tracking-*` classes.

---

## 8. Animation & Motion

### 8.1 Stagger Reveal

Children of a container animate in sequentially when scrolled into view (powered by `motion/react` `useInView`).

| Property | Value |
|---|---|
| Initial state | `opacity: 0; transform: translateY(20px)` |
| Duration | `0.6s` |
| Easing | `cubic-bezier(0.21, 0.47, 0.32, 0.98)` |
| Stagger delay | `70ms` per child (up to 9 children) |
| Trigger | `useInView` with `once: true`, margin `-60px` |

CSS classes: `.stagger-hidden` (initial) → `.stagger-visible` (animated). Toggled via the `<StaggerChildren>` wrapper component.

### 8.2 Single-Element Reveal

| Property | Value |
|---|---|
| Initial state | `opacity: 0; transform: translateY(24px)` |
| Duration | `0.7s` |
| Easing | Same cubic-bezier as stagger |

CSS classes: `.reveal-hidden` → `.reveal-visible`.

### 8.3 Logo Hover Animation

Logo segments assemble in a clockwise sequence on hover:

| Property | Value |
|---|---|
| Segment animation | `fill-opacity: 0` → `fill-opacity: var(--seg-opacity, 1)` |
| Duration | `0.2s` per segment |
| Stagger | `50ms` between segments (8 segments total) |
| Easing | `ease-out` |
| Reset transition | `0.15s ease-out` on `fill-opacity` |

### 8.4 Transition Defaults

| Element | Properties | Duration |
|---|---|---|
| Buttons | `transition-all` | Default (150ms) |
| Nav links | `transition-colors` | Default (150ms) |
| Navbar background | `transition-all` | `duration-500` |
| Dropdown panel | `transition-all` | `duration-200 ease-out` |
| Hover states | `transition-colors` | Default (150ms) |

---

## 9. Layout Patterns

### 9.1 Section Wrapper

All marketing sections use a consistent wrapper:

```tsx
<section className="py-20 md:py-36">
  <div className="mx-auto max-w-[1320px] px-6">
    {children}
  </div>
</section>
```

Variants:
- `alternate` - `bg-white` instead of `bg-background` (creates subtle tonal shift)
- `dark` - Applies `.section-dark` class for inverted sections

### 9.2 Grid Patterns

| Pattern | Classes | Usage |
|---|---|---|
| Hero split | `grid md:grid-cols-2 items-center gap-16` | Hero section |
| Benefits grid | `grid md:grid-cols-3 gap-px border border-border/40` | Benefit cards |
| Footer columns | `grid md:grid-cols-12 gap-12` | Footer layout |
| Pricing grid | `grid grid-cols-3` | Pricing dropdown |
| Service grid | `grid grid-cols-2` | Services dropdown |

### 9.3 Content Width Constraints

| Element | Max Width |
|---|---|
| Page content | `max-w-[1320px]` |
| Dropdown panel | `max-w-[720px]` |
| Section intro text | `max-w-2xl` |
| Body paragraph | `max-w-lg` or `max-w-xs` |
| Icon cloud | `max-w-sm` |

---

## 10. Dark Mode

### 10.1 Implementation

- Managed via `next-themes` with `ThemeProvider` (attribute: `class`)
- Currently **forced to light mode** (`forcedTheme="light"`)
- Dark tokens are defined and ready for activation
- Custom variant: `@custom-variant dark (&:is(.dark *))` for Tailwind

### 10.2 Section-Level Inversion

The `.section-dark` class allows dark sections within a light page without toggling global dark mode. It overrides all semantic tokens locally and applies its own gradient background. This is used for the footer and CTA banners.

---

## 11. Do's and Don'ts

### Do:
- **Use sharp corners everywhere.** The `--radius: 0rem` base is non-negotiable.
- **Use rings for containment.** `ring-1 ring-foreground/10` is the primary card/dialog boundary pattern.
- **Use opacity variants** for border lightness (`border-border/40`, `ring-foreground/10`).
- **Use brand orange sparingly.** CTAs, icon accents, active indicators, featured links.
- **Use `font-mono`** for all UI chrome (labels, metadata, buttons, badges). It auto-applies uppercase and letter-spacing: 0.
- **Use `section-dark`** for locally inverted sections instead of toggling dark mode.
- **Scale spacing aggressively** between mobile and desktop (`py-20` → `py-36`).
- **Use `text-balance`** on hero headlines.

### Don't:
- **Don't use border-radius.** No `rounded-md`, no `rounded-full`, no pills.
- **Don't use box shadows** on cards, inputs, or buttons. Shadows are only for floating overlays (dropdowns).
- **Don't use pure black** for text. `--foreground` is a warm near-black.
- **Don't overuse brand orange.** If it covers more than ~10% of the viewport, it loses its accent power.
- **Don't use default grey shadows.** If a floating element needs depth, use glassmorphism (`bg-*/80 backdrop-blur-xl`) or tonal rings.
- **Don't add rounded corners** to new components. Check that `rounded-none` is explicitly applied or inherited.

---

## 12. File Reference

| File | Purpose |
|---|---|
| `apps/web/src/index.css` | All CSS custom properties, theme tokens, base styles, animations |
| `apps/web/src/app/[locale]/layout.tsx` | Font loading (Inter, Geist Mono), theme provider setup |
| `apps/web/src/components/ui/button.tsx` | Button variants and sizes (CVA + base-ui) |
| `apps/web/src/components/ui/card.tsx` | Card component family |
| `apps/web/src/components/ui/input.tsx` | Input field (base-ui) |
| `apps/web/src/components/ui/dialog.tsx` | Dialog/modal (base-ui) |
| `apps/web/src/components/ui/dropdown-menu.tsx` | Dropdown menu (base-ui) |
| `apps/web/src/components/marketing/section-wrapper.tsx` | Section layout wrapper with dark/alternate variants |
| `apps/web/src/components/marketing/stagger-children.tsx` | Scroll-triggered stagger animation |
| `apps/web/src/components/marketing/navbar.tsx` | Navigation with glassmorphism and mega-menu |
| `apps/web/src/components/marketing/sections/hero.tsx` | Hero section |
| `apps/web/src/components/marketing/sections/benefits.tsx` | Benefits grid pattern |
| `apps/web/src/components/marketing/footer.tsx` | Footer with section-dark and monospace labels |
