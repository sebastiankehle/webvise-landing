"use client";

import { useTheme } from "next-themes";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
	Cloud,
	type ICloud,
	renderSimpleIcon,
	type SimpleIcon,
} from "react-icon-cloud";

import { iconCloudIcons } from "./icon-cloud-icons";

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
		minContrastRatio: isDarkSurface ? 2.6 : 1.15,
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

export default function IconCloud() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const renderedIcons = useMemo(() => {
		const isDarkSurface = resolvedTheme === "dark";

		return iconCloudIcons.map((icon) => renderCustomIcon(icon, isDarkSurface));
	}, [resolvedTheme]);

	return (
		<div className="h-[300px] w-full md:h-[400px]">
			{mounted ? <Cloud {...cloudProps}>{renderedIcons}</Cloud> : null}
		</div>
	);
}
