import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const lookupMock = vi.fn();
const sendEmailMock = vi.fn();
const findFirstMock = vi.fn();
const insertValuesMock = vi.fn();
const envMock = vi.hoisted(() => ({
	GOOGLE_PAGESPEED_API_KEY: undefined as string | undefined,
	CONTACT_EMAIL_TO: "mail@webvise.io",
}));

vi.mock("@webvise-app/env/server", () => ({ env: envMock }));

vi.mock("@webvise-app/db", () => ({
	db: {
		query: {
			leadEvent: { findFirst: (...args: unknown[]) => findFirstMock(...args) },
		},
		insert: () => ({
			values: (...args: unknown[]) => insertValuesMock(...args),
		}),
	},
}));

vi.mock("node:dns/promises", () => ({
	lookup: (...args: unknown[]) => lookupMock(...args),
}));

vi.mock("@webvise-app/api/email/resend", () => ({
	sendEmail: (...args: unknown[]) => sendEmailMock(...args),
	setContact: vi.fn(),
}));

const { runWpHealthAudit } = await import(
	"@webvise-app/api/services/wp-health/audit"
);

const PSI_OK = (mobile: number, desktop: number) => ({
	lighthouseResult: {
		categories: {
			performance: { score: mobile / 100 },
			seo: { score: 0.87 },
		},
		audits: {
			"first-contentful-paint": {
				title: "FCP",
				score: 0.6,
				displayValue: "1.5 s",
			},
			"render-blocking-resources": {
				title: "Eliminate render-blocking",
				score: 0.2,
				displayValue: "Save 1s",
				details: { overallSavingsMs: 1000 },
			},
		},
		_desktopMarker: desktop,
	},
});

