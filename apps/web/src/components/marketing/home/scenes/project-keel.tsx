"use client";

import {
	Activity,
	Boxes,
	ChevronsUpDown,
	Gauge,
	KeyRound,
	ScrollText,
	Search,
	ShieldCheck,
} from "lucide-react";
import { Stack_Sans_Headline, Stack_Sans_Text } from "next/font/google";
import { useEffect, useRef, useState } from "react";

import "./project-keel.css";

/** Keel's console, live, on the blue plane of its own landing page: an
 * agent call arrives, its scope is checked, and the row settles as allowed,
 * held or blocked. Carried over from the product's hero. */

// No fallback metrics exist for these two faces, so the adjustment is off.
// The scene sits below the first screen: its faces load with it, not ahead.
const text = Stack_Sans_Text({
	adjustFontFallback: false,
	display: "swap",
	preload: false,
	subsets: ["latin"],
});
const display = Stack_Sans_Headline({
	adjustFontFallback: false,
	display: "swap",
	preload: false,
	subsets: ["latin"],
});

type Outcome = "blocked" | "held" | "ok";

interface Call {
	agent: string;
	ms: number;
	outcome: Outcome;
	scope: string;
	tool: string;
}

interface Row extends Call {
	checking: boolean;
	id: number;
}

const call = (
	tool: string,
	agent: string,
	scope: string,
	outcome: Outcome,
	ms = 0
): Call => ({ agent, ms, outcome, scope, tool });

const POOL: Call[] = [
	call("invoices.create", "billing-agent", "write:billing", "held"),
	call("tickets.reply", "support-agent", "write:support", "ok", 38),
	call("issues.list", "triage-agent", "read:issues", "ok", 12),
	call("customers.get", "billing-agent", "read:customers", "ok", 9),
	call("repos.merge", "release-agent", "write:code", "blocked"),
	call("deals.update", "sales-agent", "write:crm", "ok", 44),
	call("docs.search", "support-agent", "read:docs", "ok", 21),
	call("refunds.create", "support-agent", "write:billing", "held"),
	call("invoices.list", "billing-agent", "read:billing", "ok", 14),
];

const DESIGN_WIDTH = 800;
const SEEDED = 7;
const KEPT = 8;
const START_COUNT = 412_807;
const STEPS = [11, 7, 16, 9, 13, 8];
const HOURS = [
	9, 11, 10, 13, 16, 15, 18, 17, 19, 18, 17, 16, 14, 13, 12, 13, 11, 10, 9, 8,
	7, 6, 6, 5,
];
const PEAK = Math.max(...HOURS);

const NAV = [
	{ icon: Gauge, label: "Overview" },
	{ icon: Boxes, label: "Tool catalog" },
	{ icon: Activity, label: "Calls", active: true },
	{ icon: KeyRound, label: "Scopes" },
	{ icon: ShieldCheck, label: "Guardrails" },
	{ icon: ScrollText, label: "Audit" },
];

const seed: Row[] = POOL.slice(0, SEEDED)
	.map((entry, id) => ({ ...entry, checking: false, id }))
	.reverse();

const TONE = {
	ok: { dot: "bg-[var(--k-ok)]", text: "text-[var(--k-ink)]" },
	held: { dot: "bg-[var(--k-brand)]", text: "text-[var(--k-brand)]" },
	blocked: { dot: "bg-[var(--k-danger)]", text: "text-[var(--k-danger)]" },
} as const;

function outcomeLabel(row: Row) {
	if (row.outcome === "ok") {
		return `200 · ${row.ms} ms`;
	}
	return row.outcome === "held"
		? "held for approval"
		: "blocked, scope missing";
}

function Result({ row }: { row: Row }) {
	if (row.checking) {
		return (
			<span className="flex items-center gap-2 text-[13px] text-[var(--k-ink3)]">
				<span className="keel-pulse size-2 rounded-full bg-[var(--k-ink4)]" />
				checking scope
			</span>
		);
	}
	const tone = TONE[row.outcome];
	return (
		<span className={`flex items-center gap-2 text-[13px] ${tone.text}`}>
			<span className={`size-2 rounded-full ${tone.dot}`} />
			{outcomeLabel(row)}
		</span>
	);
}

function KeelMark() {
	return (
		<svg
			aria-hidden="true"
			className="size-[18px] text-[var(--k-brand)]"
			viewBox="0 0 24 24"
		>
			<g fill="currentColor">
				<path d="M4.5 5.4 19.5 3.2 19.5 7.4 4.5 9.6Z" />
				<path d="M4.5 10.9 19.5 8.7 19.5 12.9 4.5 15.1Z" opacity="0.62" />
				<path d="M4.5 16.4 19.5 14.2 19.5 18.4 4.5 20.6Z" opacity="0.32" />
			</g>
		</svg>
	);
}

const columns =
	"grid grid-cols-[1.1fr_1.3fr_1fr_1fr] items-center gap-4 border-[var(--k-line)] px-5";

