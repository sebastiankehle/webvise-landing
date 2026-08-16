# AGENTS.md

Guidance for AI agents working in this repo. Mirrors the role of `CLAUDE.md` but is tool-agnostic (Claude Code, Codex, Gemini, Cursor, etc.).

## Project

**webvise** — source for [webvise.io](https://webvise.io). Marketing site, dashboard, blog, and free tools for a digital product agency.

## Stack

- Next.js 16 (App Router) · React 19.2 · TypeScript
- tRPC 11 · Drizzle ORM · PostgreSQL
- TailwindCSS 4 · shadcn/ui · Motion
- Better-Auth · Resend · AI SDK 6 via Vercel AI Gateway
- next-intl (locales: en, de)
- Biome (via ultracite) · Vitest · Turborepo · pnpm

## Monorepo

```
apps/web              # Next.js marketing site + dashboard
packages/api          # tRPC routers
packages/auth         # Better-Auth config
packages/db           # Drizzle schema + migrations
packages/env          # Typed env vars
```

## Commands

| Task         | Command                |
| ------------ | ---------------------- |
| Dev (all)    | `pnpm dev`             |
| Dev (web)    | `pnpm dev:web`         |
| Build        | `pnpm build`           |
| Type-check   | `pnpm check-types`     |
| Lint         | `pnpm lint`            |
| Format       | `pnpm format`          |
| Fix          | `pnpm check`           |
| Test         | `pnpm test`            |
| Verify (all) | `pnpm verify`          |
| DB push      | `pnpm db:push`         |
| DB studio    | `pnpm db:studio`       |
| DB generate  | `pnpm db:generate`     |
| DB migrate   | `pnpm db:migrate`      |
| DB start     | `pnpm db:start`        |
| DB stop      | `pnpm db:stop`         |

Package manager: **pnpm 10.1.0**. Don't use npm or yarn.

## Conventions

- **Formatter/linter**: Biome via ultracite. `lint-staged` runs `ultracite fix` on commit — don't bypass with `--no-verify`.
- **Imports**: workspace packages as `@webvise-app/*`.
- **i18n**: en and de must stay in sync. New blog posts and copy ship in both locales.
- **Env**: typed in `packages/env`. Don't read `process.env` directly in app code.
- **Components**: shadcn/ui first; only build custom when shadcn doesn't fit.
- **Server vs client**: prefer Server Components; mark `"use client"` only when needed (state, effects, event handlers, browser APIs).
- **Database**: schema lives in `packages/db`. Migrations via Drizzle — never hand-edit migration SQL after generation.

## Skills

Project-local skills live in `.agents/skills/` and are surfaced to Claude Code via symlinks in `.claude/skills/`.

| Skill                          | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| `animation-vocabulary`         | Name a motion effect from a vague description        |
| `apple-design`                 | Apple-style interface design and motion for the web  |
| `blog-article`                 | Author blog posts in EN + DE                         |
| `emil-design-eng`              | Emil Kowalski's UI polish and animation philosophy   |
| `find-animation-opportunities` | Find UI spots that should animate but don't          |
| `improve-animations`           | Audit motion code and plan improvements              |
| `review-animations`            | Review animation code against a high craft bar       |
| `shadcn`                       | Add, compose, and debug shadcn/ui components         |

To register a new `.agents/skills/<name>` skill for Claude Code:

```sh
ln -s ../../.agents/skills/<name> .claude/skills/<name>
```

## Behavioral Rules

- Read before editing. Plan changes, then make ONE complete edit per file when possible.
- State assumptions; surface ambiguity instead of guessing silently.
- Minimum code that solves the problem — no speculative abstractions, configurability, or error handling beyond what's asked.
- Touch only what's required. Don't refactor adjacent code or "improve" formatting unrelated to the task.
- Match existing style. Every changed line should trace to the request.
- Verify before claiming completion: type-check, lint, and (where relevant) build or test.
- For UI work: run dev server and exercise the change in a browser before reporting done.
- i18n: if you add user-facing copy in one locale, add it in the other (en + de).
- Don't commit `.env*`, secrets, or generated artifacts.
- Don't push or open PRs unless explicitly asked.
