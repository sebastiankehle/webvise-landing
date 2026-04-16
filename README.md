# webvise

**Design. Development. Automation.**

Source for [webvise.com](https://webvise.com) — a digital product agency shipping marketing sites, full-stack applications, and AI-powered tools for ambitious teams.

## Services

| Service                   | Starting at | Timeline   |
| ------------------------- | ----------- | ---------- |
| Landing Pages             | €1,000      | 1–2 weeks  |
| WordPress → Next.js       | €1,500      | 1–2 weeks  |
| AI Consulting             | €2,500      | 2–4 weeks  |
| MVP Development           | €5,000      | 3–5 weeks  |
| AI & Automation           | €5,000      | 3–6 weeks  |
| Full-Stack Applications   | €7,500      | 4–10 weeks |

See [webvise.com/services](https://webvise.com/services) for full details.

## Free Tools

- **[WordPress Health Report](https://webvise.com/wp-health-report)** — instant PageSpeed, SEO, security, and AI-readability audit for any WordPress site.

## Tech Stack

- **Next.js 16** · React 19.2 · TypeScript
- **tRPC 11** · **Drizzle ORM** · PostgreSQL
- **TailwindCSS 4** · **shadcn/ui** · Motion
- **Better-Auth** for auth, **Resend** for email
- **AI SDK 6** via **Vercel AI Gateway**
- **next-intl** with 7 locales (en, de, es, fr, it, nl, pl)
- **Biome** · **Vitest** · **Turborepo** · **pnpm**

Deployed on Vercel with Analytics and Speed Insights.

## Monorepo Structure

```
webvise-app/
├── apps/
│   └── web/            # Next.js marketing site + dashboard
└── packages/
    ├── api/            # tRPC routers
    ├── auth/           # Better-Auth config
    ├── config/         # Shared tooling config
    ├── db/             # Drizzle schema and migrations
    └── env/            # Typed environment variables
```

## Contact

- Website: [webvise.com](https://webvise.com)
- Email: [mail@webvise.com](mailto:mail@webvise.com)

## License

Proprietary — all rights reserved. See [LICENSE](LICENSE).
