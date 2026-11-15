# Reference Map

Read [design.md](design.md) first for exact styles. This file only selects the closest structural example.

## Source roots

- Repo: use the workspace root that contains `.agents/skills/design-webvise-asset/`
- Sebastian's vault: `$HOME/Documents/webvise/obsidian-vault`
- Presentation library: `$HOME/Documents/webvise/presentations`
- Vault guide: `wiki/work/webvise/operations/webvise-ci-reference-pack.md`

Use `wiki read` and `wiki list` when the vault is open through Obsidian. Use the filesystem paths for HTML inspection and browser rendering.

When the vault is unavailable, locate the shared `webvise-ci-reference-pack` folder. Use its `examples/` files and `proposal-reference/` file in place of the vault paths below.

## Choose the closest reference

| Asset | Primary reference | Use it for |
|---|---|---|
| Service or pitch deck | `$HOME/Documents/webvise/presentations/internal/service-catalog/de/00_WEBVISE_Leistungsuebersicht.html` and the closest numbered service deck | A4 landscape, short argument, objection handling, service hierarchy |
| Compact sales aid | `$HOME/Documents/webvise/presentations/internal/sales-kit/2026-08/sales-call-sheet-2026-08.html` | Scan-friendly hierarchy and compact prompts |
| Long guide or handbook | `$HOME/Documents/webvise/presentations/internal/sales-kit/2026-08/sales-playbook-2026-08.html` | Long-form navigation, pacing, section breaks |
| Comparison or research report | `$HOME/Documents/webvise/presentations/internal/sales-kit/2026-08/wettbewerbsvergleich-2026-08.html` | Fact cards, tables, evidence labels |
| General team brochure | `$HOME/Documents/webvise/presentations/internal/sales-kit/2026-08/team-sales-brochure-2026-08.html` | Short company and offer overview |
| Service catalog | `$HOME/Documents/webvise/presentations/internal/sales-kit/2026-08/team-service-katalog-2026-08.html` | Offer matrices and reference routing |
| One-pager | `$HOME/Documents/webvise/presentations/internal/sales-kit/2026-08/bau-kmu-ki-portal-one-pager-2026-08.html` | Single-page proof and CTA structure |
| Proposal | `$HOME/Documents/webvise/presentations/proposals/dekra/offer-ai-transformation-styled.html` | Proposal sequence and restrained page composition only |

## Current implementation sources

- Portable CI specification: `.agents/skills/design-webvise-asset/references/design.md`
- Website tokens: `apps/web/src/index.css`
- Print guide: `wiki/work/webvise/operations/print-kit.md`
- Print files: `$HOME/Documents/webvise/presentations/internal/sales-kit/print-kit/`
- Claim controls: `wiki/work/webvise/operations/business-context/proof.md`
- Offer context: `wiki/work/webvise/offers/architecture.md`
- Relationship context: `wiki/work/webvise/clients/proposals/index.md`

The Print-Kit contains `webvise-ci.css`, embedded Hanken Grotesk, `build.py`, source bodies, and fit rules. Use it instead of rebuilding A4 chrome from memory.

## The 15 service decks

The decks are generated, not hand-edited. `$HOME/Documents/webvise/presentations/internal/service-catalog/_build/` holds:

- `content/NN_<slug>.json`: German and English copy for one deck; `00_leistungsuebersicht.json` is the one-page overview
- `content/_shared.json`: labels, links and the "Stand" date shared by every deck
- `BRIEF.md`: source, claim and writing rules for deck copy
- `build.py`: renders `../de` and `../en` HTML; `--check` runs the fit probe and character budgets; `--pdf` prints the PDFs into `apps/web/public/reports/decks/`
- `audit/`: the 2026-11-15 audit notes per deck

To change a deck, edit its JSON, run `python3 _build/build.py --check --pdf <file>`, then commit the PDFs in the repo. A new deck also needs an entry in `packages/api/src/reports.ts`. The hand-built August originals are archived in `_archive/2026-08-18-originals/`.

Numbering: 01-12 follow the August set, 13 is SEO und GEO, 14 is Coaching, 15 is KI-Chatbots und Telefon-Assistenten. The overview lists all 15 in the website's order.

## DEKRA boundaries

`$HOME/Documents/webvise/presentations/proposals/dekra/offer-ai-transformation-styled.html` is the newer July proposal. Study its cover, scope, conditions, and sign-off sequence. It still uses Inter and older color values, so restyle it with the current CI. Current engagement context lives at `wiki/work/webvise/clients/proposals/dekra.md`.

`$HOME/Documents/webvise/presentations/proposals/dekra/offer-slim-styled.html` is an April archive with DEKRA colors, inline DEKRA logos, old rates, and outdated role framing. Never send or clone it. It may only answer structural questions that the newer proposal and current references do not cover.

## Hard checks

- Current print output uses Hanken Grotesk 400/500 only.
- Standalone output has no external font or asset dependency unless the brief requires one.
- A4 output has no overflow and no accidental blank page.
- Claims come from the Proof stack or user-supplied approved copy.
- The live repo overrides any stale value in an HTML reference.
