import type * as React from "react";

import { cn } from "@/lib/utils";

/* ── Display ─────────────────────────────────────────────── */
function Display({ className, ...props }: React.ComponentProps<"h1">) {
	return (
		<h1
			className={cn(
				"text-balance font-display text-[32px] leading-[1.08] tracking-[-0.04em] md:text-[48px]",
				className
			)}
			data-slot="display"
			{...props}
		/>
	);
}

/* ── Heading 1 ───────────────────────────────────────────── */
function H1({ className, ...props }: React.ComponentProps<"h1">) {
	return (
		<h1
			className={cn(
				"font-display text-[32px] leading-[1.08] tracking-[-0.04em] md:text-[48px]",
				className
			)}
			data-slot="h1"
			{...props}
		/>
	);
}

/* ── Heading 2 ───────────────────────────────────────────── */
function H2({ className, ...props }: React.ComponentProps<"h2">) {
	return (
		<h2
			className={cn(
				"font-display text-[28px] leading-[1.1] tracking-[-0.03em] md:text-[40px]",
				className
			)}
			data-slot="h2"
			{...props}
		/>
	);
}

/* ── Heading 3 ───────────────────────────────────────────── */
function H3({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			className={cn(
				"font-display text-xl leading-[1.25] tracking-[-0.02em]",
				className
			)}
			data-slot="h3"
			{...props}
		/>
	);
}

/* ── Heading 4 ───────────────────────────────────────────── */
function H4({ className, ...props }: React.ComponentProps<"h4">) {
	return (
		<h4
			className={cn("font-display text-base", className)}
			data-slot="h4"
			{...props}
		/>
	);
}

/* ── Lead (section subtitle) ─────────────────────────────── */
function Lead({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			className={cn(
				"text-[16px] text-muted-foreground leading-[1.6]",
				className
			)}
			data-slot="lead"
			{...props}
		/>
	);
}

/* ── Body ────────────────────────────────────────────────── */
function Body({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			className={cn("text-[15px] leading-[1.6]", className)}
			data-slot="body"
			{...props}
		/>
	);
}

/* ── Muted / Secondary ───────────────────────────────────── */
function Muted({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			className={cn("text-muted-foreground text-sm leading-[1.6]", className)}
			data-slot="muted"
			{...props}
		/>
	);
}

/* ── Small ───────────────────────────────────────────────── */
function Small({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn("text-muted-foreground text-sm", className)}
			data-slot="small"
			{...props}
		/>
	);
}

/* ── Caption ─────────────────────────────────────────────── */
function Caption({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn("text-muted-foreground text-xs", className)}
			data-slot="caption"
			{...props}
		/>
	);
}

/* ── Label ───────────────────────────────────────────────── */
function Label({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn("text-muted-foreground text-xs", className)}
			data-slot="label"
			{...props}
		/>
	);
}

/* ── Mono (numbers, step indicators, tech labels ONLY) ──── */
function Mono({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn("font-mono text-muted-foreground text-xs", className)}
			data-slot="mono"
			{...props}
		/>
	);
}

/* ── Stat (metric values, price displays) ───────────────── */
function Stat({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"font-display text-3xl text-brand tracking-tight md:text-[48px] md:leading-[1]",
				className
			)}
			data-slot="stat"
			{...props}
		/>
	);
}

/* ── Quote mark (decorative quotation mark) ─────────────── */
function QuoteMark({
	children = "\u201C",
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"block select-none font-display text-5xl text-brand/30 leading-none",
				className
			)}
			data-slot="quote-mark"
			{...props}
		>
			{children}
		</span>
	);
}

/* ── DisplayH2 (large split headings, problem statements) ─ */
function DisplayH2({ className, ...props }: React.ComponentProps<"h2">) {
	return (
		<h2
			className={cn(
				"font-display text-[32px] leading-[1.2] tracking-[-0.03em] md:text-[36px]",
				className
			)}
			data-slot="display-h2"
			{...props}
		/>
	);
}

/* ── Inline link ─────────────────────────────────────────── */
function InlineLink({ className, ...props }: React.ComponentProps<"a">) {
	return (
		<a
			className={cn(
				"text-foreground text-sm underline underline-offset-4 transition-colors hover:text-brand",
				className
			)}
			data-slot="inline-link"
			{...props}
		/>
	);
}

export {
	Body,
	Caption,
	Display,
	DisplayH2,
	H1,
	H2,
	H3,
	H4,
	InlineLink,
	Label,
	Lead,
	Mono,
	Muted,
	QuoteMark,
	Small,
	Stat,
};
