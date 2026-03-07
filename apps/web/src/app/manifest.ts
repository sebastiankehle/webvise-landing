import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "webvise",
		short_name: "webvise",
		description:
			"We turn ideas into production-ready software. Design, engineering, and AI. Shipped in weeks, built to scale.",
		start_url: "/",
		display: "standalone",
		background_color: "#fafafa",
		theme_color: "#f97316",
		icons: [
			{
				src: "/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
		],
	};
}
