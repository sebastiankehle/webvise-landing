import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import AnimateIn from "@/components/marketing/animate-in";
import { getBlogPosts } from "@/data/blog";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("blog");
	return {
		title: `${t("title")} — webvise`,
		description: t("subtitle"),
	};
}

export default async function BlogPage() {
	const [t, locale] = await Promise.all([
		getTranslations("blog"),
		getLocale(),
	]);
	const posts = getBlogPosts(locale);

	return (
		<section className="py-20 md:py-40">
			<div className="mx-auto max-w-[1200px] px-6">
				<AnimateIn>
					<div className="max-w-2xl">
						<h1 className="font-normal text-3xl tracking-tight md:text-5xl">
							{t("title")}
						</h1>
						<p className="mt-4 font-light text-lg text-muted-foreground">
							{t("subtitle")}
						</p>
					</div>

					<div className="mt-16 grid gap-px overflow-hidden border border-border/40 md:grid-cols-3">
						{posts.map((post) => (
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
				</AnimateIn>
			</div>
		</section>
	);
}
