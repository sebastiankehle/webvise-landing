import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/** Locales removed 2026-08 (WEB-127). 410 without redirect per data-based
 * decision on the ticket: no residual traffic, no external links. */
const REMOVED_LOCALE_PREFIX = /^\/(fr|es|nl|pl|it)(?=\/|$)/;

/** Blog slugs culled 2026-08 (WEB-128 Phase 2). Same data-based decision:
 * never clicked, no external links, 410 without redirect. */
const DELETED_BLOG_SLUGS = new Set([
	"agent-memory-vs-context",
	"ai-agents-business-automation",
	"ai-agents-replacing-saas-subscriptions",
	"ai-labs-services-distribution",
	"ai-regulations-certifications-europe",
	"ai-zero-day-era-business-security",
	"anti-slop-content-strategy",
	"b2b-website-lead-generation",
	"build-vs-buy-software-2026",
	"business-ai-agents-untrusted-web",
	"copilot-vs-autopilot-ai-agency",
	"email-marketing-vs-website",
	"every-saas-becomes-an-agent",
	"google-ads-landing-page-checklist",
	"google-ads-vs-seo",
	"google-business-profile-guide",
	"headless-cms-explained",
	"how-to-brief-a-web-agency",
	"how-to-choose-a-web-agency",
	"how-we-build-websites",
	"intent-debt-ai-technical-debt",
	"landing-page-audit-checklist",
	"landing-page-conversion-psychology",
	"landing-page-vs-full-website",
	"local-seo-for-small-business",
	"mvp-vs-prototype-vs-proof-of-concept",
	"n8n-vs-make-vs-zapier-2026",
	"seo-after-ai-overviews",
	"seo-basics-small-business",
	"seo-mistakes-small-businesses",
	"should-i-migrate-wordpress-to-nextjs",
	"signs-you-need-custom-software",
	"signs-your-website-needs-redesign",
	"small-business-ai-tools",
	"squarespace-website-problems",
	"typo3-modernization-guide",
	"typo3-vs-nextjs-enterprise",
	"vibe-coded-mvp-tech-debt",
	"vibe-coding-trap-ai-software-needs-engineers",
	"web-agency-vs-freelancer",
	"webflow-limitations-growing-business",
	"website-copywriting-tips",
	"website-cost-2026",
	"website-not-generating-leads",
	"website-performance-for-ecommerce",
	"website-redesign-cost-2026",
	"website-redesign-signs",
	"website-speed-affects-revenue",
	"what-is-model-context-protocol",
	"what-makes-a-good-business-website",
	"will-i-lose-seo-rankings-rebuild",
	"wix-limitations-growing-business",
	"wordpress-security-2026",
	"wordpress-site-speed",
	"wordpress-vs-custom-development",
	"wordpress-vs-nextjs-for-business-website",
]);

const BLOG_PATH = /^\/(?:de\/)?blog\/([^/]+)\/?$/;

const GONE_BODY =
	'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>410 — page removed</title></head><body><p>This page has been permanently removed. <a href="/">Go to webvise.io</a></p></body></html>';

export default function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const blogSlug = pathname.match(BLOG_PATH)?.[1];
	if (
		REMOVED_LOCALE_PREFIX.test(pathname) ||
		(blogSlug !== undefined && DELETED_BLOG_SLUGS.has(blogSlug))
	) {
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
