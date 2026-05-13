import "@webvise-app/env/web";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ["shiki"],
	images: {
		qualities: [75, 80, 90, 95, 100],
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
