"use client";

import { type ReactNode, type Ref, useRef } from "react";

import Logo from "@/components/logo";
import { AnimatedBeam } from "@/components/marketing/animated-beam";
import { cn } from "@/lib/utils";

import { MARKS, SlackColorMark } from "./project-hyyve";

/** Existing systems on both sides, one built system in the middle. The marks
 * on the left are tools a client project connects; the names on the right
 * are the ones the site's own integration answer gives. */

const node =
	"z-10 flex flex-none items-center justify-center bg-[#151a20] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]";
const TOOLS = MARKS.filter((mark) =>
	["linear", "jira", "github", "notion"].includes(mark.label)
);
const SYSTEMS = ["Stripe", "Resend", "CRM", "ERP"];

function Tool({
	children,
	ref,
}: {
	children: ReactNode;
	ref: Ref<HTMLDivElement>;
}) {
	return (
		<div className={cn(node, "size-10 rounded-full sm:size-11")} ref={ref}>
			{children}
		</div>
	);
}

function System({
	children,
	ref,
}: {
	children: ReactNode;
	ref: Ref<HTMLDivElement>;
}) {
	return (
		<div
			className={cn(
				node,
				"h-9 rounded-full px-3.5 text-[#e9edf1] text-sm sm:h-10 sm:px-4 sm:text-base"
			)}
			ref={ref}
		>
			{children}
		</div>
	);
}

export default function SystemsBeam({ internal }: { internal: string }) {
	const container = useRef<HTMLDivElement>(null);
	const hub = useRef<HTMLDivElement>(null);
	const l0 = useRef<HTMLDivElement>(null);
	const l1 = useRef<HTMLDivElement>(null);
	const l2 = useRef<HTMLDivElement>(null);
	const l3 = useRef<HTMLDivElement>(null);
	const l4 = useRef<HTMLDivElement>(null);
	const r0 = useRef<HTMLDivElement>(null);
	const r1 = useRef<HTMLDivElement>(null);
	const r2 = useRef<HTMLDivElement>(null);
	const r3 = useRef<HTMLDivElement>(null);
	const r4 = useRef<HTMLDivElement>(null);
	const left = [l1, l2, l3, l4];
	const right = [r0, r1, r2, r3];
	const beam = { pathColor: "#3a424c", pathOpacity: 0.6, pathWidth: 1.5 };

	return (
		<div
			aria-hidden="true"
			className="absolute inset-0 flex items-center justify-between px-5 sm:px-14 lg:px-28"
			ref={container}
		>
			<div className="flex flex-col gap-4 sm:gap-5">
				<Tool ref={l0}>
					<SlackColorMark className="size-5" />
				</Tool>
				{TOOLS.map((mark, index) => (
					<Tool key={mark.label} ref={left[index]}>
						<svg className="size-5" fill={mark.color} viewBox="0 0 24 24">
							<title>{mark.label}</title>
							<path d={mark.path} />
						</svg>
					</Tool>
				))}
			</div>

			<div
				className={cn(
					node,
					"size-16 rounded-[18px] sm:size-20 sm:rounded-[22px]"
				)}
				ref={hub}
			>
				<Logo className="size-9 sm:size-11" />
			</div>

			<div className="flex flex-col items-start gap-4 sm:gap-5">
				{SYSTEMS.map((name, index) => (
					<System key={name} ref={right[index]}>
						{name}
					</System>
				))}
				<System ref={r4}>{internal}</System>
			</div>

			{[l0, ...left].map((from, index) => (
				<AnimatedBeam
					{...beam}
					containerRef={container}
					delay={index * 0.5}
					duration={3.5}
					fromRef={from}
					// biome-ignore lint/suspicious/noArrayIndexKey: a fixed list of beams
					key={`in-${index}`}
					toRef={hub}
				/>
			))}
			{[...right, r4].map((to, index) => (
				<AnimatedBeam
					{...beam}
					containerRef={container}
					delay={0.25 + index * 0.5}
					duration={3.5}
					fromRef={hub}
					// biome-ignore lint/suspicious/noArrayIndexKey: a fixed list of beams
					key={`out-${index}`}
					toRef={to}
				/>
			))}
		</div>
	);
}
