"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import type { ReactNode } from "react";

import WhenNear from "./when-near";

type Kind = "automate" | "launch" | "operate";
type Locale = "de" | "en";

const LaunchScene = dynamic(() => import("./launch-scene"), { ssr: false });
const OperateScene = dynamic(() => import("./operate-scene"), { ssr: false });
const AutomateScene = dynamic(() => import("./automate-scene"), { ssr: false });

const scenes: Record<Kind, (locale: Locale) => ReactNode> = {
	launch: (locale) => <LaunchScene locale={locale} />,
	operate: () => <OperateScene />,
	automate: () => <AutomateScene />,
};

/** A service card's live scene. Its opening frame stands in as a picture
 * until the scene has loaded, then gives way to it. */
export default function ServiceScene({
	kind,
	locale,
}: {
	kind: Kind;
	locale: Locale;
}) {
	const openings: Record<Kind, string> = {
		automate: "/images/home/services/automate.webp",
		launch: `/images/home/services/launch-${locale}-v2.webp`,
		operate: "/images/home/services/operate-v2.webp",
	};
	const opening = openings[kind];
	return (
		<div className="group/scene absolute inset-0">
			<Image
				alt=""
				className="object-cover group-has-[.ss-stage]/scene:hidden"
				fill
				quality={90}
				sizes="(max-width: 1024px) 100vw, 400px"
				src={opening}
			/>
			<WhenNear>{scenes[kind](locale)}</WhenNear>
		</div>
	);
}
