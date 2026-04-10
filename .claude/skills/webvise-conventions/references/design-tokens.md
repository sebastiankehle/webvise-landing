# Design Tokens Reference

> **Single source of truth:** `/DESIGN_SYSTEM.md` at the repository root.
>
> This file is a pointer, not a copy. Always read `DESIGN_SYSTEM.md` for current values.
> Do NOT hardcode values from memory -- the design system has changed multiple times.

## What to find in DESIGN_SYSTEM.md

| Section | Content |
|---|---|
| 2. Color System | All OKLCH tokens (light, dark, section-dark), chart colors, sidebar tokens |
| 3. Typography | Two-font system (Inter + Geist Mono), scale table, weight hierarchy, line-height rules, paragraph widths |
| 4. Spacing | Section spacing, component spacing, layout constants |
| 5. Elevation & Shadows | Ring-based elevation, glassmorphism, shadow usage rules |
| 6. Animation | Stagger reveal, single-element reveal, logo hover, transition defaults |
| 7. Component Patterns | Buttons (incl. Brand CTA with `font-mono`), cards, benefit grids, navigation, footer, inputs, dialogs |
| 7.8 UI Chrome Labels | The two-font system usage table -- where `font-mono` applies (auto-uppercase) |
| 8. Tailwind Theme | `@theme inline` block with current font stacks and color registrations |

## Key facts (for quick reference only -- verify against DESIGN_SYSTEM.md)

- **Fonts:** Inter (content/headings via `font-sans`/`font-display`) + Geist Mono (UI chrome via `font-mono`, auto-uppercase)
- **Border radius:** `0rem` everywhere (zero rounded corners)
- **Brand color:** `oklch(0.75 0.18 55)` -- singular warm orange accent
- **Max content width:** `1320px` with `px-6` horizontal padding
- **Section spacing:** `py-20 md:py-36` (standard), `py-24 md:py-44` (hero)
