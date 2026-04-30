import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const BLOCKED_TLDS = [".local", ".localhost", ".internal"];

const BLOCKED_HOSTNAMES = [
	"metadata.google.internal",
	"metadata.google",
	"instance-data",
];

function isPrivateIPv4(ip: string): boolean {
	const parts = ip.split(".").map(Number);
	if (parts.length !== 4) {
		return false;
	}
	const [a, b] = parts;
	if (a === 10 || a === 127 || a === 0) {
		return true;
	}
	if (a === 172 && b >= 16 && b <= 31) {
		return true;
	}
	if (a === 192 && b === 168) {
		return true;
	}
	if (a === 169 && b === 254) {
		return true;
	}
	return false;
}

function isPrivateIPv6(ip: string): boolean {
	const normalized = ip.toLowerCase();
	if (normalized === "::1" || normalized === "::") {
		return true;
	}
	return (
		normalized.startsWith("fc") ||
		normalized.startsWith("fd") ||
		normalized.startsWith("fe80")
	);
}

function isPrivateIP(ip: string): boolean {
	return isPrivateIPv4(ip) || isPrivateIPv6(ip);
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
	if (
		BLOCKED_HOSTNAMES.some((h) => hostname === h || hostname.endsWith(`.${h}`))
	) {
		throw new UrlValidationError("This URL is not allowed.");
	}

	// Block dangerous TLDs
	if (
		BLOCKED_TLDS.some(
			(tld) => hostname === tld.slice(1) || hostname.endsWith(tld)
		)
	) {
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
		if (err instanceof UrlValidationError) {
			throw err;
		}
		throw new UrlValidationError("Could not resolve hostname.");
	}
}
