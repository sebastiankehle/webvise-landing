import Image from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./hero-wall.css";

const shots = "/images/case-studies";
const wall = "/images/home/wall";
const obsidian = "?v=20261111-eagle-obsidian";

/** A desktop screen. A wide one is 2:1, the others 16:10, as the screens
 * are. With `page`, the picture is a long page (its height over its width)
 * that scrolls inside the frame. */
interface Screen {
	page?: number;
	src: string;
	wide?: boolean;
}
/** A phone screen. With `page`, a long page that scrolls inside the frame. */
interface Phone {
	page?: number;
	src: string;
}
type Tile = Screen | { phones: [Phone, Phone] };

// The long phone captures are four screens tall, the long desktop page three.
const PHONE_PAGE = 9.1483;
// A phone frame's height over its width, on the generous side so a scrolled
// page never shows its end.
const PHONE_FRAME = 2.6;

/** The frames on the wall, chosen by hand: whole first screens and full
 * product screens, on desktop and on the phone.
 *
 * Every column holds as many wide frames as 16:10 ones, and a pair of phones
 * stands for one of each. That keeps all columns the same height, which the
 * seamless loop depends on.
 *
 * The order decides what stands in view when the page loads: the middle of
 * each column. There the wall shows Old World Labs, Märkische Projekt Bau,
 * Hyyve, Keel, Kernspan and the Obsidian vault, each pair of phones beside a
 * desktop screen. The other projects fill the rest and drift in. */
const COLUMNS: Tile[][] = [
	[
		{ src: `${shots}/ohyp-fintech/landing-v2.webp`, wide: true },
		{ src: `${shots}/relay/view-3.webp` },
		{ src: `${shots}/old-world-labs/sectors.webp`, wide: true },
		{ src: `${shots}/morrow/hero-v3.webp` },
		{ src: `${shots}/screencurve/ask-the-film.webp`, wide: true },
		{ src: `${shots}/kernspan/assembly-v2.webp` },
	],
	[
		{ src: `${shots}/ohyp-fintech/certificate-v2.webp`, wide: true },
		{ src: `${shots}/morrow/dashboard-v3.webp` },
		{ src: `${shots}/old-world-labs/hero.webp`, wide: true },
		{
			phones: [
				{ src: `${wall}/owl-phone.webp` },
				{ page: PHONE_PAGE, src: `${wall}/mpb-phone.webp` },
			],
		},
		{ src: `${shots}/keel/view-2.webp` },
	],
	[
		{ src: `${shots}/von-platen-coaching/view-2.webp` },
		{ src: `${shots}/keel/hero-v2.webp` },
		{ src: `${shots}/mp-bau-construction/site-hero.webp`, wide: true },
		{ page: 3, src: `${wall}/hyyve-page.webp`, wide: true },
		{ src: `${shots}/kernspan/hero-v2.webp` },
		{ src: `${shots}/ohyp-fintech/form-step-v2.webp`, wide: true },
	],
	[
		{ src: `${shots}/old-world-labs/services.webp`, wide: true },
		{ src: `${shots}/mp-bau-construction/team.webp?v=065b54f` },
		{
			src: `${shots}/rautenberg-pitch-engine/docx-output.webp${obsidian}`,
			wide: true,
		},
		{
			phones: [
				{ src: `${wall}/kernspan-phone.webp` },
				{ page: PHONE_PAGE, src: `${wall}/keel-phone.webp` },
			],
		},
		{ src: `${shots}/mp-bau-construction/references.webp?v=065b54f` },
	],
	[
		{
			src: `${shots}/rautenberg-pitch-engine/vault-structure.webp${obsidian}`,
			wide: true,
		},
		{ src: `${shots}/relay/hero-v2.webp` },
		{ src: `${shots}/screencurve/landing.webp`, wide: true },
		{ src: `${shots}/keel/view-1.webp` },
		{ src: `${shots}/hyyve/how-it-works.webp`, wide: true },
		{ src: `${shots}/morrow/graph-v3.webp` },
	],
];

// Each column drifts at its own pace, neighbours in opposite directions. A
// set is six frames tall, so the pace per frame matches the wall before.
const SECONDS = [117, 144, 126, 156, 135];

const frame =
	"relative block overflow-hidden rounded-[10px] bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_18px_36px_-18px_rgba(0,0,0,0.8)] sm:rounded-[14px]";
const SCREEN_SIZES = "(min-width: 1024px) 330px, (min-width: 640px) 30vw, 50vw";
const PHONE_SIZES = "(min-width: 1024px) 160px, (min-width: 640px) 14vw, 25vw";

/** What a frame shows: a still that fills it, or a long page that scrolls the
 * way a visitor scrolls it: a stretch at a time, a pause to read, then back to
 * the top. `shape` is the frame's height over its width. Each page starts at
 * its own point of the cycle, so the scrolling never happens in step. */
function Picture({
	page,
	shape,
	sizes,
	src,
}: {
	page?: number;
	shape: number;
	sizes: string;
	src: string;
}) {
	if (!page) {
		return (
			<Image
				alt=""
				className="object-cover object-top"
				fill
				quality={80}
				sizes={sizes}
				src={src}
			/>
		);
	}
	// A start point from the file name, so pages in view move at different times.
	const start =
		([...src].reduce((sum, char) => sum + char.charCodeAt(0), 0) * 7) % 15;
	return (
		<span
			className="hw-page absolute inset-x-0 top-0 block"
			style={
				{
					"--hw-page-delay": `-${start}s`,
					"--hw-page-to": `${((shape / page - 1) * 100).toFixed(2)}%`,
					aspectRatio: `1 / ${page}`,
				} as CSSProperties
			}
		>
			<Image alt="" fill quality={80} sizes={sizes} src={src} />
		</span>
	);
}

/** The first screen's showreel: real screens of the projects as one wall,
 * turned a few degrees, its columns drifting slowly against each other.
 * Every frame is shown whole and undistorted, and a few pages scroll. */
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
						key={SECONDS[c]}
						style={{ "--hw-seconds": `${SECONDS[c]}s` } as CSSProperties}
					>
						{/* The set three times: one is always in view above and below
						    the frame, so the drift loops without a seam or a gap */}
						{[0, 1, 2].map((round) =>
							column.map((tile) =>
								"phones" in tile ? (
									<span
										className="relative block"
										key={`${round}-${tile.phones[0].src}`}
									>
										{/* As tall as one wide and one 16:10 frame with the gap
										    between them */}
										<span className="hw-col invisible flex flex-col">
											<span className="block aspect-[2/1]" />
											<span className="block aspect-[16/10]" />
										</span>
										<span className="hw-pair absolute inset-0 flex">
											{tile.phones.map((phone) => (
												<span className={cn(frame, "flex-1")} key={phone.src}>
													<Picture
														page={phone.page}
														shape={PHONE_FRAME}
														sizes={PHONE_SIZES}
														src={phone.src}
													/>
												</span>
											))}
										</span>
									</span>
								) : (
									<span
										className={cn(
											frame,
											tile.wide ? "aspect-[2/1]" : "aspect-[16/10]"
										)}
										key={`${round}-${tile.src}`}
									>
										<Picture
											page={tile.page}
											shape={tile.wide ? 0.5 : 0.625}
											sizes={SCREEN_SIZES}
											src={tile.src}
										/>
									</span>
								)
							)
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
