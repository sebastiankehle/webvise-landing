---
name: blog-article
description: Create a new blog article for the webvise blog with full translations across all 7 supported locales. Use when the user wants a new blog post, mentions writing for the blog, or invokes /blog-article.
---

# Blog Article Creation Skill

Create a new blog article for the webvise blog with full translations across all 7 supported locales.

> **Operating principle:** publish only what an LLM cannot already generate without our unique context. The new ranking surface is **LLM citations**, not classical domain rank. Anything a vanilla LLM call could produce from the title alone is slop and will not rank, will not get cited, and dilutes the rest of the page. See `wiki/concepts/anti-slop-content-strategy.md` in the Obsidian vault for the full thesis.

> **Blog article ≠ case study.** Case studies are a separate artifact with their own format (the project / client / outcome arc). A blog article is shaped around a **claim**, not around a client engagement. Blog articles *may* reference client work as supporting evidence, but should not become thinly-veiled case studies. If the brief reads like "we did X for client Y," push back and ask whether it should actually be a case study instead.

## Usage

```
/blog-article            # zero-arg: auto-discovers topic from vault
/blog-article <brief>    # with brief: skips discovery, goes straight to entry contract
```

Examples (with brief):
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

---

<!-- PHASE: topic-discovery -->

## Topic Discovery (zero-arg mode)

When invoked without a brief, auto-discover a topic from the vault. This implements the Content Skill Graph connection pattern — the best articles come from bridging ideas, not from picking a generic topic.

### Step 1: Read Blog Log
Read existing blog articles to avoid repetition:
```
apps/web/content/blog/
```
List all existing slugs and their primary tags/keywords.

### Step 2: Read Vault for Fresh Material
Scan recently updated pages in the Obsidian vault:
```
~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Obsidian Vault/wiki/
```

Focus on:
- `wiki/concepts/` — new or recently updated concepts
- `wiki/synthesis/` — cross-cutting analyses
- `wiki/playbooks/` — actionable frameworks
- `wiki/companies/webvise/` — agency positioning, product updates

Also check `raw/articles/` for recently ingested sources that haven't been turned into blog content yet.

### Step 2b: Scan Tweet Performance for Escalation Candidates
Read the tweet log and individual tweet files for performance signals:
```
~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Obsidian Vault/wiki/collections/professional/tweet-log.md
~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Obsidian Vault/wiki/collections/professional/twitter-posts/
```

For each tweet with `status: tracked` (meaning perf data is filled in), check if it qualifies for long-form escalation:
- **High engagement:** impressions > 5K, or likes > 100, or replies > 20
- **Topic depth:** the tweet's source pages contain enough material for a 1500+ word article
- **No existing coverage:** the topic hasn't already been covered in a blog post

High-performing tweets are strong blog article candidates because the topic is already validated by audience engagement. The tweet's core insight becomes the article's claim; the source pages become the research base.

### Step 3: Find Connections
Cross-reference vault pages to find non-obvious bridges:
- A concept that reframes a webvise service offering
- A recently ingested article that validates or challenges a webvise position
- Two vault pages whose intersection produces a contrarian thesis
- A tweet escalation candidate (from Step 2b) that deserves long-form treatment

### Step 4: Generate 3 Candidate Briefs
For each candidate, produce:
- **Claim:** one quotable sentence the article defends
- **Anchor type:** which unique-context anchor it uses (contrarian thesis / post-cutoff event / original synthesis / first-party data / named example)
- **Source pages:** which vault pages it draws from
- **Bridge:** the cross-domain connection (if any)
- **Why now:** what makes this timely or relevant today
- **Existing coverage:** any overlap with published blog posts (list slugs)

Rank candidates by:
1. Strength of unique-context anchor (contrarian thesis > original synthesis > post-cutoff event > first-party data > named example)
2. Freshness of source material
3. Distance from existing blog content
4. Relevance to webvise positioning

### Step 5: Present & Confirm
Show all 3 candidates to Sebastian. **Do not proceed until he picks one or provides his own brief.** Format:

```
## Candidate 1: [short title]
Claim: "..."
Anchor: [type]
Sources: [vault pages]
Bridge: [connection or "none"]
Why now: ...
```

After selection, proceed to the Entry Contract with the chosen brief.

---

## Entry Contract — required before writing

