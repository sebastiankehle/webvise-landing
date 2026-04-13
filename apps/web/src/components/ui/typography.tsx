import type * as React from "react";

import { cn } from "@/lib/utils";

/* ── Display ─────────────────────────────────────────────── */
function Display({ className, ...props }: React.ComponentProps<"h1">) {
	return (
		<h1
			data-slot="display"
			className={cn(
				"text-balance font-display text-[32px] leading-[1.08] tracking-[-0.04em] md:text-[48px]",
				className,
			)}
			{...props}
		/>
	);
}

/* ── Heading 1 ───────────────────────────────────────────── */
function H1({ className, ...props }: React.ComponentProps<"h1">) {
	return (
		<h1
			data-slot="h1"
			className={cn(
				"font-display text-[32px] leading-[1.08] tracking-[-0.04em] md:text-[48px]",
				className,
			)}
			{...props}
		/>
	);
}

/* ── Heading 2 ───────────────────────────────────────────── */
function H2({ className, ...props }: React.ComponentProps<"h2">) {
	return (
		<h2
			data-slot="h2"
			className={cn(
				"font-display text-[28px] leading-[1.1] tracking-[-0.03em] md:text-[40px]",
				className,
			)}
			{...props}
		/>
	);
}

/* ── Heading 3 ───────────────────────────────────────────── */
function H3({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="h3"
			className={cn(
				"font-display text-xl leading-[1.25] tracking-[-0.02em]",
				className,
			)}
			{...props}
		/>
	);
}

/* ── Heading 4 ───────────────────────────────────────────── */
function H4({ className, ...props }: React.ComponentProps<"h4">) {
	return (
		<h4
			data-slot="h4"
			className={cn("font-display text-base", className)}
			{...props}
		/>
	);
}

/* ── Lead (section subtitle) ─────────────────────────────── */
function Lead({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="lead"
			className={cn(
				"text-[16px] leading-[1.6] text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

/* ── Body ────────────────────────────────────────────────── */
function Body({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="body"
			className={cn("text-[15px] leading-[1.6]", className)}
			{...props}
		/>
	);
}

/* ── Muted / Secondary ───────────────────────────────────── */
function Muted({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="muted"
			className={cn(
				"text-sm leading-[1.6] text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

/* ── Small ───────────────────────────────────────────────── */
function Small({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="small"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

/* ── Caption ─────────────────────────────────────────────── */
function Caption({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="caption"
			className={cn("text-xs text-muted-foreground", className)}
			{...props}
		/>
	);
}

/* ── Label ───────────────────────────────────────────────── */
function Label({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="label"
			className={cn(
				"text-xs text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

/* ── Mono (numbers, step indicators, tech labels ONLY) ──── */
function Mono({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="mono"
			className={cn("font-mono text-xs text-muted-foreground", className)}
			{...props}
		/>
	);
}

/* ── Stat (metric values, price displays) ───────────────── */
function Stat({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="stat"
			className={cn(
				"font-display text-3xl tracking-tight text-brand md:text-[48px] md:leading-[1]",
				className,
			)}
			{...props}
		/>
	);
}

/* ── Quote mark (decorative quotation mark) ─────────────── */
function QuoteMark({ children = "\u201C", className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="quote-mark"
			className={cn(
				"block select-none font-display text-5xl leading-none text-brand/30",
				className,
			)}
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
			data-slot="display-h2"
			className={cn(
				"font-display text-[32px] leading-[1.2] tracking-[-0.03em] md:text-[36px]",
				className,
			)}
			{...props}
		/>
	);
}

/* ── Inline link ─────────────────────────────────────────── */
function InlineLink({ className, ...props }: React.ComponentProps<"a">) {
	return (
		<a
			data-slot="inline-link"
			className={cn(
				"text-sm text-foreground underline underline-offset-4 transition-colors hover:text-brand",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Display,
	H1,
	H2,
	H3,
	H4,
	Lead,
	Body,
	Muted,
	Small,
	Caption,
	Label,
	Mono,
	Stat,
	QuoteMark,
	DisplayH2,
	InlineLink,
};