describe("runWpHealthAudit", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		lookupMock.mockReset();
		sendEmailMock.mockReset();
		findFirstMock.mockReset();
		insertValuesMock.mockReset();
		findFirstMock.mockResolvedValue(undefined);
		insertValuesMock.mockResolvedValue(undefined);
		vi.stubGlobal("fetch", fetchMock);
		envMock.GOOGLE_PAGESPEED_API_KEY = "psi-key";
		// Default: dns resolves to a public IP so validateUrl passes
		lookupMock.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	function setupPsi(mobile: number, desktop: number) {
		fetchMock.mockImplementation((url: string) => {
			if (url.includes("googleapis.com")) {
				const isMobile = url.includes("strategy=mobile");
				return Promise.resolve(
					new Response(
						JSON.stringify(
							isMobile ? PSI_OK(mobile, mobile) : PSI_OK(desktop, desktop)
						),
						{ status: 200 }
					)
				);
			}
			// detectTechnology fetch
			return Promise.resolve(
				new Response("<html>plain</html>", { status: 200 })
			);
		});
	}

	it("returns ok with the canonical result shape on the happy path", async () => {
		setupPsi(60, 90);
		const out = await runWpHealthAudit({ url: "https://example.com" });
		expect(out.ok).toBe(true);
		if (!out.ok) {
			return;
		}
		expect(out.result.url).toBe("https://example.com");
		expect(out.result.mobile).toEqual({ score: 60 });
		expect(out.result.desktop).toEqual({ score: 90 });
		// projectedScore: mobile 60 (>=50, <70) → 95
		expect(out.result.projectedScore).toBe(95);
		expect(out.result).not.toHaveProperty("migrationEstimate");
		expect(out.result.issues.length).toBeGreaterThan(0);
		expect(out.result.vitals.length).toBeGreaterThan(0);
		expect(out.result.seo).toEqual({ score: 87 });
		// The stubbed page serves HTML for llms.txt too, so it does not count.
		expect(out.result.geo.llmsTxt).toBe(false);
		expect(out.result.geo.jsonLdTypes).toEqual([]);
	});

	it("reports llms.txt, blocked AI crawlers and JSON-LD types", async () => {
		fetchMock.mockImplementation((url: string) => {
			if (url.includes("googleapis.com")) {
				return Promise.resolve(
					new Response(JSON.stringify(PSI_OK(80, 90)), { status: 200 })
				);
			}
			if (url.endsWith("/llms.txt")) {
				return Promise.resolve(new Response("# Example", { status: 200 }));
			}
			if (url.endsWith("/robots.txt")) {
				return Promise.resolve(
					new Response("User-agent: GPTBot\nDisallow: /", { status: 200 })
				);
			}
			return Promise.resolve(
				new Response(
					'<script type="application/ld+json">{"@type":"Organization"}</script>',
					{ status: 200 }
				)
			);
		});
		const out = await runWpHealthAudit({ url: "https://example.com" });
		expect(out.ok).toBe(true);
		if (!out.ok) {
			return;
		}
		expect(out.result.geo).toEqual({
			llmsTxt: true,
			aiCrawlers: "partly-blocked",
			blockedCrawlers: ["GPTBot"],
			jsonLdTypes: ["Organization"],
		});
	});

	it("still returns ok when the llms.txt and robots.txt fetches fail", async () => {
		fetchMock.mockImplementation((url: string) => {
			if (url.includes("googleapis.com")) {
				return Promise.resolve(
					new Response(JSON.stringify(PSI_OK(80, 90)), { status: 200 })
				);
			}
			if (url.endsWith("/llms.txt") || url.endsWith("/robots.txt")) {
				return Promise.reject(new Error("boom"));
			}
			return Promise.resolve(
				new Response("<html>plain</html>", { status: 200 })
			);
		});
		const out = await runWpHealthAudit({ url: "https://example.com" });
		expect(out.ok).toBe(true);
		if (!out.ok) {
			return;
		}
		expect(out.result.geo.llmsTxt).toBe(false);
		expect(out.result.geo.aiCrawlers).toBe("unknown");
	});

	it("computes a lower projected score when mobile score is critical", async () => {
		setupPsi(30, 60);
		const out = await runWpHealthAudit({ url: "https://example.com" });
		expect(out.ok).toBe(true);
		if (!out.ok) {
			return;
		}
		expect(out.result.projectedScore).toBe(93); // mobile < 50
		expect(out.result).not.toHaveProperty("migrationEstimate");
	});

	it("flags 'No HTTPS' when the URL is plain http", async () => {
		setupPsi(80, 90);
		const out = await runWpHealthAudit({ url: "http://example.com" });
		expect(out.ok).toBe(true);
		if (!out.ok) {
			return;
		}
		expect(out.result.securityFlags).toContain("No HTTPS encryption");
	});

	it("flags WordPress + PHP when the page exposes wp-content", async () => {
		fetchMock.mockImplementation((url: string) => {
			if (url.includes("googleapis.com")) {
				return Promise.resolve(
					new Response(JSON.stringify(PSI_OK(80, 90)), { status: 200 })
				);
			}
			return Promise.resolve(
				new Response('<link href="/wp-content/x.css" />', {
					status: 200,
				})
			);
		});
		const out = await runWpHealthAudit({ url: "https://wp.example" });
		expect(out.ok).toBe(true);
		if (!out.ok) {
			return;
		}
		expect(out.result.securityFlags).toContain(
			"WordPress plugin ecosystem exposure"
		);
		expect(out.result.securityFlags).toContain(
			"PHP server-side attack surface"
		);
	});

	it("returns missing_psi_key when the env var is unset", async () => {
		envMock.GOOGLE_PAGESPEED_API_KEY = undefined;
		const out = await runWpHealthAudit({ url: "https://example.com" });
		expect(out.ok).toBe(false);
		expect(out.ok === false && out.error.kind).toBe("missing_psi_key");
	});

	it("returns invalid_url when DNS resolves to a private IP (rebinding)", async () => {
		lookupMock.mockResolvedValueOnce([{ address: "10.0.0.1", family: 4 }]);
		const out = await runWpHealthAudit({ url: "https://attacker.example" });
		expect(out.ok).toBe(false);
		expect(out.ok === false && out.error.kind).toBe("invalid_url");
	});

	it.each([
		[429, "rate_limited"],
		[400, "bad_url"],
		[403, "key_issue"],
		[500, "unknown"],
	])("returns psi_failed/%s code=%s when PSI responds %s", async (status, code) => {
		// mockImplementation returns a fresh Response per call so both PSI
		// fetches (mobile + desktop) can independently read their bodies.
		fetchMock.mockImplementation(
			async () => new Response("err", { status: status as number })
		);
		const out = await runWpHealthAudit({ url: "https://example.com" });
		expect(out.ok).toBe(false);
		if (out.ok) {
			return;
		}
		expect(out.error.kind).toBe("psi_failed");
		if (out.error.kind === "psi_failed") {
			expect(out.error.code).toBe(code);
		}
	});

	it("returns psi_null_score when PSI gives null performance score", async () => {
		fetchMock.mockImplementation(() =>
			Promise.resolve(
				new Response(
					JSON.stringify({
						lighthouseResult: {
							categories: { performance: { score: null } },
							audits: {},
						},
					}),
					{ status: 200 }
				)
			)
		);
		const out = await runWpHealthAudit({ url: "https://example.com" });
		expect(out.ok).toBe(false);
		expect(out.ok === false && out.error.kind).toBe("psi_null_score");
	});

	it("does NOT call sendEmail when input.email is omitted", async () => {
		setupPsi(80, 90);
		await runWpHealthAudit({ url: "https://example.com" });
		expect(sendEmailMock).not.toHaveBeenCalled();
	});

	it("calls sendEmail twice (admin + prospect) when input.email is set", async () => {
		setupPsi(45, 80);
		sendEmailMock.mockResolvedValue({ ok: true });
		await runWpHealthAudit({
			url: "https://example.com",
			email: "lead@example.com",
			firstName: "Ada",
		});
		expect(sendEmailMock).toHaveBeenCalledTimes(2);
		const labels = sendEmailMock.mock.calls.map((c) => c[0].label);
		expect(labels).toContain("wp-health-admin");
		expect(labels).toContain("wp-health-prospect");
	});

	it("admin email subject contains the URL and mobile score", async () => {
		setupPsi(42, 80);
		sendEmailMock.mockResolvedValue({ ok: true });
		await runWpHealthAudit({
			url: "https://example.com",
			email: "lead@example.com",
		});
		const adminCall = sendEmailMock.mock.calls.find(
			(c) => c[0].label === "wp-health-admin"
		);
		expect(adminCall?.[0].subject).toContain("https://example.com");
		expect(adminCall?.[0].subject).toContain("42");
	});

	it("sends only the admin email when a report went to the address in the last 24h", async () => {
		setupPsi(45, 80);
		sendEmailMock.mockResolvedValue({ ok: true });
		findFirstMock.mockResolvedValue({ id: "prior" });
		await runWpHealthAudit({
			url: "https://example.com",
			email: "Lead@Example.com",
		});
		const labels = sendEmailMock.mock.calls.map((c) => c[0].label);
		expect(labels).toEqual(["wp-health-admin"]);
		expect(insertValuesMock).not.toHaveBeenCalled();
	});

	it("sends only the admin email when the cap lookup throws", async () => {
		setupPsi(45, 80);
		sendEmailMock.mockResolvedValue({ ok: true });
		findFirstMock.mockRejectedValue(new Error("db down"));
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
			// silence expected log
		});
		await runWpHealthAudit({
			url: "https://example.com",
			email: "lead@example.com",
		});
		errorSpy.mockRestore();
		const labels = sendEmailMock.mock.calls.map((c) => c[0].label);
		expect(labels).toEqual(["wp-health-admin"]);
	});

	it("keeps visitor-typed text and the URL out of the prospect email", async () => {
		setupPsi(45, 80);
		sendEmailMock.mockResolvedValue({ ok: true });
		await runWpHealthAudit({
			url: "https://example.com",
			email: "lead@example.com",
			firstName: "Mallory",
		});
		const prospect = sendEmailMock.mock.calls.find(
			(c) => c[0].label === "wp-health-prospect"
		)?.[0];
		expect(prospect.subject).not.toContain("example.com");
		expect(prospect.html).not.toContain("Mallory");
		expect(prospect.text).not.toContain("Mallory");
	});

	it("records a wp_health_report lead event after the prospect email is sent", async () => {
		setupPsi(45, 80);
		sendEmailMock.mockResolvedValue({ ok: true });
		await runWpHealthAudit({
			url: "https://example.com/page",
			email: " Lead@Example.com ",
		});
		expect(insertValuesMock).toHaveBeenCalledWith({
			email: "lead@example.com",
			eventType: "wp_health_report",
			placement: "wp_health_report",
			path: "/wp-health-report",
			topic: "example.com",
		});
	});
});
