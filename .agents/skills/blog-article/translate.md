# Blog Translation Playbook — native German rendition

Standalone playbook for translating one webvise blog article from English into
German, the only non-English locale. Referenced by `SKILL.md` step 10 and
invokable on its own to (re-)translate existing articles. It carries NO
authoring pipeline: no topic discovery, no research, no content scrub, no
quality scoring, no meta options, no approval prompts. The English file is
final input and is never modified.

## Roles

- **Orchestrator** (the main session): builds the per-article anchor list,
  spawns the executor, re-runs every mechanical gate itself, spot-reads. Never
  writes the translation.
- **Executor** (one subagent, `model: "sonnet"`): produces the native German
  rendition of `de.json`. It has zero context beyond its prompt and this file.

## Locale & register table

| Locale | File | Register | Notes |
|--------|------|----------|-------|
| de | `de.json` | Sie (formal) | No "wir/uns" agency voice |

## Native-rendition directive

The goal is a text a native German speaker would write about this subject,
with the article's exact meaning, structure, and evidence. Natural idiom,
locale-typical phrasing, native sentence rhythm. NOT a literal
sentence-by-sentence translation, and NOT a rewrite: every block keeps its
meaning, order, and intent; sentences within a block may be restructured
freely to sound native.

## Translation rules (binding, all of them)

1. **JSON shape is frozen.** Same keys, same block count, same block order and
   `type`s as `en.json`. Translate values only.
2. **Identical across locales:** `date`, `readingTime`, `tags` — copy from
   `en.json` byte-for-byte. Translate: `keyword`, `title`, `excerpt`,
   `metaDescription`, `cta` (if present), and all block text/items/cells/
   `download` titles+descriptions (`reportId` stays).
3. **Markdown preserved:** `**bold**` and `[text](url)` survive; translate the
   visible text, never the URL.
4. **Internal links are locale-agnostic.** Write `/blog/foo`,
   `/services/ai-automation`, `/#contact` — NEVER `/de/blog/foo`. next-intl
   `<Link>` auto-prepends the locale; a prefixed path double-prefixes to a 404.
5. **External URLs (`http...`) unchanged.**
6. **Technical terms, product names, acronyms stay in English** (Next.js,
   WordPress, MCP, SEO, RAG, headless CMS where it's the industry term, ...).
7. **Formal register: Sie.**
8. **No generic-fication.** Every first-party anchor survives: public named
   entities, numbers, dates, framework names, anonymized client descriptors
   ("a German construction firm" → "ein deutsches Bauunternehmen"), internal
   links. Currency/number formats may be localized defensibly (`$50K` →
   `50.000 €`), never softened to "große Summen" / "ein führender Experte".
   Never reintroduce client names.
9. **Prose hygiene carries over:** no em dashes (`—`), en dashes (`–`), or
   spaced hyphens (` - `) — use commas, colons, periods, or restructure. No
   negation-then-correction constructions ("nicht X, sondern Y" as a
   rhetorical hook) — state the positive claim. Max 4 sentences per paragraph
   block.

## Brand-voice rules

webvise is an engineer-led one-person studio, not an agency.

- Never use first-person plural implying a team: no "wir/uns/unser" as the
  studio's voice.
- Avoid the repetitive "webvise does X. webvise built Y." pattern: in any
  block, "webvise" appears as grammatical subject at most once; restructure
  other sentences so they need no subject (result-led, gerund/nominal style,
  imperative where natural in German).
- "webvise" stays where it carries weight: first mention, CTAs, the closing
  `/#contact` paragraph.

## Executor prompt template

The orchestrator instantiates this verbatim, filling `{...}`:

```
You are a native-rendition translation executor. First read
/Users/sebastiankehle/Documents/webvise/repos/internals/webvise-landing/.agents/skills/blog-article/translate.md
in full — the sections "Native-rendition directive", "Translation rules",
"Brand-voice rules", and "Executor self-verification" are your contract.
Confirm at the top of your reply that you read it.

Job:
- Source (read-only): apps/web/content/blog/{SLUG}/en.json
- Target (overwrite): apps/web/content/blog/{SLUG}/de.json
- Locale: de. Register: Sie (formal).
- Anchors that MUST survive (verbatim or defensibly localized):
  {ANCHOR_LIST}

Boundaries: never touch en.json or any other file; never change JSON keys,
block count/order/types, date, readingTime, tags, reportId, slugs, internal
link paths, or external URLs.

Escape hatches — STOP, change nothing, report back if: an anchor cannot be
defensibly localized; the EN source contradicts the playbook rules (e.g.
contains a locale-prefixed internal link); the JSON structure is unexpected.

Output contract: write the target file, run the self-verification commands
from the playbook, then return ONLY: file path, blocks translated count,
anchors localized (e.g. "$50K → 50.000 €"), self-verification results.
No file dumps, no prose summary of the article.
```

## Executor self-verification (run before returning)

```bash
node -e "
const fs=require('fs');
const en=JSON.parse(fs.readFileSync('apps/web/content/blog/{SLUG}/en.json','utf8'));
const tr=JSON.parse(fs.readFileSync('apps/web/content/blog/{SLUG}/de.json','utf8'));
const must=(c,m)=>{if(!c){console.log('FAIL:',m);process.exitCode=1}};
must(tr.blocks.length===en.blocks.length,'block count '+tr.blocks.length+' != '+en.blocks.length);
must(JSON.stringify(tr.blocks.map(b=>b.type))===JSON.stringify(en.blocks.map(b=>b.type)),'block type sequence differs');
must(tr.date===en.date&&tr.readingTime===en.readingTime,'date/readingTime differ');
must(JSON.stringify(tr.tags)===JSON.stringify(en.tags),'tags differ');
let t=JSON.stringify(tr);
must(!/\]\(\/(en|de)\//.test(t),'locale-prefixed internal link');
must(!/—|–| - /.test(t.replace(/\\\\n/g,'')),'em/en/spaced dash found');
console.log(process.exitCode?'SELF-CHECK FAILED':'self-check clean');
"
```

## Orchestrator procedure

1. **Anchor list (judgment work, per article):** read `en.json`, extract the
   first-party anchors — public entities, numeric claims, dates, frameworks,
   anonymized client descriptors. 4–10 items. This goes into the executor
   prompt and into the audit script below.
2. **Spawn** the executor (`model: "sonnet"`) with the instantiated template.
3. **Gates (re-run yourself — never accept the executor's word):**
   - JSON validity + block counts (Validation Command in SKILL.md).
   - Key/structure + dash + link check: the executor self-verification script.
   - Anchor audit (script from SKILL.md step 11, with this article's anchor
     list).
   - Brand-voice density: count sentences with "webvise" as subject; flag any
     block where it appears as subject more than once.
   - `pnpm test` (the translations test suite enforces locale completeness
     and JSON validity repo-wide).
4. **Spot-read** the full German rendition. Check: native rhythm, Sie
   register, no agency-"wir", anchors intact.
5. **Re-dispatch failures** to a fresh executor with the failure appended to
   the prompt. Do not fix the translation yourself.

## Done criteria (per article)

- `de.json` written; every gate in step 3 clean; spot-read passed.
- `pnpm test` green.
