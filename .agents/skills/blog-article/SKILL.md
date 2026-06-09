---
name: blog-article
description: Create a new blog article for the webvise blog with full translations across all 7 supported locales. Use when the user wants a new blog post, mentions writing for the blog, or invokes /blog-article.
---

# Blog Article Creation Skill

Create a new blog article for the webvise blog with full translations across all 7 supported locales.

> **Primary goal — in priority order:** (1) rank in classical search and LLM citations for queries webvise's customers are typing, (2) route qualified traffic to a webvise service page that converts to a booked inquiry, (3) demonstrate competence so the reader trusts webvise to deliver. Every article must do at least two of the three. The blog is webvise's lead channel, not a personal megaphone.

> **Two valid lanes — pick one before writing:**
> - **Commercial-intent SEO (default lane).** Buyer queries like "wordpress vs next.js for business", "how much does a website cost", "signs your website needs a redesign", "ai automation for small business". These map directly to a webvise service, target a real search query with a known SERP, and route to `/services/<slug>`. Most articles should be this lane.
> - **Thought-leadership (secondary lane).** Contrarian or synthetic takes that build webvise's authority on AI, agency economics, or web strategy. Use sparingly and only when there is genuine first-party signal. These articles still need to mention webvise and link to a service or `/#contact`, but rank via citations and shares rather than buyer queries.

> **Anti-slop guardrail (applies to both lanes).** Don't publish what a vanilla LLM call could produce from the title alone. For commercial-intent posts, originality means webvise's specific answer, numbers, opinion, and service attachment — not contrarianism for its own sake. For thought-leadership posts, originality means the claim itself is one no other agency is willing to defend. Slop dilutes the rest of the blog and demotes the domain.

> **Blog article ≠ case study.** Case studies are a separate artifact with their own format (the project / client / outcome arc). A blog article is shaped around a **claim or query**, not around a client engagement. Blog articles may reference client work only as anonymized first-party evidence, with enough operational detail to be useful and without naming the client, company, person, repository, or private asset. If the brief reads like "we did X for client Y," push back and ask whether it should actually be a case study instead.

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

When invoked without a brief, auto-discover a topic. Default to the **commercial-intent SEO lane**. Only fall back to the thought-leadership lane if no SEO gap is high-value enough to fill.

### Step 1: Service & Keyword Gap Analysis (primary signal)

Read `apps/web/src/data/services.ts` for the canonical 6 webvise services:
`landing-pages`, `wordpress-migration`, `ai-consulting`, `mvp-development`, `ai-automation`, `full-stack-applications`.

Read `apps/web/content/blog/` and group existing slugs by which service each one supports. Find:
- **Service gaps** — services with thin or zero supporting blog content.
- **Buyer-intent gaps** — common buyer queries (cost, comparison, decision-tree, migration, audit, "is X right for me", "signs you need Y") that webvise hasn't yet ranked for.
- **Competitor-shaped gaps** — queries where the current SERP is dominated by weak generic content webvise can beat with first-party data.

Buyer-intent keyword templates that historically convert for webvise:
- `[service] cost [year]`
- `[platform] vs [platform]` (e.g., `wordpress vs next.js`)
- `[platform] migration to [platform]`
- `is [tool/platform] worth it for [audience]`
- `how to choose [thing]`
- `[problem] checklist`
- `signs your [thing] needs [action]`
- `[service] for [vertical]` (b2b, e-commerce, manufacturing, local business)

### Step 2: Read Blog Log
Read existing blog articles to avoid repetition. List all existing slugs and their primary tags/keywords. Note overlap candidates.

### Step 3: Vault scan (only if a thought-leadership angle is needed)

If Step 1 surfaced a commercial-intent topic with a clear service attachment, **skip this step**. Otherwise, scan recently updated pages in the Obsidian vault for a thought-leadership angle. Use the `wiki` CLI (`wiki list wiki/<dir>`, `wiki read wiki/<path>`, `wiki search <query>`) — the vault lives at:

```
/Users/sebastiankehle/Documents/webvise/obsidian-vault/
```

Focus on:
- `wiki/topics/` — concepts, syntheses, and cross-cutting analyses grouped by domain (ai-agents, business, content, engineering, wiki-systems)
- `wiki/procedures/` — actionable runbooks and frameworks
- `wiki/work/webvise/` — agency positioning, product updates, current state

Also check `raw/articles/` for recently ingested sources that haven't been turned into blog content yet.

### Step 4: Tweet performance (optional secondary signal)

