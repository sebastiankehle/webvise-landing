import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { ActionArrow } from "@/components/marketing/action";
import Closing from "@/components/marketing/home/closing";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { H1, H3, inlineLinkClassName } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const tools = [
	{ key: "aiVisibilityCheck", href: "/tools/ai-visibility-check" },
	{ key: "robotsLlmsGenerator", href: "/tools/robots-llms-generator" },
	{ key: "wpHealthReport", href: "/wp-health-report" },
	{ key: "projectScope", href: "/tools/project-scope" },
] as const;

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const [t, locale] = await Promise.all([
		getTranslations("freeTools"),
		getLocale(),
	]);
	const title = t("meta.title");
	const description = t("meta.description");
	return {
		title,
		description,
		alternates: generateAlternates("/tools", locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl("/tools", locale),
		},
	};
}

/** Every free tool on the site, one card each. */
export default async function ToolsPage({ params }: { params: LocaleParams }) {
	await pinLocale(params);
	const [t, tn] = await Promise.all([
		getTranslations("freeTools"),
		getTranslations("nav"),
	]);

	return (
		<>
			<section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
				<ConstructedGrid variant="page" />
				<GridContainer>
					<div className="stagger-visible">
						<H1 className="max-w-[18ch]">{t("title")}</H1>
						<p className="mt-6 max-w-[58ch] text-foreground text-lg leading-[1.6]">
							{t("lead")}
						</p>
						<div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2">
							{tools.map((tool) => (
								<Link
									className="group/arrow flex flex-col rounded-[20px] bg-card p-6 shadow-[0_0_0_1px_rgba(14,18,23,0.06),0_24px_48px_-36px_rgba(14,18,23,0.35)] outline-none transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(14,18,23,0.1),0_28px_56px_-32px_rgba(14,18,23,0.45)] focus-visible:ring-2 focus-visible:ring-ring/70 md:p-7 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
									href={tool.href}
									key={tool.key}
								>
									<div className="text-brand-readable text-sm">
										{t(`items.${tool.key}.label`)}
									</div>
									<H3 className="mt-1.5 text-xl leading-snug">
										{t(`items.${tool.key}.title`)}
									</H3>
									<p className="mt-3 max-w-[46ch] text-base text-muted-foreground leading-[1.6]">
										{t(`items.${tool.key}.description`)}
									</p>
									<span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-base text-foreground">
										{t("open")}
										<ActionArrow />
									</span>
								</Link>
							))}
						</div>
						<p className="mt-10 max-w-[62ch] text-base text-muted-foreground leading-[1.6]">
							<span className="text-foreground">{t("other.title")}</span>{" "}
							{t("other.body")}{" "}
							<Link className={inlineLinkClassName} href="/book">
								{tn("menuPromptCta")}
							</Link>
						</p>
					</div>
				</GridContainer>
			</section>
			<Closing />
		</>
	);
}
