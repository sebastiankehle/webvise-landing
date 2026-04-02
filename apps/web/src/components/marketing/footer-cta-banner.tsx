"use client";

import { Button } from "@/components/ui/button";
import { useFooterCta } from "./footer-cta-context";

interface FooterCtaBannerProps {
	defaultHeadline: string;
	defaultSubtext: string;
	defaultButtonText: string;
}

export default function FooterCtaBanner({
	defaultHeadline,
	defaultSubtext,
	defaultButtonText,
}: FooterCtaBannerProps) {
	const cta = useFooterCta();

	if (cta.hidden) return null;

	const headline = cta.headline ?? defaultHeadline;
	const subtext = cta.subtext ?? defaultSubtext;
	const buttonText = cta.buttonText ?? defaultButtonText;
	const buttonHref = cta.buttonHref ?? "/#contact";

	return (
		<div className="border-[--border] border-b">
			<div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center md:py-24">
				<div>
					<p className="font-display text-3xl tracking-tight md:text-4xl">
						{headline}
					</p>
					<p className="mt-3 text-sm text-muted-foreground md:text-base">
						{subtext}
					</p>
				</div>
				<div className="flex shrink-0 gap-3">
					<Button
						size="lg"
						className="shrink-0 border-transparent bg-brand px-8 text-white [&]:hover:bg-brand/80"
						data-ph-capture-attribute-cta-location="footer"
						data-ph-capture-attribute-cta-variant="primary"
						render={<a href={buttonHref} />}
					>
						{buttonText}
					</Button>
					{cta.secondaryButtonText && cta.secondaryButtonHref && (
						<Button
							size="lg"
							variant="outline"
							// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
							render={<a href={cta.secondaryButtonHref} />}
						>
							{cta.secondaryButtonText}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