export default function KeelScene() {
	const root = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0);
	const [rows, setRows] = useState(seed);
	const [count, setCount] = useState(START_COUNT);

	useEffect(() => {
		const el = root.current;
		if (!el) {
			return;
		}
		const fit = new ResizeObserver(() =>
			setScale(el.clientWidth / DESIGN_WIDTH)
		);
		fit.observe(el);
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return () => fit.disconnect();
		}

		let id = SEEDED;
		let timer: ReturnType<typeof setInterval> | undefined;
		const settling = new Set<ReturnType<typeof setTimeout>>();
		const arrive = () => {
			const mine = id;
			id += 1;
			setRows((prev) =>
				[
					{ ...POOL[mine % POOL.length], checking: true, id: mine },
					...prev,
				].slice(0, KEPT)
			);
			setCount((prev) => prev + STEPS[mine % STEPS.length]);
			const settle = setTimeout(() => {
				settling.delete(settle);
				setRows((prev) =>
					prev.map((row) =>
						row.id === mine ? { ...row, checking: false } : row
					)
				);
			}, 900);
			settling.add(settle);
		};
		const seen = new IntersectionObserver(
			([entry]) => {
				clearInterval(timer);
				timer = entry?.isIntersecting ? setInterval(arrive, 2600) : undefined;
			},
			{ threshold: 0.3 }
		);
		seen.observe(el);
		return () => {
			fit.disconnect();
			seen.disconnect();
			clearInterval(timer);
			for (const settle of settling) {
				clearTimeout(settle);
			}
		};
	}, []);

	return (
		<div
			aria-hidden="true"
			className={`keel-scene absolute inset-0 overflow-hidden ${text.className}`}
			ref={root}
		>
			<div
				className="absolute top-0 left-0 h-[500px] w-[800px] origin-top-left"
				style={{
					scale: String(scale),
					visibility: scale ? "visible" : "hidden",
				}}
			>
				<div className="keel-plane absolute inset-x-0 top-[64px] bottom-0" />
				<div className="absolute top-[150px] left-[64px] w-[780px] overflow-hidden rounded-md bg-white">
					<div className="flex h-[46px] items-center gap-3 border-[var(--k-line)] border-b px-4">
						<span className="flex items-center gap-2">
							<KeelMark />
							<span
								className={`${display.className} font-medium text-[15px] tracking-[-0.03em]`}
							>
								Keel
							</span>
						</span>
						<span className="h-4 w-px bg-[var(--k-line)]" />
						<span className="flex items-center gap-1.5 text-[13px] text-[var(--k-ink2)]">
							Northwind Cloud
							<ChevronsUpDown className="size-3.5 text-[var(--k-ink4)]" />
						</span>
						<span className="ml-auto flex h-7 items-center gap-2 rounded-[5px] bg-[var(--k-ground)] px-2.5 text-[12.5px] text-[var(--k-ink3)]">
							<Search className="size-3.5" />
							Search
						</span>
					</div>

					<div className="grid grid-cols-[168px_minmax(0,1fr)]">
						<div className="flex flex-col gap-0.5 border-[var(--k-line)] border-r p-3">
							{NAV.map((item) => (
								<span
									className={`flex items-center gap-2.5 rounded-[5px] px-2.5 py-2 text-[13px] ${
										item.active
											? "bg-[var(--k-soft)] text-[var(--k-brand)]"
											: "text-[var(--k-ink2)]"
									}`}
									key={item.label}
								>
									<item.icon
										className={`size-4 ${
											item.active
												? "text-[var(--k-brand)]"
												: "text-[var(--k-ink4)]"
										}`}
									/>
									{item.label}
								</span>
							))}
						</div>

						<div className="min-w-0">
							<div className="flex items-end justify-between gap-6 px-5 pt-5 pb-4">
								<div>
									<div
										className={`${display.className} font-light text-[32px] tabular-nums leading-none tracking-[-0.02em]`}
									>
										{count.toLocaleString("en-US")}
									</div>
									<div className="mt-2 flex items-center gap-2 text-[13px] text-[var(--k-ink3)]">
										<span className="keel-pulse size-2 rounded-full bg-[var(--k-ok)]" />
										agent calls today, live
									</div>
								</div>
								<div className="flex h-[54px] items-end gap-[5px]">
									{HOURS.map((v, hour) => (
										<span
											className={`w-[7px] rounded-[1.5px] ${
												hour === HOURS.length - 1
													? "bg-[var(--k-brand)]"
													: "bg-[var(--k-bar)]"
											}`}
											// biome-ignore lint/suspicious/noArrayIndexKey: a fixed 24-hour series
											key={hour}
											style={{ height: `${Math.round((v / PEAK) * 100)}%` }}
										/>
									))}
								</div>
							</div>

							<div
								className={`${columns} h-[34px] border-y bg-[var(--k-ground)] text-[12.5px] text-[var(--k-ink3)]`}
							>
								<span>Tool</span>
								<span>Result</span>
								<span>Agent</span>
								<span>Scope</span>
							</div>
							<ul>
								{rows.map((row) => (
									<li
										className={`${columns} h-[46px] overflow-hidden border-b ${
											row.id >= SEEDED ? "keel-row-in" : ""
										}`}
										key={row.id}
									>
										<code className="truncate font-mono text-[13px]">
											{row.tool}
										</code>
										<Result row={row} />
										<span className="truncate text-[13px] text-[var(--k-ink2)]">
											{row.agent}
										</span>
										<code className="truncate font-mono text-[12.5px] text-[var(--k-ink3)]">
											{row.scope}
										</code>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
