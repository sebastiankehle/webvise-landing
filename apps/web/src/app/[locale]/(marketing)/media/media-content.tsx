"use client";

import { useTranslations } from "next-intl";

import {
	BannerAsset,
	LogoAsset,
	WallpaperAsset,
} from "@/components/marketing/media-asset";
import { H4, Label, Muted } from "@/components/ui/typography";

const VARIANTS = ["light", "dark", "brand"] as const;

export default function MediaContent({ heroSlogan }: { heroSlogan: string }) {
	const t = useTranslations("media");

	return (
		<div className="mt-16 space-y-24">
			{/* Logo */}
			<div>
				<H4 className="mb-2 text-lg">{t("logoTitle")}</H4>
				<Muted className="mb-8">{t("logoDescription")}</Muted>
				<div className="grid gap-12 sm:grid-cols-3">
					{VARIANTS.map((v) => (
						<div key={v}>
							<Label className="mb-3 block font-medium text-foreground text-sm">
								{t(
									`variant${v[0].toUpperCase()}${v.slice(1)}` as
										| "variantLight"
										| "variantDark"
										| "variantBrand",
								)}
							</Label>
							<LogoAsset variant={v} />
						</div>
					))}
				</div>
			</div>

			{/* LinkedIn Banners - Tagline */}
			<div>
				<H4 className="mb-2 text-lg">{t("linkedinBanners")}</H4>
				<Muted className="mb-8">{t("linkedinBannersDescription")}</Muted>
				<div className="grid gap-16">
					{VARIANTS.map((v) => (
						<div key={v}>
							<Label className="mb-3 block font-medium text-foreground text-sm">
								{t(
									`variant${v[0].toUpperCase()}${v.slice(1)}` as
										| "variantLight"
										| "variantDark"
										| "variantBrand",
								)}
							</Label>
							<BannerAsset
								variant={v}
								width={1584}
								height={396}
								tagline={t("tagline")}
								subtitle={t("subtitle")}
								filename={`webvise-linkedin-banner-${v}.png`}
							/>
						</div>
					))}
				</div>
			</div>

			{/* LinkedIn Banners - Hero Slogan */}
			<div>
				<H4 className="mb-2 text-lg">{t("linkedinBannersHero")}</H4>
				<Muted className="mb-8">{t("linkedinBannersHeroDescription")}</Muted>
				<div className="grid gap-16">
					{VARIANTS.map((v) => (
						<div key={v}>
							<Label className="mb-3 block font-medium text-foreground text-sm">
								{t(
									`variant${v[0].toUpperCase()}${v.slice(1)}` as
										| "variantLight"
										| "variantDark"
										| "variantBrand",
								)}
							</Label>
							<BannerAsset
								variant={v}
								width={1584}
								height={396}
								tagline={heroSlogan}
								subtitle={t("subtitle")}
								filename={`webvise-linkedin-banner-hero-${v}.png`}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Desktop Wallpapers */}
			<div>
				<H4 className="mb-2 text-lg">{t("desktopWallpapers")}</H4>
				<Muted className="mb-8">{t("desktopWallpapersDescription")}</Muted>
				<div className="grid gap-16">
					{VARIANTS.map((v) => (
						<div key={v}>
							<Label className="mb-3 block font-medium text-foreground text-sm">
								{t(
									`variant${v[0].toUpperCase()}${v.slice(1)}` as
										| "variantLight"
										| "variantDark"
										| "variantBrand",
								)}
							</Label>
							<WallpaperAsset
								variant={v}
								width={2560}
								height={1440}
								tagline={t("tagline")}
								subtitle={t("subtitle")}
								filename={`webvise-wallpaper-desktop-${v}.png`}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Mobile Wallpapers */}
			<div>
				<H4 className="mb-2 text-lg">{t("mobileWallpapers")}</H4>
				<Muted className="mb-8">{t("mobileWallpapersDescription")}</Muted>
				<div className="grid gap-12 sm:grid-cols-3">
					{VARIANTS.map((v) => (
						<div key={v}>
							<Label className="mb-3 block font-medium text-foreground text-sm">
								{t(
									`variant${v[0].toUpperCase()}${v.slice(1)}` as
										| "variantLight"
										| "variantDark"
										| "variantBrand",
								)}
							</Label>
							<WallpaperAsset
								variant={v}
								width={1170}
								height={2532}
								tagline={t("tagline")}
								subtitle={t("subtitle")}
								filename={`webvise-wallpaper-mobile-${v}.png`}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
