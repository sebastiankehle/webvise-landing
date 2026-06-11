# Remaining work

Open items after the June 2026 security/perf/copy overhaul. Each entry is
self-contained enough for a future session (human or agent) to pick up cold.
Done so far (for context): security plans 001–005 shipped; 10-item backlog
shipped; all 99 blog articles re-rendered in 6 locales; German got a second
fresh-render pass with a freshness gate; webvise-subject de-repetition done;
service/system deliverables+outcomes rewritten (Option A).

## 1. Fresh re-render for the remaining locales (largest item)

The first translation pass let executors read the existing target file; many
lightly edited the old translation instead of re-rendering. German was fixed
in a second pass. Still affected (articles ≥40% 6-gram-similar to the
pre-overhaul text at commit `d1a306a7`): **fr ≈64, es ≈61, it ≈53, nl ≈52,
pl ≈24**.

Recipe that worked for German (reuse verbatim):
- Playbook: `.agents/skills/blog-article/translate.md` (executor contract).
- One sonnet executor per article×locale. The prompt MUST forbid reading the
  existing target file ("known-defective; render fresh from en.json only")
  and include native style direction for the locale.
- Gates after each batch (orchestrator, scripted): JSON parse; block
  count/type sequence identical to en.json; date/readingTime/tags identical;
  no locale-prefixed internal links (`](/de/...` etc.); no em/en/spaced
  dashes beyond what EN contains; auto-anchor survival (CamelCase/dotted/
  digit-bearing tokens from EN, ≥85%); **freshness: <60% 6-gram similarity
  vs the old rendition at `d1a306a7`** (this is the gate whose absence
  caused the problem); `pnpm test`; 1–2 critical spot-reads per batch by a
  native-caliber reviewer.
- Cost reference: German pass = 70 articles ≈ 2.6M sonnet tokens ≈ 25 min.

## 2. CI: GitHub Actions Node 24 bump (deadline June 16, 2026)

`.github/workflows/ci.yml` uses actions/checkout@v4, actions/setup-node@v4,
pnpm/action-setup@v4 — all running on Node 20, which GitHub forces to Node 24
on 2026-06-16. Bump to the current major of each action (or set
`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` to test first). One-line changes;
verify a green run after.

## 3. `turbo check-types` is a no-op

No workspace package defines a `check-types` script, so the CI/verify
typecheck step executes zero tasks; TypeScript is only validated inside
`next build`. Add `"check-types": "tsc --noEmit"` to each package
(apps/web, packages/api, auth, db, env) with appropriate tsconfig refs so
type errors fail fast instead of at the build step.

## 4. Locale message payload to the client (deferred backlog item)

`apps/web/src/app/[locale]/layout.tsx` passes the full ~90KB per-locale
`getMessages()` into `NextIntlClientProvider` on every page. Most marketing
content renders server-side; client components need only a few namespaces.
Fix: inventory `useTranslations` namespaces in "use client" components, pass
only those (`pick(messages, [...])`). Verify with `next build` route sizes
before/after; risk: a missed namespace throws at runtime — needs a dev-server
click-through of pages with client components (chat widget, consent banner,
theme switcher, forms).

## 5. Durable rate limiting for the AI endpoints

`packages/api/src/rate-limit.ts` is an in-memory per-instance Map — on
Vercel it's best-effort only. If AI Gateway spend becomes visible: Upstash
Redis (Vercel Marketplace) + `@upstash/ratelimit` behind the same
`check(ip)` interface. Endpoints: `/api/ai` (session-gated) and
`/api/ai/chat` (public widget; input caps already in place).

## 6. Drop the orphaned `todo` table

The todo demo (routes + router) was removed; `packages/db/src/schema/todo.ts`
and the production table remain. Generate a Drizzle migration to drop the
table (never hand-edit migration SQL per AGENTS.md), delete the schema file,
run `pnpm db:migrate` against prod when convenient.

## 7. Small/optional

- **kysely override** in root `package.json` (`^0.28.17`) can be removed
  entirely now that better-auth 1.6.x accepts kysely 0.29 — do it on the
  next dependency pass and re-run `pnpm audit --prod`.
- **Remote branch cleanup**: ~18 stale `WEB-*`/`blog/*`/`feat/*` branches on
  origin; some contain unmerged work (WEB-122 "needs more work"). Operator
  decision per branch; don't bulk-delete.
- **Privacy policy wording**: server-side chat analytics are now
  consent-gated (capture only when the widget sends the PostHog distinct-ID
  header), but the privacy page should describe chat analytics explicitly.
- **EN pricing article currency**: `how-much-does-a-website-cost/en.json`
  deliberately prices in £ (UK-intent query); all 6 translations now use €
  (1:1 numerals). If the EN page should also move to €, that changes the
  target query economics — content decision, not a translation fix.
- **German taste notes** (deliberately left): "Oberhand gewinnt"
  (agent-memory-vs-context), "Seitenaufruf … abfragen" phrasing
  (wordpress-vs-nextjs). Defensible German; only touch in a human edit pass.
- **Vercel CLI** globally outdated (54.1.0 → 54.11.x): `pnpm add -g vercel@latest`.

## 8. Strategic options (no commitment, evidence in repo)

- Blog → lead funnel: ~100 articles, newsletter + report-download infra
  live, but no per-post CTAs wired to `/services/<slug>`; highest-leverage
  growth lever found in the June audit.
- Dashboard fate: auth shell is clean after scaffold removal — either build
  one real authenticated feature (e.g. saved wp-health reports) or leave
  dormant.
- wp-health as keyed B2B API: feasible on current architecture; validate
  demand with 3–5 prospects before building.
