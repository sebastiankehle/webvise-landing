import { Shield } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import JsonLd from "@/components/json-ld";
import BlogShare from "@/components/marketing/blog-share";
import ReportDownloadForm from "@/components/marketing/report-download-form";
import SectionWrapper, {
	GridFrame,
} from "@/components/marketing/section-wrapper";
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

const BOLD_RE = /^\*\*(.*?)\*\*$/;
const LINK_RE = /^\[(.*?)\]\((.*?)\)$/;

export function generateStaticParams() {
	return getBlogPosts("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
	const { locale, slug } = await params;
	setRequestLocale(locale);
	const post = getBlogPostBySlug(slug, locale);
	if (!post) {
		return {};
	}

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
			images: [
				{
					url: "/opengraph-image",
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${post.title} | webvise`,
			description,
			images: ["/twitter-image"],
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
		const boldMatch = token.match(BOLD_RE);
		if (boldMatch) {
			const innerLink = boldMatch[1].match(LINK_RE);
			if (innerLink) {
				if (innerLink[2].startsWith("http")) {
					return (
						<a
							className="font-medium text-brand-readable underline underline-offset-4 transition-colors hover:text-brand-readable"
							href={innerLink[2]}
							key={key}
							rel="noopener noreferrer"
							target="_blank"
						>
							{innerLink[1]}
						</a>
					);
				}
				return (
					<Link
						className="font-medium text-brand-readable underline underline-offset-4 transition-colors hover:text-brand-readable"
						href={innerLink[2] as "/blog"}
						key={key}
					>
						{innerLink[1]}
					</Link>
				);
			}
			return (
				<strong className="font-medium text-foreground" key={key}>
					{boldMatch[1]}
				</strong>
			);
		}
		const linkMatch = token.match(LINK_RE);
		if (linkMatch) {
			if (linkMatch[2].startsWith("http")) {
				return (
					<a
						className="text-brand-readable underline underline-offset-4 transition-colors hover:text-brand-readable"
						href={linkMatch[2]}
						key={key}
						rel="noopener noreferrer"
						target="_blank"
					>
						{linkMatch[1]}
					</a>
				);
			}
			return (
				<Link
					className="text-brand-readable underline underline-offset-4 transition-colors hover:text-brand-readable"
					href={linkMatch[2] as "/blog"}
					key={key}
				>
					{linkMatch[1]}
				</Link>
			);
		}
		return token;
	});
}

function getBlockSignature(block: Block): string {
	if ("text" in block) {
		return block.text;
	}
	if ("items" in block) {
		return block.items[0];
	}
	if ("headers" in block) {
		return block.headers.join();
	}
	if ("reportId" in block) {
		return block.reportId;
	}
	return "";
}

function getBlockKeys(blocks: Block[]) {
	const counts = new Map<string, number>();
	return blocks.map((block) => {
		const base = block.type + getBlockSignature(block);
		const n = counts.get(base) ?? 0;
		counts.set(base, n + 1);
		return n > 0 ? `${base}:${n}` : base;
	});
}

function RenderBlock({ block }: { block: Block }) {
	switch (block.type) {
		case "h2":
			return (
				<H2 className="mt-14 mb-4 text-[24px] leading-[1.2] first:mt-0 md:text-[28px]">
					{block.text}
				</H2>
			);
		case "h3":
			return <H3 className="mt-8 mb-3 text-[17px]">{block.text}</H3>;
		case "p":
			return (
				<Muted className="mb-5 text-[16px] leading-[1.75] last:mb-0">
					{renderInline(block.text)}
				</Muted>
			);
		case "ul":
			return (
				<ul className="mb-5 space-y-2 text-[15px] text-muted-foreground leading-[1.65]">
					{block.items.map((item) => (
						<li className="flex gap-3" key={item}>
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
										className="px-4 py-3 text-left font-medium text-foreground text-xs"
										key={h}
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{block.rows.map((row) => (
								<tr
									className="border-border/40 border-b last:border-0"
									key={row.join("|")}
								>
									{row.map((cell, ci) => (
										<td
											className="px-4 py-3 text-muted-foreground"
											key={`${block.headers[ci] ?? ci}:${cell}`}
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
					description={block.description}
					reportId={block.reportId}
					title={block.title}
				/>
			);
		default:
			return null;
	}
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	const { locale, slug } = await params;
	setRequestLocale(locale);
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
			<section className="relative pt-32 pb-24 md:pt-44 md:pb-36">
				{/* Constructed grid */}
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
											className="border border-border/40 px-3 py-1.5 text-foreground text-sm transition-all hover:border-brand hover:bg-brand hover:text-brand-foreground"
											key={tag}
										>
											{tag}
										</Label>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="relative mx-auto mt-10 max-w-[1320px] px-6">
					<BlogShare title={post.title} url={postUrl} />
				</div>
			</section>

			<SectionWrapper alternate id="content">
				<div className="max-w-2xl">
					{(() => {
						const keys = getBlockKeys(post.blocks);
						return post.blocks.map((block, idx) => (
							<RenderBlock block={block} key={keys[idx]} />
						));
					})()}

					{post.tags?.some((tag) =>
						["ai", "security"].some((t) => tag.toLowerCase().includes(t))
					) && (
						<div className="mt-14 flex items-center gap-3 border border-border/40 p-5 text-sm">
							<Shield
								className="h-4 w-4 shrink-0 text-brand-icon"
								strokeWidth={1.5}
							/>
							<Muted>{tt("text")}</Muted>
						</div>
					)}
				</div>
			</SectionWrapper>

			<section className="relative border-grid-line border-t pt-12 pb-28">
				{/* Constructed grid */}
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
					<BlogShare title={post.title} url={postUrl} />

					{(prev || next) && (
						<div className="mt-12 grid gap-6 md:grid-cols-2">
							{prev && (
								<Link
									className="group border border-border/40 p-6 transition-colors hover:border-brand-border"
									href={`/blog/${prev.slug}` as "/blog"}
								>
									<Caption>{t("prevPost")}</Caption>
									<H3 className="mt-2 text-lg transition-colors group-hover:text-brand-readable">
										{prev.title}
									</H3>
									<Muted className="mt-2 line-clamp-2 leading-relaxed">
										{prev.excerpt}
									</Muted>
								</Link>
							)}
							{next && (
								<Link
									className="group border border-border/40 p-6 transition-colors hover:border-brand-border"
									href={`/blog/${next.slug}` as "/blog"}
								>
									<Caption>{t("nextPost")}</Caption>
									<H3 className="mt-2 text-lg transition-colors group-hover:text-brand-readable">
										{next.title}
									</H3>
									<Muted className="mt-2 line-clamp-2 leading-relaxed">
										{next.excerpt}
									</Muted>
								</Link>
							)}
						</div>
					)}
				</div>
			</section>
		</>
	);
}
