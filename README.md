# webvise

**Design. Development. Automation.**

Source for [webvise.io](https://webvise.io), a senior-led AI-native software studio for custom workflow systems, internal tools, portals, dashboards, AI-assisted workflows, and production-ready web applications.

## Services

webvise keeps the existing service pages for SEO and buyer navigation, but public pricing is scoped around the system needed rather than fixed package anchors.

| Service                   | Public scope language        | Typical timeline |
| ------------------------- | ---------------------------- | ---------------- |
| Landing Pages             | Focused build                | 1-2 weeks        |
| WordPress → Next.js       | Focused build                | 1-2 weeks        |
| AI Consulting             | Discovery or focused build   | 2-4 weeks        |
| MVP Development           | Custom system                | 3-5 weeks        |
| AI and Automation         | Custom system                | 3-6 weeks        |
| Full-Stack Applications   | Custom system                | 4-10 weeks       |

See [webvise.io/services](https://webvise.io/services) for full details.

## Free Tools

- **[WordPress Health Report](https://webvise.io/wp-health-report)**, instant PageSpeed, SEO, security, and AI-readability audit for any WordPress site.

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

- Website: [webvise.io](https://webvise.io)
- Email: [mail@webvise.io](mailto:mail@webvise.io)

## License

Proprietary, all rights reserved. See [LICENSE](LICENSE).
