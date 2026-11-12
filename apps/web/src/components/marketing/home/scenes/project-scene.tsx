"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";

import HyyveOrbit from "./project-hyyve";
import KernspanDamper from "./project-kernspan";
import type { ProjectSceneSlug } from "./project-scene-slugs";
import WhenNear from "./when-near";

type Locale = "de" | "en";

const FzScene = dynamic(() => import("./project-fz"), { ssr: false });
const KeelScene = dynamic(() => import("./project-keel"), { ssr: false });
const MpbScene = dynamic(() => import("./project-mpb"), { ssr: false });
const OwlScene = dynamic(() => import("./project-owl"), { ssr: false });
const RbScene = dynamic(() => import("./project-rb"), { ssr: false });
const ScScene = dynamic(() => import("./project-sc"), { ssr: false });
const VpScene = dynamic(() => import("./project-vp"), { ssr: false });

/** A card's picture. `live` scenes load after the page and get the opening
 * frame as a stand-in; `plain` ones are markup and render at once. */
interface Entry {
	live?: (locale: Locale) => ReactNode;
	plain?: (opening: string, sizes: string) => ReactNode;
}

/** One of the project's own screens as a framed sheet, pinned top-left and
 * run off the right and the bottom, the way the scenes set their windows. */
function Sheet({ sizes, src }: { sizes: string; src: string }) {
	return (
		<div className="absolute top-[10%] left-[7%] aspect-[16/10] w-[118%] overflow-hidden rounded-[10px] bg-card shadow-[0_0_0_1px_rgba(14,18,23,0.08),0_24px_48px_-24px_rgba(14,18,23,0.4)]">
			<Image
				alt=""
				className="object-cover object-left-top"
				fill
				sizes={sizes}
				src={src}
			/>
		</div>
	);
}

const sheet = (opening: string, sizes: string) => (
	<Sheet sizes={sizes} src={opening} />
);

const scenes: Record<ProjectSceneSlug, Entry> = {
	finanzierungszertifikat: { live: () => <FzScene /> },
	hyyve: { plain: () => <HyyveOrbit /> },
	keel: {
		plain: (opening, sizes) => (
			<>
				<Image
					alt=""
					className="object-cover object-left-top"
					fill
					sizes={sizes}
					src={opening}
				/>
				<WhenNear>
					<KeelScene />
				</WhenNear>
			</>
		),
	},
	kernspan: {
		plain: (_opening, sizes) => <KernspanDamper sizes={sizes} />,
	},
	"maerkische-projekt-bau": { live: () => <MpbScene /> },
	morrow: { plain: sheet },
	"old-world-labs": { live: () => <OwlScene /> },
	"rautenberg-pitch-engine": {
		live: (locale) => <RbScene locale={locale} />,
	},
	relay: { plain: sheet },
	screencurve: { live: (locale) => <ScScene locale={locale} /> },
	"von-platen-coaching": {
		live: (locale) => <VpScene locale={locale} />,
	},
};

/** A project card's picture: its live scene, its own illustration or one of
 * its screens. */
export default function ProjectScene({
	opening,
	sizes,
	slug,
}: {
	opening: string;
	sizes: string;
	slug: ProjectSceneSlug;
}) {
	const locale: Locale = useLocale() === "de" ? "de" : "en";
	const entry = scenes[slug];
	if (entry.plain) {
		return entry.plain(opening, sizes);
	}
	return (
		<div className="group/scene absolute inset-0">
			<Image
				alt=""
				className="object-cover group-has-[.ss-stage]/scene:hidden"
				fill
				quality={90}
				sizes={sizes}
				src={opening}
			/>
			<WhenNear>{entry.live?.(locale)}</WhenNear>
		</div>
	);
}
