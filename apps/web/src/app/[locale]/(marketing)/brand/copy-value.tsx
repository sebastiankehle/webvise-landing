"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const COPIED_MS = 1600;

/** A colour value that copies itself on click. The press scales to 0.97 in
 * 150 ms, as the site's buttons do, and the icon turns into a check. */
export function CopyValue({
	copiedLabel,
	copyLabel,
	tone,
	value,
}: {
	copiedLabel: string;
	copyLabel: string;
	/** Which ground the value sits on, for the hover tint. */
	tone: "light" | "dark";
	value: string;
}) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => () => clearTimeout(timer.current), []);

	async function copy() {
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			return;
		}
		setCopied(true);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setCopied(false), COPIED_MS);
	}

	return (
		<button
			aria-label={`${copyLabel}: ${value}`}
			className={cn(
				"-mx-2 flex items-center gap-2 rounded-sm px-2 py-1 text-left text-sm outline-none transition-[background-color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-current active:scale-[0.97]",
				tone === "dark" ? "hover:bg-white/10" : "hover:bg-black/[0.06]"
			)}
			onClick={copy}
			type="button"
		>
			<span>{value}</span>
			{copied ? (
				<Check aria-hidden="true" className="size-3.5 shrink-0" />
			) : (
				<Copy aria-hidden="true" className="size-3.5 shrink-0 opacity-60" />
			)}
			<span aria-live="polite" className="sr-only">
				{copied ? copiedLabel : ""}
			</span>
		</button>
	);
}
