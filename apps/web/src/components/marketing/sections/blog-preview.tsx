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
			<div className="grid items-start gap-12 md:grid-cols-[1fr_1.2fr]">
				<h2 className="font-display text-[28px] leading-[34px] md:text-[36px] md:leading-[42px]">
					{t("title")}
				</h2>
				<div>
					<p className="text-[17px] text-muted-foreground leading-[26px] tracking-[-0.011em]">
						{t("subtitle")}
					</p>
					<Link
						href="/blog"
						className="mt-4 inline-flex items-center gap-1 text-brand text-sm tracking-[-0.011em] transition-opacity hover:opacity-80"
					>
						{t("viewAll")}
					</Link>
				</div>
			</div>
			<StaggerChildren className="mt-14 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
				{posts.map((post) => (
					<Link
						key={post.slug}
						href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
						className="group flex flex-col border-border/40 not-last:border-b p-8 transition-colors hover:bg-muted/30 md:not-[:nth-last-child(-n+3)]:border-b md:[&:nth-child(3n+1)]:border-r md:[&:nth-child(3n+2)]:border-r md:p-10"
					>
						<div className="flex items-center gap-3 text-muted-foreground text-xs tracking-[-0.011em]">
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
						<h3 className="mt-5 font-display text-[16px] leading-[21px] tracking-[-0.011em] transition-colors group-hover:text-brand">
							{post.title}
						</h3>
						<p className="mt-3 line-clamp-3 text-muted-foreground text-sm leading-[1.5]">
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
