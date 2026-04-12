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
			<div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
				<h2 className="font-display text-[28px] leading-[34px] md:text-[36px] md:leading-[42px]">
					{t("title")}
				</h2>
				<p className="text-[17px] text-muted-foreground leading-[26px] tracking-[-0.011em]">
					{t("subtitle")}
				</p>
			</div>
			<StaggerChildren className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-2 lg:grid-cols-4">
				{categories.map((cat) => (
					<div
						key={cat.key}
						className="border-border/40 not-last:border-b p-6 md:odd:border-r md:nth-[-n+2]:border-b md:not-last:border-b-0 md:p-8 lg:not-last:border-r lg:nth-[-n+2]:border-b-0 lg:odd:border-r-0"
					>
						<p className="mb-5 text-muted-foreground/50 text-xs tracking-[-0.011em]">
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
