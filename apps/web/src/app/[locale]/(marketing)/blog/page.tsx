import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import JsonLd from "@/components/json-ld";
import { ActionArrow } from "@/components/marketing/action";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import { getBlogPosts } from "@/data/blog";
import { BLOG_TOPICS } from "@/data/blog-topics";
import { Link } from "@/i18n/navigation";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const POSTS_PER_PAGE = 9;

const TOPICS = BLOG_TOPICS;

const chip =
	"inline-flex h-9 items-center rounded-sm px-3 text-sm outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring/70";

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

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
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
	params,
	searchParams,
}: {
	params: LocaleParams;
	searchParams: Promise<{ page?: string; q?: string; topic?: string }>;
}) {
	await pinLocale(params);
	const [t, locale, query] = await Promise.all([
		getTranslations("blog"),
		getLocale(),
		searchParams,
	]);
	const topic = TOPICS.find((entry) => entry.key === query.topic);
	const search = query.q?.trim().slice(0, 80) ?? "";
	const needle = search.toLowerCase();
	const posts = getBlogPosts(locale).filter(
		(post) =>
			(!topic ||
				post.tags?.some((tag) =>
					(topic.tags as readonly string[]).includes(tag)
				)) &&
			(!needle ||
				`${post.title} ${post.excerpt} ${post.keyword}`
					.toLowerCase()
					.includes(needle))
	);
	// Filters ride along in every pagination link.
	const filters = {
		...(topic ? { topic: topic.key } : {}),
		...(search ? { q: search } : {}),
	};
	const blogUrl = localizedUrl("/blog", locale);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${blogUrl}#webpage`,
		name: t("title"),
		description: t("subtitle"),
		url: blogUrl,
		isPartOf: { "@id": "https://www.webvise.io/#website" },
		mainEntity: {
			"@type": "Blog",
			"@id": `${blogUrl}#blog`,
			name: t("title"),
			url: blogUrl,
		},
	};

	const currentPage = Math.max(1, Number(query.page) || 1);
	const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
	const page = Math.min(currentPage, totalPages);
	const paginatedPosts = posts.slice(
		(page - 1) * POSTS_PER_PAGE,
		page * POSTS_PER_PAGE
	);

	const pageItems = computePageItems(page, totalPages);

	return (
		<>
			<JsonLd data={jsonLd} />
			<section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
				<ConstructedGrid variant="page" />
				<GridContainer>
					<div className="grid gap-x-6 gap-y-6 lg:grid-cols-12 lg:items-end">
						<H1 className="lg:col-span-6">{t("title")}</H1>
						<p className="max-w-[52ch] text-foreground text-lg leading-[1.6] lg:col-span-5 lg:col-start-8">
							{t("subtitle")}
						</p>
					</div>

					<div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 md:mt-14">
						<ul className="flex flex-wrap gap-2">
							{[undefined, ...TOPICS].map((entry) => (
								<li key={entry?.key ?? "all"}>
									<Link
										aria-current={
											entry?.key === topic?.key ? "true" : undefined
										}
										className={`${chip} ${
											entry?.key === topic?.key
												? "border border-foreground bg-foreground text-background"
												: "border border-foreground/15 text-foreground hover:bg-foreground/[0.06]"
										}`}
										href={{
											pathname: "/blog",
											query: {
												...(entry ? { topic: entry.key } : {}),
												...(search ? { q: search } : {}),
											},
										}}
									>
										{t(`filter.topics.${entry?.key ?? "all"}`)}
									</Link>
								</li>
							))}
						</ul>
						{/* A plain GET form: search works without script. */}
						<form className="relative w-full sm:w-64">
							{topic && <input name="topic" type="hidden" value={topic.key} />}
							<label className="sr-only" htmlFor="blog-search">
								{t("filter.search")}
							</label>
							<Search
								aria-hidden="true"
								className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<input
								className="h-10 w-full rounded-sm bg-card pr-3 pl-10 text-base text-foreground shadow-[inset_0_0_0_1px_rgba(14,18,23,0.12)] outline-none transition-shadow placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--ring)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
								defaultValue={search}
								id="blog-search"
								name="q"
								placeholder={t("filter.search")}
								type="search"
							/>
						</form>
					</div>

					{posts.length === 0 && (
						<p className="mt-10 text-base text-foreground/75 leading-[1.6]">
							{t("filter.empty")}{" "}
							<Link
								className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
								href="/blog"
							>
								{t("filter.reset")}
							</Link>
						</p>
					)}

					<ul className="mt-6 md:mt-8">
						{paginatedPosts.map((post) => (
							<li key={post.slug}>
								<Link
									className="group/arrow -mx-4 grid gap-x-6 gap-y-1.5 rounded-[10px] px-4 py-6 outline-none transition-colors duration-150 hover:bg-card focus-visible:bg-card md:grid-cols-12 md:items-baseline"
									href={`/blog/${post.slug}` as "/blog"}
								>
									<time
										className="text-muted-foreground text-sm tabular-nums md:col-span-2"
										dateTime={post.date}
									>
										{new Date(post.date).toLocaleDateString(locale, {
											day: "numeric",
											month: "short",
											year: "numeric",
										})}
									</time>
									<span className="md:col-span-8">
										<h2 className="font-display text-foreground text-lg leading-snug">
											{post.title}
										</h2>
										<span className="mt-1.5 line-clamp-2 block max-w-[68ch] text-base text-foreground/75 leading-[1.6]">
											{post.excerpt}
										</span>
									</span>
									<span className="flex items-center gap-3 text-muted-foreground text-sm tabular-nums md:col-span-2 md:justify-end">
										{post.readingTime} {t("minRead")}
										<span className="text-foreground">
											<ActionArrow />
										</span>
									</span>
								</Link>
							</li>
						))}
					</ul>

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
													page === 2
														? filters
														: { ...filters, page: String(page - 1) },
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
																item === 1
																	? filters
																	: { ...filters, page: String(item) },
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
												query: { ...filters, page: String(page + 1) },
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
