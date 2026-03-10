"use client";

import type { RefObject } from "react";
import { useEffect, useId, useRef, useState } from "react";

export interface AnimatedBeamProps {
	className?: string;
	containerRef: RefObject<HTMLElement | null>;
	fromRef: RefObject<HTMLElement | null>;
	toRef: RefObject<HTMLElement | null>;
	curvature?: number;
	reverse?: boolean;
	pathColor?: string;
	pathWidth?: number;
	pathOpacity?: number;
	gradientStartColor?: string;
	gradientStopColor?: string;
	delay?: number;
	duration?: number;
	startXOffset?: number;
	startYOffset?: number;
	endXOffset?: number;
	endYOffset?: number;
}

export function AnimatedBeam({
	className,
	containerRef,
	fromRef,
	toRef,
	curvature = 0,
	reverse = false,
	duration = Math.random() * 3 + 4,
	delay = 0,
	pathColor = "oklch(0.75 0.18 55 / 0.1)",
	pathWidth = 1.5,
	pathOpacity = 0.15,
	gradientStartColor = "oklch(0.75 0.18 55)",
	gradientStopColor = "oklch(0.75 0.18 55 / 0.3)",
	startXOffset = 0,
	startYOffset = 0,
	endXOffset = 0,
	endYOffset = 0,
}: AnimatedBeamProps) {
	const id = useId();
	const svgRef = useRef<SVGSVGElement>(null);
	const [pathD, setPathD] = useState("");
	const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

	const x1Values = reverse ? "90%;-10%" : "10%;110%";
	const x2Values = reverse ? "100%;0%" : "0%;100%";

	useEffect(() => {
		const updatePath = () => {
			if (containerRef.current && fromRef.current && toRef.current) {
				const containerRect = containerRef.current.getBoundingClientRect();
				const rectA = fromRef.current.getBoundingClientRect();
				const rectB = toRef.current.getBoundingClientRect();

				const svgWidth = containerRect.width;
				const svgHeight = containerRect.height;
				setSvgDimensions({ width: svgWidth, height: svgHeight });

				const startX =
					rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
				const startY =
					rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
				const endX =
					rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
				const endY =
					rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

				const controlY = startY - curvature;
				const d = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`;
				setPathD(d);
			}
		};

		const resizeObserver = new ResizeObserver(() => {
			updatePath();
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		updatePath();

		return () => {
			resizeObserver.disconnect();
		};
	}, [
		containerRef,
		fromRef,
		toRef,
		curvature,
		startXOffset,
		startYOffset,
		endXOffset,
		endYOffset,
	]);

	return (
		<svg
			ref={svgRef}
			fill="none"
			width={svgDimensions.width}
			height={svgDimensions.height}
			xmlns="http://www.w3.org/2000/svg"
			className={`pointer-events-none absolute top-0 left-0 transform-gpu ${className ?? ""}`}
			viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
			role="img"
			aria-hidden="true"
		>
			<path
				d={pathD}
				stroke={pathColor}
				strokeWidth={pathWidth}
				strokeOpacity={pathOpacity}
				strokeLinecap="round"
			/>
			<path
				d={pathD}
				strokeWidth={pathWidth}
				stroke={`url(#${id})`}
				strokeOpacity="1"
				strokeLinecap="round"
			/>
			<defs>
				<linearGradient
					className="transform-gpu"
					id={id}
					gradientUnits="userSpaceOnUse"
				>
					<animate
						attributeName="x1"
						values={x1Values}
						dur={`${duration}s`}
						begin={`${delay}s`}
						repeatCount="indefinite"
					/>
					<animate
						attributeName="x2"
						values={x2Values}
						dur={`${duration}s`}
						begin={`${delay}s`}
						repeatCount="indefinite"
					/>
					<stop stopColor={gradientStartColor} stopOpacity="0" />
					<stop stopColor={gradientStartColor} />
					<stop offset="32.5%" stopColor={gradientStopColor} />
					<stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}
