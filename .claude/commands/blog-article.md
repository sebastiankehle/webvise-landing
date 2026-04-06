# Blog Article Creation Skill

Create a new blog article for the webvise blog with full translations across all 7 supported locales.

> **Operating principle:** publish only what an LLM cannot already generate without our unique context. The new ranking surface is **LLM citations**, not classical domain rank. Anything a vanilla LLM call could produce from the title alone is slop and will not rank, will not get cited, and dilutes the rest of the page. See `wiki/concepts/anti-slop-content-strategy.md` in the Obsidian vault for the full thesis.

> **Blog article ≠ case study.** Case studies are a separate artifact with their own format (the project / client / outcome arc). A blog article is shaped around a **claim**, not around a client engagement. Blog articles *may* reference client work as supporting evidence, but should not become thinly-veiled case studies. If the brief reads like "we did X for client Y," push back and ask whether it should actually be a case study instead.

## Usage

```
/blog-article <brief>
```

Examples (non-case-study shapes):
```
/blog-article ChatGPT citations are the new ranking surface — argue that
programmatic SEO is now a liability, anchored on the forgebitz thread
(2026-04-06) and our internal observation that LLM-cited posts outperform
backlink-chasing posts on traffic-to-lead conversion
```
```
/blog-article why we stopped writing 10-minute "ultimate guide" articles —
contrarian take on length-as-a-virtue, drawing on Karpathy's AutoResearch
release and the death of pSEO
```

## Entry Contract — required before writing

A bare topic like *"AI for e-commerce"* is **not** a valid brief. Before generating anything, the brief must include at least one **unique-context anchor** from this list:

1. **Contrarian thesis or framework** — a position Sebastian/webvise owns and is willing to defend (preferred — most blog articles should hang on a claim)
2. **Post-training-cutoff event/source** — recent fact with date and link the article reacts to or interprets
3. **Original synthesis** — primary sources combined in a way no one else has assembled
4. **First-party data** — internal benchmark, observation, or measurement (not necessarily from a client engagement)
5. **Named real-world example** — a concrete client / project / product reference used *as supporting evidence*, not as the spine of the article. Use sparingly. If the article would collapse without the client reference, it's a case study, not a blog article — stop and reconsider the format.

If the user supplies only a topic, **abort and ask for the anchor.** Do not proceed.

You must also collect (in working memory, not persisted to JSON):

- `claim`: a single, quotable, attributable sentence the article exists to defend
- `firstPartySources`: list of internal links / case study pages / client repos / vault notes the article will draw from

## Training-Data Test — pre-flight before writing each section

For every planned section, ask: *could a vanilla LLM call produce this paragraph from the title alone, without our context?*

- If **yes** → cut the section, or replace it with first-party material.
- If **no** → keep it.

Reject any draft where more than ~30% of blocks fail this test. Length is no longer a virtue — cap the article at the point first-party signal runs out.

## Research Hierarchy

Pull in this order. Stop as soon as you have enough unique material:

1. **Sebastian's positions and vault synthesis.** The Obsidian vault at `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Obsidian Vault/` — especially `wiki/concepts/`, `wiki/synthesis/`, and any `personal/` notes that capture an opinion or framework. This is the primary anchor for most blog articles.
2. **Post-cutoff facts.** Web search **only** for events, releases, or numbers more recent than the model's training cutoff. Cite with date and URL.
3. **Cross-source synthesis.** Combine 2+ primary sources in a way that produces a non-obvious claim.
4. **Internal first-party data.** Webvise's own observations, benchmarks, and project work — sibling repos under `~/Documents/webvise/`, `wiki/sources/` pages, vault `webvise/` and `luca/` notes. Use as supporting evidence, not as the spine.
5. **Client references — sparingly.** Only when a specific named example is the cleanest illustration of the claim. If you find yourself building the article *around* a client, stop: that's a case study, file it as one.

If steps 1-5 surface **nothing unique**, abort the command and tell the user. Do not generate.

## Blog System Reference

- **Content location:** `apps/web/content/blog/{slug}/` with one JSON file per locale
- **Supported locales:** en (required), de, fr, es, nl, pl, it
- **Routing:** auto-discovered, no config changes needed. Post appears at `/blog/{slug}`
- **Type definitions:** `apps/web/src/data/blog.ts` — `BlogPost`, `Block`

## JSON Schema

Each locale file follows this structure:

```json
{
  "date": "YYYY-MM-DD",
  "readingTime": <integer minutes>,
  "keyword": "<primary SEO keyword phrase>",
  "title": "<article title>",
  "excerpt": "<1-2 sentence summary for listing page>",
  "metaDescription": "<meta description, ~155 chars>",
  "cta": "<custom CTA button text or omit for default>",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "blocks": [...]
}
```

## Block Types

