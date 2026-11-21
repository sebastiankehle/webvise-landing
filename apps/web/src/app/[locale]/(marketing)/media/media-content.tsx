import { useTranslations } from "next-intl";

import { ActionLink } from "@/components/marketing/action";
import { BrandNav } from "@/components/marketing/brand-nav";
import { GuideSection } from "@/components/marketing/guide-section";
import { LogoFiles } from "@/components/marketing/logo-files";
import type { Tagline } from "@/components/marketing/media-asset";
import SectionWrapper from "@/components/marketing/section-wrapper";
import { Body, H2 } from "@/components/ui/typography";
import { BannerStage, WallpaperStage } from "./media-stages";

const SECTIONS = ["logo", "linkedin", "x", "wallpapers"] as const;

/** The media kit, laid out as the brand guidelines are: a section bar, each
 * section's title beside its text, the files at full width below. */
export default function MediaContent({ tagline }: { tagline: Tagline }) {
	const t = useTranslations("media");

	return (
		<div>
			<BrandNav
				items={SECTIONS.map((id) => ({ id, label: t(`nav.${id}`) }))}
				label={t("navLabel")}
			/>

			<GuideSection
				id="logo"
				paragraphs={[t("sections.logo.body")]}
				title={t("sections.logo.title")}
			>
				<LogoFiles />
			</GuideSection>

			<GuideSection
				id="linkedin"
				paragraphs={[t("sections.linkedin.body")]}
				title={t("sections.linkedin.title")}
			>
				<BannerStage kind="linkedin" tagline={tagline} />
			</GuideSection>

			{/* X shows headers at 3:1, so the LinkedIn banner would lose its
			    sides and cut the mark at the wedge */}
			<GuideSection
				id="x"
				paragraphs={[t("sections.x.body")]}
				title={t("sections.x.title")}
			>
				<BannerStage kind="x" tagline={tagline} />
			</GuideSection>

			<GuideSection
				id="wallpapers"
				paragraphs={[t("sections.wallpapers.body")]}
				title={t("sections.wallpapers.title")}
			>
				<WallpaperStage tagline={tagline} />
			</GuideSection>

			<SectionWrapper id="questions">
				<div className="grid gap-6 lg:grid-cols-12 lg:gap-x-6">
					<H2 className="lg:col-span-5">{t("sections.closing.title")}</H2>
					<div className="lg:col-span-6 lg:col-start-7 lg:pt-2">
						<Body className="max-w-[60ch] text-foreground/75">
							{t("sections.closing.body")}
						</Body>
						<div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
							<ActionLink
								arrow
								href="/brand"
								location="media_closing"
								variant="ink"
							>
								{t("sections.closing.action")}
							</ActionLink>
							<a
								className="text-foreground underline decoration-foreground/30 underline-offset-4 outline-none transition-colors hover:decoration-foreground focus-visible:decoration-foreground"
								href="mailto:mail@webvise.io"
							>
								mail@webvise.io
							</a>
						</div>
					</div>
				</div>
			</SectionWrapper>
		</div>
	);
}
