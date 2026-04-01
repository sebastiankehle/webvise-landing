import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getLegalPage } from "@/data/legal";
import { generateAlternates } from "@/lib/seo";

const EMAIL_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

function renderLine(line: string) {
	const parts = line.split(EMAIL_RE);
	if (parts.length === 1) return line;
	return parts.map((part) =>
		EMAIL_RE.test(part) ? (
			<a
				key={part}
				href={`mailto:${part}`}
				className="text-brand underline underline-offset-4 transition-opacity hover:opacity-80"
			>
				{part}
			</a>
		) : (
			part
		),
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	return {
		title: "Imprint - webvise",
		description:
			"Legal information and contact details for webvise, as required by German law.",
		alternates: generateAlternates("/imprint", locale),
	};
}

export default async function ImprintPage() {
	const locale = await getLocale();
	const page = getLegalPage("imprint", locale);
	if (!page) notFound();

	return (
		<article className="mx-auto max-w-[1320px] px-6 py-32 md:py-44">
			<div className="max-w-2xl">
				<h1 className="font-display text-4xl tracking-tight md:text-5xl">
					{page.title}
				</h1>
				<p className="mt-4 text-muted-foreground leading-relaxed">{page.subtitle}</p>
			</div>

			<div className="mt-16 max-w-2xl space-y-12 text-muted-foreground leading-relaxed [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-lg">
				{page.sections.map((section) => (
					<section key={section.heading}>
						<h2>{section.heading}</h2>
						{section.body && (
							<p>
								{section.body.split("\n").map((line, i, arr) => (
									<span key={line}>
										{renderLine(line)}
										{i < arr.length - 1 && <br />}
									</span>
								))}
							</p>
						)}
					</section>
				))}
			</div>
		</article>
	);
}
