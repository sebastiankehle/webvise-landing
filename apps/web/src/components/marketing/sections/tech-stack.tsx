import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { TechBadge } from "@/components/marketing/tech-badge";
import { H2, Label, Lead } from "@/components/ui/typography";

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
			"Stitch",
			"tRPC",
		],
	},
	{
		key: "backend",
		items: [
			"Node.js",
			"Bun",
			"Hono",
			"Convex",
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
			"Google AI Studio",
			"n8n",
			"Vercel AI SDK",
			"Mastra",
		],
	},
	{
		key: "infrastructure",
		items: ["Vercel", "Docker", "Turborepo", "Sentry", "PostHog", "Neon", "Greptile", "Coderabbit"],
	},
];

export default async function TechStack() {
	const t = await getTranslations("techStack");

	return (
		<SectionWrapper id="tech-stack" alternate>
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2 lg:grid-cols-4">
				{categories.map((cat) => (
					<div
						key={cat.key}
						className="border-border/40 not-last:border-b p-6 md:odd:border-r md:nth-[-n+2]:border-b md:not-last:border-b-0 md:p-8 lg:not-last:border-r lg:nth-[-n+2]:border-b-0 lg:odd:border-r-0"
					>
						<Label className="mb-5 block text-muted-foreground/50">{t(cat.key)}</Label>
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
