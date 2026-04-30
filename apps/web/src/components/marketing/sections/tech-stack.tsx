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
		items: [
			"Vercel",
			"Docker",
			"Turborepo",
			"Sentry",
			"PostHog",
			"Neon",
			"Greptile",
			"Coderabbit",
		],
	},
];

export default async function TechStack() {
	const t = await getTranslations("techStack");

	return (
		<SectionWrapper alternate hatch id="tech-stack">
			<div className="max-w-[640px]">
				<H2>{t("title")}</H2>
				<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
			</div>
			<StaggerChildren className="-mx-6 mt-16 grid border-grid-line border-t md:grid-cols-2 lg:grid-cols-4">
				{categories.map((cat) => (
					<div
						className="border-grid-line border-b p-6 md:border-r md:p-8 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
						key={cat.key}
					>
						<Label className="mb-5 block text-muted-foreground">
							{t(cat.key)}
						</Label>
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
