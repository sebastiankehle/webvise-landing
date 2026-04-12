import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { getLegalPage } from "@/data/legal";
import { generateAlternates } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const page = getLegalPage("terms", locale);
	return {
		title: page?.title ?? "Terms of Service",
		description: page?.subtitle,
		alternates: generateAlternates("/terms", locale),
	};
}

export default async function TermsPage() {
	const locale = await getLocale();
	const page = getLegalPage("terms", locale);
	if (!page) notFound();
	const tt = await getTranslations("trust.blogBanner");

	return (
		<article className="mx-auto max-w-[1320px] px-6 py-32 md:py-44">
			<div className="max-w-2xl">
				<h1 className="font-display text-[40px] leading-[1.1] md:text-[56px]">
					{page.title}
				</h1>
				<p className="mt-4 text-muted-foreground leading-[1.5]">{page.subtitle}</p>
			</div>

			<div className="mt-16 max-w-2xl space-y-12 text-muted-foreground leading-[1.5] [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-[16px] [&_h2]:leading-[21px] [&_h2]:tracking-[-0.011em] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
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
