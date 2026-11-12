import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { LegalPageShell } from "@/components/marketing/legal-page-shell";
import { InlineLink } from "@/components/ui/typography";
import { getLegalPage } from "@/data/legal";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { generateAlternates, localizedUrl } from "@/lib/seo";

const EMAIL_RE = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

function renderLine(line: string) {
	const parts = line.split(EMAIL_RE);
	if (parts.length === 1) {
		return line;
	}
	return parts.map((part) =>
		EMAIL_RE.test(part) ? (
			<InlineLink href={`mailto:${part}`} key={part}>
				{part}
			</InlineLink>
		) : (
			part
		)
	);
}

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const locale = await getLocale();
	const page = getLegalPage("imprint", locale);
	return {
		title: page?.title ?? "Imprint",
		description: page?.subtitle,
		alternates: generateAlternates("/imprint", locale),
		openGraph: {
			title: page?.title,
			description: page?.subtitle,
			siteName: "webvise",
			url: localizedUrl("/imprint", locale),
		},
	};
}

export default async function ImprintPage({
	params,
}: {
	params: LocaleParams;
}) {
	await pinLocale(params);
	const locale = await getLocale();
	const page = getLegalPage("imprint", locale);
	if (!page) {
		notFound();
	}
	const tt = await getTranslations("trust.blogBanner");

	return (
		<LegalPageShell
			page={page}
			renderBody={(body) =>
				body.split("\n").map((line, i, arr) => (
					<span key={line}>
						{renderLine(line)}
						{i < arr.length - 1 && <br />}
					</span>
				))
			}
			trustText={tt("text")}
		/>
	);
}
