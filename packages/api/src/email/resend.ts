import { env } from "@webvise-app/env/server";

interface SendEmailInput {
	attachments?: Array<{ filename: string; content: string }>;
	from: string;
	headers?: Record<string, string>;
	html: string;
	label: string;
	replyTo?: string;
	subject: string;
	text?: string;
	to: string | string[];
}

interface SetContactInput {
	email: string;
	label: string;
	subscribed: boolean;
}

export type EmailResult =
	| { ok: true }
	| { ok: false; reason: "not_configured" | "api_error"; details?: string };

function getApiKey(label: string): string | null {
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) {
		console.error(`[email:${label}] RESEND_API_KEY not configured`);
		return null;
	}
	return apiKey;
}

export async function sendEmail(input: SendEmailInput): Promise<EmailResult> {
	const apiKey = getApiKey(input.label);
	if (!apiKey) {
		return { ok: false, reason: "not_configured" };
	}

	const body: Record<string, unknown> = {
		from: input.from,
		to: Array.isArray(input.to) ? input.to : [input.to],
		subject: input.subject,
		html: input.html,
	};
	if (input.replyTo) {
		body.reply_to = input.replyTo;
	}
	if (input.text) {
		body.text = input.text;
	}
	if (input.headers) {
		body.headers = input.headers;
	}
	if (input.attachments) {
		body.attachments = input.attachments;
	}

	try {
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!res.ok) {
			const details = await res.text();
			console.error(`[email:${input.label}] resend api error:`, details);
			return { ok: false, reason: "api_error", details };
		}

		return { ok: true };
	} catch (err) {
		const details = err instanceof Error ? err.message : String(err);
		console.error(`[email:${input.label}] fetch failed:`, details);
		return { ok: false, reason: "api_error", details };
	}
}

export async function setContact(input: SetContactInput): Promise<EmailResult> {
	const apiKey = getApiKey(input.label);
	if (!apiKey) {
		return { ok: false, reason: "not_configured" };
	}

	try {
		const res = await fetch("https://api.resend.com/contacts", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: input.email,
				unsubscribed: !input.subscribed,
			}),
		});

		if (!res.ok) {
			const details = await res.text();
			console.error(`[email:${input.label}] resend contacts error:`, details);
			return { ok: false, reason: "api_error", details };
		}

		return { ok: true };
	} catch (err) {
		const details = err instanceof Error ? err.message : String(err);
		console.error(`[email:${input.label}] contacts fetch failed:`, details);
		return { ok: false, reason: "api_error", details };
	}
}
