# Reference Map

Read [design.md](design.md) first for exact styles. This file only selects the closest structural example.

## Source roots

- Repo: use the workspace root that contains `.agents/skills/design-webvise-asset/`
- Sebastian's vault: `$HOME/Documents/webvise/obsidian-vault`
- Vault guide: `wiki/work/webvise/operations/webvise-ci-reference-pack.md`

Use `wiki read` and `wiki list` when the vault is open through Obsidian. Use the filesystem paths for HTML inspection and browser rendering.

When the vault is unavailable, locate the shared `webvise-ci-reference-pack` folder. Use its `examples/` files and `proposal-reference/` file in place of the vault paths below.

## Choose the closest reference

| Asset | Primary reference | Use it for |
|---|---|---|
| Service or pitch deck | `wiki/work/webvise/operations/00_WEBVISE_Leistungsuebersicht.html` and the closest numbered service deck | A4 landscape, short argument, objection handling, service hierarchy |
| Compact sales aid | `wiki/work/webvise/operations/sales-call-sheet-2026-08.html` | Scan-friendly hierarchy and compact prompts |
| Long guide or handbook | `wiki/work/webvise/operations/sales-playbook-2026-08.html` | Long-form navigation, pacing, section breaks |
| Comparison or research report | `wiki/work/webvise/operations/wettbewerbsvergleich-2026-08.html` | Fact cards, tables, evidence labels |
| General team brochure | `wiki/work/webvise/operations/team-sales-brochure-2026-08.html` | Short company and offer overview |
| Service catalog | `wiki/work/webvise/operations/team-service-katalog-2026-08.html` | Offer matrices and reference routing |
| One-pager | `wiki/work/webvise/operations/bau-kmu-ki-portal-one-pager-2026-08.html` | Single-page proof and CTA structure |
| Proposal | `wiki/work/webvise/proposals/dekra/offer-ai-transformation-styled.html` | Proposal sequence and restrained page composition only |

## Current implementation sources

- Portable CI specification: `.agents/skills/design-webvise-asset/references/design.md`
- Website tokens: `apps/web/src/index.css`
- Print guide: `wiki/work/webvise/operations/print-kit.md`
- Print files: `wiki/work/webvise/operations/print-kit/`
- Claim controls: `wiki/work/webvise/operations/business-context/proof.md`
- Sales context: `wiki/work/webvise/operations/sales-assets.md`

The Print-Kit contains `webvise-ci.css`, embedded Hanken Grotesk, `build.py`, source bodies, and fit rules. Use it instead of rebuilding A4 chrome from memory.

## The 12 service decks

The numbered files live in `wiki/work/webvise/operations/`:

- `01_WEBVISE_Launch_Landing-Pages.html`
- `02_WEBVISE_Launch_MVPs-und-Produktprototypen.html`
- `03_WEBVISE_Launch_Website-Workflows.html`
- `04_WEBVISE_Launch_WordPress-und-Legacy-Migrationen.html`
- `05_WEBVISE_Operate_Interne-Tools-und-Dashboards.html`
- `06_WEBVISE_Operate_Kundenportale-und-Geschaeftsanwendungen.html`
- `07_WEBVISE_Operate_Booking-und-Event-Plattformen.html`
- `08_WEBVISE_Operate_Individuelle-Business-Anwendungen.html`
- `09_WEBVISE_Automate_KI-Audit-und-Beratung.html`
- `10_WEBVISE_Automate_Company-Brain-Systeme.html`
- `11_WEBVISE_Automate_KI-Workflow-Automation.html`
- `12_WEBVISE_Automate_KI-Agenten-mit-Review-Gates.html`

## DEKRA boundaries

`offer-ai-transformation-styled.html` is the newer July proposal. Study its cover, scope, conditions, and sign-off sequence. It still uses Inter and older color values, so restyle it with the current CI.

`offer-slim-styled.html` is an April archive with DEKRA colors, inline DEKRA logos, old rates, and outdated role framing. Never send or clone it. It may only answer structural questions that the newer proposal and current references do not cover.

## Hard checks

- Current print output uses Hanken Grotesk 400/500 only.
- Standalone output has no external font or asset dependency unless the brief requires one.
- A4 output has no overflow and no accidental blank page.
- Claims come from the Proof stack or user-supplied approved copy.
- The live repo overrides any stale value in an HTML reference.
