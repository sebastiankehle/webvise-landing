"use client";

import Image from "next/image";
import {
	type KeyboardEvent,
	type PointerEvent,
	useEffect,
	useRef,
	useState,
} from "react";

import type { DamperStage } from "./kernspan/damper-stage";

const TICKS = 34;
const STAGE_GROUND = "#1f262d";
const STILL = "/images/case-studies/kernspan/damper.webp";

/** Kernspan's damper, rendered live: it comes apart and goes back together
 * on a loop. With `rail`, the project's own tick rail sits under it and
 * scrubs the sequence by pointer or arrow keys. Three.js loads only once the
 * picture is near the screen; until then, and without WebGL, the still shows. */
export default function KernspanDamper({
	label,
	rail = false,
	sizes,
}: {
	label?: string;
	rail?: boolean;
	sizes: string;
}) {
	const host = useRef<HTMLDivElement>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const railRef = useRef<HTMLDivElement>(null);
	const stage = useRef<DamperStage | null>(null);
	const dragging = useRef(false);
	const [live, setLive] = useState(false);
	const [journey, setJourney] = useState(0);

	useEffect(() => {
		const el = host.current;
		if (!el) {
			return;
		}
		let gone = false;
		const mount = async () => {
			const { mountDamper } = await import("./kernspan/damper-stage");
			if (gone || !canvas.current) {
				return;
			}
			try {
				stage.current = mountDamper(canvas.current, el, {
					// With the rail, the part keeps the band it sits in clear.
					inset: rail ? 60 : 0,
					onJourney: (j) => {
						if (!dragging.current) {
							setJourney(Math.round(j * 200) / 200);
						}
					},
					onReady: () => setLive(true),
				});
			} catch {
				// No WebGL: the still stays.
			}
		};
		const seen = new IntersectionObserver(
			([entry]) => stage.current?.setRunning(Boolean(entry?.isIntersecting)),
			{ threshold: 0.2 }
		);
		const near = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					near.disconnect();
					mount().then(() => seen.observe(el));
				}
			},
			{ rootMargin: "400px" }
		);
		near.observe(el);
		return () => {
			gone = true;
			near.disconnect();
			seen.disconnect();
			stage.current?.dispose();
			stage.current = null;
		};
	}, [rail]);

	const scrubTo = (value: number) => {
		const next = Math.min(1, Math.max(0, value));
		setJourney(next);
		stage.current?.scrub(next);
	};
	const scrubFromPointer = (event: PointerEvent<HTMLDivElement>) => {
		const rect = railRef.current?.getBoundingClientRect();
		if (rect) {
			scrubTo((event.clientX - rect.left) / rect.width);
		}
	};
	const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
		event.currentTarget.setPointerCapture(event.pointerId);
		dragging.current = true;
		scrubFromPointer(event);
	};
	const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		if (dragging.current) {
			scrubFromPointer(event);
		}
	};
	const letGo = () => {
		dragging.current = false;
		stage.current?.release();
	};
	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const step = event.shiftKey ? 0.1 : 0.035;
		const target = {
			ArrowDown: journey - step,
			ArrowLeft: journey - step,
			ArrowRight: journey + step,
			ArrowUp: journey + step,
			End: 1,
			Home: 0,
		}[event.key];
		if (target !== undefined) {
			event.preventDefault();
			scrubTo(target);
		}
	};

	const active = Math.round(journey * (TICKS - 1));

	return (
		<div
			className="absolute inset-0 overflow-hidden"
			ref={host}
			style={{ backgroundColor: STAGE_GROUND }}
		>
			<Image
				alt=""
				className="object-cover"
				fill
				quality={90}
				sizes={sizes}
				src={STILL}
			/>
			<canvas
				className={`absolute inset-0 size-full transition-opacity duration-500 ${
					live ? "opacity-100" : "opacity-0"
				}`}
				ref={canvas}
			/>
			{rail && live ? (
				<div
					aria-label={label}
					aria-valuemax={100}
					aria-valuemin={0}
					aria-valuenow={Math.round(journey * 100)}
					className="absolute bottom-4 left-1/2 flex h-8 w-[min(14.5rem,calc(100%-2rem))] -translate-x-1/2 cursor-ew-resize touch-none select-none items-center justify-between rounded-[0.875rem] bg-[#161b20] px-3 outline-none ring-1 ring-white/10 focus-visible:ring-2 focus-visible:ring-[#cae1f6]/60"
					onBlur={letGo}
					onKeyDown={onKeyDown}
					onPointerCancel={letGo}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={letGo}
					ref={railRef}
					role="slider"
					tabIndex={0}
				>
					{Array.from({ length: TICKS }, (_, tick) => (
						<span
							aria-hidden="true"
							className={`h-3.5 w-px transition-[background-color,transform] duration-200 ${
								tick === active
									? "scale-y-[1.45] bg-[#cae1f6]"
									: "bg-[#8d99a5]/45"
							}`}
							// biome-ignore lint/suspicious/noArrayIndexKey: a fixed row of ticks
							key={tick}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}
