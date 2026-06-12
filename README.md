# webvise

**Design. Development. Automation.**

Source for [webvise.io](https://webvise.io), a senior-led AI-native software studio for custom workflow systems, internal tools, portals, dashboards, AI-assisted workflows, and production-ready web applications.

## Services

webvise groups offerings by business workflow:

- **Launch**: landing pages, MVPs, website workflow layers, and WordPress or legacy migrations.
- **Operate**: internal tools, dashboards, client portals, booking platforms, and full-stack business applications.
- **Automate**: AI consulting, AI automation, company brain / memory systems, and agentic workflow automation.

See [webvise.io/#services](https://webvise.io/#services) for the current model.

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
    ├── db/             # Drizzle schema and migrations
    └── env/            # Typed environment variables
```

## Contact

- Website: [webvise.io](https://webvise.io)
- Email: [mail@webvise.io](mailto:mail@webvise.io)

## License

Proprietary, all rights reserved. See [LICENSE](LICENSE).
