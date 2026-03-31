import "@webvise-app/env/web";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: ["shiki"],
	async redirects() {
		return [
			{
				source: "/analyze",
				destination: "/wp-health-report",
				permanent: true,
			},
		];
	},
};

export default withNextIntl(nextConfig);
