import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { getLegalPage } from "@/data/legal";

const EMAIL_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

function renderLine(line: string) {
	const parts = line.split(EMAIL_RE);
	if (parts.length === 1) return line;
	return parts.map((part) =>
		EMAIL_RE.test(part) ? (
			<a
				key={part}
				href={`mailto:${part}`}
				className="text-foreground underline underline-offset-4"
			>
				{part}
			</a>
		) : (
			part
		),
	);
}

export const metadata: Metadata = {
	title: "Imprint - webvise",
	description:
		"Legal information and contact details for webvise, as required by German law.",
};

export default async function ImprintPage() {
	const locale = await getLocale();
	const page = getLegalPage("imprint", locale);
	if (!page) notFound();

	return (
		<article className="mx-auto max-w-[1200px] px-6 py-32 md:py-40">
			<div className="max-w-2xl">
				<h1 className="font-normal text-4xl tracking-tight md:text-5xl">
					{page.title}
				</h1>
				<p className="mt-4 font-light text-muted-foreground">
					{page.subtitle}
				</p>
			</div>

			<div className="mt-16 max-w-2xl space-y-12 font-light text-muted-foreground leading-relaxed [&_h2]:mb-4 [&_h2]:font-medium [&_h2]:text-foreground [&_h2]:text-lg">
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
