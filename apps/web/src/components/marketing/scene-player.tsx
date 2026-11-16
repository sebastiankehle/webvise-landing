"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, type ReactNode, useContext, useRef, useState } from "react";

import { Playback } from "@/components/stageshow/kit/playback";
import { cn } from "@/lib/utils";

const button =
	"pointer-events-auto flex size-8 items-center justify-center rounded-full bg-black/60 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Pause and restart for anything that moves on its own for longer than 5 s
 * (WCAG 2.2.2). Paused, a stage shows its still and CSS animations hold
 * where they are; scenes that run on timers read `Playback` themselves.
 * Restart sets looping CSS animations back to their start in place and
 * mounts each `SceneLayer` afresh, so a scene plays from its start while
 * the text and links around it stay mounted. The buttons sit top right,
 * where the scenes' windows, pinned top left, leave margin; `controls`
 * places them elsewhere (false: none, for a card whose picture holds
 * still). A host whose scene sits inside a link wraps the link, so the
 * buttons stay out of it. Under reduced motion the scenes are stills
 * already, and without JavaScript the buttons could do nothing: both hide
 * them.
 */
export function ScenePlayer({
	children,
	className,
	controls = "top-3 right-3",
}: {
	children: ReactNode;
	className?: string;
	controls?: string | false;
}) {
	const t = useTranslations("scenes");
	const [paused, setPaused] = useState(false);
	const [run, setRun] = useState(0);
	const root = useRef<HTMLDivElement>(null);
	const restart = () => {
		setPaused(false);
		setRun((r) => r + 1);
		for (const animation of root.current?.getAnimations({ subtree: true }) ??
			[]) {
			if (
				animation instanceof CSSAnimation &&
				animation.effect?.getComputedTiming().iterations ===
					Number.POSITIVE_INFINITY
			) {
				animation.currentTime = 0;
			}
		}
	};
	return (
		<Playback.Provider value={{ paused, run }}>
			<div
				className={cn("relative", className)}
				data-scene-paused={paused || undefined}
				ref={root}
			>
				{children}
				{controls !== false && (
					<div
						className={cn(
							"pointer-events-none absolute z-20 flex gap-1.5 motion-reduce:hidden [@media(scripting:none)]:hidden",
							controls
						)}
					>
						<button
							aria-label={paused ? t("play") : t("pause")}
							className={button}
							onClick={() => setPaused((p) => !p)}
							title={paused ? t("play") : t("pause")}
							type="button"
						>
							{paused ? (
								<Play aria-hidden className="size-3.5 fill-current" />
							) : (
								<Pause aria-hidden className="size-3.5 fill-current" />
							)}
						</button>
						<button
							aria-label={t("restart")}
							className={button}
							onClick={restart}
							title={t("restart")}
							type="button"
						>
							<RotateCcw aria-hidden className="size-3.5" />
						</button>
					</div>
				)}
			</div>
		</Playback.Provider>
	);
}

/** A scene's moving layer: mounted afresh on Restart, so a scene driven by
 * a script or timers plays from its start. Wrap only what moves; text and
 * links stay outside it. */
export function SceneLayer({ children }: { children: ReactNode }) {
	const { run } = useContext(Playback);
	return <Fragment key={run}>{children}</Fragment>;
}
