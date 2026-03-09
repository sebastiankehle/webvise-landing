"use client";

import { usePathname } from "next/navigation";

import Logo from "@/components/logo";

/** Fast logo preloader shown on subpages only (not the homepage). */
export default function FastPreloader() {
	const pathname = usePathname();

	// Strip locale prefix (e.g. /de/blog → /blog, /en → /)
	const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
	if (pathWithoutLocale === "/") return null;

	return (
		<div className="preloader-fast" aria-hidden="true">
			<Logo className="h-10 w-10" />
		</div>
	);
}
