import type * as React from "react";

import { cn } from "@/lib/utils";

/* ── Display ─────────────────────────────────────────────── */
function Display({ className, ...props }: React.ComponentProps<"h1">) {
	return (
		<h1
			className={cn(
				"text-balance font-display text-3xl text-foreground leading-tight md:text-5xl",
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
				"text-balance font-display text-3xl text-foreground leading-tight md:text-5xl",
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
				"text-balance font-display text-[1.625rem] text-foreground leading-[1.15] md:text-4xl md:leading-tight",
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
				"font-display text-foreground text-xl leading-snug",
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
			className={cn("font-display text-base text-foreground", className)}
			data-slot="h4"
			{...props}
		/>
	);
}

/* ── Lead (section subtitle) ─────────────────────────────── */
function Lead({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			className={cn("text-base text-muted-foreground leading-7", className)}
			data-slot="lead"
			{...props}
		/>
	);
}

/* ── Body ────────────────────────────────────────────────── */
function Body({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			className={cn("text-base text-foreground leading-7", className)}
			data-slot="body"
			{...props}
		/>
	);
}

/* ── Muted / Secondary ───────────────────────────────────── */
function Muted({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			className={cn("text-muted-foreground text-sm leading-6", className)}
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
				"font-display text-3xl text-brand-readable md:text-5xl md:leading-none",
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
				"block select-none font-display text-3xl text-brand-icon leading-none",
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
				"text-balance font-display text-[1.625rem] text-foreground leading-[1.15] md:text-4xl md:leading-tight",
				className
			)}
			data-slot="display-h2"
			{...props}
		/>
	);
}

const inlineLinkClassName =
	"border border-transparent text-brand-readable text-sm underline decoration-brand-border/70 underline-offset-4 outline-none transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50";

/* ── Inline link ─────────────────────────────────────────── */
function InlineLink({ className, ...props }: React.ComponentProps<"a">) {
	return (
		<a
			className={cn(inlineLinkClassName, className)}
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
	inlineLinkClassName,
	Label,
	Lead,
	Mono,
	Muted,
	QuoteMark,
	Small,
	Stat,
};
