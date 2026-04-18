import { getTranslations } from "next-intl/server";

import SectionWrapper from "@/components/marketing/section-wrapper";
import { TrackClick } from "@/components/marketing/track-click";
import { Button } from "@/components/ui/button";
import { H2, Muted } from "@/components/ui/typography";
import { Link } from "@/i18n/navigation";

export default async function MidCta() {
	const t = await getTranslations("midCta");

	return (
		<SectionWrapper id="mid-cta" dark className="!py-20 md:!py-28">
			<div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
				<div className="max-w-[640px]">
					<H2 className="text-balance">
						{t.rich("title", {
							brand: (chunks) => <span className="text-brand">{chunks}</span>,
							br: () => <br className="hidden md:block" />,
						})}
					</H2>
					<Muted className="mt-4 max-w-[560px]">{t("subtitle")}</Muted>
				</div>
				<TrackClick
					event="cta_clicked"
					properties={{
						location: "mid-cta",
						variant: "primary",
						destination: "contact",
					}}
				>
					<Button
						size="lg"
						className="[a]:hover:!bg-brand/80 shrink-0 border-transparent bg-brand px-8 text-white"
						render={<Link href={{ pathname: "/", hash: "contact" }} />}
					>
						{t("cta")}
					</Button>
				</TrackClick>
			</div>
		</SectionWrapper>
	);
}
