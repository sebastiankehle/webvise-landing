import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import { getBlogPosts } from "@/data/blog";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const POSTS_PER_PAGE = 9;

export async function generateMetadata(): Promise<Metadata> {
	const [t, locale] = await Promise.all([
		getTranslations("blog"),
		getLocale(),
	]);
	const title = t("title");
	const description = t("subtitle");

	return {
		title,
		description,
		alternates: generateAlternates("/blog", locale),
		openGraph: {
			title: `${title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl("/blog", locale),
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | webvise`,
			description,
		},
	};
}

export default async function BlogPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const [t, locale, params] = await Promise.all([
		getTranslations("blog"),
		getLocale(),
		searchParams,
	]);
	const posts = getBlogPosts(locale);
	const blogUrl = localizedUrl("/blog", locale);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${blogUrl}#webpage`,
		name: t("title"),
		description: t("subtitle"),
		url: blogUrl,
		isPartOf: { "@id": "https://webvise.io/#website" },
		mainEntity: {
			"@type": "Blog",
			"@id": `${blogUrl}#blog`,
			name: t("title"),
			url: blogUrl,
		},
	};

	const currentPage = Math.max(1, Number(params.page) || 1);
	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
	const page = Math.min(currentPage, totalPages);
	const paginatedPosts = posts.slice(
		(page - 1) * POSTS_PER_PAGE,
		page * POSTS_PER_PAGE,
	);

	return (
		<>
			<JsonLd data={jsonLd} />
			<section className="py-24 md:py-44">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="max-w-[720px]">
						<h1 className="font-display text-[30px] leading-[1.05] tracking-[-0.028em] md:text-[42px]">
							{t("title")}
						</h1>
						<p className="mt-5 max-w-[560px] text-[17px] text-muted-foreground leading-[1.55]">
							{t("subtitle")}
						</p>
					</div>

					<div className="mt-16 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
						{paginatedPosts.map((post) => (
							<Link
								key={post.slug}
								href={`/blog/${post.slug}` as "/blog"}
								className="group flex flex-col p-8 transition-colors hover:bg-muted/30 md:p-10"
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
								<h2 className="mt-5 font-display text-xl leading-[1.25] tracking-[-0.018em] transition-colors group-hover:text-brand">
									{post.title}
								</h2>
								<p className="mt-3 text-muted-foreground text-sm leading-[1.6]">
									{post.excerpt}
								</p>
								<span className="mt-8 text-brand text-sm transition-opacity group-hover:opacity-80">
									{t("readMore")}
								</span>
							</Link>
						))}
					</div>

					{totalPages > 1 && (
						<nav className="mt-14 flex items-center justify-center gap-2">
							{page > 1 && (
								<Link
									href={{
										pathname: "/blog",
										query: page === 2 ? undefined : { page: String(page - 1) },
									}}
									className="border border-border/40 px-4 py-2 text-sm transition-colors hover:bg-muted/30"
								>
									{t("pagination.previous")}
								</Link>
							)}
							{Array.from({ length: totalPages }, (_, i) => i + 1).map(
								(p) => (
									<Link
										key={p}
										href={{
											pathname: "/blog",
											query: p === 1 ? undefined : { page: String(p) },
										}}
										className={`border px-3 py-2 text-sm transition-colors ${
											p === page
												? "border-brand bg-brand text-white"
												: "border-border/40 hover:bg-muted/30"
										}`}
									>
										{p}
									</Link>
								),
							)}
							{page < totalPages && (
								<Link
									href={{
										pathname: "/blog",
										query: { page: String(page + 1) },
									}}
									className="border border-border/40 px-4 py-2 text-sm transition-colors hover:bg-muted/30"
								>
									{t("pagination.next")}
								</Link>
							)}
						</nav>
					)}
				</div>
			</section>
		</>
	);
}
