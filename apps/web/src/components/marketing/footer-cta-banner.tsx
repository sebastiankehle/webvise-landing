import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

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
					<p className="font-display text-[28px] leading-[1.15] md:text-[40px]">
						{headline}
					</p>
					<p className="mt-4 max-w-[560px] text-[15px] text-muted-foreground leading-[1.6]">
						{subtext}
					</p>
				</div>
				<Button
					size="lg"
					className="[a]:hover:!bg-brand/80 shrink-0 border-transparent bg-brand px-8 text-white"
					data-ph-capture-attribute-cta-location="footer"
					data-ph-capture-attribute-cta-variant="primary"
					// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
					render={<Link href={{ pathname: "/", hash: "contact" }} />}
				>
					{buttonText}
				</Button>
			</div>
		</div>
	);
}
