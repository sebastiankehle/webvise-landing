import type { Metadata } from "next";

import WpHealthReport from "@/components/marketing/wp-health-report";

export const metadata: Metadata = {
	title: "Free WordPress Health Report",
	description:
		"Get a free WordPress Health Report in 60 seconds. See your real speed score, security risks, and what a Next.js rebuild would score.",
	openGraph: {
		title: "Free WordPress Health Report — webvise",
		description:
			"Get a free WordPress Health Report in 60 seconds. See your real speed score, security risks, and what a Next.js rebuild would score.",
	},
};

export default function WpHealthReportPage() {
	return <WpHealthReport />;
}