Tweet engagement is a *signal*, not a brief. Only check this if Steps 1 and 3 produced nothing publishable. Read via:
```
wiki read wiki/content/x/log.md
```

Escalate a tweet to a blog article only when (a) the topic also matches a buyer query (preferred) or webvise service, (b) impressions > 5K or likes > 100, and (c) there is enough first-party material for 1500+ words. Personal-voice tweets without commercial intent are not a blog candidate.

### Step 5: Generate 3 Candidate Briefs

Default to **at least 2 of 3 candidates being commercial-intent SEO** with a service attachment. Only include a thought-leadership candidate if it carries unusually strong first-party signal.

For each candidate, produce:
- **Lane:** commercial-intent SEO | thought-leadership
- **Claim:** one quotable sentence the article defends or answers
- **Target query:** the exact buyer query (commercial lane) or anchor topic (thought lane)
- **Service attachment:** which of the 6 webvise services this article routes to (commercial lane: required; thought lane: best-fit if any)
- **Anchor type:** commercial-intent SEO / contrarian thesis / post-cutoff event / original synthesis / first-party data / public named example / anonymized client example
- **Source pages:** vault pages, internal repos, or SERP references this draws from
- **Why now:** what makes this timely or relevant today
- **Existing coverage:** any overlap with published blog posts (list slugs)

Rank candidates by:
1. Lead-gen potential (clear service attachment + buyer intent)
2. SEO opportunity (search volume vs current SERP weakness)
3. Strength of first-party signal (numbers, public named examples, anonymized client examples, opinions webvise can defend)
4. Distance from existing blog content
5. Freshness

### Step 6: Present & Confirm

Show all 3 candidates to the user. **Do not proceed until they pick one or provide their own brief.** Format:

```
## Candidate 1: [short title]
Lane: commercial-intent SEO | thought-leadership
Claim: "..."
Target query: "..."
Service: /services/<slug> (or "thought-leadership only")
Anchor: [type]
Sources: [pages]
Why now: ...
```

After selection, proceed to the Entry Contract with the chosen brief.

---

## Entry Contract — required before writing

A bare topic like *"AI for e-commerce"* is **not** a valid brief. Before generating anything, the brief must include at least one **anchor** from this list:

1. **Commercial-intent SEO query** *(default)* — a buyer query the article will rank for, paired with a webvise service. Examples: "wordpress vs next.js for business", "how much does a website cost", "ai automation for small business", "signs your website needs a redesign". The article exists to capture this query, answer it with webvise's first-party authority, and route the reader to `/services/<slug>`.
2. **Contrarian thesis or framework** — a position webvise owns and is willing to defend. Use when the topic isn't a buyer query but builds the brand's authority on a topic adjacent to its services.
3. **Post-training-cutoff event/source** — recent fact with date and link the article reacts to or interprets.
4. **Original synthesis** — primary sources combined in a way no one else has assembled.
5. **First-party data** — internal benchmark, observation, or measurement from agency project work.
6. **Real-world example** — a concrete public project, product, tool, research source, or anonymized client example used *as supporting evidence*, not as the spine of the article. Client examples must never name the client, company, person, repository, or private asset. Use sparingly. If the article would collapse without a client reference, it's a case study, not a blog article — stop and reconsider the format.

If the user supplies only a bare topic (no anchor), **abort and ask for the anchor.** Do not proceed. The zero-arg discovery mode (above) handles the case where no topic is given at all.

You must also collect (in working memory, not persisted to JSON):

- `lane`: `commercial-intent-seo` | `thought-leadership`
- `targetQuery`: the exact buyer query (commercial lane) — must drive the title, h1, first paragraph, and meta description
- `service`: the webvise service this article routes traffic to. One of: `landing-pages`, `wordpress-migration`, `ai-consulting`, `mvp-development`, `ai-automation`, `full-stack-applications`. Commercial-intent articles **must** declare a service. Thought-leadership articles should declare the closest fit, or `none` with explicit acknowledgement that the article won't drive direct lead-gen.
- `claim`: a single, quotable, attributable sentence the article exists to defend or answer
- `firstPartySources`: list of internal links / service pages / case study pages / private project notes / vault notes the article will draw from. Commercial-intent articles **must** include the matching `/services/<slug>` page in this list — read it first so the article's vocabulary, claims, and CTAs align with the service. Private client sources may inform the article, but the published draft must anonymize the client and omit private names.

## Training-Data Test — pre-flight before writing each section

