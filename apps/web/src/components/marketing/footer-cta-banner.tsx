import { Button } from "@/components/ui/button";

interface FooterCtaBannerProps {
	headline: string;
	subtext: string;
	buttonText: string;
}

export default function FooterCtaBanner({
	headline,
	subtext,
	buttonText,
}: FooterCtaBannerProps) {
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
				<Button
					size="lg"
					className="shrink-0 border-transparent bg-brand px-8 text-white [&]:hover:brightness-125"
					data-ph-capture-attribute-cta-location="footer"
					data-ph-capture-attribute-cta-variant="primary"
					render={<a href="/#contact" />}
				>
					{buttonText}
				</Button>
			</div>
		</div>
	);
}
