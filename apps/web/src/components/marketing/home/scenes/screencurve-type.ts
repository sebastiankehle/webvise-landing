import { Geist, Geist_Mono } from "next/font/google";

// Screencurve's type: Geist, and Geist Mono for Timecodes. Its scenes load
// after the page, so the faces load with them, not ahead.
const sans = Geist({
	display: "swap",
	preload: false,
	subsets: ["latin"],
	variable: "--sc-sans",
});
const mono = Geist_Mono({
	display: "swap",
	preload: false,
	subsets: ["latin"],
	variable: "--sc-mono",
});

/** The classes that set `--sc-sans` and `--sc-mono` on a scene. */
export const screencurveType = `${sans.variable} ${mono.variable}`;
