import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const lookupMock = vi.fn();
const sendEmailMock = vi.fn();

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
		categories: { performance: { score: mobile / 100 } },
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
	const ORIG_PSI_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;

	beforeEach(() => {
		fetchMock.mockReset();
		lookupMock.mockReset();
		sendEmailMock.mockReset();
		vi.stubGlobal("fetch", fetchMock);
		process.env.GOOGLE_PAGESPEED_API_KEY = "psi-key";
		// Default: dns resolves to a public IP so validateUrl passes
		lookupMock.mockResolvedValue({ address: "93.184.216.34", family: 4 });
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		if (ORIG_PSI_KEY === undefined) {
			delete process.env.GOOGLE_PAGESPEED_API_KEY;
		} else {
			process.env.GOOGLE_PAGESPEED_API_KEY = ORIG_PSI_KEY;
		}
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
		// estimateMax: mobile >= 50 → 1500
		expect(out.result.migrationEstimate).toEqual({ min: 750, max: 1500 });
		expect(out.result.issues.length).toBeGreaterThan(0);
		expect(out.result.vitals.length).toBeGreaterThan(0);
	});

	it("computes a higher migration estimate when mobile score is critical", async () => {
		setupPsi(30, 60);
		const out = await runWpHealthAudit({ url: "https://example.com" });
		expect(out.ok).toBe(true);
		if (!out.ok) {
			return;
		}
		expect(out.result.projectedScore).toBe(93); // mobile < 50
		expect(out.result.migrationEstimate.max).toBe(2500);
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
		delete process.env.GOOGLE_PAGESPEED_API_KEY;
		const out = await runWpHealthAudit({ url: "https://example.com" });
		expect(out.ok).toBe(false);
		expect(out.ok === false && out.error.kind).toBe("missing_psi_key");
	});

	it("returns invalid_url when DNS resolves to a private IP (rebinding)", async () => {
		lookupMock.mockResolvedValueOnce({ address: "10.0.0.1", family: 4 });
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
});
