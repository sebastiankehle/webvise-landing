"use client";

import { useTheme } from "next-themes";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
	Cloud,
	type ICloud,
	type SimpleIcon,
	fetchSimpleIcons,
	renderSimpleIcon,
} from "react-icon-cloud";

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
		maxSpeed: 0.04,
		minSpeed: 0.02,
	},
};

function renderCustomIcon(icon: SimpleIcon, theme: string) {
	return renderSimpleIcon({
		icon,
		bgHex: theme === "light" ? "#fafafa" : "#080510",
		fallbackHex: theme === "light" ? "#6e6e73" : "#ffffff",
		minContrastRatio: theme === "dark" ? 2 : 1.2,
		size: 42,
		aProps: {
			href: undefined,
			target: undefined,
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
	"figma",
	"nodejs",
	"docker",
	"github",
	"openai",
	"python",
	"cloudflare",
	"linear",
	"turborepo",
	"biome",
];

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;

export default function IconCloud() {
	const [mounted, setMounted] = useState(false);
	const [data, setData] = useState<IconData | null>(null);
	const { theme } = useTheme();

	useEffect(() => {
		setMounted(true);
		fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
	}, []);

	const renderedIcons = useMemo(() => {
		if (!data) return null;
		return Object.values(data.simpleIcons).map((icon) =>
			renderCustomIcon(icon, theme || "light"),
		);
	}, [data, theme]);

	if (!mounted) {
		return <div className="h-[300px] w-full md:h-[400px]" />;
	}

	return (
		<Cloud {...cloudProps}>
			<>{renderedIcons}</>
		</Cloud>
	);
}
