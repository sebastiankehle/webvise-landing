import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { getBlogPosts } from "@/data/blog";
import { Link } from "@/i18n/navigation";

const POSTS_PER_PAGE = 9;

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("blog");
	return {
		title: `${t("title")} - webvise`,
		description: t("subtitle"),
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

	const currentPage = Math.max(1, Number(params.page) || 1);
	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
	const page = Math.min(currentPage, totalPages);
	const paginatedPosts = posts.slice(
		(page - 1) * POSTS_PER_PAGE,
		page * POSTS_PER_PAGE,
	);

	return (
		<section className="py-20 md:py-40">
			<div className="mx-auto max-w-[1200px] px-6">
				<div>
					<div className="max-w-2xl">
						<h1 className="font-normal text-3xl tracking-tight md:text-5xl">
							{t("title")}
						</h1>
						<p className="mt-4 font-light text-lg text-muted-foreground">
							{t("subtitle")}
						</p>
					</div>

					<div className="mt-16 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
						{paginatedPosts.map((post) => (
							<a
								key={post.slug}
								href={`/blog/${post.slug}`}
								className="group flex flex-col p-6 transition-colors hover:bg-muted/40 md:p-8"
							>
								<div className="flex items-center gap-3">
									<time
										dateTime={post.date}
										className="font-light text-muted-foreground text-xs"
									>
										{new Date(post.date).toLocaleDateString("en-GB", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</time>
									<span className="text-muted-foreground/40 text-xs">·</span>
									<span className="font-light text-muted-foreground text-xs">
										{post.readingTime} {t("minRead")}
									</span>
								</div>
								<h2 className="mt-4 font-normal text-lg leading-snug tracking-tight transition-colors group-hover:text-brand">
									{post.title}
								</h2>
								<p className="mt-3 font-light text-muted-foreground text-sm leading-relaxed">
									{post.excerpt}
								</p>
								<span className="mt-6 font-light text-brand text-sm transition-opacity group-hover:opacity-80">
									{t("readMore")}
								</span>
							</a>
						))}
					</div>

					{totalPages > 1 && (
						<nav className="mt-12 flex items-center justify-center gap-2">
							{page > 1 && (
								<Link
									href={{
										pathname: "/blog",
										query: page === 2 ? undefined : { page: String(page - 1) },
									}}
									className="rounded border border-border/40 px-4 py-2 font-light text-sm transition-colors hover:bg-muted/40"
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
										className={`rounded border px-3 py-2 font-light text-sm transition-colors ${
											p === page
												? "border-brand bg-brand text-white"
												: "border-border/40 hover:bg-muted/40"
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
									className="rounded border border-border/40 px-4 py-2 font-light text-sm transition-colors hover:bg-muted/40"
								>
									{t("pagination.next")}
								</Link>
							)}
						</nav>
					)}
				</div>
			</div>
		</section>
	);
}
