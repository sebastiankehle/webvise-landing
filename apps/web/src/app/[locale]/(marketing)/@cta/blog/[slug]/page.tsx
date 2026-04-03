import { getLocale, getTranslations } from "next-intl/server";

import FooterCtaBanner from "@/components/marketing/footer-cta-banner";
import { getBlogPostBySlug, getBlogPosts } from "@/data/blog";

export function generateStaticParams() {
	return getBlogPosts("en").map((p) => ({ slug: p.slug }));
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

	return (
		<FooterCtaBanner
			headline={t("ctaTitle")}
			subtext={t("ctaDescription")}
			buttonText={post?.cta ?? t("ctaButton")}
		/>
	);
}
