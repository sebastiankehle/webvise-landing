import Image from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./hero-wall.css";

const shots = "/images/case-studies";

/** The frames on the wall, chosen by hand: only whole first screens and full
 * product screens, no sections cut from a page. Each column mixes projects,
 * light and dark. A wide frame is 2:1, the others 16:10, as the screens are. */
const COLUMNS: { src: string; wide?: boolean }[][] = [
	[
		{ src: `${shots}/mp-bau-construction/site-hero.webp`, wide: true },
		{ src: `${shots}/keel/hero-v2.webp` },
		{ src: `${shots}/morrow/dashboard-v3.webp` },
		{ src: `${shots}/old-world-labs/services.webp`, wide: true },
	],
	[
		{ src: `${shots}/ohyp-fintech/landing-v2.webp`, wide: true },
		{ src: `${shots}/relay/hero-v2.webp` },
		{ src: `${shots}/kernspan/hero-v2.webp` },
		{ src: `${shots}/morrow/graph-v3.webp` },
	],
	[
		{ src: `${shots}/screencurve/ask-the-film.webp`, wide: true },
		{ src: `${shots}/morrow/hero-v3.webp` },
		{ src: `${shots}/ohyp-fintech/certificate-v2.webp`, wide: true },
		{ src: `${shots}/keel/view-2.webp` },
	],
	[
		{ src: `${shots}/old-world-labs/hero.webp`, wide: true },
		{ src: `${shots}/screencurve/landing.webp`, wide: true },
		{ src: `${shots}/relay/view-3.webp` },
		{ src: `${shots}/mp-bau-construction/references.webp?v=065b54f` },
	],
	[
		{ src: `${shots}/hyyve/hero.webp`, wide: true },
		{ src: `${shots}/kernspan/assembly-v2.webp` },
		{ src: `${shots}/von-platen-coaching/view-2.webp` },
		{ src: `${shots}/old-world-labs/sectors.webp`, wide: true },
	],
];

// Each column drifts at its own pace, neighbours in opposite directions.
const SECONDS = [78, 96, 84, 104, 90];

/** The first screen's showreel: the strongest real screens of the projects
 * as one wall, turned a few degrees, its columns drifting slowly against
 * each other. Every frame is shown whole and undistorted. */
export default function HeroWall({ label }: { label: string }) {
	return (
		<div
			aria-label={label}
			className="hw relative aspect-[358/300] overflow-hidden rounded-[18px] bg-[#0b0f14] shadow-[0_0_0_1px_rgba(14,18,23,0.14),0_60px_120px_-50px_rgba(14,18,23,0.55),0_24px_48px_-32px_rgba(14,18,23,0.4)] sm:aspect-[1164/592] sm:rounded-[24px]"
			role="img"
		>
			<div className="hw-plane absolute top-1/2 left-1/2 flex">
				{COLUMNS.map((column, c) => (
					<div
						className={cn(
							"hw-col flex flex-1 flex-col",
							c % 2 === 0 ? "hw-up" : "hw-down"
						)}
						key={column[0]?.src}
						style={{ "--hw-seconds": `${SECONDS[c]}s` } as CSSProperties}
					>
						{/* The set three times: one is always in view above and below
						    the frame, so the drift loops without a seam or a gap */}
						{[0, 1, 2].map((round) =>
							column.map((shot) => (
								<span
									className="relative block overflow-hidden rounded-[10px] bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_18px_36px_-18px_rgba(0,0,0,0.8)] sm:rounded-[14px]"
									key={`${round}-${shot.src}`}
									style={{ aspectRatio: shot.wide ? "2 / 1" : "16 / 10" }}
								>
									<Image
										alt=""
										className="object-cover object-top"
										fill
										quality={80}
										sizes="(min-width: 1024px) 330px, (min-width: 640px) 30vw, 50vw"
										src={shot.src}
									/>
								</span>
							))
						)}
					</div>
				))}
			</div>
			{/* The edges sink into the stage; the middle stays clear */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_110%_at_50%_45%,transparent_55%,rgba(11,15,20,0.45)_82%,#0b0f14_100%)]"
			/>
		</div>
	);
}
