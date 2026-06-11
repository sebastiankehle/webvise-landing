# Remaining work

Open items after the June 2026 security/perf/copy overhaul and the follow-up
repo pass on June 11, 2026.

Done in the June 11 pass:
- GitHub Actions bumped to Node 24-compatible action majors.
- `check-types` scripts added across the workspace and Turbo now runs real
  package typechecks.
- Client `next-intl` payload trimmed to namespaces used by client components.
- AI endpoint rate limiting can use Upstash Redis when
  `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured, with
  in-memory fallback for local/test.
- Orphaned `todo` schema removed from the Drizzle schema export.
- Privacy policy explicitly describes consent-gated chat analytics in all 7
  locales.
- Root `kysely` override removed.
- Global Vercel CLI updated to 54.11.1.
- Implemented copy proposal docs removed from `docs/copy`.

## 1. Fresh re-render for the remaining locales

The first translation pass let executors read the existing target file; many
lightly edited the old translation instead of re-rendering. German was fixed
in a second pass. Still affected (articles >=40% 6-gram-similar to the
pre-overhaul text at commit `d1a306a7`): **fr ≈64, es ≈61, it ≈53, nl ≈52,
pl ≈24**.

Recipe that worked for German:
- Playbook: `.agents/skills/blog-article/translate.md` (executor contract).
- One executor per article×locale. The prompt MUST forbid reading the existing
  target file ("known-defective; render fresh from en.json only") and include
  native style direction for the locale.
- Gates after each batch (orchestrator, scripted): JSON parse; block
  count/type sequence identical to en.json; date/readingTime/tags identical;
  no locale-prefixed internal links (`](/de/...` etc.); no em/en/spaced
  dashes beyond what EN contains; auto-anchor survival (CamelCase/dotted/
  digit-bearing tokens from EN, >=85%); **freshness: <60% 6-gram similarity
  vs the old rendition at `d1a306a7`**; `pnpm test`; 1-2 critical spot-reads
  per batch by a native-caliber reviewer.
- Cost reference: German pass = 70 articles ≈ 2.6M sonnet tokens ≈ 25 min.

Note: this requires explicit permission to run parallel translation executors.
The main session should not write these translations itself per the playbook.

## 2. Drop the production `todo` table

The todo schema file and export are gone. The production table still needs a
real Drizzle migration and deploy-time `pnpm db:migrate`.

The repo currently has no checked-in Drizzle migration baseline under
`packages/db/src/migrations`, so do not hand-write a drop-table SQL file. Use
the actual production migration workflow or first establish the migration
baseline, then generate the drop migration with Drizzle.

## 3. Operator/content decisions

- **Remote branch cleanup**: stale `WEB-*`/`blog/*`/`feat/*` branches remain
  on origin; some contain unmerged work (WEB-122 "needs more work"). Decide
  per branch; don't bulk-delete.
- **EN pricing article currency**:
  `how-much-does-a-website-cost/en.json` deliberately prices in £
  (UK-intent query); all 6 translations use € (1:1 numerals). If EN should
  also move to €, that changes the target query economics.
- **German taste notes**: "Oberhand gewinnt" (agent-memory-vs-context),
  "Seitenaufruf ... abfragen" phrasing (wordpress-vs-nextjs). Defensible
  German; only touch in a human edit pass.

## 4. Strategic options

- Blog -> lead funnel: ~100 articles, newsletter + report-download infra
  live, but no per-post CTAs wired to `/services/<slug>`.
- Dashboard fate: auth shell is clean after scaffold removal. Either build one
  real authenticated feature (e.g. saved wp-health reports) or leave dormant.
- wp-health as keyed B2B API: feasible on current architecture; validate
  demand with 3-5 prospects before building.
