import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { getBlogPosts } from "@/data/blog";
import { Link } from "@/i18n/navigation";

export default async function BlogPreview() {
	const [t, locale] = await Promise.all([getTranslations("blog"), getLocale()]);
	const posts = getBlogPosts(locale).slice(0, 6);

	if (posts.length === 0) return null;

	return (
		<SectionWrapper id="blog" alternate>
			<div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
				<div className="max-w-2xl">
					<h2 className="font-display text-3xl tracking-tight md:text-4xl">
						{t("title")}
					</h2>
					<p className="mt-4 text-muted-foreground leading-relaxed">
						{t("subtitle")}
					</p>
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
						className="group flex flex-col border-border/40 not-last:border-b p-8 transition-colors hover:bg-muted/30 md:not-[:nth-last-child(-n+3)]:border-b md:[&:nth-child(3n+1)]:border-r md:[&:nth-child(3n+2)]:border-r md:p-10"
					>
						<div className="flex items-center gap-3 text-muted-foreground text-xs">
							<time dateTime={post.date}>
								{new Date(post.date).toLocaleDateString(locale, {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</time>
							<span className="text-border">/</span>
							<span>
								{post.readingTime} {t("minRead")}
							</span>
						</div>
						<h3 className="mt-5 font-display text-xl leading-snug tracking-tight transition-colors group-hover:text-brand">
							{post.title}
						</h3>
						<p className="mt-3 line-clamp-3 text-muted-foreground text-sm leading-relaxed">
							{post.excerpt}
						</p>
						<span className="mt-auto pt-8 text-brand text-sm transition-opacity group-hover:opacity-80">
							{t("readMore")}
						</span>
					</Link>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