Must match the `Block` union in `apps/web/src/data/blog.ts`:

```typescript
{ "type": "p", "text": "Paragraph with **bold** and [link text](url)" }
{ "type": "h2", "text": "Section Heading" }
{ "type": "h3", "text": "Subsection Heading" }
{ "type": "ul", "items": ["**Bold item** with explanation", "Second item"] }
{ "type": "table", "headers": ["Col1", "Col2"], "rows": [["cell", "cell"]] }
{ "type": "download", "title": "Title", "description": "...", "reportId": "report-id" }
```

## Inline Formatting

- Bold: `**text**`
- Links: `[visible text](url)` — external links get `target="_blank"` automatically
- Internal links: relative paths like `/blog/other-slug`, `/services/ai-automation`, `/#contact`

## Tags

Pick 2-4 from this standardized set, most relevant first:

**Technology:** AI Agents, AI, Automation, MCP, WordPress, TYPO3, Squarespace, Webflow, Framer, Next.js, React, Open Source, Self-Hosted

**Topics:** SEO, Performance, Lead Generation, Marketing, Web Development, Web Design, CMS, Security, E-Commerce, Copywriting, Internationalization, Mobile, Maintenance

**Business:** Business Strategy, Cost Guide, Small Business, Local Business, B2B, Enterprise, Case Study, Process, Manufacturing, Construction

The first tag drives the CTA category:
- AI / Automation / MCP → AI-focused CTA
- WordPress / TYPO3 / Squarespace / Webflow / Framer / CMS → platform migration CTA
- SEO → SEO audit CTA
- Performance → performance CTA
- Lead Generation / Copywriting / Marketing → lead gen CTA
- Other → default CTA

## Writing Style

- Lead with the **claim**. The first paragraph must contain the quotable sentence the article defends.
- Direct, no-fluff, authoritative. No "in today's fast-paced world" preambles.
- Every section must carry first-party signal: a number, a name, a date, a quote, a link to internal work.
- Prefer tables for comparisons where you have actual numbers. Don't pad with generic comparisons.
- End with a paragraph mentioning **webvise** and linking to `/#contact`.
- **Length is determined by unique signal**, not by a target. Stop when first-party material runs out.

## Translation Rules

- `date`, `readingTime`, and `tags` are identical across all locales
- `keyword`, `title`, `excerpt`, `metaDescription`, `cta` are translated per locale
- All block text is translated to natural, fluent prose in each language
- **Bold** and [link](url) markdown syntax must be preserved
- Internal links must be prefixed with the locale: `/blog/foo` → `/de/blog/foo`, `/fr/blog/foo`, etc.
- External URLs (starting with `http`) stay unchanged
- Technical terms, product names, acronyms stay in English
- Formal register: Sie (German), vouvoiement (French), usted (Spanish), u-vorm (Dutch), formal Polish, Lei (Italian)
- **No generic-fication.** Translations must preserve every first-party specific — client names, numbers, dates, named frameworks, links to internal work. Don't soften concrete claims into generic best practices.

## Execution Steps

1. **Validate brief.** Does it contain at least one unique-context anchor? Did the user provide a `claim` and `firstPartySources`? If not, **abort and ask.**
2. **Research (internal first).** Walk the research hierarchy. Stop when you have enough unique material. If nothing unique surfaces, abort.
3. **Outline.** Sketch sections and run the **Training-Data Test** on each. Cut anything a vanilla LLM could produce.
4. **Write English version.** Create `en.json`. Open with the claim. Every section carries first-party signal.
5. **Self-check (slop smell).** Run the checklist below. If any answer is "no," fix the draft before continuing.
6. **Add tags.** Pick 2-4, most relevant first.
7. **Create translations.** Generate the 6 locale files in parallel using executor agents. Enforce the no-generic-fication rule.
8. **Validate JSON.** Run the validation command below.
9. **Type check.** Run `npx tsc --noEmit --project apps/web/tsconfig.json`.

## Slop Smell Self-Check (mandatory before declaring done)

Answer "yes" to **all five** or fix the draft:

- [ ] Contains at least one fact, number, or quote that is **not** in any LLM's training data?
- [ ] Names at least one specific entity (client, project, person, product) with a verifiable detail?
- [ ] Has a clearly identifiable authorial point of view, not a balanced overview?
- [ ] Could **not** be reproduced by feeding the title into ChatGPT and asking for an article?
- [ ] First paragraph contains the quotable `claim`, with attribution surfaces (date, links) intact?

## Validation Command

```bash
for f in apps/web/content/blog/<slug>/*.json; do
  locale=$(basename "$f" .json)
  blocks=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$f','utf8')).blocks.length)")
  echo "$locale: $blocks blocks"
done
```

All 7 files must parse and the block counts must match across locales.
