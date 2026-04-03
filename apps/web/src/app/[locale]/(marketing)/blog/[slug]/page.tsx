import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import JsonLd from "@/components/json-ld";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { type Block, getBlogPostBySlug, getBlogPosts } from "@/data/blog";
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
										className="px-4 py-3 text-left font-mono text-[10px] text-foreground uppercase tracking-widest"
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
	const postUrl = localizedUrl(`/blog/${slug}`, locale);

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
			<section className="py-24 md:py-44">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="max-w-2xl">
						<Link
							href="/blog"
							className="text-muted-foreground text-sm transition-colors hover:text-foreground"
						>
							&larr; {t("backLink")}
						</Link>
						<div className="mt-8 flex items-center gap-3 font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
							<time dateTime={post.date}>
								{new Date(post.date).toLocaleDateString(locale, {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</time>
							<span className="text-border">/</span>
							<span>
								{post.readingTime} {t("minRead")}
							</span>
						</div>
						<h1 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">
							{post.title}
						</h1>
					</div>
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
				</div>
			</SectionWrapper>
		</>
	);
}
