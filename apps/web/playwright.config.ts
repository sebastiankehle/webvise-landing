import { defineConfig, devices } from "@playwright/test";

const PORT = 3590;

/** Browser checks run against a production build: run `pnpm build` first.
 * Prefetching only behaves as in production there. */
export default defineConfig({
	testDir: "e2e",
	fullyParallel: true,
	reporter: "list",
	use: {
		...devices["Desktop Chrome"],
		baseURL: `http://localhost:${PORT}`,
		viewport: { width: 1440, height: 900 },
	},
	webServer: {
		command: `next start --port ${PORT}`,
		url: `http://localhost:${PORT}`,
		reuseExistingServer: true,
	},
});
