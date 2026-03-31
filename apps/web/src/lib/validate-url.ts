import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const BLOCKED_TLDS = [".local", ".localhost", ".internal"];

const BLOCKED_HOSTNAMES = [
	"metadata.google.internal",
	"metadata.google",
	"instance-data",
];

function isPrivateIP(ip: string): boolean {
	// IPv4 private/reserved ranges
	const parts = ip.split(".").map(Number);
	if (parts.length === 4) {
		const [a, b] = parts;
		if (a === 10) return true; // 10.0.0.0/8
		if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
		if (a === 192 && b === 168) return true; // 192.168.0.0/16
		if (a === 127) return true; // 127.0.0.0/8
		if (a === 169 && b === 254) return true; // 169.254.0.0/16 (link-local + metadata)
		if (a === 0) return true; // 0.0.0.0/8
	}

	// IPv6 loopback and private ranges
	const normalized = ip.toLowerCase();
	if (normalized === "::1") return true;
	if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // fc00::/7
	if (normalized.startsWith("fe80")) return true; // fe80::/10
	if (normalized === "::") return true;

	return false;
}

export class UrlValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UrlValidationError";
	}
}

export async function validateUrl(url: string): Promise<void> {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new UrlValidationError("Invalid URL format.");
	}

	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
		throw new UrlValidationError("Only http and https URLs are allowed.");
	}

	const hostname = parsed.hostname.toLowerCase();

	// Block known metadata hostnames
	if (BLOCKED_HOSTNAMES.some((h) => hostname === h || hostname.endsWith(`.${h}`))) {
		throw new UrlValidationError("This URL is not allowed.");
	}

	// Block dangerous TLDs
	if (BLOCKED_TLDS.some((tld) => hostname === tld.slice(1) || hostname.endsWith(tld))) {
		throw new UrlValidationError("This URL is not allowed.");
	}

	// If hostname is already an IP, check it directly
	if (isIP(hostname)) {
		if (isPrivateIP(hostname)) {
			throw new UrlValidationError("This URL is not allowed.");
		}
		return;
	}

	// Resolve hostname and check the resolved IP
	try {
		const { address } = await lookup(hostname);
		if (isPrivateIP(address)) {
			throw new UrlValidationError("This URL is not allowed.");
		}
	} catch (err) {
		if (err instanceof UrlValidationError) throw err;
		throw new UrlValidationError("Could not resolve hostname.");
	}
}
