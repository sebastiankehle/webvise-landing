import {
	createUnsubscribeToken,
	verifyUnsubscribeToken,
} from "@webvise-app/api/email/unsubscribe-token";
import { describe, expect, it } from "vitest";

const SECRET = "test-secret-that-is-at-least-32-chars!!";
const NOW = 1_700_000_000_000; // fixed timestamp for deterministic tests

describe("createUnsubscribeToken / verifyUnsubscribeToken", () => {
	it("round-trips a valid token", () => {
		const token = createUnsubscribeToken("user@example.com", NOW, SECRET);
		const result = verifyUnsubscribeToken(token, NOW, SECRET);
		expect(result).toEqual({ ok: true, email: "user@example.com" });
	});

	it("rejects a tampered email part (different address, same signature)", () => {
		const token = createUnsubscribeToken("user@example.com", NOW, SECRET);
		// Replace the email segment with a different address's base64url
		const parts = token.split(".");
		const fakePart = Buffer.from("attacker@evil.com", "utf-8").toString(
			"base64url"
		);
		const tampered = [fakePart, parts[1], parts[2]].join(".");
		expect(verifyUnsubscribeToken(tampered, NOW, SECRET)).toEqual({
			ok: false,
		});
	});

	it("rejects a token verified with the wrong secret", () => {
		const token = createUnsubscribeToken("user@example.com", NOW, SECRET);
		expect(
			verifyUnsubscribeToken(token, NOW, "wrong-secret-that-is-32-chars!!!!")
		).toEqual({ ok: false });
	});

	it("rejects an expired token (issued 366 days ago)", () => {
		const DAY_MS = 24 * 60 * 60 * 1000;
		const issuedAt = NOW - 366 * DAY_MS;
		const token = createUnsubscribeToken("user@example.com", issuedAt, SECRET);
		expect(verifyUnsubscribeToken(token, NOW, SECRET)).toEqual({ ok: false });
	});

	it("rejects the legacy format (plain base64url email, no dots)", () => {
		const legacy = Buffer.from("user@example.com", "utf-8").toString(
			"base64url"
		);
		expect(verifyUnsubscribeToken(legacy, NOW, SECRET)).toEqual({ ok: false });
	});

	it("rejects garbage tokens", () => {
		expect(verifyUnsubscribeToken("a.b.c", NOW, SECRET)).toEqual({ ok: false });
		expect(verifyUnsubscribeToken("", NOW, SECRET)).toEqual({ ok: false });
	});
});
