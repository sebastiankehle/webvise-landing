"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { routing } from "@/i18n/routing";

const LEADING_HASH_RE = /^#/;
const TRAILING_SLASHES_RE = /\/+$/;

type RouterPushHref = Parameters<ReturnType<typeof useRouter>["push"]>[0];

function normalizePathname(pathname: string) {
	const normalized = pathname.replace(TRAILING_SLASHES_RE, "");
	return normalized || "/";
}

function stripLocale(pathname: string) {
	const normalized = normalizePathname(pathname);
	for (const locale of routing.locales) {
		const prefix = `/${locale}`;
		if (normalized === prefix) {
			return "/";
		}
		if (normalized.startsWith(`${prefix}/`)) {
			return normalized.slice(prefix.length) || "/";
		}
	}
	return normalized;
}

function localizedPathname(pathname: string, locale: string) {
	const barePathname = normalizePathname(pathname);
	if (locale === routing.defaultLocale) {
		return barePathname;
	}
	return barePathname === "/" ? `/${locale}` : `/${locale}${barePathname}`;
}

function getHashTarget(hash: string) {
	const rawId = hash.replace(LEADING_HASH_RE, "");
	if (!rawId) {
		return null;
	}

	try {
		return document.getElementById(decodeURIComponent(rawId));
	} catch {
		return document.getElementById(rawId);
	}
}

function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
	const target = getHashTarget(hash);
	if (!target) {
		return false;
	}

	target.scrollIntoView({ behavior, block: "start" });
	return true;
}

function isPlainPrimaryClick(event: MouseEvent) {
	return (
		!event.defaultPrevented &&
		event.button === 0 &&
		!event.altKey &&
		!event.ctrlKey &&
		!event.metaKey &&
		!event.shiftKey
	);
}

function getClickableAnchor(target: EventTarget | null) {
	if (!(target instanceof Element)) {
		return null;
	}

	const anchor = target.closest<HTMLAnchorElement>("a[href]");
	if (
		!anchor ||
		anchor.hasAttribute("download") ||
		(anchor.target && anchor.target !== "_self")
	) {
		return null;
	}

	return anchor;
}

function getSameOriginHashUrl(anchor: HTMLAnchorElement) {
	const rawHref = anchor.getAttribute("href");
	if (!rawHref) {
		return null;
	}

	const url = new URL(rawHref, window.location.href);
	if (url.origin !== window.location.origin || !url.hash) {
		return null;
	}

	return url;
}

function handleSamePageHash(url: URL) {
	const currentPathname = normalizePathname(window.location.pathname);
	const currentBarePathname = stripLocale(currentPathname);
	const targetBarePathname = stripLocale(url.pathname);

	if (targetBarePathname !== currentBarePathname || !getHashTarget(url.hash)) {
		return false;
	}

	const nextUrl = `${window.location.pathname}${window.location.search}${url.hash}`;
	if (window.location.hash !== url.hash) {
		window.history.pushState(null, "", nextUrl);
	}
	scrollToHash(url.hash);
	return true;
}

function getHomepageHashHref(url: URL, locale: string) {
	if (stripLocale(url.pathname) !== "/") {
		return null;
	}

	return `${localizedPathname("/", locale)}${url.search}${url.hash}`;
}

export default function HashLinkScrollManager() {
	const locale = useLocale();
	const _pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		const hash = window.location.hash;
		if (!hash) {
			return;
		}

		let timeout: number | undefined;
		const frame = window.requestAnimationFrame(() => {
			scrollToHash(hash);
			timeout = window.setTimeout(() => scrollToHash(hash), 120);
		});

		return () => {
			window.cancelAnimationFrame(frame);
			if (timeout) {
				window.clearTimeout(timeout);
			}
		};
	});

	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			if (!isPlainPrimaryClick(event)) {
				return;
			}

			const anchor = getClickableAnchor(event.target);
			if (!anchor) {
				return;
			}

			const url = getSameOriginHashUrl(anchor);
			if (!url) {
				return;
			}

			if (handleSamePageHash(url)) {
				event.preventDefault();
				return;
			}

			const homepageHashHref = getHomepageHashHref(url, locale);
			if (homepageHashHref) {
				event.preventDefault();
				router.push(homepageHashHref as RouterPushHref, { scroll: false });
			}
		};

		document.addEventListener("click", onClick, true);
		return () => document.removeEventListener("click", onClick, true);
	}, [locale, router]);

	return null;
}
