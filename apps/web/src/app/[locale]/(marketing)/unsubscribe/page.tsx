import { AlertTriangle, MailX } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
	ConstructedGrid,
	GridContainer,
} from "@/components/marketing/section-wrapper";
import { Body, H1, InlineLink, Muted } from "@/components/ui/typography";
import { CAL_URL } from "@/lib/cal";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("unsubscribe");

	return {
		title: t("metaTitle"),
		robots: { index: false, follow: false },
	};
}

export default async function UnsubscribePage({
	searchParams,
}: {
	searchParams: Promise<{ success?: string; error?: string }>;
}) {
	const params = await searchParams;
	const hasError = !!params.error;
	const t = await getTranslations("unsubscribe");

	return (
		<article className="relative py-32 md:py-44">
			<ConstructedGrid hatch variant="page" />
			<GridContainer className="flex justify-center">
				<div className="max-w-md border border-border/40 bg-card/35 p-8 text-center md:p-10">
					{hasError ? (
						<>
							<AlertTriangle
								className="mx-auto mb-6 h-8 w-8 text-muted-foreground"
								strokeWidth={1.5}
							/>
							<H1 className="text-2xl md:text-2xl">{t("errorTitle")}</H1>
							<Body className="mt-4 text-muted-foreground">
								{t("errorDescription")}{" "}
								<InlineLink href="mailto:mail@webvise.io">
									mail@webvise.io
								</InlineLink>
								.
							</Body>
						</>
					) : (
						<>
							<MailX
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
					)}
				</div>
			</GridContainer>
		</article>
	);
}
