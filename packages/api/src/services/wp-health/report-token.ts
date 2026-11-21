import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@webvise-app/env/server";
import type { AuditResultData } from "./audit";

const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 1 day
const PURPOSE = "wp-health-report";

function getSecret(secret?: string): string {
	const resolved = secret ?? env.EMAIL_TOKEN_SECRET ?? env.BETTER_AUTH_SECRET;
	if (!resolved) {
		throw new Error("Report token secret is not configured");
	}
	return resolved;
}

function sign(payload: string, secret: string): string {
	return createHmac("sha256", secret)
		.update(`${PURPOSE}.${payload}`)
		.digest("base64url");
}

/**
 * The report as the visitor saw it, signed. Unlocking sends this token back,
 * so the emails carry the scores on screen and the client cannot change them.
 */
export function createReportToken(
	report: AuditResultData,
	issuedAtMs: number = Date.now(),
	secret?: string
): string {
	const reportPart = Buffer.from(JSON.stringify(report), "utf-8").toString(
		"base64url"
	);
	const payload = `${reportPart}.${issuedAtMs}`;
	return `${payload}.${sign(payload, getSecret(secret))}`;
}

export function verifyReportToken(
	token: string,
	nowMs: number = Date.now(),
	secret?: string
): AuditResultData | null {
	const parts = token.split(".");
	if (parts.length !== 3) {
		return null;
	}
	const [reportPart, issuedAtPart, signature] = parts as [
		string,
		string,
		string,
	];
	const payload = `${reportPart}.${issuedAtPart}`;
	const sigBuf = Buffer.from(signature, "utf-8");
	const expectedBuf = Buffer.from(sign(payload, getSecret(secret)), "utf-8");
	if (
		sigBuf.length !== expectedBuf.length ||
		!timingSafeEqual(sigBuf, expectedBuf)
	) {
		return null;
	}
	const issuedAt = Number(issuedAtPart);
	if (!Number.isFinite(issuedAt) || nowMs - issuedAt > MAX_AGE_MS) {
		return null;
	}
	return JSON.parse(
		Buffer.from(reportPart, "base64url").toString("utf-8")
	) as AuditResultData;
}
