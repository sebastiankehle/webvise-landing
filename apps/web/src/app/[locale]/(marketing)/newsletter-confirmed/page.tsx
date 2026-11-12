import { AlertTriangle, MailCheck } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { Button } from "@/components/ui/button";
import { Body, H1, InlineLink, Muted } from "@/components/ui/typography";
import { type LocaleParams, pinLocale } from "@/i18n/static-locale";
import { CAL_URL } from "@/lib/cal";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	await pinLocale(params);
	const t = await getTranslations("newsletterConfirmation");

	return {
		title: t("metaTitle"),
		robots: { index: false, follow: false },
	};
}

export default async function NewsletterConfirmedPage({
	params,
	searchParams,
}: {
	params: LocaleParams;
	searchParams: Promise<{ success?: string; error?: string; token?: string }>;
}) {
	await pinLocale(params);
	const query = await searchParams;
	const hasError = !!query.error;
	const needsConfirmation = !!query.token && !query.success;
	const t = await getTranslations("newsletterConfirmation");
	let content: ReactNode;

	if (hasError) {
		content = (
			<>
				<AlertTriangle
					className="mx-auto mb-6 h-8 w-8 text-muted-foreground"
					strokeWidth={1.5}
				/>
				<H1 className="text-2xl md:text-2xl">{t("errorTitle")}</H1>
				<Body className="mt-4 text-muted-foreground">
					{t("errorDescription")}{" "}
					<InlineLink href="mailto:mail@webvise.io">mail@webvise.io</InlineLink>
					.
				</Body>
			</>
		);
	} else if (needsConfirmation) {
		content = (
			<>
				<MailCheck
					className="mx-auto mb-6 h-8 w-8 text-muted-foreground"
					strokeWidth={1.5}
				/>
				<H1 className="text-2xl md:text-2xl">{t("pendingTitle")}</H1>
				<Body className="mt-4 text-muted-foreground">
					{t("pendingDescription")}
				</Body>
				<form action="/api/newsletter/confirm" className="mt-8" method="post">
					<input name="token" type="hidden" value={query.token} />
					<Button type="submit" variant="brand">
						{t("confirmButton")}
					</Button>
				</form>
			</>
		);
	} else {
		content = (
			<>
				<MailCheck
					className="mx-auto mb-6 h-8 w-8 text-muted-foreground"
					strokeWidth={1.5}
				/>
				<H1 className="text-2xl md:text-2xl">{t("successTitle")}</H1>
				<Body className="mt-4 text-muted-foreground">
					{t("successDescription")}
				</Body>
				<Muted className="mt-8">
					{t("projectPrompt")}{" "}
					<InlineLink href={CAL_URL}>{t("cta")}</InlineLink>
				</Muted>
			</>
		);
	}

	return (
		<article className="relative py-32 md:py-44">
			<ConstructedGrid hatch variant="page" />
			<GridContainer className="flex justify-center">
				<div className="max-w-md border border-border/40 bg-card/35 p-8 text-center md:p-10">
					{content}
				</div>
			</GridContainer>
		</article>
	);
}
