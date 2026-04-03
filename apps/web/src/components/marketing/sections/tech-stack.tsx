import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
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
		items: [
			"OpenAI",
			"Anthropic",
			"Gemini",
			"Vercel AI SDK",
			"Mastra",
			"Inngest",
			"n8n",
		],
	},
	{
		key: "infrastructure",
		items: ["Vercel", "Docker", "Turborepo", "Redis", "Sentry", "PostHog"],
	},
];

export default async function TechStack() {
	const t = await getTranslations("techStack");

	return (
		<SectionWrapper id="tech-stack" alternate>
			<div className="max-w-2xl">
				<h2 className="font-display text-3xl tracking-tight md:text-4xl">
					{t("title")}
				</h2>
				<p className="mt-4 text-muted-foreground leading-relaxed">{t("subtitle")}</p>
			</div>
			<StaggerChildren className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-border/40 lg:grid-cols-4">
				{categories.map((cat) => (
					<div
						key={cat.key}
						className="border-border/40 nth-[-n+2]:border-b p-6 odd:border-r md:p-8 lg:not-last:border-r lg:nth-[-n+2]:border-b-0 lg:odd:border-r-0"
					>
						<p className="mb-5 text-muted-foreground/50 text-xs">
							{t(cat.key)}
						</p>
						<div className="flex flex-wrap gap-2">
							{cat.items.map((tech) => (
								<TechBadge key={tech} name={tech} />
							))}
						</div>
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
