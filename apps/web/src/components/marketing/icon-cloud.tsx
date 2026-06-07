"use client";

import { useTheme } from "next-themes";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
	Cloud,
	fetchSimpleIcons,
	type ICloud,
	renderSimpleIcon,
	type SimpleIcon,
} from "react-icon-cloud";

import { DARK_THEME_IDS } from "@/lib/themes";

const darkThemeIds = new Set<string>(DARK_THEME_IDS);
const darkSurfaceFallbackHex = "#f4f1ea";

const cloudProps: Omit<ICloud, "children"> = {
	containerProps: {
		style: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
		},
	},
	options: {
		reverse: true,
		depth: 1,
		wheelZoom: false,
		imageScale: 2,
		activeCursor: "default",
		tooltip: "native",
		initial: [0.1, -0.1],
		clickToFront: 500,
		tooltipDelay: 0,
		outlineColour: "#0000",
		minBrightness: 0.55,
		maxSpeed: 0.04,
		minSpeed: 0.02,
	},
};

function renderCustomIcon(icon: SimpleIcon, isDarkSurface: boolean) {
	return renderSimpleIcon({
		bgHex: isDarkSurface ? "#101416" : "#ffffff",
		fallbackHex: isDarkSurface ? darkSurfaceFallbackHex : "#1f1712",
		icon,
		minContrastRatio: 2.6,
		size: 42,
		aProps: {
			href: "/",
			target: "_self",
			rel: undefined,
			onClick: (e: ReactMouseEvent<HTMLAnchorElement>) => e.preventDefault(),
			style: {
				outline: "none",
				border: "none",
				textDecoration: "none",
			},
		},
	});
}

const iconSlugs = [
	"typescript",
	"react",
	"nextdotjs",
	"tailwindcss",
	"vercel",
	"nodedotjs",
	"docker",
	"github",
	"linear",
	"turborepo",
	"biome",
	"posthog",
	"sentry",
	"drizzle",
	"redis",
	"trpc",
	"postgresql",
	"hono",
	"pnpm",
	"openai",
	"claude",
	"googlegemini",
];

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;

export default function IconCloud() {
	const { resolvedTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [data, setData] = useState<IconData | null>(null);

	useEffect(() => {
		setMounted(true);
		fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
	}, []);

	const renderedIcons = useMemo(() => {
		if (!data) {
			return null;
		}
		const activeTheme = theme === "system" ? resolvedTheme : theme;
		const isDarkSurface = activeTheme ? darkThemeIds.has(activeTheme) : false;

		return Object.values(data.simpleIcons).map((icon) =>
			renderCustomIcon(icon, isDarkSurface)
		);
	}, [data, resolvedTheme, theme]);

	return (
		<div className="h-[300px] w-full md:h-[400px]">
			{mounted && renderedIcons ? (
				<Cloud {...cloudProps}>{renderedIcons}</Cloud>
			) : null}
		</div>
	);
}
