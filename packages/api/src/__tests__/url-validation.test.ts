import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const HTTP_HTTPS_RE = /http and https/;
const NOT_ALLOWED_RE = /not allowed/;
const COULD_NOT_RESOLVE_RE = /Could not resolve/;

const lookupMock = vi.fn();

vi.mock("node:dns/promises", () => ({
	lookup: (...args: unknown[]) => lookupMock(...args),
}));

const { isBlockedAddress, UrlValidationError, validateUrl } = await import(
	"@webvise-app/api/url-validation"
);

describe("validateUrl", () => {
	beforeEach(() => {
		lookupMock.mockReset();
	});
	afterEach(() => {
		lookupMock.mockReset();
	});

	it("rejects malformed URLs", async () => {
		await expect(validateUrl("not a url")).rejects.toBeInstanceOf(
			UrlValidationError
		);
	});

	it("rejects non-http(s) protocols", async () => {
		await expect(validateUrl("ftp://example.com")).rejects.toThrow(
			HTTP_HTTPS_RE
		);
	});

	it("rejects javascript: URLs", async () => {
		await expect(validateUrl("javascript:alert(1)")).rejects.toBeInstanceOf(
			UrlValidationError
		);
	});

	it("rejects metadata hostnames (cloud SSRF target)", async () => {
		await expect(
			validateUrl("http://metadata.google.internal/computeMetadata/v1/")
		).rejects.toThrow(NOT_ALLOWED_RE);
	});

	it("rejects subdomain of blocked metadata host", async () => {
		await expect(
			validateUrl("http://foo.metadata.google.internal/")
		).rejects.toThrow(NOT_ALLOWED_RE);
	});

	it.each([
		".local",
		".localhost",
		".internal",
	])("rejects %s TLDs", async (tld) => {
		await expect(validateUrl(`http://router${tld}`)).rejects.toThrow(
			NOT_ALLOWED_RE
		);
	});

	it.each([
		"http://10.0.0.1",
		"http://127.0.0.1",
		"http://192.168.1.1",
		"http://172.16.0.1",
		"http://172.31.255.255",
		"http://169.254.169.254",
	])("rejects literal private IPv4 %s", async (url) => {
		await expect(validateUrl(url)).rejects.toThrow(NOT_ALLOWED_RE);
		expect(lookupMock).not.toHaveBeenCalled();
	});

	it.each([
		"http://[::1]/",
		"http://[fc00::1]/",
		"http://[fe80::1]/",
	])("rejects literal private IPv6 %s", async (url) => {
		await expect(validateUrl(url)).rejects.toThrow(NOT_ALLOWED_RE);
	});

	it("accepts public IPv4 literal", async () => {
		await expect(validateUrl("http://93.184.216.34/")).resolves.toBeUndefined();
		expect(lookupMock).not.toHaveBeenCalled();
	});

	it("rejects when DNS resolves to a private IP (rebinding defence)", async () => {
		lookupMock.mockResolvedValueOnce([{ address: "10.0.0.5", family: 4 }]);
		await expect(validateUrl("http://attacker.example.com")).rejects.toThrow(
			NOT_ALLOWED_RE
		);
	});

	it("accepts when DNS resolves to a public IP", async () => {
		lookupMock.mockResolvedValueOnce([{ address: "93.184.216.34", family: 4 }]);
		await expect(validateUrl("https://example.com")).resolves.toBeUndefined();
		expect(lookupMock).toHaveBeenCalledWith("example.com", { all: true });
	});

	it("rejects when any resolved address is private", async () => {
		lookupMock.mockResolvedValueOnce([
			{ address: "93.184.216.34", family: 4 },
			{ address: "10.0.0.5", family: 4 },
		]);
		await expect(validateUrl("http://mixed.example.com")).rejects.toThrow(
			NOT_ALLOWED_RE
		);
	});

	it("rejects when DNS returns no addresses", async () => {
		lookupMock.mockResolvedValueOnce([]);
		await expect(validateUrl("http://empty.example.com")).rejects.toThrow(
			NOT_ALLOWED_RE
		);
	});

	it.each([
		"http://[::ffff:127.0.0.1]/",
		"http://[::ffff:a9fe:a9fe]/",
		"http://[fe90::1]/",
		"http://100.100.100.200/",
		"http://198.18.0.1/",
		"http://224.0.0.1/",
	])("rejects special-range literal %s", async (url) => {
		await expect(validateUrl(url)).rejects.toThrow(NOT_ALLOWED_RE);
	});

	it("isBlockedAddress allows public addresses", () => {
		expect(isBlockedAddress("8.8.8.8")).toBe(false);
		expect(isBlockedAddress("2606:4700::1")).toBe(false);
	});

	it("rejects when DNS lookup fails", async () => {
		lookupMock.mockRejectedValueOnce(new Error("ENOTFOUND"));
		await expect(validateUrl("https://nx.example.com")).rejects.toThrow(
			COULD_NOT_RESOLVE_RE
		);
	});
});
