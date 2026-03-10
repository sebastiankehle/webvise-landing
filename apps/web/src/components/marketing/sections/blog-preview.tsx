import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import StaggerChildren from "@/components/marketing/stagger-children";
import { getBlogPosts } from "@/data/blog";

export default async function BlogPreview() {
	const [t, locale] = await Promise.all([
		getTranslations("blog"),
		getLocale(),
	]);
	const posts = getBlogPosts(locale).slice(0, 3);

	if (posts.length === 0) return null;

	return (
		<SectionWrapper id="blog">
			<div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
				<div className="max-w-2xl">
					<h2 className="font-normal text-3xl tracking-tight md:text-4xl">
						{t("title")}
					</h2>
					<p className="mt-4 font-light text-muted-foreground">
						{t("subtitle")}
					</p>
				</div>
				<a
					href="/blog"
					className="shrink-0 font-light text-brand text-sm transition-opacity hover:opacity-80"
				>
					{t("viewAll")}
				</a>
			</div>
			<StaggerChildren className="mt-12 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
				{posts.map((post) => (
					<a
						key={post.slug}
						href={`/blog/${post.slug}`}
						className="group flex flex-col border-border/40 p-6 transition-colors hover:bg-muted/40 md:p-8 not-last:border-b md:not-last:border-r md:not-last:border-b-0"
					>
						<div className="flex items-center gap-3">
							<time
								dateTime={post.date}
								className="font-light text-muted-foreground text-xs"
							>
								{new Date(post.date).toLocaleDateString(locale, {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</time>
							<span className="text-muted-foreground/40 text-xs">&middot;</span>
							<span className="font-light text-muted-foreground text-xs">
								{post.readingTime} {t("minRead")}
							</span>
						</div>
						<h3 className="mt-4 font-normal text-lg leading-snug tracking-tight transition-colors group-hover:text-brand">
							{post.title}
						</h3>
						<p className="mt-3 line-clamp-3 font-light text-muted-foreground text-sm leading-relaxed">
							{post.excerpt}
						</p>
						<span className="mt-6 font-light text-brand text-sm transition-opacity group-hover:opacity-80">
							{t("readMore")}
						</span>
					</a>
				))}
			</StaggerChildren>
		</SectionWrapper>
	);
}
