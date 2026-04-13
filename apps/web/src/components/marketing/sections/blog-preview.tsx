import { ArrowRight } from "lucide-react";
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
		<SectionWrapper id="blog" alternate>
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
			<StaggerChildren className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
				{posts.map((post) => (
					<Link
						key={post.slug}
						href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
						className="group flex flex-col border-border/40 not-last:border-b p-8 transition-colors hover:bg-muted/30 md:not-[:nth-last-child(-n+3)]:border-b md:p-10 md:[&:nth-child(3n+1)]:border-r md:[&:nth-child(3n+2)]:border-r"
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
						<H3 className="mt-5 tracking-[-0.04em] transition-colors group-hover:text-brand">
							{post.title}
						</H3>
						<Muted className="mt-3 line-clamp-3">{post.excerpt}</Muted>
						<div className="mt-6 mt-auto flex items-center justify-end border-border/40 border-t pt-5">
							<ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brand" />
						</div>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
