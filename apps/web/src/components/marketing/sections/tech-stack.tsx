import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { TechPillGroup } from "@/components/marketing/tech-pill-group";
import {
	H2,
	inlineLinkClassName,
	Label,
	Lead,
} from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

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
		<SectionWrapper hatch id="tech-stack" surface="inverted">
			<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
				<div className="max-w-[660px]">
					<H2>{t("title")}</H2>
				</div>
				<div className="max-w-[560px] lg:justify-self-end">
					<Lead>{t("subtitle")}</Lead>
					<Link
						className={`${inlineLinkClassName} mt-5 inline-flex`}
						href="/case-studies"
					>
						{t("proofLink")}
					</Link>
				</div>
			</div>
			<StaggerChildren className="mt-10 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
				{categories.map((cat) => (
					<div className="surface-card p-6 md:p-7" key={cat.key}>
						<Label className="mb-5 block text-muted-foreground">
							{t(cat.key)}
						</Label>
						<TechPillGroup items={[...cat.items]} />
					</div>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
