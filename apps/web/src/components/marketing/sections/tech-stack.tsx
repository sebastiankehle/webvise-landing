import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { TechBadge } from "@/components/marketing/tech-badge";

const categories = [
	{
		key: "frontend",
		items: [
			"Next.js",
			"React",
			"TypeScript",
			"Tailwind CSS",
			"shadcn/ui",
			"Motion",
		],
	},
	{
		key: "backend",
		items: [
			"Node.js",
			"Bun",
			"Hono",
			"tRPC",
			"Drizzle",
			"Redis",
			"PostgreSQL",
			"Better Auth",
		],
	},
	{
		key: "ai",
		items: ["OpenAI", "Anthropic", "Gemini", "Vercel AI SDK", "Mastra", "Inngest", "n8n"],
	},
	{
		key: "infrastructure",
		items: [
			"Vercel",
			"Docker",
			"Turborepo",
			"Redis",
			"Sentry",
			"PostHog",
		],
	},
];

export default async function TechStack() {
	const t = await getTranslations("techStack");

	return (
		<SectionWrapper id="tech-stack" alternate>
			<div className="max-w-2xl">
				<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 font-light text-muted-foreground">{t("subtitle")}</p>
			</div>
			<div className="mt-12 grid gap-px overflow-hidden border border-border/40 grid-cols-2 lg:grid-cols-4">
				{categories.map((cat) => (
					<div
						key={cat.key}
						className="border-border/40 p-6 md:p-8 [&:nth-child(odd)]:border-r [&:nth-child(-n+2)]:border-b lg:[&:nth-child(odd)]:border-r-0 lg:[&:nth-child(-n+2)]:border-b-0 lg:[&:not(:last-child)]:border-r"
					>
						<p className="mb-4 font-medium text-muted-foreground/50 text-xs uppercase tracking-wider">
							{t(cat.key)}
						</p>
					<div className="flex flex-wrap gap-2">
						{cat.items.map((tech) => (
							<TechBadge key={tech} name={tech} />
						))}
					</div>
					</div>
				))}
			</div>
		</SectionWrapper>
	);
}
