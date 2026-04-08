"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
	Cloud,
	fetchSimpleIcons,
	type ICloud,
	renderSimpleIcon,
	type SimpleIcon,
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

function renderCustomIcon(icon: SimpleIcon) {
	const hex = icon.hex.replace("#", "").toLowerCase();
	// Force white/near-white icons to black
	const r = Number.parseInt(hex.slice(0, 2), 16);
	const g = Number.parseInt(hex.slice(2, 4), 16);
	const b = Number.parseInt(hex.slice(4, 6), 16);
	const effectiveIcon =
		r > 200 && g > 200 && b > 200 ? { ...icon, hex: "1a1a1a" } : icon;

	return renderSimpleIcon({
		icon: effectiveIcon,
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
	const [mounted, setMounted] = useState(false);
	const [data, setData] = useState<IconData | null>(null);

	useEffect(() => {
		setMounted(true);
		fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
	}, []);

	const renderedIcons = useMemo(() => {
		if (!data) return null;
		return Object.values(data.simpleIcons).map((icon) =>
			renderCustomIcon(icon),
		);
	}, [data]);

	return (
		<div className="h-[300px] w-full md:h-[400px]">
			{mounted && renderedIcons ? (
				<Cloud {...cloudProps}>{renderedIcons}</Cloud>
			) : null}
		</div>
	);
}
