import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Locales removed 2026-08 (WEB-127). 410 without redirect per data-based
 * decision on the ticket: no residual traffic, no external links. */
const REMOVED_LOCALE_PREFIX = /^\/(fr|es|nl|pl|it)(?=\/|$)/;

const GONE_BODY =
	'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>410 — page removed</title></head><body><p>This page has been permanently removed. <a href="/">Go to webvise.io</a></p></body></html>';

export default function proxy(request: NextRequest) {
	if (REMOVED_LOCALE_PREFIX.test(request.nextUrl.pathname)) {
		return new NextResponse(GONE_BODY, {
			status: 410,
			headers: { "content-type": "text/html; charset=utf-8" },
		});
	}
	return intlMiddleware(request);
}

export const config = {
	matcher:
		"/((?!api|trpc|ingest|_next|_vercel|apple-icon|opengraph-image|twitter-image|.*\\..*).*)",
};
