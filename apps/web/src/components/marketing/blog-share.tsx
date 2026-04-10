"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

export default function BlogShare({
	url,
	title,
}: { url: string; title: string }) {
	const t = useTranslations("blog");
	const [copied, setCopied] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const copyLink = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard API unavailable or denied
		}
	}, [url]);

	return (
		<div className="flex items-center gap-3">
			<span className="font-mono text-muted-foreground/50 text-xs">
				{t("shareArticle")}
			</span>
			<div className="flex items-center gap-1.5">
				<button
					type="button"
					onClick={() =>
						window.open(
							`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
							"_blank",
							"noopener,noreferrer",
						)
					}
					className="flex h-8 w-8 items-center justify-center border border-border/40 text-muted-foreground transition-colors hover:border-brand hover:bg-brand hover:text-white"
					aria-label="Share on X"
				>
					<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
					</svg>
				</button>
				<button
					type="button"
					onClick={() =>
						window.open(
							`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
							"_blank",
							"noopener,noreferrer",
						)
					}
					className="flex h-8 w-8 items-center justify-center border border-border/40 text-muted-foreground transition-colors hover:border-brand hover:bg-brand hover:text-white"
					aria-label="Share on LinkedIn"
				>
					<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
					</svg>
				</button>
				<button
					type="button"
					onClick={copyLink}
					className="flex h-8 items-center gap-1.5 border border-border/40 px-2.5 text-muted-foreground transition-colors hover:border-brand hover:bg-brand hover:text-white"
					aria-label={t("copyLink")}
				>
					{copied ? (
						<Check className="h-3.5 w-3.5" />
					) : (
						<Copy className="h-3.5 w-3.5" />
					)}
					<span className="text-xs">
						{copied ? t("linkCopied") : t("copyLink")}
					</span>
				</button>
			</div>
		</div>
	);
}
