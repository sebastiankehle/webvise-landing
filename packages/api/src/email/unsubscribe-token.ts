import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@webvise-app/env/server";

const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

function getSecret(secret?: string): string {
	const resolved = secret ?? env.BETTER_AUTH_SECRET;
	if (!resolved) {
		throw new Error("Unsubscribe token secret is not configured");
	}
	return resolved;
}

function sign(payload: string, secret: string): string {
	return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createUnsubscribeToken(
	email: string,
	issuedAtMs: number = Date.now(),
	secret?: string
): string {
	const emailPart = Buffer.from(email, "utf-8").toString("base64url");
	const payload = `${emailPart}.${issuedAtMs}`;
	return `${payload}.${sign(payload, getSecret(secret))}`;
}

export function verifyUnsubscribeToken(
	token: string,
	nowMs: number = Date.now(),
	secret?: string
): { ok: true; email: string } | { ok: false } {
	const parts = token.split(".");
	if (parts.length !== 3) {
		return { ok: false };
	}
	const [emailPart, issuedAtPart, signature] = parts as [
		string,
		string,
		string,
	];
	const payload = `${emailPart}.${issuedAtPart}`;
	const expected = sign(payload, getSecret(secret));
	const sigBuf = Buffer.from(signature, "utf-8");
	const expectedBuf = Buffer.from(expected, "utf-8");
	if (
		sigBuf.length !== expectedBuf.length ||
		!timingSafeEqual(sigBuf, expectedBuf)
	) {
		return { ok: false };
	}
	const issuedAt = Number(issuedAtPart);
	if (!Number.isFinite(issuedAt) || nowMs - issuedAt > MAX_AGE_MS) {
		return { ok: false };
	}
	const email = Buffer.from(emailPart, "base64url").toString("utf-8");
	if (!email.includes("@")) {
		return { ok: false };
	}
	return { ok: true, email };
}
