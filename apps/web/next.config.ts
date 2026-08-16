import "@webvise-app/env/web";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ["shiki"],
	// The confirm route reads blog content at request time to pick the
	// topic-specific welcome email; without this the files are not bundled.
	outputFileTracingIncludes: {
		"/api/newsletter/confirm": ["./content/blog/**/*"],
	},
	images: {
		qualities: [75, 80, 85, 90, 95, 100],
	},
	skipTrailingSlashRedirect: true,
	async rewrites() {
		return [
			{
				source: "/ingest/static/:path*",
				destination: "https://eu-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/ingest/array/:path*",
				destination: "https://eu-assets.i.posthog.com/array/:path*",
			},
			{
				source: "/ingest/:path*",
				destination: "https://eu.i.posthog.com/:path*",
			},
		];
	},
	async redirects() {
		return [
			{
				source: "/apple-touch-icon.png",
				destination: "/apple-icon",
				permanent: false,
			},
			{
				source: "/apple-touch-icon-precomposed.png",
				destination: "/apple-icon",
				permanent: false,
			},
			{
				source: "/impressum",
				destination: "/de/impressum",
				permanent: true,
			},
			{
				source: "/datenschutz",
				destination: "/de/datenschutz",
				permanent: true,
			},
			{
				source: "/systems/ai-assisted-workflow-automation",
				destination: "/services/agentic-workflow-automation",
				permanent: true,
			},
			{
				source: "/:locale(en|de)/systems/ai-assisted-workflow-automation",
				destination: "/:locale/services/agentic-workflow-automation",
				permanent: true,
			},
			{
				source: "/services/ai-assisted-workflow-automation",
				destination: "/services/agentic-workflow-automation",
				permanent: true,
			},
			{
				source: "/:locale(en|de)/services/ai-assisted-workflow-automation",
				destination: "/:locale/services/agentic-workflow-automation",
				permanent: true,
			},
			{
				source: "/systems/:slug",
				destination: "/services/:slug",
				permanent: true,
			},
			{
				source: "/:locale(en|de)/systems/:slug",
				destination: "/:locale/services/:slug",
				permanent: true,
			},
		];
	},
};

export default withNextIntl(nextConfig);