A bare topic like *"AI for e-commerce"* is **not** a valid brief. Before generating anything, the brief must include at least one **unique-context anchor** from this list:

1. **Contrarian thesis or framework** — a position Sebastian/webvise owns and is willing to defend (preferred — most blog articles should hang on a claim)
2. **Post-training-cutoff event/source** — recent fact with date and link the article reacts to or interprets
3. **Original synthesis** — primary sources combined in a way no one else has assembled
4. **First-party data** — internal benchmark, observation, or measurement (not necessarily from a client engagement)
5. **Named real-world example** — a concrete client / project / product reference used *as supporting evidence*, not as the spine of the article. Use sparingly. If the article would collapse without the client reference, it's a case study, not a blog article — stop and reconsider the format.

If the user supplies only a bare topic (no anchor), **abort and ask for the anchor.** Do not proceed. The zero-arg discovery mode (above) handles the case where no topic is given at all.

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

## webvise Quality Benchmark Gate

Before writing the English draft, benchmark against the strongest existing webvise posts. Do this even when the brief is supplied and topic discovery is skipped.

Minimum benchmark set:
- `apps/web/content/blog/ai-search-referrals-first-data/en.json`
- 2-4 recent or high-signal posts with similar intent, especially decision-tree, data-backed, or operational articles

Extract concrete requirements before drafting:
- first paragraph states the claim directly and gives a quotable answer
- the article carries proof, stakes, or operating detail in every section
- at least one decision table or comparison table helps the reader choose
- copy-pastable commands, checklists, payloads, templates, or audit steps appear where relevant
- CTAs are contextual to the section, not generic sales interruptions
- the voice is specific to webvise: direct, opinionated, anti-slop, and grounded in actual workflows

If an English draft feels weaker than the benchmark posts, rewrite before translation. Do not create localized files from a weak English draft.

## Transformative Reference Rewrite Rule

When Sebastian provides another article as inspiration, treat it as reference material, not source text to copy:

- Preserve the useful **reader journey** only: problem setup, sequencing, pacing, and decision logic.
- Write original prose, examples, names, commands, section framing, and CTAs. Do not reuse distinctive expression or recognizable examples from the reference.
- Do not mention the reference article, author, platform, or engagement metrics in finished blog content unless the article is explicitly about that source or a factual claim depends on citing it.
- Make the result read as a standalone webvise article with its own claim, vocabulary, evidence, examples, and CTA logic.
- Add an originality audit before finalizing: no copied distinctive names/examples/phrases, no source-only metrics, and no accidental commentary on the reference across all locales.

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

### Introduction Structure (mandatory)

Every article opens with this sequence:

1. **Direct answer (1-2 sentences).** State the claim immediately. This is the snippet AI search engines will quote. Make it quotable, attributable, and specific.
2. **Hook (1 sentence).** One of these types:
   - **Provocative question:** challenges an assumption the reader holds
   - **Scenario:** "You're [doing X]. Here's why that's wrong."
   - **Stat lead:** a specific number that surprises
   - **Bold claim:** contrarian position stated bluntly
   - **Contrarian reversal:** "Everyone says X. The data says Y."
3. **APP Formula (2-3 sentences):** Agree (validate the reader's situation) + Promise (what they'll learn) + Preview (how the article delivers it).
4. **Key Takeaways block.** A `ul` block with 3-5 bullet points summarizing the article's core insights. This goes right after the intro, before the first h2. Readers who skim get the value. Readers who stay get the depth.

### Prose Constraints

- **Max 4 sentences per paragraph.** Break longer paragraphs.
- **Max 25 words average per sentence.** Vary length (short punchy + longer explanatory), but keep the average tight.
- **No em dashes, en dashes, or spaced hyphens.** Never write `—`, `–`, ` - `, or `  -  `. Use periods, commas, colons, or restructure the sentence. Any dash-like separator between clauses is an LLM tell.
- **No filler transitions.** Cut "Furthermore," "Additionally," "It's worth noting that," "In conclusion." Just start the next thought.
- Lead with the **claim**. The first paragraph must contain the quotable sentence the article defends.
- Direct, no-fluff, authoritative. No "in today's fast-paced world" preambles.
- Every section must carry first-party signal: a number, a name, a date, a quote, a link to internal work.
- Prefer tables for comparisons where you have actual numbers. Don't pad with generic comparisons.
- End with a paragraph mentioning **webvise** and linking to `/#contact`.
- **Length is determined by unique signal**, not by a target. Stop when first-party material runs out.

