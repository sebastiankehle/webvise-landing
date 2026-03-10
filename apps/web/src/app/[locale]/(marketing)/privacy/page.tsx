import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getLegalPage } from "@/data/legal";

export const metadata: Metadata = {
	title: "Privacy Policy - webvise",
	description: "How webvise collects, uses, and protects your personal data.",
};

export default async function PrivacyPage() {
	const locale = await getLocale();
	const page = getLegalPage("privacy", locale);
	if (!page) notFound();

	return (
		<article className="mx-auto max-w-[1200px] px-6 py-32 md:py-40">
			<div className="max-w-2xl">
				<h1 className="font-normal text-4xl tracking-tight md:text-5xl">
					{page.title}
				</h1>
				<p className="mt-4 font-light text-muted-foreground">{page.subtitle}</p>
			</div>

			<div className="mt-16 max-w-2xl space-y-12 font-light text-muted-foreground leading-relaxed [&_h2]:mb-4 [&_h2]:font-medium [&_h2]:text-foreground [&_h2]:text-lg [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
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
		</article>
	);
}
