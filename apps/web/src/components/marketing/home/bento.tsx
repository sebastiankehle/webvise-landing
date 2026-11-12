import { getLocale, getTranslations } from "next-intl/server";

import BentoScene from "@/components/marketing/home/scenes/bento-scene";
import KernspanDamper from "@/components/marketing/home/scenes/project-kernspan";
import { MarketingArrowLink } from "@/components/marketing/marketing-arrow-link";
import { SectionHeading } from "@/components/marketing/section-heading";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { TechPillGroup } from "@/components/marketing/tech-pill-group";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { cn } from "@/lib/utils";

const stack = [
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

const directKeys = ["1", "2", "3"];
const supportKeys = ["monitoring", "improvements", "extensions"];

const tile =
	"rounded-[20px] bg-card p-2 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]";
const frame =
	"relative overflow-hidden rounded-[14px] bg-foreground/[0.04] shadow-[inset_0_0_0_1px_rgba(14,18,23,0.05)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]";
const title = "font-display text-foreground text-xl leading-snug";
const text = "mt-2 text-base text-muted-foreground leading-[1.6]";
const wide = "grid grid-cols-1 gap-2 lg:col-span-8 lg:grid-cols-[1fr_1.2fr]";
const copy = "flex flex-col justify-end px-4 pt-4 pb-3 md:px-5";

/** How the work gets built and kept running, one thought per tile. Each
 * picture is a live piece of a real project, set in as it is. */
export default async function Bento() {
	const [te, ts, tp, th, locale] = await Promise.all([
		getTranslations("engineerLed"),
		getTranslations("techStack"),
		getTranslations("support"),
		getTranslations("home.bento"),
		getLocale(),
	]);

	return (
		<SectionWrapper id="engineer-led">
			<SectionHeading description={te("paragraphs.0")} title={te("title")} />
			<div className="mt-10 grid grid-cols-1 gap-5 md:mt-14 lg:grid-cols-12">
				{/* Who you work with */}
				<article className="flex flex-col justify-between rounded-[20px] bg-foreground p-6 text-background md:p-7 lg:col-span-4">
					<h3 className="font-display text-xl leading-snug">
						{te("bullets.0")}
					</h3>
					<div>
						<ul className="mt-8">
							{directKeys.map((key) => (
								<li
									className="border-background/15 border-t py-3 text-base"
									key={key}
								>
									{te(`bullets.${key}`)}
								</li>
							))}
						</ul>
						<MarketingArrowLink
							className="mt-4 text-background text-base hover:text-background/80"
							href="/about"
						>
							{te("cta")}
						</MarketingArrowLink>
					</div>
				</article>

				{/* AI in the build, judgement with the engineer */}
				<article className={cn(tile, wide)}>
					<div className={cn(copy, "max-lg:order-2")}>
						<h3 className={title}>{te("bullets.5")}</h3>
						<p className={text}>{te("paragraphs.1")}</p>
					</div>
					<div className={cn(frame, "aspect-[16/10]")}>
						<BentoScene kind="takeoff" />
					</div>
				</article>

				{/* The stack */}
				<article className={cn(tile, wide)}>
					<div className={cn(copy, "max-lg:order-2")}>
						<h3 className={title}>{ts("title")}</h3>
						<p className={text}>{ts("subtitle")}</p>
						<MarketingArrowLink className="mt-4 text-base" href="/case-studies">
							{ts("proofLink")}
						</MarketingArrowLink>
					</div>
					<div
						className={cn(
							frame,
							"grid content-center gap-x-5 gap-y-6 p-5 sm:grid-cols-2"
						)}
					>
						{stack.map((group) => (
							<div key={group.key}>
								<div className="mb-3 text-muted-foreground text-sm">
									{ts(group.key)}
								</div>
								<TechPillGroup items={group.items} />
							</div>
						))}
					</div>
				</article>

				{/* From the interface to deployment */}
				<article className={cn(tile, "flex flex-col lg:col-span-4")}>
					<div className={cn(frame, "aspect-[16/10]")}>
						<BentoScene kind="summary" />
					</div>
					<div className={copy}>
						<h3 className={title}>{te("bullets.4")}</h3>
					</div>
				</article>

				{/* One part, built in code */}
				<article className={cn(tile, "flex flex-col lg:col-span-4")}>
					<div className={cn(frame, "min-h-[220px] flex-1")}>
						<KernspanDamper sizes="(min-width: 1024px) 400px, 100vw" />
					</div>
					<div className={cn(copy, "flex-none")}>
						<h3 className={title}>{th("damper.title")}</h3>
						<p className={text}>{th("damper.description")}</p>
						<MarketingArrowLink
							className="mt-4 text-base"
							href={{
								pathname: "/case-studies/[slug]",
								params: { slug: "kernspan" },
							}}
						>
							{th("damper.link")}
						</MarketingArrowLink>
					</div>
				</article>

				{/* After launch */}
				<article className={cn(tile, "lg:col-span-8")}>
					<div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_1.2fr]">
						<div className={cn(copy, "max-lg:order-2")}>
							<h3 className={title}>{tp("title")}</h3>
							<p className={text}>{tp("subtitle")}</p>
							<a
								className="group mt-4 inline-flex items-center gap-1.5 text-base text-brand-readable outline-none transition-colors hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring/50"
								href={homepageSectionHref("contact", locale)}
							>
								{tp("contactLink")}
							</a>
						</div>
						<div className={cn(frame, "aspect-[16/10]")}>
							<BentoScene kind="steps" />
						</div>
					</div>
					<dl className="grid gap-x-6 gap-y-5 px-4 pt-6 pb-4 sm:grid-cols-3 md:px-5">
						{supportKeys.map((key) => (
							<div key={key}>
								<dt className="font-medium text-base text-foreground">
									{tp(`items.${key}.title`)}
								</dt>
								<dd className="mt-1.5 text-muted-foreground text-sm leading-6">
									{tp(`items.${key}.description`)}
								</dd>
							</div>
						))}
					</dl>
				</article>
			</div>
		</SectionWrapper>
	);
}
