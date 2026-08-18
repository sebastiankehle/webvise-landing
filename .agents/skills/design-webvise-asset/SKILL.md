---
name: design-webvise-asset
description: Design or revise webvise-branded sales, proposal, marketing, print, presentation, and web assets from the current webvise CI. Use for service decks, pitch decks, one-pagers, brochures, offers, reports, PDFs, standalone HTML documents, landing pages, site sections, and any request to make an asset look or feel like webvise.
---

# Design a webvise Asset

Create the smallest asset that meets the brief while keeping the current webvise CI intact.

## Start with the source order

Read both local references before designing:

- [references/design.md](references/design.md) — exact web and print styles
- [references/reference-map.md](references/reference-map.md) — which example fits which asset

Use sources in this order:

1. Treat `apps/web/src/index.css` and the live site components as the current CI.
2. Use `references/design.md` as the portable, exact CI specification.
3. Use the vault Print-Kit for A4 mechanics, embedded Hanken Grotesk, and print checks.
4. Choose the closest August service or sales HTML as the layout reference.
5. Use the July DEKRA offer only for proposal structure.
6. Treat the April DEKRA slim offer as archive material. Never copy its client branding, colors, fonts, rates, or claims.

When sources disagree, the higher source wins. Do not average old and new styles.

## Define the brief

Resolve these facts from the request and existing material:

- purpose and audience
- output format and channel
- page or screen count
- language
- required content and approved claims
- output path and editable source

Ask only when a missing choice would change the result. Do not invent prices, proof, client names, or approval status.

## Choose the format

- Use self-contained HTML for a file that must be easy to open, send, or print.
- Use A4 landscape for service or pitch decks unless the brief says otherwise.
- Use A4 portrait for offers, one-pagers, reports, and long sales documents.
- Use repo-native React and the current component system for web pages or sections.
- Use the applicable document, presentation, PDF, image, or browser skill when the output format requires it.

## Apply the CI

- Apply the exact tokens, typography, radii, surfaces, motion, and print measurements in `references/design.md`.
- Pull live values from `apps/web/src/index.css` when it is available; update the local specification when they differ.
- Do not substitute remembered hex values, generic Tailwind defaults, or styles inferred from screenshots.
- Use Hanken Grotesk only at weights 400 and 500 in the default CI. Embed it for standalone files.
- Build hierarchy with spacing, scale, alignment, restrained hairlines, and the documented radii.
- Use one orange brand accent with neutral light surfaces and dark text.
- Avoid heavy bold type, decorative bars, dense full-surface grids, and generic template styling.
- Render arrows with `<i class="ar"></i>` in print HTML; do not type the arrow glyph the embedded font lacks.
- Keep webvise branding primary. Add client branding only when the brief calls for it and permission is clear.
- Reuse layout logic, not stale copy or claims.

## Build

1. Read no more than the three to five sources needed for the chosen format.
2. Sketch the content hierarchy and page allocation before styling.
3. Start from the closest approved reference or Print-Kit source.
4. Make one complete implementation pass per file where possible.
5. Keep the editable source beside the final output.

For user-facing copy in the web app, keep all seven locales in sync. For a standalone sales asset, use the language in the brief.

## Verify

For standalone HTML:

- Open it in a browser and inspect every page.
- Check the intended viewport and print size.
- Confirm that no content clips, overflows, or creates an extra page.
- Print without browser margins.
- Run `pdffonts`; allow only Hanken Grotesk faces for current-CI print work.
- Match PDF page count to the number of page containers.

For repo-native web work:

- Run the relevant type, lint, and test checks.
- Exercise the result in a browser at desktop and mobile widths.
- Follow the repository browser-harness instructions before browser automation.

Report the editable source, final output, reference used, and checks run.

## Protect content and client boundaries

- Check the vault Proof stack before reusing public claims.
- Do not expose internal playbook content to clients.
- Do not use a client logo, client color system, private price, or confidential name as a webvise default.
- Do not send a legacy reference as the finished asset.
