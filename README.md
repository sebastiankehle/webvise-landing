# Webvise

Digital product agency — design, engineering, AI.

## Tech Stack

- **Next.js 15** with React 19
- **tRPC 11** for end-to-end type-safe APIs
- **Drizzle ORM** with PostgreSQL
- **TailwindCSS 4** and **shadcn/ui**
- **Better-Auth** for authentication
- **7-locale i18n** — en, de, fr, es, nl, pl, it
- **Biome** for linting and formatting
- **Turborepo** for monorepo orchestration

## Monorepo Structure

```
webvise-app/
├── apps/
│   └── web/            # Next.js application
├── packages/
│   ├── api/            # tRPC API layer
│   ├── auth/           # Authentication config
│   ├── config/         # Shared configuration
│   ├── db/             # Database schema and migrations
│   └── env/            # Environment variable validation
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Copy the example environment file and fill in your values:

```bash
cp apps/web/.env.example apps/web/.env
```

See [`apps/web/.env.example`](apps/web/.env.example) for all available variables.

3. Set up the database:

```bash
pnpm db:push
```

4. Start the development server:

```bash
pnpm dev
```

The app runs at [http://localhost:3001](http://localhost:3001).

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start all apps in development mode       |
| `pnpm build`         | Build all apps                           |
| `pnpm check-types`   | TypeScript type checking across all apps |
| `pnpm db:push`       | Push schema changes to database          |
| `pnpm db:generate`   | Generate database client/types           |
| `pnpm db:migrate`    | Run database migrations                  |
| `pnpm db:studio`     | Open Drizzle Studio                      |
| `pnpm check`         | Run Biome formatting and linting         |
