import { Shield } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import JsonLd from "@/components/json-ld";
import { BlogNewsletterCard } from "@/components/marketing/blog-newsletter-card";
import BlogShare from "@/components/marketing/blog-share";
import { MarketingTag } from "@/components/marketing/marketing-tag";
import ReportDownloadForm from "@/components/marketing/report-download-form";
import SectionWrapper, {
	ConstructedGrid,
	DetailPageSection,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import {
	Caption,
	H1,
	H2,
	H3,
	inlineLinkClassName,
	Lead,
	Muted,
} from "@/components/ui/typography";
import {
	type Block,
	getAdjacentPosts,
	getBlogPostBySlug,
	getBlogPosts,
} from "@/data/blog";
import { topicsForTags } from "@/data/blog-topics";
import { Link } from "@/i18n/navigation";
import { homepageSectionHref } from "@/lib/homepage-section-href";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const BOLD_RE = /^\*\*(.*?)\*\*$/;
const LINK_RE = /^\[(.*?)\]\((.*?)\)$/;
const HOMEPAGE_HASH_LINK_RE = /^\/#(.+)$/;

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
			modifiedTime: post.updated,
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

function renderInline(text: string, locale: string) {
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
				return renderLink(innerLink[2], innerLink[1], key, locale);
			}
			return (
				<strong className="font-medium text-foreground" key={key}>
					{boldMatch[1]}
				</strong>
			);
		}
		const linkMatch = token.match(LINK_RE);
		if (linkMatch) {
			return renderLink(linkMatch[2], linkMatch[1], key, locale);
		}
		return token;
	});
}

