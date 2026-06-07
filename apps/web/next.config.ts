import "@webvise-app/env/web";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ["shiki"],
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
		];
	},
};

export default withNextIntl(nextConfig);
