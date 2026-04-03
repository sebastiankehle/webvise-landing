# Blog Article Creation Skill

Create a new blog article for the webvise blog with full translations across all 7 supported locales.

## Usage

```
/blog-article <topic>
```

Example: `/blog-article AI-powered customer support for e-commerce`

## Input

The user provides a topic or brief description. If details are sparse, research the topic first using web search before writing.

## Blog System Reference

- **Content location**: `apps/web/content/blog/{slug}/` with one JSON file per locale
- **Supported locales**: en (required), de, fr, es, nl, pl, it
- **Routing**: Auto-discovered, no config changes needed. Post appears at `/blog/{slug}`

## JSON Schema

Each locale file follows this structure:

```json
{
  "date": "YYYY-MM-DD",
  "readingTime": <integer minutes>,
  "keyword": "<primary SEO keyword phrase>",
  "title": "<article title>",
  "excerpt": "<1-2 sentence summary for listing page>",
  "metaDescription": "<SEO meta description, ~155 chars>",
  "cta": "<custom CTA button text or omit for default>",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "blocks": [...]
}
```

## Block Types

```typescript
{ "type": "p", "text": "Paragraph with **bold** and [link text](url)" }
{ "type": "h2", "text": "Section Heading" }
{ "type": "h3", "text": "Subsection Heading" }
{ "type": "ul", "items": ["**Bold item** with explanation", "Second item"] }
{ "type": "table", "headers": ["Col1", "Col2"], "rows": [["cell", "cell"]] }
```

## Inline Formatting

- Bold: `**text**`
- Links: `[visible text](url)` — external links get `target="_blank"` automatically
- Internal links: use relative paths like `/blog/other-slug`, `/services/ai-automation`, `/#contact`

## Tags

Use existing tags from this standardized set (pick 2-4 per article):

**Technology**: AI Agents, AI, Automation, MCP, WordPress, TYPO3, Squarespace, Webflow, Framer, Next.js, React, Open Source, Self-Hosted

**Topics**: SEO, Performance, Lead Generation, Marketing, Web Development, Web Design, CMS, Security, E-Commerce, Copywriting, Internationalization, Mobile, Maintenance

**Business**: Business Strategy, Cost Guide, Small Business, Local Business, B2B, Enterprise, Case Study, Process, Manufacturing, Construction

Tags drive the CTA displayed below the article:
- AI/Automation/MCP tags → AI-focused CTA
- WordPress/TYPO3/Squarespace/Webflow/Framer/CMS → platform migration CTA
- SEO → SEO audit CTA
- Performance → performance CTA
- Lead Generation/Copywriting/Marketing → lead gen CTA
- Other → default CTA

Place the most relevant tag first — it determines the CTA category.

## Translation Rules

- `date`, `readingTime`, and `tags` are identical across all locales
- `keyword`, `title`, `excerpt`, `metaDescription`, `cta` are translated per locale
- All block text content is translated to natural, fluent prose in each language
- **Bold** and [link](url) markdown syntax must be preserved in translations
- Internal links must be prefixed with the locale: `/blog/foo` → `/de/blog/foo` (German), `/fr/blog/foo` (French), etc.
- External URLs (starting with `http`) stay unchanged
- Technical terms, product names, and acronyms stay in English
- Use formal register: Sie (German), vouvoiement (French), usted (Spanish), u-vorm (Dutch), formal Polish, Lei (Italian)

## CTA Text

Set a custom `cta` field that matches the article topic. This appears as the CTA button text. Translate it per locale. If omitted, the default "Get a Free Audit" button text is used.

## Writing Style

Match the existing blog tone:
- Direct, no-fluff, authoritative
- Technical depth with practical business insights
- Lead with value, not preamble
- Use tables for comparisons, lists for actionable items
- End with a paragraph mentioning **webvise** and linking to `/#contact`
- Target 8-15 minute reading time (30-50 blocks)

## Execution Steps

1. **Research**: If the topic is broad or unfamiliar, research it using web search to gather facts, stats, and current developments
2. **Write English version**: Create the `en.json` file with all fields and content blocks
3. **Add tags**: Pick 2-4 tags from the standardized set, most relevant first
4. **Create translations**: Generate all 6 locale files (de, fr, es, nl, pl, it) in parallel using executor agents
5. **Validate**: Run `node -e` to verify all 7 JSON files parse correctly and have matching block counts
6. **Type check**: Run `npx tsc --noEmit --project apps/web/tsconfig.json` to verify no type errors

## Validation Command

```bash
for f in apps/web/content/blog/<slug>/*.json; do
  locale=$(basename "$f" .json)
  blocks=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$f','utf8')).blocks.length)")
  echo "$locale: $blocks blocks"
done
```
