import { Shield } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Body, H1, H2, Lead, Muted } from "@/components/ui/typography";
import { getLegalPage } from "@/data/legal";
import { generateAlternates } from "@/lib/seo";

const EMAIL_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

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
	const page = getLegalPage("imprint", locale);
	return {
		title: page?.title ?? "Imprint",
		description: page?.subtitle,
		alternates: generateAlternates("/imprint", locale),
	};
}

export default async function ImprintPage() {
	const locale = await getLocale();
	const page = getLegalPage("imprint", locale);
	if (!page) notFound();
	const tt = await getTranslations("trust.blogBanner");

	return (
		<article className="mx-auto max-w-[1320px] px-6 py-32 md:py-44">
			<div className="max-w-2xl">
				<H1>{page.title}</H1>
				<Lead className="mt-4">{page.subtitle}</Lead>
			</div>

			<div className="mt-16 max-w-2xl space-y-12">
				{page.sections.map((section) => (
					<section key={section.heading}>
						<H2 className="mb-4 text-lg md:text-lg">{section.heading}</H2>
						{section.body && (
							<Body className="text-muted-foreground leading-relaxed">
								{section.body.split("\n").map((line, i, arr) => (
									<span key={line}>
										{renderLine(line)}
										{i < arr.length - 1 && <br />}
									</span>
								))}
							</Body>
						)}
					</section>
				))}
			</div>

			<div className="mt-16 flex max-w-2xl items-center gap-3 border border-border/40 p-5">
				<Shield className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.5} />
				<Muted>{tt("text")}</Muted>
			</div>
		</article>
	);
}
