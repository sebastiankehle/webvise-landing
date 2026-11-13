import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";

const BLOCKED_TLDS = [".local", ".localhost", ".internal"];

const BLOCKED_HOSTNAMES = [
	"metadata.google.internal",
	"metadata.google",
	"instance-data",
];

const BLOCKED_IPV4_SUBNETS: [string, number][] = [
	["0.0.0.0", 8],
	["10.0.0.0", 8],
	["100.64.0.0", 10],
	["127.0.0.0", 8],
	["169.254.0.0", 16],
	["172.16.0.0", 12],
	["192.0.0.0", 24],
	["192.0.2.0", 24],
	["192.168.0.0", 16],
	["198.18.0.0", 15],
	["198.51.100.0", 24],
	["203.0.113.0", 24],
	["224.0.0.0", 4],
	["240.0.0.0", 4],
];

const BLOCKED_IPV6_SUBNETS: [string, number][] = [
	["::", 128],
	["::1", 128],
	["fc00::", 7],
	["fe80::", 10],
	["ff00::", 8],
	["2001:db8::", 32],
	["64:ff9b::", 96],
	["64:ff9b:1::", 48],
	["100::", 64],
];

const blockList = new BlockList();
for (const [net, prefix] of BLOCKED_IPV4_SUBNETS) {
	blockList.addSubnet(net, prefix, "ipv4");
}
for (const [net, prefix] of BLOCKED_IPV6_SUBNETS) {
	blockList.addSubnet(net, prefix, "ipv6");
}

const MAPPED_DOTTED_RE = /^::(?:ffff:)?(\d{1,3}(?:\.\d{1,3}){3})$/;
const MAPPED_HEX_RE = /^::(?:ffff:)?([0-9a-f]{1,4}):([0-9a-f]{1,4})$/;

/** Embedded IPv4 of an IPv4-mapped (::ffff:x) or IPv4-compatible (::x) address. */
function embeddedIPv4(ip: string): string | null {
	const dotted = MAPPED_DOTTED_RE.exec(ip);
	if (dotted?.[1]) {
		return dotted[1];
	}
	const hex = MAPPED_HEX_RE.exec(ip);
	if (hex?.[1] && hex[2]) {
		const hi = Number.parseInt(hex[1], 16);
		const lo = Number.parseInt(hex[2], 16);
		return `${Math.floor(hi / 256)}.${hi % 256}.${Math.floor(lo / 256)}.${lo % 256}`;
	}
	return null;
}

export function isBlockedAddress(ip: string): boolean {
	const address = (ip.split("%")[0] ?? "").toLowerCase();
	const family = isIP(address);
	if (family === 4) {
		return blockList.check(address, "ipv4");
	}
	if (family === 6) {
		const v4 = embeddedIPv4(address);
		if (v4) {
			return isIP(v4) === 4 ? blockList.check(v4, "ipv4") : true;
		}
		return blockList.check(address, "ipv6");
	}
	return true;
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

	let hostname = parsed.hostname.toLowerCase();
	// Node's URL parser preserves the [ ] around IPv6 literals; strip them
	// so isIP / isBlockedAddress can recognise the address.
	if (hostname.startsWith("[") && hostname.endsWith("]")) {
		hostname = hostname.slice(1, -1);
	}

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
		if (isBlockedAddress(hostname)) {
			throw new UrlValidationError("This URL is not allowed.");
		}
		return;
	}

	// Resolve hostname and check every resolved address
	try {
		const addresses = await lookup(hostname, { all: true });
		if (
			addresses.length === 0 ||
			addresses.some((a) => isBlockedAddress(a.address))
		) {
			throw new UrlValidationError("This URL is not allowed.");
		}
	} catch (err) {
		if (err instanceof UrlValidationError) {
			throw err;
		}
		throw new UrlValidationError("Could not resolve hostname.");
	}
}