### Body Requirements

- **4-7 h2 sections.** Each section must pass the Training-Data Test.
- **2-3 mini-stories.** Real examples with NAMES, DATES, SPECIFIC DETAILS, and OUTCOMES. Not hypotheticals.
- **2-3 contextual CTAs.** First CTA within the first 500 words. CTAs should feel natural, not bolted on. Example: "If you're evaluating [topic], [webvise can help](/#contact)."
- **At least 1 table.** Use for comparisons, frameworks, or data. Tables with real numbers outperform prose lists.

## Translation Rules

- `date`, `readingTime`, and `tags` are identical across all locales
- `keyword`, `title`, `excerpt`, `metaDescription`, `cta` are translated per locale
- All block text is translated to natural, fluent prose in each language
- **Bold** and [link](url) markdown syntax must be preserved
- **Internal links MUST be locale-agnostic.** Always write `/blog/foo`, `/services/ai-automation`, `/#contact` — never prefix with a locale. The blog renderer uses next-intl `<Link>`, which auto-prepends the current locale at render time. Writing `/de/blog/foo` produces `/de/de/blog/foo` (double-locale) → 404. This rule applies identically to every locale file (en, de, fr, es, nl, pl, it): the path is the same across all translations.
- External URLs (starting with `http`) stay unchanged
- Technical terms, product names, acronyms stay in English
- Formal register: Sie (German), vouvoiement (French), usted (Spanish), u-vorm (Dutch), formal Polish, Lei (Italian)
- **No generic-fication.** Translations must preserve every first-party specific — client names, numbers, dates, named frameworks, links to internal work. Don't soften concrete claims into generic best practices.

## Execution Steps

1. **Validate brief.** Does it contain at least one unique-context anchor? Did the user provide a `claim` and `firstPartySources`? If not, **abort and ask.**
2. **Research (internal first).** Walk the research hierarchy. Stop when you have enough unique material. If nothing unique surfaces, abort.
3. **Outline.** Sketch sections and run the **Training-Data Test** on each. Cut anything a vanilla LLM could produce. Verify: introduction follows the mandatory structure (direct answer + hook + APP + key takeaways). Body has 4-7 h2 sections, 2-3 mini-stories, 2-3 CTAs, at least 1 table.
4. **Generate meta options.** Before writing, produce **3 title options** and **3 meta description options** for the English version. Present to Sebastian for selection.
   - **Title formulas:** "How to [Benefit] [Qualifier]" / "[Number] [Things] That [Outcome]" / "[Adjective] Guide to [Topic]" / Direct claim as title
   - **Description formulas:** Problem-Solution-CTA (~155 chars) / Benefit-Method-CTA / Question-Answer-CTA
   - Include the primary keyword naturally. No clickbait.
