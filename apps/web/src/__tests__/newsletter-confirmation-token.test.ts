import {
	createNewsletterConfirmationToken,
	verifyNewsletterConfirmationToken,
} from "@webvise-app/api/email/newsletter-confirmation-token";
import { describe, expect, it } from "vitest";

const SECRET = "test-secret-that-is-at-least-32-chars!!";
const NOW = 1_700_000_000_000;

describe("createNewsletterConfirmationToken / verifyNewsletterConfirmationToken", () => {
	it("round-trips a valid token and normalizes the email", () => {
		const token = createNewsletterConfirmationToken(
			"Reader@Example.com",
			NOW,
			SECRET
		);
		const result = verifyNewsletterConfirmationToken(token, NOW, SECRET);
		expect(result).toEqual({ ok: true, email: "reader@example.com" });
	});

	it("rejects tokens older than 7 days", () => {
		const DAY_MS = 24 * 60 * 60 * 1000;
		const issuedAt = NOW - 8 * DAY_MS;
		const token = createNewsletterConfirmationToken(
			"user@example.com",
			issuedAt,
			SECRET
		);
		expect(verifyNewsletterConfirmationToken(token, NOW, SECRET)).toEqual({
			ok: false,
		});
	});

	it("rejects tokens signed for another secret", () => {
		const token = createNewsletterConfirmationToken(
			"user@example.com",
			NOW,
			SECRET
		);
		expect(
			verifyNewsletterConfirmationToken(
				token,
				NOW,
				"wrong-secret-that-is-32-chars!!!!"
			)
		).toEqual({ ok: false });
	});
});
