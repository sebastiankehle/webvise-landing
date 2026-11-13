import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const NOT_ALLOWED_RE = /not allowed/;
const TOO_MANY_RE = /Too many redirects/;

const lookupMock = vi.fn();

vi.mock("node:dns/promises", () => ({
	lookup: (...args: unknown[]) => lookupMock(...args),
}));

const { safeFetchText } = await import("@webvise-app/api/safe-fetch");

const OPTS = { timeoutMs: 5000, maxBytes: 1000, maxRedirects: 3 };

function redirect(location: string) {
	return new Response(null, { status: 302, headers: { location } });
}

describe("safeFetchText", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		fetchMock.mockReset();
		lookupMock.mockReset();
		lookupMock.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("rejects a redirect to a private IP literal", async () => {
		fetchMock.mockResolvedValueOnce(redirect("http://127.0.0.1/admin"));
		await expect(safeFetchText("https://example.com", OPTS)).rejects.toThrow(
			NOT_ALLOWED_RE
		);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("rejects more redirects than maxRedirects", async () => {
		fetchMock.mockImplementation(() =>
			Promise.resolve(redirect("https://example.com/next"))
		);
		await expect(safeFetchText("https://example.com", OPTS)).rejects.toThrow(
			TOO_MANY_RE
		);
		expect(fetchMock).toHaveBeenCalledTimes(4);
	});

	it("resolves a relative Location against the current URL", async () => {
		fetchMock
			.mockResolvedValueOnce(redirect("/final"))
			.mockResolvedValueOnce(new Response("done", { status: 200 }));
		const res = await safeFetchText("https://example.com/start", OPTS);
		expect(res.url).toBe("https://example.com/final");
		expect(res.text).toBe("done");
		expect(fetchMock.mock.calls[1]?.[0]).toBe("https://example.com/final");
	});

	it("caps the body at maxBytes", async () => {
		fetchMock.mockResolvedValueOnce(
			new Response("a".repeat(5 * 1024 * 1024), { status: 200 })
		);
		const res = await safeFetchText("https://example.com", OPTS);
		expect(res.text.length).toBeLessThanOrEqual(1000);
		expect(res.text.length).toBeGreaterThan(0);
	});

	it("fetches every hop with redirect: manual", async () => {
		fetchMock
			.mockResolvedValueOnce(redirect("https://example.com/b"))
			.mockResolvedValueOnce(new Response("ok", { status: 200 }));
		await safeFetchText("https://example.com/a", OPTS);
		expect(fetchMock).toHaveBeenCalledTimes(2);
		for (const call of fetchMock.mock.calls) {
			expect(call[1]).toMatchObject({ redirect: "manual" });
		}
	});
});