5. **Write English version.** Create `en.json`. Open with direct answer + hook + APP + key takeaways. Every section carries first-party signal. Enforce prose constraints (max 4 sentences/paragraph, max 25 words avg/sentence, no em dashes).
6. **Content scrub.** Before quality check, scrub the English draft for:
   - **AI phrase patterns:** remove "It's important to note that," "In today's landscape," "It's worth mentioning," "This is particularly relevant," "At the end of the day," "When it comes to," "In terms of," "Due to the fact," "In order to," "This highlights," "This underscores," "Stands as," "Serves as," "Marks as a turning point"
   - **AI word blacklist:** cut these words entirely: additionally, furthermore, moreover, enhance, intricacies, tapestry, robust, vibrant, dynamic, seamless, align, leverage, game-changer, unlock, delve, revolutionize, cutting-edge, harness, empower, navigate, landscape, paradigm, synergy, streamline, supercharge, elevate, transform, innovative, powerful
   - **Em/en dashes and spaced hyphens:** replace `—`, `–`, ` - `, and `  -  ` with periods, commas, or colons. Never use any dash-like separator between clauses
   - **Filler transitions:** cut "Furthermore," "Additionally," "Moreover," "In conclusion," "That being said"
   - **Sentence structure bans:** (1) no stacked short sentences under 12 words with the same subject — combine them; (2) no more than two sentences in a paragraph starting with the same word; (3) every paragraph needs rhythm — at least one sentence under 15 words and one over 25 words; (4) no vague optimism endings — end on facts, consequences, or tension; (5) no forced rule-of-three — use as many points as the argument needs; (6) no synonym swapping for variety — repeat the clearest noun; (7) let paragraphs have texture — asides, turns, slight mess are fine
   - **Passive voice:** flag and rewrite where active voice is stronger
   - **Generic qualifiers:** cut "very," "really," "extremely," "highly," "incredibly" unless they add meaning
   - **Read-aloud test:** read each section aloud. If it sounds robotic or formal when spoken, rewrite it

   **Mechanical scrub script (run and report numeric results before proceeding):**

   ```bash
   node -e "
   const fs=require('fs');
   const p=JSON.parse(fs.readFileSync('apps/web/content/blog/<slug>/en.json','utf8'));
   let t=p.title+'\n'+p.excerpt+'\n'+(p.metaDescription||'')+'\n';
   p.blocks.forEach(b=>{if(b.text)t+=b.text+'\n';if(b.items)b.items.forEach(i=>t+=i+'\n');if(b.rows)b.rows.forEach(r=>r.forEach(c=>t+=c+'\n'))});
   console.log('dashes em/en/spaced:', (t.match(/—/g)||[]).length, (t.match(/–/g)||[]).length, (t.match(/ - /g)||[]).length);
   const bl=['additionally','furthermore','moreover','enhance','intricacies','tapestry','robust','vibrant','dynamic','seamless','align','leverage','game-changer','unlock','delve','revolutionize','cutting-edge','harness','empower','navigate','landscape','paradigm','synergy','streamline','supercharge','elevate','transform','innovative','utilize','powerful'];
   const hits=[]; bl.forEach(w=>{const m=t.match(new RegExp('\\\\b'+w+'\\\\w*\\\\b','gi'));if(m)hits.push(w+':'+m.length)});
   console.log('blacklist:', hits.length?hits:'clean');
   const longParas=[]; p.blocks.filter(b=>b.type==='p').forEach((b,i)=>{const s=b.text.split(/(?<=[.!?])\\s+/).filter(x=>x.trim());if(s.length>4)longParas.push(i+':'+s.length)});
   console.log('paragraphs>4 sentences:', longParas.length?longParas:'clean');
   console.log('words:', t.split(/\\s+/).filter(w=>w).length);
   "
   ```

   All three counts must be zero/clean before proceeding. If a blacklisted word is a direct citation of a framework name (e.g. Kenyon's "Transformation" section), rename in the draft rather than overriding the gate.
7. **Quality score.** Rate the English draft on a 0-100 composite before proceeding:

   | Dimension | Weight | What it measures |
   |-----------|--------|-----------------|
   | Humanity | 30% | Does it sound like a person wrote it? No AI patterns, natural rhythm, personality |
   | Specificity | 25% | Named entities, real numbers, dates, concrete examples per section |
   | Structure | 20% | Intro structure followed, h2 count, CTA placement, key takeaways present |
   | SEO | 15% | Keyword in title/h1/first paragraph, meta description quality, internal links |
   | Readability | 10% | Sentence length variance, paragraph brevity, no walls of text |

   - **70-100:** Proceed to translations.
   - **50-69:** Fix the weakest dimension, re-scrub, re-score. Show Sebastian what was fixed.
   - **Below 50:** Major rewrite needed. Flag to Sebastian with the breakdown.

   Show the score breakdown to Sebastian before proceeding.

8. **Self-check (slop smell).** Walk the checklist below **item by item**, explicitly ticking each box. Do not collapse the walk into a single "all good" assertion — the quality score does not substitute for this gate. If any answer is "no," fix the draft and re-walk before continuing.
9. **Add tags.** Pick 2-4, most relevant first.
10. **Create translations.** Generate the 6 locale files in parallel using executor agents. Enforce the no-generic-fication rule in each agent prompt. Translate the selected title and meta description, not all options.
11. **No-genericification audit (translations).** Build a list of first-party anchors from the English draft (named entities, numeric claims, dates, framework names, client references). Run the audit script below across all 6 translations. Every anchor must survive, either verbatim or as a defensible localization (e.g. `$1T` → `1 000 milliards $`, `$50K` → `50 000 €` or `50 tys. zł`). Flag and fix any translation where an anchor was softened to a generic ("large numbers", "a leading CRO expert", "thousands of brands"). Do **not** declare done until this audit reports clean.

    ```bash
    node -e "
    const fs=require('fs');
    const base='apps/web/content/blog/<slug>/';
    // Edit the anchor list to reflect THIS article's first-party specifics
    const anchors=[
      {name:'Princeton',     pattern:/Princeton/},
      {name:'Stripe',        pattern:/Stripe/},
      {name:'Kenyon',        pattern:/Kenyon/},
      {name:'webvise',       pattern:/webvise/},
      // add: named numbers, dates, clients, frameworks for this article
    ];
    for(const l of ['de','fr','es','nl','pl','it']){
      const p=JSON.parse(fs.readFileSync(base+l+'.json','utf8'));
      let t=''; p.blocks.forEach(b=>{if(b.text)t+=b.text+' ';if(b.items)b.items.forEach(i=>t+=i+' ');if(b.rows)b.rows.forEach(r=>r.forEach(c=>t+=c+' '))});
      const missing=anchors.filter(a=>!a.pattern.test(t)).map(a=>a.name);
      console.log(l+':',missing.length?'MISSING: '+missing.join(', '):'all anchors present');
    }
    "
    ```

    Also verify per-locale: (a) zero em/en/spaced dashes, (b) every internal link is locale-agnostic — zero occurrences of `/en/`, `/de/`, `/fr/`, `/es/`, `/nl/`, `/pl/`, `/it/` anywhere inside a markdown `](...)` target; paths must start with a bare segment like `/blog/`, `/services/`, `/#contact` (c) block count matches English.
12. **Validate JSON.** Run the validation command below.
13. **Type check.** Run `npx tsc --noEmit --project apps/web/tsconfig.json`.

## Slop Smell Self-Check (mandatory before declaring done)

Answer "yes" to **all** or fix the draft:

**Content quality:**
- [ ] Contains at least one fact, number, or quote that is **not** in any LLM's training data?
- [ ] Names at least one specific entity (client, project, person, product) with a verifiable detail?
- [ ] Has a clearly identifiable authorial point of view, not a balanced overview?
- [ ] Could **not** be reproduced by feeding the title into ChatGPT and asking for an article?
- [ ] First paragraph contains the quotable `claim`, with attribution surfaces (date, links) intact?

**Structure:**
- [ ] Introduction follows mandatory structure? (direct answer + hook + APP + key takeaways)
- [ ] 4-7 h2 sections, each passing the Training-Data Test?
- [ ] 2-3 mini-stories with names, dates, specific details, outcomes?
- [ ] First CTA appears within the first 500 words?
- [ ] At least 1 table with real data?

**Prose hygiene:**
- [ ] No em dashes, en dashes, or spaced hyphens (`—`, `–`, ` - `)?
- [ ] No AI phrase patterns? (check scrubber list)
- [ ] No paragraph longer than 4 sentences?
- [ ] No filler transitions? ("Furthermore," "Additionally," "Moreover")
- [ ] Quality score >= 70?

**Translations (mandatory before declaring done):**
- [ ] Every first-party anchor from the English draft survives in each of de, fr, es, nl, pl, it (verbatim or as a defensible localization — never softened to a generic)?
- [ ] No em dashes, en dashes, or spaced hyphens in any locale?
- [ ] Every internal link in each translation is locale-agnostic (e.g. `/blog/slug`, `/#contact`, `/services/ai-automation`)? `grep -E '\]\(/(en\|de\|fr\|es\|nl\|pl\|it)/' apps/web/content/blog/<slug>/` MUST return zero matches. next-intl `<Link>` auto-prepends the current locale; any locale-prefixed link produces a double-locale 404.
- [ ] Block count matches the English source for every locale?
- [ ] No-genericification audit script (step 11) reported "all anchors present" for every locale?

## Validation Command

```bash
for f in apps/web/content/blog/<slug>/*.json; do
  locale=$(basename "$f" .json)
  blocks=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$f','utf8')).blocks.length)")
  echo "$locale: $blocks blocks"
done
```

All 7 files must parse and the block counts must match across locales.
