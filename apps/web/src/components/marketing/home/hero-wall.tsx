import Image from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./hero-wall.css";

export interface WallShot {
	alt: string;
	src: string;
}

// Each column drifts at its own pace, neighbours in opposite directions.
const SECONDS = [74, 96, 82, 104, 88, 110];

/** The first screen's showreel: every project's real screens laid out as one
 * tilted wall that drifts slowly, column against column. Nothing here is a
 * mock-up; each tile is a screen from a project page. */
export default function HeroWall({
	label,
	shots,
}: {
	label: string;
	shots: WallShot[];
}) {
	const columns = SECONDS.map((_, column) =>
		shots.filter((_shot, index) => index % SECONDS.length === column)
	);

	return (
		<div
			aria-label={label}
			className="hw relative aspect-[358/300] overflow-hidden rounded-[18px] bg-[#0b0f14] shadow-[0_0_0_1px_rgba(14,18,23,0.14),0_60px_120px_-50px_rgba(14,18,23,0.55),0_24px_48px_-32px_rgba(14,18,23,0.4)] sm:aspect-[1164/592] sm:rounded-[24px]"
			role="img"
		>
			<div className="hw-plane absolute top-1/2 left-1/2 flex">
				{columns.map((column, c) => (
					<div
						className={cn(
							"hw-col flex flex-1 flex-col",
							c % 2 === 0 ? "hw-up" : "hw-down"
						)}
						// biome-ignore lint/suspicious/noArrayIndexKey: six fixed columns
						key={c}
						style={{ "--hw-seconds": `${SECONDS[c]}s` } as CSSProperties}
					>
						{/* The set three times: one is always in view above and below
						    the frame, so the drift loops without a seam or a gap */}
						{[0, 1, 2].map((round) =>
							column.map((shot) => (
								<span
									className="relative block aspect-[16/10] overflow-hidden rounded-[10px] bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_18px_36px_-18px_rgba(0,0,0,0.8)] sm:rounded-[14px]"
									key={`${round}-${shot.src}`}
								>
									<Image
										alt=""
										className="object-cover object-left-top"
										fill
										quality={75}
										sizes="(min-width: 1024px) 340px, (min-width: 640px) 30vw, 46vw"
										src={shot.src}
									/>
								</span>
							))
						)}
					</div>
				))}
			</div>
			{/* Light falls on the middle; the edges sink into the stage */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_105%_at_50%_45%,transparent_48%,rgba(11,15,20,0.5)_80%,#0b0f14_100%)]"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-[#0b0f14]/80 to-transparent"
			/>
		</div>
	);
}
