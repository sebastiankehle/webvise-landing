import {
	createNewsletterConfirmationToken,
	verifyNewsletterConfirmationToken,
} from "@webvise-app/api/email/newsletter-confirmation-token";
import { beforeEach, describe, expect, it, vi } from "vitest";

const envMock = vi.hoisted(() => ({
	EMAIL_TOKEN_SECRET: undefined as string | undefined,
	BETTER_AUTH_SECRET: undefined as string | undefined,
}));

vi.mock("@webvise-app/env/server", () => ({ env: envMock }));

const SECRET = "test-secret-that-is-at-least-32-chars!!";
const AUTH_SECRET = "auth-secret-that-is-at-least-32-chars!!!";
const EMAIL_SECRET = "email-secret-that-is-at-least-32-chars!!";
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

describe("secret fallback", () => {
	beforeEach(() => {
		envMock.EMAIL_TOKEN_SECRET = undefined;
		envMock.BETTER_AUTH_SECRET = undefined;
	});

	it("still verifies a token signed with BETTER_AUTH_SECRET after EMAIL_TOKEN_SECRET is added", () => {
		envMock.BETTER_AUTH_SECRET = AUTH_SECRET;
		const token = createNewsletterConfirmationToken("user@example.com", NOW);
		envMock.EMAIL_TOKEN_SECRET = EMAIL_SECRET;
		expect(verifyNewsletterConfirmationToken(token, NOW)).toEqual({
			ok: true,
			email: "user@example.com",
		});
	});

	it("signs new tokens with EMAIL_TOKEN_SECRET", () => {
		envMock.BETTER_AUTH_SECRET = AUTH_SECRET;
		envMock.EMAIL_TOKEN_SECRET = EMAIL_SECRET;
		const token = createNewsletterConfirmationToken("user@example.com", NOW);
		expect(verifyNewsletterConfirmationToken(token, NOW, EMAIL_SECRET).ok).toBe(
			true
		);
		expect(verifyNewsletterConfirmationToken(token, NOW, AUTH_SECRET)).toEqual({
			ok: false,
		});
	});

	it("rejects a token signed with an unknown secret", () => {
		envMock.BETTER_AUTH_SECRET = AUTH_SECRET;
		envMock.EMAIL_TOKEN_SECRET = EMAIL_SECRET;
		const token = createNewsletterConfirmationToken(
			"user@example.com",
			NOW,
			SECRET
		);
		expect(verifyNewsletterConfirmationToken(token, NOW)).toEqual({
			ok: false,
		});
	});
});
