"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import {
	BannerAsset,
	type Tagline,
	WallpaperAsset,
} from "@/components/marketing/media-asset";
import { Option, Segmented } from "@/components/marketing/segmented";

const VARIANTS = ["light", "inverted", "brand"] as const;
type Variant = (typeof VARIANTS)[number];

const DOTS: Record<Variant, string> = {
	light: "#f8fafb",
	inverted: "#050a0f",
	brand: "#ff8918",
};

/** The ground switch, as the brand guidelines' logo stage draws it. */
function GroundSwitch({
	onChange,
	value,
}: {
	onChange: (variant: Variant) => void;
	value: Variant;
}) {
	const t = useTranslations("media");
	return (
		<Segmented label={t("ground")}>
			{VARIANTS.map((variant) => (
				<Option
					key={variant}
					onClick={() => onChange(variant)}
					selected={value === variant}
				>
					<span
						aria-hidden="true"
						className="size-2.5 rounded-full border border-foreground/15"
						style={{ backgroundColor: DOTS[variant] }}
					/>
					{t(`grounds.${variant}`)}
				</Option>
			))}
		</Segmented>
	);
}

const BANNERS = {
	linkedin: { file: "webvise-linkedin-banner", height: 396, width: 1584 },
	x: { file: "webvise-x-banner", height: 500, width: 1500 },
} as const;

/** One banner on the chosen ground, with its download. */
export function BannerStage({
	kind,
	tagline,
}: {
	kind: keyof typeof BANNERS;
	tagline: Tagline;
}) {
	const t = useTranslations("media");
	const [variant, setVariant] = useState<Variant>("light");
	const { file, height, width } = BANNERS[kind];

	return (
		<div>
			<GroundSwitch onChange={setVariant} value={variant} />
			<div className="brand-stage-in mt-4" key={variant}>
				<BannerAsset
					filename={`${file}-${variant}.png`}
					height={height}
					subtitle={t("subtitle")}
					tagline={tagline}
					variant={variant}
					width={width}
				/>
			</div>
		</div>
	);
}

/** The desktop and the phone wallpaper side by side, on one ground. */
export function WallpaperStage({ tagline }: { tagline: Tagline }) {
	const t = useTranslations("media");
	const [variant, setVariant] = useState<Variant>("light");

	return (
		<div>
			<GroundSwitch onChange={setVariant} value={variant} />
			<div
				className="brand-stage-in mt-4 grid items-start gap-x-6 gap-y-10 lg:grid-cols-[minmax(0,1fr)_15rem]"
				key={variant}
			>
				<div>
					<p className="mb-3 text-foreground text-sm">
						{t("sections.wallpapers.desktop")}
					</p>
					<WallpaperAsset
						filename={`webvise-wallpaper-desktop-${variant}.png`}
						height={1440}
						tagline={tagline}
						variant={variant}
						width={2560}
					/>
				</div>
				<div className="w-full max-w-60 lg:max-w-none">
					<p className="mb-3 text-foreground text-sm">
						{t("sections.wallpapers.phone")}
					</p>
					<WallpaperAsset
						filename={`webvise-wallpaper-mobile-${variant}.png`}
						height={2532}
						tagline={tagline}
						variant={variant}
						width={1170}
					/>
				</div>
			</div>
		</div>
	);
}
