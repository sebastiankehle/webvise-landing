import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "webvise",
		short_name: "webvise",
		description:
			"Design, development, and AI automation for custom workflow software.",
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
