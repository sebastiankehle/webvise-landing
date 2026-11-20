import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "webvise",
		short_name: "webvise",
		description:
			"Design, development, and AI automation for custom workflow software.",
		start_url: "/",
		display: "standalone",
		background_color: "#f8fafb",
		theme_color: "#ff8918",
		// The app icon: the white mark on the dark square
		icons: [
			{
				src: "/app-icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
		],
	};
}