For every planned section, ask: *could a vanilla LLM call produce this paragraph from the title alone, without our context?*

- If **yes** → the section must earn its place via at least one of: webvise's specific opinion, a concrete number, a named example, a service-attached recommendation, or a comparison the reader is actually searching for.
- If **no** → keep it.

For commercial-intent SEO articles, the bar is "does this section help the reader make a buying decision and route them toward a webvise service?" — pure originality is not required, but boilerplate-only sections are still cut. For thought-leadership articles, the bar is stricter: vanilla-LLM output must be replaced with first-party material or cut.

Reject any draft where more than ~30% of blocks fail this test. Cap the article at the point first-party signal and buyer-decision content run out — don't pad to a target word count.

## Research Hierarchy

Pull in this order. Stop as soon as you have enough material:

1. **Target query and SERP context** *(commercial-intent lane: required)*. What is the user typing? What currently ranks for it? Where are the existing results weak (thin content, no first-party data, dated, generic)? This frames the article — without it, you're writing for nobody.
2. **Matching webvise service page.** Read `apps/web/src/app/[locale]/(marketing)/services/[slug]/...` and the service translation files for the chosen service slug. The article must echo its claims, vocabulary, and CTAs — never contradict them.
3. **Internal first-party data.** webvise's own observations, benchmarks, and project work — sibling repos under `~/Documents/webvise/`, internal case studies in `apps/web/content/case-studies/`, agency project notes. This is what makes the article rank-worthy and citation-worthy. Published blog prose must anonymize client examples and omit client, company, person, repository, and private asset names.
4. **Vault synthesis** *(thought-leadership lane: required; commercial lane: optional)*. The Obsidian vault at `/Users/sebastiankehle/Documents/webvise/obsidian-vault/` (use the `wiki` CLI: `wiki list`, `wiki read`, `wiki search`) — especially `wiki/topics/`, `wiki/procedures/`, and `wiki/work/webvise/`. Use to add an opinion or framework on top of the buyer-intent answer, not to replace it.
5. **Post-cutoff facts.** Web search **only** for events, releases, or numbers more recent than the model's training cutoff. Cite with date and URL.
6. **Cross-source synthesis.** Combine 2+ primary sources in a way that produces a non-obvious claim.
7. **Client references — anonymized only.** Client work may appear as "a German construction firm," "a documentary producer," "a B2B SaaS team," or another non-identifying description when it is the cleanest illustration of the claim. Never name the client, company, person, repository, or private asset in a blog article. If you find yourself building the article *around* a client, stop: that's a case study, file it as one.

If steps 1-7 surface **nothing the article can stand on**, abort the command and tell the user. Do not generate filler.

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

> **Voice layer.** The canonical ban-list for Sebastian's writing voice lives in the vault at `/Users/sebastiankehle/Documents/webvise/obsidian-vault/wiki/content/voice-dna.md`. Read it before drafting when the vault is reachable (`wiki read wiki/content/voice-dna.md`). This skill owns the blog structure, SEO, and lead-gen rules; Voice DNA owns how the prose sounds and what is forbidden. If the two ever disagree on a phrasing rule, Voice DNA wins. The most important import: the FATAL negation-correction ban ("not X, but Y" and all variants), which is stricter than older versions of this skill.

### Introduction Structure (mandatory)

Every article opens with this sequence:

1. **Direct answer (1-2 sentences).** State the claim immediately. This is the snippet AI search engines will quote. Make it quotable, attributable, and specific.
2. **Hook (1 sentence).** One of these types:
   - **Provocative question:** challenges an assumption the reader holds
   - **Scenario:** "You're [doing X]. Here's why that's wrong."
   - **Stat lead:** a specific number that surprises
   - **Bold claim:** contrarian position stated bluntly, as a positive assertion
   - **Receipt lead:** open on a specific scene, number, or named example that cuts against the reader's default, then state the corrected view directly. NEVER phrase it as "not X, but Y" / "Everyone says X, the data says Y" / any negation-then-correction (this is a FATAL fail, see the scrub step below)
3. **APP Formula (2-3 sentences):** Agree (validate the reader's situation) + Promise (what they'll learn) + Preview (how the article delivers it).
4. **Key Takeaways block.** A `ul` block with 3-5 bullet points summarizing the article's core insights. This goes right after the intro, before the first h2. Readers who skim get the value. Readers who stay get the depth.

### Prose Constraints

