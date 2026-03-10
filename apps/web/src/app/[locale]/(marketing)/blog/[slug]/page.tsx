import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { type Block, getBlogPostBySlug, getBlogPosts } from "@/data/blog";

export function generateStaticParams() {
	return getBlogPosts("en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = getBlogPostBySlug(slug, "en");
	if (!post) return {};

	return {
		title: `${post.title} - webvise`,
		description: post.excerpt,
		keywords: post.keyword,
	};
}

function renderInline(text: string) {
	// Split on **bold** and [link text](url) patterns
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
					className="font-medium text-brand underline underline-offset-4 transition-colors hover:text-brand/80"
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

function RenderBlock({ block }: { block: Block }) {
	switch (block.type) {
		case "h2":
			return (
				<h2 className="mt-12 mb-4 font-normal text-2xl tracking-tight first:mt-0">
					{block.text}
				</h2>
			);
		case "h3":
			return (
				<h3 className="mt-8 mb-3 font-medium text-base tracking-tight">
					{block.text}
				</h3>
			);
		case "p":
			return (
				<p className="mb-5 font-light text-muted-foreground leading-relaxed last:mb-0">
					{renderInline(block.text)}
				</p>
			);
		case "ul":
			return (
				<ul className="mb-5 space-y-2 font-light text-muted-foreground text-sm leading-relaxed">
					{block.items.map((item) => (
						<li key={item} className="flex gap-3">
							<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
							<span>{renderInline(item)}</span>
						</li>
					))}
				</ul>
			);
		case "table":
			return (
				<div className="mb-5 overflow-x-auto">
					<table className="w-full border border-border/40 font-light text-sm">
						<thead>
							<tr className="border-border/40 border-b bg-muted/30">
								{block.headers.map((h) => (
									<th
										key={h}
										className="px-4 py-3 text-left font-medium text-foreground text-xs uppercase tracking-wider"
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
									className="border-border/40 border-b last:border-0 odd:bg-background even:bg-muted/20"
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

	return (
		<>
			<section className="py-20 md:py-40">
				<div className="mx-auto max-w-[1200px] px-6">
				<div>
					<div className="max-w-2xl">
						<a
								href="/blog"
								className="font-light text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								&larr; {t("backLink")}
							</a>
							<div className="mt-6 flex items-center gap-3 font-light text-muted-foreground text-xs">
								<time dateTime={post.date}>
									{new Date(post.date).toLocaleDateString("en-GB", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</time>
								<span className="text-muted-foreground/40">·</span>
								<span>
									{post.readingTime} {t("minRead")}
								</span>
							</div>
							<h1 className="mt-4 font-normal text-3xl tracking-tight md:text-5xl">
								{post.title}
							</h1>
						</div>
					</div>
				</div>
			</section>

			<SectionWrapper id="content" alternate>
				<div className="max-w-2xl">
					{post.blocks.map((block) => (
						<RenderBlock
							key={block.type + (("text" in block ? block.text : "") || "")}
							block={block}
						/>
					))}
				</div>
			</SectionWrapper>

			<SectionWrapper id="cta">
				<div className="max-w-xl">
					<h2 className="font-normal text-2xl tracking-tight">
						{t("ctaTitle")}
					</h2>
					<p className="mt-4 font-light text-muted-foreground">
						{t("ctaDescription")}
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Button
							className="border-brand bg-brand text-white [&]:hover:bg-brand/80"
							// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
							render={<a href="/#contact" />}
						>
							{t("ctaButton")}
						</Button>
						{/* biome-ignore lint/a11y/useAnchorContent: content provided by Button children */}
						<Button variant="outline" render={<a href="/blog" />}>
							{t("ctaSecondary")}
						</Button>
					</div>
				</div>
			</SectionWrapper>
		</>
	);
}
