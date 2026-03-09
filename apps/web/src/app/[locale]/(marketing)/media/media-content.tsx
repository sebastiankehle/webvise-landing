"use client";

import { useTranslations } from "next-intl";

import { BannerAsset, LogoAsset, WallpaperAsset } from "@/components/marketing/media-asset";

const VARIANTS = ["light", "dark", "brand"] as const;

export default function MediaContent({ heroSlogan }: { heroSlogan: string }) {
	const t = useTranslations("media");

	return (
		<div className="mt-16 space-y-24">
			{/* Logo */}
			<div>
				<h2 className="mb-2 font-medium text-lg">{t("logoTitle")}</h2>
				<p className="mb-8 text-muted-foreground text-sm">{t("logoDescription")}</p>
				<div className="grid gap-12 sm:grid-cols-3">
					{VARIANTS.map((v) => (
						<div key={v}>
							<p className="mb-3 font-medium text-sm">{t(`variant${v[0].toUpperCase()}${v.slice(1)}` as "variantLight" | "variantDark" | "variantBrand")}</p>
							<LogoAsset variant={v} />
						</div>
					))}
				</div>
			</div>

			{/* LinkedIn Banners - Tagline */}
			<div>
				<h2 className="mb-2 font-medium text-lg">{t("linkedinBanners")}</h2>
				<p className="mb-8 text-muted-foreground text-sm">{t("linkedinBannersDescription")}</p>
				<div className="grid gap-16">
					{VARIANTS.map((v) => (
						<div key={v}>
							<p className="mb-3 font-medium text-sm">{t(`variant${v[0].toUpperCase()}${v.slice(1)}` as "variantLight" | "variantDark" | "variantBrand")}</p>
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
				<h2 className="mb-2 font-medium text-lg">{t("linkedinBannersHero")}</h2>
				<p className="mb-8 text-muted-foreground text-sm">{t("linkedinBannersHeroDescription")}</p>
				<div className="grid gap-16">
					{VARIANTS.map((v) => (
						<div key={v}>
							<p className="mb-3 font-medium text-sm">{t(`variant${v[0].toUpperCase()}${v.slice(1)}` as "variantLight" | "variantDark" | "variantBrand")}</p>
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
				<h2 className="mb-2 font-medium text-lg">{t("desktopWallpapers")}</h2>
				<p className="mb-8 text-muted-foreground text-sm">{t("desktopWallpapersDescription")}</p>
				<div className="grid gap-16">
					{VARIANTS.map((v) => (
						<div key={v}>
							<p className="mb-3 font-medium text-sm">{t(`variant${v[0].toUpperCase()}${v.slice(1)}` as "variantLight" | "variantDark" | "variantBrand")}</p>
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
				<h2 className="mb-2 font-medium text-lg">{t("mobileWallpapers")}</h2>
				<p className="mb-8 text-muted-foreground text-sm">{t("mobileWallpapersDescription")}</p>
				<div className="grid gap-12 sm:grid-cols-3">
					{VARIANTS.map((v) => (
						<div key={v}>
							<p className="mb-3 font-medium text-sm">{t(`variant${v[0].toUpperCase()}${v.slice(1)}` as "variantLight" | "variantDark" | "variantBrand")}</p>
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