- **Max 4 sentences per paragraph.** Break longer paragraphs.
- **Max 25 words average per sentence.** Vary length (short punchy + longer explanatory), but keep the average tight.
- **No em dashes, en dashes, or spaced hyphens.** Never write `—`, `–`, ` - `, or `  -  `. Use periods, commas, colons, or restructure the sentence. Any dash-like separator between clauses is an LLM tell.
- **No filler transitions.** Cut "Furthermore," "Additionally," "It's worth noting that," "In conclusion." Just start the next thought.
- Lead with the **claim**. The first paragraph must contain the quotable sentence the article defends.
- Direct, no-fluff, authoritative. No "in today's fast-paced world" preambles.
- Every section must carry first-party signal: a number, public source name, anonymized project detail, date, quote, or link to internal work.
- Prefer tables for comparisons where you have actual numbers. Don't pad with generic comparisons.
- End with a paragraph mentioning **webvise** and linking to `/#contact`.
- **Length is determined by unique signal**, not by a target. Stop when first-party material runs out.

### Body Requirements

- **4-7 h2 sections.** Each section must pass the Training-Data Test.
- **2-3 mini-stories.** Real examples with dates, specific details, and outcomes. Public sources may be named. Client examples must be anonymized and stripped of client, company, person, repository, and private asset names. Not hypotheticals.
- **2-3 contextual CTAs.** First CTA within the first 500 words. CTAs should feel natural, not bolted on.
  - **At least one CTA must link to the matched service page** (`/services/<slug>`). Service pages convert better than `/#contact`. Example: "If you're evaluating WordPress alternatives, [webvise's WordPress migration service](/services/wordpress-migration) handles the rebuild and SEO continuity."
  - **At least one internal blog link** to a related post under `/blog/<slug>`. Builds topical clusters and keeps users on-site.
  - The closing paragraph still mentions **webvise** and points to `/#contact` for general inquiries.
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
- **No generic-fication.** Translations must preserve every first-party specific — anonymized client descriptors, numbers, dates, named public frameworks, links to internal work. Don't soften concrete claims into generic best practices. Do not reintroduce client names during translation.

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
   - **AI word blacklist:** cut these words entirely: additionally, furthermore, moreover, enhance, intricacies, tapestry, robust, vibrant, dynamic, seamless, align, leverage, game-changer, unlock, delve, revolutionize, cutting-edge, harness, empower, navigate, landscape, paradigm, synergy, streamline, supercharge, elevate, transform, innovative, powerful, utilize, straightforward, future-proof, realm, and "signal/signals" when used as generic insider fog
   - **FATAL negation-correction (hard fail):** never negate one framing and then assert a corrected one. Bans "This isn't X, it's Y," "not X but Y," "X is not Y, it is Z," "doesn't need X, needs Y," "Forget X. This is Y," "Less X, more Y," and every variant. One hit fails the draft. Delete the negation and state the positive claim on its own.
   - **Engagement bait and fake-insider lines:** cut "let that sink in," "read that again," "this changes everything," "what nobody tells you," "most people don't realize," "here's the part nobody's talking about," "follow for more."
   - **No synthetic conclusion:** no "Takeaway:," "Lesson:," "the point is," "what this means is" closers. The required closing webvise + `/#contact` line stays, written as a flat concrete next step rather than a motivational summary or aphorism.
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
   const bl=['additionally','furthermore','moreover','enhance','intricacies','tapestry','robust','vibrant','dynamic','seamless','align','leverage','game-changer','unlock','delve','revolutionize','cutting-edge','harness','empower','navigate','landscape','paradigm','synergy','streamline','supercharge','elevate','transform','innovative','utilize','powerful','straightforward','future-proof','realm'];
   const hits=[]; bl.forEach(w=>{const m=t.match(new RegExp('\\\\b'+w+'\\\\w*\\\\b','gi'));if(m)hits.push(w+':'+m.length)});
   console.log('blacklist:', hits.length?hits:'clean');
   const fatal=[/\\bnot\\s+[\\w']+[ ,]+but\\b/gi,/\\bisn't\\s+[\\w']+.{0,25}\\bit'?s\\b/gi,/\\bis not\\s+[\\w']+.{0,25}\\bit is\\b/gi,/\\bdoesn't need\\b.{0,30}\\bneeds?\\b/gi,/\\bless\\s+[\\w']+,\\s*more\\b/gi,/\\bforget\\s+[\\w']+\\./gi];
   const fhits=[]; fatal.forEach((r,i)=>{const m=t.match(r);if(m)fhits.push('p'+i+':'+JSON.stringify(m))});
   console.log('FATAL negation-correction:', fhits.length?fhits:'clean');
   const longParas=[]; p.blocks.filter(b=>b.type==='p').forEach((b,i)=>{const s=b.text.split(/(?<=[.!?])\\s+/).filter(x=>x.trim());if(s.length>4)longParas.push(i+':'+s.length)});
   console.log('paragraphs>4 sentences:', longParas.length?longParas:'clean');
   console.log('words:', t.split(/\\s+/).filter(w=>w).length);
   "
   ```

   All counts (dashes, blacklist, FATAL negation-correction, paragraphs>4) must be zero/clean before proceeding. If a blacklisted word is a direct citation of a framework name (e.g. Kenyon's "Transformation" section), rename in the draft rather than overriding the gate. The FATAL check is conservative and can flag legitimate sentences; read each hit and either rewrite the negation away or confirm it is not a negation-then-correction hook.
7. **Quality score.** Rate the English draft on a 0-100 composite before proceeding:

   | Dimension | Weight | What it measures |
   |-----------|--------|-----------------|
   | SEO & Lead-Gen | 25% | Primary keyword in title/h1/first paragraph and meta description; service-page link present; internal blog link present; closing inquiry path; service-attached CTA within first 500 words |
   | Specificity | 25% | Named entities, real numbers, dates, concrete examples per section; webvise-specific opinion visible |
   | Humanity | 20% | Does it sound like a person wrote it? No AI patterns, natural rhythm, distinct voice |
   | Structure | 20% | Intro structure followed, h2 count, CTA placement, key takeaways present |
   | Readability | 10% | Sentence length variance, paragraph brevity, no walls of text |

   - **70-100:** Proceed to translations.
   - **50-69:** Fix the weakest dimension, re-scrub, re-score. Show Sebastian what was fixed.
   - **Below 50:** Major rewrite needed. Flag to Sebastian with the breakdown.

   Show the score breakdown to Sebastian before proceeding.

8. **Self-check (slop smell).** Walk the checklist below **item by item**, explicitly ticking each box. Do not collapse the walk into a single "all good" assertion — the quality score does not substitute for this gate. If any answer is "no," fix the draft and re-walk before continuing.
9. **Add tags.** Pick 2-4, most relevant first.
10. **Create translations.** Generate the 6 locale files in parallel using executor agents. Enforce the no-generic-fication rule in each agent prompt. Translate the selected title and meta description, not all options.
11. **No-genericification audit (translations).** Build a list of first-party anchors from the English draft (public named entities, numeric claims, dates, framework names, anonymized client descriptors). Run the audit script below across all 6 translations. Every anchor must survive, either verbatim or as a defensible localization (e.g. `$1T` → `1 000 milliards $`, `$50K` → `50 000 €` or `50 tys. zł`). Flag and fix any translation where an anchor was softened to a generic ("large numbers", "a leading CRO expert", "thousands of brands"). Do **not** declare done until this audit reports clean.

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
      // add: named numbers, dates, public entities, anonymized client descriptors, frameworks for this article
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
- [ ] Contains at least one fact, number, opinion, or named example that goes beyond what a vanilla LLM would output?
- [ ] Names at least one specific public entity (project, person, product, framework) or uses one anonymized client example with a verifiable operational detail?
- [ ] Has a clearly identifiable webvise point of view, not a balanced overview?
- [ ] First paragraph contains the quotable `claim` (or directly answers the target query), with attribution surfaces (date, links) intact?
- [ ] Primary keyword (`targetQuery`) appears in: title, first paragraph, and meta description?

**SEO & Lead-Gen:**
- [ ] At least one CTA links to the matched service page `/services/<slug>` within the body, not only the closing paragraph?
- [ ] At least one internal link to another blog post `/blog/<slug>` is present?
- [ ] Closing paragraph mentions **webvise** and links to `/#contact`?
- [ ] Article maps to one of the 6 webvise services, OR is explicitly tagged as thought-leadership-only with a fallback service link?
- [ ] Meta description is ~155 chars, contains the primary keyword, and ends with a benefit or path forward (not clickbait)?

**Structure:**
- [ ] Introduction follows mandatory structure? (direct answer + hook + APP + key takeaways)
- [ ] 4-7 h2 sections, each passing the Training-Data Test?
- [ ] 2-3 mini-stories with public names where allowed, dates, specific details, and outcomes? Client mini-stories anonymized?
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