function renderLink(href: string, label: string, key: string, locale: string) {
	if (href.startsWith("http")) {
		return (
			<a
				className={inlineLinkClassName}
				href={href}
				key={key}
				rel="noopener noreferrer"
				target="_blank"
			>
				{label}
			</a>
		);
	}

	const homepageHashMatch = href.match(HOMEPAGE_HASH_LINK_RE);
	// Articles link to "the contact form". That form now lives on /book.
	if (homepageHashMatch?.[1] === "contact") {
		return (
			<Link className={inlineLinkClassName} href="/book" key={key}>
				{label}
			</Link>
		);
	}
	if (homepageHashMatch) {
		return (
			<a
				className={inlineLinkClassName}
				href={homepageSectionHref(homepageHashMatch[1], locale)}
				key={key}
			>
				{label}
			</a>
		);
	}

	return (
		<Link className={inlineLinkClassName} href={href as "/blog"} key={key}>
			{label}
		</Link>
	);
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

const DIACRITICS = /[\u0300-\u036f]/g;
const NOT_WORD = /[^a-z0-9]+/g;
const EDGE_DASHES = /^-|-$/g;

/** An anchor for a heading, from its own words. */
function headingAnchor(text: string) {
	return text
		.toLowerCase()
		.normalize("NFKD")
		.replace(DIACRITICS, "")
		.replace(NOT_WORD, "-")
		.replace(EDGE_DASHES, "")
		.slice(0, 60);
}

function RenderBlock({
	anchor,
	block,
	locale,
}: {
	anchor?: string;
	block: Block;
	locale: string;
}) {
	switch (block.type) {
		case "h2":
			return (
				<H2
					className="mt-14 mb-4 scroll-mt-28 text-2xl leading-tight first:mt-0 md:text-2xl"
					id={anchor}
				>
					{block.text}
				</H2>
			);
		case "h3":
			return <H3 className="mt-8 mb-3 font-medium text-base">{block.text}</H3>;
		case "p":
			return (
				<Muted className="mb-5 break-words text-base leading-7 last:mb-0">
					{renderInline(block.text, locale)}
				</Muted>
			);
		case "callout":
			return (
				<div className="surface-card mb-8 border-brand-border border-l-2 p-5">
					<Muted className="break-words text-base leading-7">
						{renderInline(block.text, locale)}
					</Muted>
				</div>
			);
		case "ul":
			return (
				<ul className="mb-6 list-disc space-y-2 break-words pl-5 text-base text-muted-foreground leading-7 marker:text-brand-readable/50">
					{block.items.map((item) => (
						<li className="pl-1" key={item}>
							{renderInline(item, locale)}
						</li>
					))}
				</ul>
			);
		case "ol":
			return (
				<ol className="mb-6 list-decimal space-y-2 break-words pl-5 text-base text-muted-foreground leading-7 marker:text-brand-readable/50">
					{block.items.map((item) => (
						<li className="pl-1" key={item}>
							{renderInline(item, locale)}
						</li>
					))}
				</ol>
			);
		case "table":
			return (
				<div className="mb-5 max-w-full overflow-x-auto">
					<table className="w-full hyphens-none break-normal border border-border/40 text-sm">
						<thead>
							<tr className="border-border/40 border-b bg-muted/30">
								{block.headers.map((h) => (
									<th
										className="min-w-28 px-4 py-3 text-left align-top font-medium text-foreground text-sm"
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
											className="min-w-28 px-4 py-3 align-top text-muted-foreground"
											key={`${block.headers[ci] ?? ci}:${cell}`}
										>
											{renderInline(cell, locale)}
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
	const topics = topicsForTags(post.tags ?? []);

	const t = await getTranslations("blog");
	const tn = await getTranslations("blog.newsletter");
	const tschema = await getTranslations("schema");
	const tt = await getTranslations("trust.blogBanner");
	const ta = await getTranslations("about");
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
				dateModified: post.updated ?? post.date,
				author: { "@id": "https://www.webvise.io/#organization" },
				publisher: { "@id": "https://www.webvise.io/#organization" },
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
						name: tschema("home"),
						item: localizedUrl("/", locale),
					},
					{
						"@type": "ListItem",
						position: 2,
						name: tschema("blog"),
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

	// Each h2 gets an anchor; a repeated heading gets its position added.
	const anchors = new Map<number, string>();
	const headings: { anchor: string; text: string }[] = [];
	post.blocks.forEach((block, idx) => {
		if (block.type !== "h2") {
			return;
		}
		const base = headingAnchor(block.text) || `section-${idx}`;
		const anchor = headings.some((heading) => heading.anchor === base)
			? `${base}-${idx}`
			: base;
		anchors.set(idx, anchor);
		headings.push({ anchor, text: block.text });
	});

	return (
		<>
			<JsonLd data={jsonLd} />

			{/* Header */}
			<section className="relative pt-12 pb-12 md:pt-20 md:pb-16">
				<ConstructedGrid variant="page" />
				<GridContainer>
					<div className="grid min-w-0 items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
						<div className="w-full min-w-0 max-w-[20rem] sm:max-w-none">
							<Caption className="text-brand-readable">
								<time dateTime={post.date}>
									{new Date(post.date).toLocaleDateString(locale, {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</time>
								{post.updated && (
									<>
										{" \u00B7 "}
										{t("updatedOn")}{" "}
										<time dateTime={post.updated}>
											{new Date(post.updated).toLocaleDateString(locale, {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
										</time>
									</>
								)}
								{" \u00B7 "}
								{post.readingTime} {t("minRead")}
							</Caption>
							<H1 className="mt-4 max-w-full text-pretty break-words [overflow-wrap:anywhere] md:max-w-4xl md:[overflow-wrap:normal]">
								{post.title}
							</H1>
							<Lead className="mt-8 max-w-2xl">{post.excerpt}</Lead>
							{topics.length > 0 && (
								<div className="mt-6 flex flex-wrap items-center gap-2">
									{topics.map((topic) => (
										<Link
											className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
											href={{ pathname: "/blog", query: { topic } }}
											key={topic}
										>
											<MarketingTag className="hover:bg-foreground/[0.06]">
												{t(`filter.topics.${topic}`)}
											</MarketingTag>
										</Link>
									))}
								</div>
							)}
							<BlogShare
								className="mt-8"
								title={post.title}
								url={postUrl}
								withBorder={false}
							/>
						</div>

						<BlogNewsletterCard
							buttonLabel={tn("button")}
							error={tn("error")}
							placeholder={tn("placeholder")}
							success={tn("success")}
							title={tn("divider")}
						/>
					</div>
				</GridContainer>
			</section>

			<SectionWrapper className="pt-14 md:pt-20" id="content">
				<div className="grid min-w-0 items-start gap-12 lg:grid-cols-[minmax(0,42rem)_24rem] lg:gap-14">
					<article className="w-full min-w-0 max-w-full [overflow-wrap:anywhere] md:max-w-2xl">
						{(() => {
							const keys = getBlockKeys(post.blocks);
							return post.blocks.map((block, idx) => (
								<RenderBlock
									anchor={anchors.get(idx)}
									block={block}
									key={keys[idx]}
									locale={locale}
								/>
							));
						})()}

						{post.tags?.some((tag) =>
							["ai", "security"].some((t) => tag.toLowerCase().includes(t))
						) && (
							<div className="surface-card mt-14 flex items-center gap-3 p-5 text-sm">
								<Shield
									className="h-4 w-4 shrink-0 text-brand-icon"
									strokeWidth={1.5}
								/>
								<Muted>{tt("text")}</Muted>
							</div>
						)}
					</article>
					{/* Beside the text: who wrote it and where it goes */}
					<aside className="hidden lg:sticky lg:top-28 lg:block">
						<Link
							className="group/arrow flex items-center gap-3 outline-none focus-visible:underline focus-visible:underline-offset-4"
							href="/about"
						>
							<Image
								alt=""
								className="size-11 shrink-0 rounded-full object-cover"
								height={44}
								src="/images/founder.jpeg"
								width={44}
							/>
							<span className="min-w-0">
								<span className="block font-medium text-base text-foreground leading-6">
									{ta("intro.name")}
								</span>
								<span className="block text-muted-foreground text-sm leading-5">
									{ta("intro.role")}
								</span>
							</span>
						</Link>
						{headings.length > 1 && (
							<nav
								aria-label={t("contents")}
								className="mt-8 border-foreground/[0.08] border-t pt-6"
							>
								<p className="text-muted-foreground text-sm">{t("contents")}</p>
								<ol className="mt-3 grid gap-2.5">
									{headings.map((heading) => (
										<li key={heading.anchor}>
											<a
												className="text-base text-foreground/70 leading-snug outline-none transition-colors duration-150 hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:underline-offset-4"
												href={`#${heading.anchor}`}
											>
												{heading.text}
											</a>
										</li>
									))}
								</ol>
							</nav>
						)}
					</aside>
				</div>
			</SectionWrapper>

			<DetailPageSection className="pt-12 pb-28" id="post-navigation">
				{(prev || next) && (
					<div className="grid gap-6 md:grid-cols-2">
						{prev && (
							<Link
								className="surface-card group p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
								href={`/blog/${prev.slug}` as "/blog"}
							>
								<Caption className="text-brand-readable">
									{t("prevPost")}
								</Caption>
								<H3 className="mt-2 text-base">{prev.title}</H3>
								<Muted className="mt-2 line-clamp-2 leading-relaxed">
									{prev.excerpt}
								</Muted>
							</Link>
						)}
						{next && (
							<Link
								className="surface-card group p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
								href={`/blog/${next.slug}` as "/blog"}
							>
								<Caption className="text-brand-readable">
									{t("nextPost")}
								</Caption>
								<H3 className="mt-2 text-base">{next.title}</H3>
								<Muted className="mt-2 line-clamp-2 leading-relaxed">
									{next.excerpt}
								</Muted>
							</Link>
						)}
					</div>
				)}
			</DetailPageSection>
		</>
	);
}
