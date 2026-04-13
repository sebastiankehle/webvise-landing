import { Shield } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import JsonLd from "@/components/json-ld";
import BlogShare from "@/components/marketing/blog-share";
import ReportDownloadForm from "@/components/marketing/report-download-form";
import SectionWrapper from "@/components/marketing/section-wrapper";
import {
	Caption,
	H1,
	H2,
	H3,
	Label,
	Lead,
	Muted,
} from "@/components/ui/typography";
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
	const seen = new Map<string, number>();
	return tokens.map((token) => {
		const count = seen.get(token) ?? 0;
		seen.set(token, count + 1);
		const key = count > 0 ? `${token}:${count}` : token;
		const boldMatch = token.match(/^\*\*(.*?)\*\*$/);
		if (boldMatch) {
			const innerLink = boldMatch[1].match(/^\[(.*?)\]\((.*?)\)$/);
			if (innerLink) {
				if (innerLink[2].startsWith("http")) {
					return (
						<a
							key={key}
							href={innerLink[2]}
							className="font-medium text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
							target="_blank"
							rel="noopener noreferrer"
						>
							{innerLink[1]}
						</a>
					);
				}
				return (
					<Link
						key={key}
						href={innerLink[2] as "/blog"}
						className="font-medium text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
					>
						{innerLink[1]}
					</Link>
				);
			}
			return (
				<strong key={key} className="font-medium text-foreground">
					{boldMatch[1]}
				</strong>
			);
		}
		const linkMatch = token.match(/^\[(.*?)\]\((.*?)\)$/);
		if (linkMatch) {
			if (linkMatch[2].startsWith("http")) {
				return (
					<a
						key={key}
						href={linkMatch[2]}
						className="text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
						target="_blank"
						rel="noopener noreferrer"
					>
						{linkMatch[1]}
					</a>
				);
			}
			return (
				<Link
					key={key}
					href={linkMatch[2] as "/blog"}
					className="text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
				>
					{linkMatch[1]}
				</Link>
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
					: "headers" in block
						? block.headers.join()
						: "reportId" in block
							? block.reportId
							: "");
		const n = counts.get(base) ?? 0;
		counts.set(base, n + 1);
		return n > 0 ? `${base}:${n}` : base;
	});
}

function RenderBlock({ block }: { block: Block }) {
	switch (block.type) {
		case "h2":
			return (
				<H2 className="mt-14 mb-4 text-[26px] leading-[1.2] first:mt-0 md:text-[28px]">
					{block.text}
				</H2>
			);
		case "h3":
			return <H3 className="mt-8 mb-3 text-[17px]">{block.text}</H3>;
		case "p":
			return (
				<Muted className="mb-5 text-[16px] leading-[1.7] last:mb-0">
					{renderInline(block.text)}
				</Muted>
			);
		case "ul":
			return (
				<ul className="mb-5 space-y-2 text-[15px] text-muted-foreground leading-[1.65]">
					{block.items.map((item) => (
						<li key={item} className="flex gap-3">
							<span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand" />
							<Muted className="text-[15px] text-foreground leading-[1.65]">
								{renderInline(item)}
							</Muted>
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
										className="px-4 py-3 text-left font-medium text-foreground text-xs"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{block.rows.map((row) => (
								<tr
									key={row.join("|")}
									className="border-border/40 border-b last:border-0"
								>
									{row.map((cell, ci) => (
										<td
											key={`${block.headers[ci] ?? ci}:${cell}`}
											className="px-4 py-3 text-muted-foreground"
										>
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

			{/* Header */}
			<section className="pt-24 pb-24 md:pt-36 md:pb-36">
				<div className="mx-auto max-w-[1320px] px-6">
					<div className="grid items-start gap-12 md:grid-cols-3 md:gap-16">
						{/* Title + info */}
						<div className="md:col-span-2">
							<Caption>
								<time dateTime={post.date}>
									{new Date(post.date).toLocaleDateString(locale, {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</time>
								{" \u00B7 "}
								{post.readingTime} {t("minRead")}
							</Caption>
							<H1 className="mt-3">{post.title}</H1>
							<Lead className="mt-5 max-w-[620px]">{post.excerpt}</Lead>
						</div>

						{/* Tags box */}
						{post.tags && post.tags.length > 0 && (
							<div className="border border-border/40 p-6 md:p-8">
								<Caption className="mb-5 block">{t("tagsLabel")}</Caption>
								<div className="flex flex-wrap gap-2">
									{post.tags.map((tag) => (
										<Label
											key={tag}
											className="border border-border/40 px-3 py-1.5 text-foreground text-sm transition-all hover:border-brand hover:bg-brand hover:text-white"
										>
											{tag}
										</Label>
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

					{post.tags?.some((tag) =>
						["ai", "security"].some((t) => tag.toLowerCase().includes(t)),
					) && (
						<div className="mt-14 flex items-center gap-3 border border-border/40 p-5 text-sm">
							<Shield
								className="h-4 w-4 shrink-0 text-brand"
								strokeWidth={1.5}
							/>
							<Muted>{tt("text")}</Muted>
						</div>
					)}
				</div>
			</SectionWrapper>

			<section className="border-border/40 border-t pt-12 pb-28">
				<div className="mx-auto max-w-[1320px] px-6">
					<BlogShare url={postUrl} title={post.title} />

					{(prev || next) && (
						<>
							<div className="mt-12 grid gap-6 md:grid-cols-2">
								{prev && (
									<Link
										href={`/blog/${prev.slug}` as "/blog"}
										className="group border border-border/40 p-6 transition-colors hover:border-brand/30"
									>
										<Caption>{t("prevPost")}</Caption>
										<H3 className="mt-2 text-lg transition-colors group-hover:text-brand">
											{prev.title}
										</H3>
										<Muted className="mt-2 line-clamp-2 leading-relaxed">
											{prev.excerpt}
										</Muted>
									</Link>
								)}
								{next && (
									<Link
										href={`/blog/${next.slug}` as "/blog"}
										className="group border border-border/40 p-6 transition-colors hover:border-brand/30"
									>
										<Caption>{t("nextPost")}</Caption>
										<H3 className="mt-2 text-lg transition-colors group-hover:text-brand">
											{next.title}
										</H3>
										<Muted className="mt-2 line-clamp-2 leading-relaxed">
											{next.excerpt}
										</Muted>
									</Link>
								)}
							</div>
						</>
					)}
				</div>
			</section>
		</>
	);
}
