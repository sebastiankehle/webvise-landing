import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import JsonLd from "@/components/json-ld";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Caption, H1, H3, Lead, Muted } from "@/components/ui/typography";
import { getBlogPosts } from "@/data/blog";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const POSTS_PER_PAGE = 9;

type PageItem = number | "ellipsis";

function computePageItems(page: number, totalPages: number): PageItem[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}
	const siblings = 1;
	const leftDots = page - siblings > 3;
	const rightDots = page + siblings < totalPages - 2;
	const windowSize = 3 + 2 * siblings;

	if (!leftDots && rightDots) {
		const items: PageItem[] = Array.from(
			{ length: windowSize },
			(_, i) => i + 1
		);
		items.push("ellipsis", totalPages);
		return items;
	}
	if (leftDots && !rightDots) {
		const items: PageItem[] = [1, "ellipsis"];
		for (let i = totalPages - windowSize + 1; i <= totalPages; i++) {
			items.push(i);
		}
		return items;
	}
	const items: PageItem[] = [1, "ellipsis"];
	for (let i = page - siblings; i <= page + siblings; i++) {
		items.push(i);
	}
	items.push("ellipsis", totalPages);
	return items;
}

export async function generateMetadata(): Promise<Metadata> {
	const [t, locale] = await Promise.all([getTranslations("blog"), getLocale()]);
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
		page * POSTS_PER_PAGE
	);

	const pageItems = computePageItems(page, totalPages);

	return (
		<>
			<JsonLd data={jsonLd} />
			<section className="section-inverted relative pt-32 pb-24 md:pt-44 md:pb-44">
				<ConstructedGrid hatch variant="page" />
				<GridContainer>
					<div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
						<div className="max-w-[660px]">
							<H1>{t("title")}</H1>
						</div>
						<div className="max-w-[560px] lg:justify-self-end">
							<Lead>{t("subtitle")}</Lead>
						</div>
					</div>

					<div className="mt-10 grid gap-5 md:mt-16 md:grid-cols-3">
						{paginatedPosts.map((post) => (
							<Link
								className="surface-card group flex flex-col p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:p-7"
								href={`/blog/${post.slug}` as "/blog"}
								key={post.slug}
							>
								<div className="flex items-center justify-between gap-4">
									<Caption className="text-brand-readable">
										<time dateTime={post.date}>
											{new Date(post.date).toLocaleDateString(locale, {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</time>
									</Caption>
									<Caption className="tabular-nums">
										{post.readingTime} {t("minRead")}
									</Caption>
								</div>
								<H3 className="mt-5 line-clamp-2">{post.title}</H3>
								<Muted className="mt-3 line-clamp-3">{post.excerpt}</Muted>
								<div className="mt-auto flex items-center justify-end pt-6">
									<ArrowRight className="h-4 w-4 text-brand-icon transition-transform duration-300 group-hover:translate-x-1" />
								</div>
							</Link>
						))}
					</div>

					{totalPages > 1 && (
						<nav
							aria-label={t("pagination.label")}
							className="mt-12 flex items-center justify-between gap-3 md:mt-16"
						>
							{page > 1 ? (
								<Button
									render={
										<Link
											href={{
												pathname: "/blog",
												query:
													page === 2 ? undefined : { page: String(page - 1) },
											}}
										/>
									}
									size="sm"
									variant="outline"
								>
									<ChevronLeft data-icon="inline-start" />
									<span className="hidden sm:inline">
										{t("pagination.previous")}
									</span>
								</Button>
							) : (
								<Button
									aria-hidden="true"
									disabled
									size="sm"
									tabIndex={-1}
									variant="outline"
								>
									<ChevronLeft data-icon="inline-start" />
									<span className="hidden sm:inline">
										{t("pagination.previous")}
									</span>
								</Button>
							)}

							<ol className="flex items-center gap-1.5">
								{pageItems.map((item, idx) =>
									item === "ellipsis" ? (
										<li
											aria-hidden="true"
											className="px-1 text-muted-foreground text-xs"
											// biome-ignore lint/suspicious/noArrayIndexKey: ellipsis position is stable
											key={`ellipsis-${idx}`}
										>
											…
										</li>
									) : (
										<li key={item}>
											<Button
												aria-current={item === page ? "page" : undefined}
												render={
													<Link
														href={{
															pathname: "/blog",
															query:
																item === 1 ? undefined : { page: String(item) },
														}}
													/>
												}
												size="icon-sm"
												variant={item === page ? "brand" : "outline"}
											>
												{item}
											</Button>
										</li>
									)
								)}
							</ol>

							{page < totalPages ? (
								<Button
									render={
										<Link
											href={{
												pathname: "/blog",
												query: { page: String(page + 1) },
											}}
										/>
									}
									size="sm"
									variant="outline"
								>
									<span className="hidden sm:inline">
										{t("pagination.next")}
									</span>
									<ChevronRight data-icon="inline-end" />
								</Button>
							) : (
								<Button
									aria-hidden="true"
									disabled
									size="sm"
									tabIndex={-1}
									variant="outline"
								>
									<span className="hidden sm:inline">
										{t("pagination.next")}
									</span>
									<ChevronRight data-icon="inline-end" />
								</Button>
							)}
						</nav>
					)}
				</GridContainer>
			</section>
		</>
	);
}
