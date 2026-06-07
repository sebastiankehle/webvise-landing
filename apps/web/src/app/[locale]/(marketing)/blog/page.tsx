import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import JsonLd from "@/components/json-ld";
import { GridFrame } from "@/components/marketing/section-wrapper";
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
			<section className="relative pt-32 pb-24 md:pt-44 md:pb-44">
				<div
					aria-hidden="true"
					className="grid-hatch pointer-events-none absolute inset-y-0 left-0 hidden md:block md:w-[calc((100%_-_1320px)_/_2)]"
				/>
				<div
					aria-hidden="true"
					className="grid-hatch pointer-events-none absolute inset-y-0 right-0 hidden md:block md:w-[calc((100%_-_1320px)_/_2)]"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1320px] md:block"
				>
					<div className="h-full border-grid-line border-x" />
				</div>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-grid-line md:block"
				/>
				<GridFrame className="inset-0" />
				<div className="relative mx-auto max-w-[1320px] px-6">
					<div className="max-w-[720px]">
						<H1>{t("title")}</H1>
						<Lead className="mt-5 max-w-[560px] text-[17px] leading-[1.55]">
							{t("subtitle")}
						</Lead>
					</div>

					<div className="-mx-6 mt-16 grid border-grid-line border-t md:grid-cols-3">
						{paginatedPosts.map((post) => (
							<Link
								className="group flex flex-col border-grid-line border-b p-6 transition-colors hover:bg-muted/30 md:border-r md:p-8 md:[&:nth-child(3n)]:border-r-0"
								href={`/blog/${post.slug}` as "/blog"}
								key={post.slug}
							>
								<Caption className="flex items-center gap-3">
									<time dateTime={post.date}>
										{new Date(post.date).toLocaleDateString(locale, {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</time>
									<Caption className="text-border">/</Caption>
									<Caption className="text-current">
										{post.readingTime} {t("minRead")}
									</Caption>
								</Caption>
								<H3 className="mt-5 transition-colors group-hover:text-brand-readable">
									{post.title}
								</H3>
								<Muted className="mt-3 leading-[1.6]">{post.excerpt}</Muted>
								<div className="mt-6 mt-auto flex items-center justify-end border-border/40 border-t pt-5">
									<ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brand-readable" />
								</div>
							</Link>
						))}
					</div>

					{totalPages > 1 && (
						<nav
							aria-label="Pagination"
							className="-mx-6 flex items-center justify-between gap-2 border-grid-line border-t p-6 md:p-8"
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
												className={
													item === page
														? "[a]:hover:!bg-brand-hover border-brand bg-brand text-brand-foreground"
														: undefined
												}
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
												variant={item === page ? "default" : "outline"}
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
				</div>
			</section>
		</>
	);
}
