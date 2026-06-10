import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { H2, Lead } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

interface FooterCtaBannerProps {
	buttonText: string;
	headline: string;
	subtext: string;
}

export default function FooterCtaBanner({
	headline,
	subtext,
	buttonText,
}: FooterCtaBannerProps) {
	return (
		<div className="border-border border-b">
			<div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center md:py-24">
				<div>
					<H2>{headline}</H2>
					<Lead className="mt-4 max-w-[480px]">{subtext}</Lead>
				</div>
				<TrackClick
					event="cta_clicked"
					properties={{
						location: "footer",
						variant: "primary",
						destination: "contact",
					}}
				>
					<Button
						className="shrink-0 px-8"
						render={<Link href={{ pathname: "/", hash: "contact" }} />}
						size="lg"
						variant="brand"
					>
						{buttonText}
					</Button>
				</TrackClick>
			</div>
		</div>
	);
}
