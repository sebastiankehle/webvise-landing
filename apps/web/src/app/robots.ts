import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/dashboard/", "/login/", "/todos/"],
			},
		],
		sitemap: "https://webvise.io/sitemap.xml",
	};
}
