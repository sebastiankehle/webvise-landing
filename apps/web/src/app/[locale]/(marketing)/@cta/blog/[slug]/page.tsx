import { getLocale, getTranslations } from "next-intl/server";

import FooterCtaBanner from "@/components/marketing/footer-cta-banner";
import { getBlogPostBySlug, getBlogPosts } from "@/data/blog";

export function generateStaticParams() {
	return getBlogPosts("en").map((p) => ({ slug: p.slug }));
}

const TAG_TO_CTA: Record<string, string> = {
	"AI Agents": "ai",
	AI: "ai",
	Automation: "ai",
	MCP: "ai",
	WordPress: "platform",
	TYPO3: "platform",
	Squarespace: "platform",
	Webflow: "platform",
	Framer: "platform",
	CMS: "platform",
	SEO: "seo",
	Performance: "performance",
	"Lead Generation": "leads",
	Copywriting: "leads",
	Marketing: "leads",
};

function getCtaCategory(tags?: string[]): string | null {
	if (!tags?.length) return null;
	for (const tag of tags) {
		if (TAG_TO_CTA[tag]) return TAG_TO_CTA[tag];
	}
	return null;
}

export default async function BlogCta({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const locale = await getLocale();
	const post = getBlogPostBySlug(slug, locale);
	const t = await getTranslations("blog");

	const category = getCtaCategory(post?.tags);
	const headline = category ? t(`ctas.${category}.headline`) : t("ctaTitle");
	const subtext = category
		? t(`ctas.${category}.description`)
		: t("ctaDescription");
	const buttonText = category ? t(`ctas.${category}.button`) : t("ctaButton");

	return (
		<FooterCtaBanner
			headline={headline}
			subtext={subtext}
			buttonText={buttonText}
			newsletter={{
				divider: t("newsletter.divider"),
				placeholder: t("newsletter.placeholder"),
				buttonLabel: t("newsletter.button"),
				success: t("newsletter.success"),
				error: t("newsletter.error"),
			}}
		/>
	);
}
