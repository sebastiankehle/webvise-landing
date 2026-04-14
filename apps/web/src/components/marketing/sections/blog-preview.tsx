import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { Caption, H2, H3, Lead, Muted } from "@/components/ui/typography";
import { getBlogPosts } from "@/data/blog";
import { Link } from "@/i18n/navigation";

export default async function BlogPreview() {
	const [t, locale] = await Promise.all([getTranslations("blog"), getLocale()]);
	const posts = getBlogPosts(locale).slice(0, 6);

	if (posts.length === 0) return null;

	return (
		<SectionWrapper id="blog" alternate hatch>
			<div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
				<div className="max-w-[640px]">
					<H2>{t("title")}</H2>
					<Lead className="mt-5 max-w-[520px]">{t("subtitle")}</Lead>
				</div>
				<Link
					href="/blog"
					className="shrink-0 text-brand text-sm transition-opacity hover:opacity-80"
				>
					{t("viewAll")}
				</Link>
			</div>
			<StaggerChildren className="mt-16 -mx-6 grid border-t border-grid-line md:grid-cols-3">
				{posts.map((post) => (
					<Link
						key={post.slug}
						href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
						className="group flex flex-col border-b border-grid-line p-6 md:border-r md:p-8 md:[&:nth-child(3n)]:border-r-0"
					>
						<div className="flex items-center gap-3">
							<Caption>
								<time dateTime={post.date}>
									{new Date(post.date).toLocaleDateString(locale, {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</time>
							</Caption>
							<Caption className="text-border">/</Caption>
							<Caption>
								{post.readingTime} {t("minRead")}
							</Caption>
						</div>
						<H3 className="mt-5 transition-colors group-hover:text-brand">
							{post.title}
						</H3>
						<Muted className="mt-3 line-clamp-3">{post.excerpt}</Muted>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
