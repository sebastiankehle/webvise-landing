import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Shield } from "lucide-react";

import BlogShare from "@/components/marketing/blog-share";
import ReportDownloadForm from "@/components/marketing/report-download-form";
import JsonLd from "@/components/json-ld";
import SectionWrapper from "@/components/marketing/section-wrapper";
import {
	type Block,
	getAdjacentPosts,
	getBlogPostBySlug,
	getBlogPosts,
} from "@/data/blog";
import { Link } from "@/i18n/navigation";
import { generateAlternates, localizedUrl } from "@/lib/seo";

export function generateStaticParams() {
	return getBlogPosts("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const locale = await getLocale();
	const post = getBlogPostBySlug(slug, locale);
	if (!post) return {};

	const description = post.metaDescription ?? post.excerpt;
	const path = `/blog/${slug}`;

	return {
		title: post.title,
		description,
		keywords: post.keyword,
		alternates: generateAlternates(path, locale),
		openGraph: {
			title: `${post.title} | webvise`,
			description,
			siteName: "webvise",
			url: localizedUrl(path, locale),
			type: "article",
			publishedTime: post.date,
		},
		twitter: {
			card: "summary_large_image",
			title: `${post.title} | webvise`,
			description,
		},
	};
}

function renderInline(text: string) {
	const tokens = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
	return tokens.map((token) => {
		const boldMatch = token.match(/^\*\*(.*?)\*\*$/);
		if (boldMatch) {
			const innerLink = boldMatch[1].match(/^\[(.*?)\]\((.*?)\)$/);
			if (innerLink) {
				return (
					<a
						key={token}
						href={innerLink[2]}
						className="font-medium text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
						{...(innerLink[2].startsWith("http")
							? { target: "_blank", rel: "noopener noreferrer" }
							: {})}
					>
						{innerLink[1]}
					</a>
				);
			}
			return (
				<strong key={token} className="font-medium text-foreground">
					{boldMatch[1]}
				</strong>
			);
		}
		const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
		if (linkMatch) {
			return (
				<a
					key={token}
					href={linkMatch[2]}
					className="text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
					{...(linkMatch[2].startsWith("http")
						? { target: "_blank", rel: "noopener noreferrer" }
						: {})}
				>
					{linkMatch[1]}
				</a>
			);
		}
		return token;
	});
}

function getBlockKeys(blocks: Block[]) {
	const counts = new Map<string, number>();
	return blocks.map((block) => {
		const base =
			block.type +
			("text" in block
				? block.text
				: "items" in block
					? block.items[0]
					: block.headers.join());
		const n = counts.get(base) ?? 0;
		counts.set(base, n + 1);
		return n > 0 ? `${base}:${n}` : base;
	});
}

function RenderBlock({ block }: { block: Block }) {
	switch (block.type) {
		case "h2":
			return (
				<h2 className="mt-14 mb-4 font-display text-2xl tracking-tight first:mt-0">
					{block.text}
				</h2>
			);
		case "h3":
			return (
				<h3 className="mt-8 mb-3 text-base tracking-tight">
					{block.text}
				</h3>
			);
		case "p":
			return (
				<p className="mb-5 text-muted-foreground leading-relaxed last:mb-0">
					{renderInline(block.text)}
				</p>
			);
		case "ul":
			return (
				<ul className="mb-5 space-y-2 text-muted-foreground text-sm leading-relaxed">
					{block.items.map((item) => (
						<li key={item} className="flex gap-3">
							<span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand" />
							<span>{renderInline(item)}</span>
						</li>
					))}
				</ul>
			);
		case "table":
			return (
				<div className="mb-5 overflow-x-auto">
					<table className="w-full border border-border/40 text-sm">
						<thead>
							<tr className="border-border/40 border-b bg-muted/30">
								{block.headers.map((h) => (
									<th
										key={h}
										className="px-4 py-3 text-left text-foreground text-xs font-medium"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{block.rows.map((row) => (
								<tr
									key={row.join("-")}
									className="border-border/40 border-b last:border-0"
								>
									{row.map((cell) => (
										<td key={cell} className="px-4 py-3 text-muted-foreground">
											{renderInline(cell)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		case "download":
			return (
				<ReportDownloadForm
					reportId={block.reportId}
					title={block.title}
					description={block.description}
				/>
			);
		default:
			return null;
	}
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const locale = await getLocale();
	const post = getBlogPostBySlug(slug, locale);

	if (!post) {
		notFound();
	}

	const t = await getTranslations("blog");
	const tt = await getTranslations("trust.blogBanner");
	const postUrl = localizedUrl(`/blog/${slug}`, locale);
	const { prev, next } = getAdjacentPosts(slug, locale);

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "BlogPosting",
				"@id": `${postUrl}#article`,
				headline: post.title,
				description: post.metaDescription ?? post.excerpt,
				datePublished: post.date,
				dateModified: post.date,
				author: { "@id": "https://webvise.io/#organization" },
				publisher: { "@id": "https://webvise.io/#organization" },
				mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
				inLanguage: locale,
			},
			{
				"@type": "BreadcrumbList",
				"@id": `${postUrl}#breadcrumb`,
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Home",
						item: localizedUrl("/", locale),
					},
					{
						"@type": "ListItem",
						position: 2,
						name: "Blog",
						item: localizedUrl("/blog", locale),
					},
					{
						"@type": "ListItem",
						position: 3,
						name: post.title,
						item: postUrl,
					},
				],
			},
		],
	};

	return (
		<>
			<JsonLd data={jsonLd} />

			{/* Breadcrumb */}
			<nav
				aria-label="Breadcrumb"
				className="mx-auto max-w-[1320px] px-6 pt-24 md:pt-36"
			>
				<ol className="flex items-center gap-2 text-sm text-muted-foreground">
					<li>
						<Link
							href="/"
							className="transition-colors hover:text-foreground"
						>
							Home
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li>
						<Link
							href="/blog"
							className="transition-colors hover:text-foreground"
						>
							{t("title")}
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li className="truncate text-foreground">{post.title}</li>
				</ol>
			</nav>

			{/* Header */}
			<section className="pb-24 pt-10 md:pb-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="grid items-start gap-12 md:grid-cols-3 md:gap-16">
						{/* Title + info */}
						<div className="md:col-span-2">
							<span className="text-brand text-xs">
								<time dateTime={post.date}>
									{new Date(post.date).toLocaleDateString(locale, {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</time>
								{" \u00B7 "}
								{post.readingTime} {t("minRead")}
							</span>
							<h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
								{post.title}
							</h1>
							<p className="mt-4 text-lg text-muted-foreground leading-relaxed">
								{post.excerpt}
							</p>
						</div>

						{/* Tags box */}
						{post.tags && post.tags.length > 0 && (
							<div className="border border-border/40 p-6 md:p-8">
								<p className="mb-5 text-muted-foreground/50 text-xs">
									{t("tagsLabel")}
								</p>
								<div className="flex flex-wrap gap-2">
									{post.tags.map((tag) => (
										<span
											key={tag}
											className="border border-border/40 px-3 py-1.5 text-sm transition-all hover:border-brand hover:bg-brand hover:text-white"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="mx-auto mt-10 max-w-[1320px] px-6">
					<BlogShare url={postUrl} title={post.title} />
				</div>
			</section>

			<SectionWrapper id="content" alternate>
				<div className="max-w-2xl">
					{(() => {
						const keys = getBlockKeys(post.blocks);
						return post.blocks.map((block, idx) => (
							<RenderBlock key={keys[idx]} block={block} />
						));
					})()}

					{post.tags?.some((tag) => ["ai", "security"].some((t) => tag.toLowerCase().includes(t))) && (
						<div className="mt-14 flex items-center gap-3 border border-border/40 p-5 text-sm">
							<Shield className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} />
							<span className="text-muted-foreground">
								{tt("text")}
							</span>
						</div>
					)}
				</div>
			</SectionWrapper>

			<section className="border-border/40 border-t pb-28 pt-12">
				<div className="mx-auto max-w-[1320px] px-6">
					<BlogShare url={postUrl} title={post.title} />

					{(prev || next) && (
						<>
							<h2 className="mt-12 font-display text-2xl tracking-tight">
								{t("moreArticles")}
							</h2>
							<div className="mt-10 grid gap-6 md:grid-cols-2">
								{prev && (
									<a
										href={`/blog/${prev.slug}`}
										className="group border border-border/40 p-6 transition-colors hover:border-brand/30"
									>
										<span className="text-brand text-xs">
											{t("prevPost")}
										</span>
										<h3 className="mt-2 font-display text-lg tracking-tight transition-colors group-hover:text-brand">
											{prev.title}
										</h3>
										<p className="mt-2 text-muted-foreground text-sm leading-relaxed line-clamp-2">
											{prev.excerpt}
										</p>
									</a>
								)}
								{next && (
									<a
										href={`/blog/${next.slug}`}
										className="group border border-border/40 p-6 transition-colors hover:border-brand/30"
									>
										<span className="text-brand text-xs">
											{t("nextPost")}
										</span>
										<h3 className="mt-2 font-display text-lg tracking-tight transition-colors group-hover:text-brand">
											{next.title}
										</h3>
										<p className="mt-2 text-muted-foreground text-sm leading-relaxed line-clamp-2">
											{next.excerpt}
										</p>
									</a>
								)}
							</div>
						</>
					)}
				</div>
			</section>
		</>
	);
}
