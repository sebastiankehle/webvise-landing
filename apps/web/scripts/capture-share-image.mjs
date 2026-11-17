// The share image link previews show for the site, in both locales: the
// English home page's first screen, cut to 1200 × 630 and captured at 2x as
// JPEG. Run it against a running site after the hero changes:
//
//   pnpm --filter web share-image http://localhost:3000
//
// It writes public/images/home/share.jpg.
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3000";
const out = fileURLToPath(
	new URL("../public/images/home/share.jpg", import.meta.url)
);

// The hero alone: its headline, the header's lockup above it and the top of
// the wall below. The wall's box is shorter than on the page, so its centre,
// the frames picked to stand in view, falls inside the picture.
const style = `
	html, body { overflow: hidden !important; }
	nextjs-portal { display: none !important; }
	#hero { padding: 0 !important; height: 630px; }
	#hero .stagger-visible > p,
	#hero .stagger-visible > div:not(:last-child),
	#hero .stagger-visible > ul,
	#hero .stagger-visible > div:last-child > :not(:first-child),
	#hero button { display: none !important; }
	#hero h1 {
		font-size: 60px !important;
		line-height: 1.04 !important;
		padding-top: 118px;
	}
	#hero .stagger-visible > div:last-child { margin-top: 48px !important; }
	#hero .hw { aspect-ratio: auto !important; height: 420px; }
	.share-brand {
		position: absolute; top: 46px; left: 0; right: 0;
		display: flex; justify-content: center;
	}
`;

const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: 1200, height: 630 },
	deviceScaleFactor: 2,
	// Holds the wall still where it starts
	reducedMotion: "reduce",
	colorScheme: "light",
});

await page.goto(`${base}/en`, { waitUntil: "networkidle" });
await page.addStyleTag({ content: style });
await page.evaluate(() => {
	// Hide everything beside the hero, on every level up to <body>
	let node = document.querySelector("#hero");
	while (node && node !== document.body) {
		for (const sibling of node.parentElement.children) {
			if (sibling !== node) {
				sibling.style.display = "none";
			}
		}
		node = node.parentElement;
	}
	const brand = document.createElement("div");
	brand.className = "share-brand";
	brand.append(document.querySelector("header a").cloneNode(true));
	document.querySelector("#hero").append(brand);
	window.scrollTo(0, 0);
});
// Every picture in view loaded, and the font in
await page.waitForFunction(
	() =>
		[...document.querySelectorAll("#hero img")]
			.filter((img) => img.getBoundingClientRect().top < 630)
			.every((img) => img.complete && img.naturalWidth > 0),
	undefined,
	{ timeout: 120_000 }
);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.screenshot({ path: out, type: "jpeg", quality: 82 });
await browser.close();
console.log(`${base}/en -> public/images/home/share.jpg`);
