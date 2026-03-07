import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";

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
			"PostgreSQL",
			"Drizzle ORM",
			"tRPC",
			"Hono",
			"Redis",
			"Zod",
		],
	},
	{
		key: "ai",
		items: ["OpenAI", "Anthropic", "Gemini", "Vercel AI SDK", "Mastra", "n8n"],
	},
	{
		key: "infrastructure",
		items: [
			"Vercel",
			"Docker",
			"Turborepo",
			"GitHub Actions",
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
			<div className="mt-12 grid gap-px overflow-hidden border border-border/40 sm:grid-cols-2 lg:grid-cols-4">
				{categories.map((cat) => (
					<div
						key={cat.key}
						className="border-border/40 p-8 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-r sm:[&:not(:last-child)]:border-b-0"
					>
						<p className="mb-4 font-medium text-muted-foreground/50 text-xs uppercase tracking-wider">
							{t(cat.key)}
						</p>
						<div className="flex flex-wrap gap-2">
							{cat.items.map((tech) => (
								<span
									key={tech}
									className="border border-border/40 px-3 py-1.5 font-light text-sm transition-all hover:border-brand hover:bg-brand hover:text-white"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</SectionWrapper>
	);
}
