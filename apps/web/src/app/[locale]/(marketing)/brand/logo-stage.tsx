"use client";

import { type CSSProperties, useState } from "react";

import { MARK_PARTS, WORD } from "@/components/logo";
import { cn } from "@/lib/utils";
import { GROUNDS } from "./brand-figures";
import { Option, Segmented } from "./segmented";

const STAGE_GROUNDS = ["paper", "dark", "orange"] as const;
type StageGround = (typeof STAGE_GROUNDS)[number];

const VERSIONS = ["main", "stacked", "mark"] as const;
type Version = (typeof VERSIONS)[number];

/** Each version's artwork: its bounds in its own units, the clear space (the
 * depth of the wedge at that version's scale) and its width on the stage. */
const ARTWORK: Record<
	Version,
	{
		box: readonly [number, number, number, number];
		space: number;
		width: string;
	}
> = {
	main: {
		box: [0, -16.7, 124.27, 18.2],
		space: 7.7,
		width: "w-[74%] sm:w-[58%] max-w-[620px]",
	},
	stacked: {
		box: [0, 0, 86.52, 43.565],
		space: 10.78,
		width: "w-[50%] sm:w-[34%] max-w-[360px]",
	},
	mark: {
		box: [0, 0, 30.25, 15],
		space: 7.7,
		width: "w-[40%] sm:w-[25%] max-w-[260px]",
	},
};

function Parts() {
	return (
		<>
			{MARK_PARTS.map((d) => (
				<path d={d} fill="currentColor" key={d} />
			))}
		</>
	);
}

/** The same paths as `Logo`, `StackedLogo` and `Mark`, placed the same way. */
function Artwork({ version }: { version: Version }) {
	if (version === "main") {
		return (
			<>
				<g transform="translate(0 -13.5)">
					<Parts />
				</g>
				<path
					d={WORD}
					fill="currentColor"
					transform="translate(37.507 0) scale(22.059)"
				/>
			</>
		);
	}
	if (version === "stacked") {
		return (
			<>
				<g transform="translate(22.083 0) scale(1.4)">
					<Parts />
				</g>
				<path
					d={WORD}
					fill="currentColor"
					transform="translate(-0.243 43.3) scale(22.059)"
				/>
			</>
		);
	}
	return <Parts />;
}

export interface LogoStageLabels {
	ground: string;
	grounds: Record<StageGround, string>;
	space: string;
	version: string;
	versions: Record<Version, string>;
}

/** The logo on a large ground. Viewers switch the ground, the version and the
 * clear space; the logo takes the ground's colour, as the rules set it. */
export function LogoStage({ labels }: { labels: LogoStageLabels }) {
	const [ground, setGround] = useState<StageGround>("paper");
	const [version, setVersion] = useState<Version>("main");
	const [showSpace, setShowSpace] = useState(false);

	const { background, logo, ring } = GROUNDS[ground];
	const {
		box: [bx, by, bw, bh],
		space,
		width,
	} = ARTWORK[version];
	const frame = [bx - space, by - space, bw + 2 * space, bh + 2 * space];
	const outer = `M${frame[0]} ${frame[1]}h${frame[2]}v${frame[3]}h${-frame[2]}Z`;
	const inner = `M${bx} ${by}h${bw}v${bh}h${-bw}Z`;

	return (
		<div>
			<div className="flex flex-wrap items-center gap-3">
				<Segmented label={labels.ground}>
					{STAGE_GROUNDS.map((key) => (
						<Option
							key={key}
							onClick={() => setGround(key)}
							selected={ground === key}
						>
							<span
								aria-hidden="true"
								className="size-2.5 rounded-full border border-foreground/15"
								style={{ backgroundColor: GROUNDS[key].background }}
							/>
							{labels.grounds[key]}
						</Option>
					))}
				</Segmented>
				<Segmented label={labels.version}>
					{VERSIONS.map((key) => (
						<Option
							key={key}
							onClick={() => setVersion(key)}
							selected={version === key}
						>
							{labels.versions[key]}
						</Option>
					))}
				</Segmented>
				<div className="inline-flex h-9 items-center rounded-full border border-foreground/15 p-0.5 text-sm">
					<Option
						onClick={() => setShowSpace((value) => !value)}
						selected={showSpace}
					>
						<span
							aria-hidden="true"
							className={cn(
								"size-2.5 border border-dashed transition-colors duration-150",
								showSpace ? "border-foreground" : "border-muted-foreground"
							)}
						/>
						{labels.space}
					</Option>
				</div>
			</div>

			<div
				className={cn(
					"relative mt-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.25rem] transition-[background-color,color,box-shadow] duration-300 ease-out sm:aspect-[2/1] lg:aspect-[5/2]",
					ring && "shadow-[inset_0_0_0_1px_rgba(14,18,23,0.08)]"
				)}
				style={{ backgroundColor: background, color: logo } as CSSProperties}
			>
				<svg
					aria-label={`${labels.versions[version]} · ${labels.grounds[ground]}`}
					className={cn("brand-stage-in h-auto overflow-visible", width)}
					key={version}
					role="img"
					viewBox={frame.join(" ")}
					xmlns="http://www.w3.org/2000/svg"
				>
					<g
						className="transition-opacity duration-200 ease-out"
						opacity={showSpace ? 1 : 0}
					>
						<path
							d={`${outer}${inner}`}
							fill="currentColor"
							fillOpacity="0.07"
							fillRule="evenodd"
						/>
						<path
							d={`${outer}${inner}`}
							fill="none"
							stroke="currentColor"
							strokeDasharray="5 5"
							strokeOpacity="0.5"
							strokeWidth="1.25"
							vectorEffect="non-scaling-stroke"
						/>
					</g>
					<Artwork version={version} />
				</svg>
				<p
					aria-hidden="true"
					className="absolute bottom-4 left-5 text-[0.8125rem] tabular-nums opacity-60"
				>
					{logo} / {background}
				</p>
			</div>
		</div>
	);
}
