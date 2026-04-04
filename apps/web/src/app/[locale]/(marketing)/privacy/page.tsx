import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { getLegalPage } from "@/data/legal";
import { generateAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const page = getLegalPage("privacy", locale);
	return {
		title: page?.title ?? "Privacy Policy",
		description: page?.subtitle,
		alternates: generateAlternates("/privacy", locale),
	};
}

export default async function PrivacyPage() {
	const locale = await getLocale();
	const page = getLegalPage("privacy", locale);
	if (!page) notFound();
	const tt = await getTranslations("trust.blogBanner");

	return (
		<article className="mx-auto max-w-[1320px] px-6 py-32 md:py-44">
			<div className="max-w-2xl">
				<h1 className="font-display text-4xl tracking-tight md:text-5xl">
					{page.title}
				</h1>
				<p className="mt-4 text-muted-foreground leading-relaxed">{page.subtitle}</p>
			</div>

			<div className="mt-16 max-w-2xl space-y-12 text-muted-foreground leading-relaxed [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-lg [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
				{page.sections.map((section) => (
					<section key={section.heading}>
						<h2>{section.heading}</h2>
						{section.body && <p>{section.body}</p>}
						{section.items && (
							<ul>
								{section.items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						)}
					</section>
				))}
			</div>

				<div className="mt-16 flex max-w-2xl items-center gap-3 border border-border/40 p-5 text-sm">
					<Shield className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} />
					<span className="text-muted-foreground">{tt("text")}</span>
				</div>
		</article>
	);
}
