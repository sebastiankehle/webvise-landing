"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { SceneLayer } from "@/components/marketing/scene-player";
import PageScroll from "./page-scroll";
import HyyveOrbit from "./project-hyyve";
import KernspanDamper from "./project-kernspan";
import type { ProjectSceneSlug } from "./project-scene-slugs";
import WhenNear from "./when-near";

type Locale = "de" | "en";

const FzScene = dynamic(() => import("./project-fz"), { ssr: false });
const KeelScene = dynamic(() => import("./project-keel"), { ssr: false });
const MpbChatScene = dynamic(() => import("./project-mpb-chat"), {
	ssr: false,
});
const RbScene = dynamic(() => import("./project-rb"), { ssr: false });
const ScScene = dynamic(() => import("./project-sc"), { ssr: false });
const VpScene = dynamic(() => import("./project-vp"), { ssr: false });

/** A card's picture. `live` scenes load after the page and get the opening
 * frame as a stand-in; `plain` ones are markup and render at once. `name`
 * (a key of scenes.names) is what a screen reader hears for a scene. */
interface Entry {
	live?: (locale: Locale) => ReactNode;
	name?: string;
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
	finanzierungszertifikat: { live: () => <FzScene />, name: "fz" },
	hyyve: { name: "hyyveOrbit", plain: () => <HyyveOrbit /> },
	keel: {
		name: "keel",
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
		name: "kernspan",
		plain: (_opening, sizes) => <KernspanDamper sizes={sizes} />,
	},
	"maerkische-projekt-bau": { live: () => <MpbChatScene />, name: "mpbChat" },
	morrow: { plain: sheet },
	"old-world-labs": {
		name: "owlPage",
		plain: (_opening, sizes) => (
			<PageScroll
				height={3575}
				sizes={sizes}
				src="/images/case-studies/old-world-labs/fullpage.webp"
				width={1512}
			/>
		),
	},
	"rautenberg-pitch-engine": {
		live: (locale) => <RbScene locale={locale} />,
		name: "rb",
	},
	relay: { plain: sheet },
	screencurve: { live: (locale) => <ScScene locale={locale} />, name: "sc" },
	"von-platen-coaching": {
		live: (locale) => <VpScene locale={locale} />,
		name: "vp",
	},
};

/** The credit of the film still Screencurve's scene opens, set like a photo
 * credit in the strip above the scene's window (22 of its 400 design pixels),
 * flush with the window's right edge. Plain text, since the card around it
 * is a link to the project and its credits. */
function StillCredit() {
	const t = useTranslations("caseStudies.filmCredits");
	return (
		<span
			aria-hidden="true"
			className="pointer-events-none absolute inset-x-[6%] top-0 z-10 flex aspect-[400/22] items-center justify-end text-[10.5px] text-muted-foreground leading-none"
		>
			<span className="truncate">{t("still")}</span>
		</span>
	);
}

/** A project card's picture: its live scene, its own illustration or one of
 * its screens. `priority` loads the opening still at once, for a card above
 * the fold. Outside a link the scene is an image with its name. Inside a
 * card link, `describedBy` keeps it out of the link's name: the scene is
 * hidden and its name becomes the link's description, by that id. */
export default function ProjectScene({
	describedBy,
	opening,
	priority = false,
	sizes,
	slug,
}: {
	describedBy?: string;
	opening: string;
	priority?: boolean;
	sizes: string;
	slug: ProjectSceneSlug;
}) {
	const locale: Locale = useLocale() === "de" ? "de" : "en";
	const names = useTranslations("scenes.names");
	const entry = scenes[slug];
	const picture = entry.plain ? (
		<SceneLayer>{entry.plain(opening, sizes)}</SceneLayer>
	) : (
		<div className="group/scene absolute inset-0">
			{/* Laid out like the stage, so the swap does not shift: as wide as
			    the frame up to twice the scenes' 400px design width, centred,
			    pinned to the top and run off the bottom */}
			<Image
				alt=""
				className="mx-auto max-w-[800px] object-cover object-top group-has-[.ss-stage]/scene:hidden"
				fill
				priority={priority}
				quality={90}
				sizes={sizes}
				src={opening}
			/>
			<SceneLayer>
				<WhenNear>{entry.live?.(locale)}</WhenNear>
			</SceneLayer>
			{slug === "screencurve" && <StillCredit />}
		</div>
	);
	if (describedBy) {
		return (
			<div aria-hidden="true" className="absolute inset-0">
				{picture}
				<span className="sr-only" id={describedBy}>
					{entry.name ? names(entry.name) : null}
				</span>
			</div>
		);
	}
	return entry.name ? (
		<div aria-label={names(entry.name)} className="absolute inset-0" role="img">
			{picture}
		</div>
	) : (
		picture
	);
}
