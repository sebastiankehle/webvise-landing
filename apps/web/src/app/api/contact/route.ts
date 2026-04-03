import { NextResponse } from "next/server";
import { z } from "zod";
import {
	createRateLimiter,
	getClientIP,
	rateLimitResponse,
} from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/escape-html";

const limiter = createRateLimiter({
	name: "contact",
	maxRequests: 3,
	windowMs: 60_000,
});

const contactSchema = z.object({
	name: z.string().min(1).max(200),
	email: z.string().email().max(200),
	company: z.string().max(200).optional(),
	service: z.string().max(100).optional(),
	message: z.string().min(1).max(5000),
});

const SERVICE_LABELS: Record<string, string> = {
	"landing-pages": "Landing Pages",
	"seo-performance": "SEO & Performance",
	"wordpress-migration": "WordPress Migration",
	"mvp-development": "MVP Development",
	"ai-automation": "AI Automation",
	"full-stack-applications": "Full-Stack Applications",
};

function buildContactHtml(data: {
	name: string;
	email: string;
	company?: string;
	service?: string;
	message: string;
	timestamp: string;
}) {
	const name = escapeHtml(data.name);
	const email = escapeHtml(data.email);
	const company = data.company ? escapeHtml(data.company) : undefined;
	const message = escapeHtml(data.message);
	const serviceLabel = data.service
		? escapeHtml(SERVICE_LABELS[data.service] ?? data.service)
		: null;

	const rows = [
		["Name", name],
		["Email", `<a href="mailto:${email}" style="color:#7c3aed">${email}</a>`],
		company ? ["Company", company] : null,
		serviceLabel ? ["Service", serviceLabel] : null,
		["Received", data.timestamp],
	].filter(Boolean) as [string, string][];

	const tableRows = rows
		.map(
			([label, value]) => `
      <tr>
        <td style="padding:8px 16px 8px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
        <td style="padding:8px 0;color:#111827;font-size:13px">${value}</td>
      </tr>`,
		)
		.join("");

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border:1px solid #e5e7eb">
    <div style="background:#7c3aed;padding:20px 28px">
      <span style="color:#ffffff;font-size:14px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase">webvise</span>
      <span style="color:#c4b5fd;font-size:14px;margin-left:8px">- New Inquiry</span>
    </div>
    <div style="padding:28px">
      <h1 style="margin:0 0 4px;font-size:20px;font-weight:600;color:#111827">
        ${name}${company ? ` · ${company}` : ""}
      </h1>
      ${serviceLabel ? `<p style="margin:0 0 20px;font-size:13px;color:#7c3aed;font-weight:500">${serviceLabel}</p>` : '<div style="margin-bottom:20px"></div>'}
      <table style="border-collapse:collapse;width:100%">
        ${tableRows}
      </table>
      <div style="margin:24px 0 0;border-top:1px solid #e5e7eb;padding-top:20px">
        <p style="margin:0 0 8px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;font-weight:500">Message</p>
        <p style="margin:0;font-size:14px;color:#111827;line-height:1.6;white-space:pre-wrap">${message}</p>
      </div>
      <div style="margin:24px 0 0">
        <a href="mailto:${email}?subject=Re: Your webvise inquiry" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:10px 20px;font-size:13px;font-weight:500">
          Reply to ${escapeHtml(data.name.split(" ")[0])}
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
	const { limited, retryAfterSec } = limiter.check(getClientIP(request));
	if (limited) return rateLimitResponse(retryAfterSec);

	try {
		const body = await request.json();
		const data = contactSchema.parse(body);

		const resendApiKey = process.env.RESEND_API_KEY;
		const contactEmail = process.env.CONTACT_EMAIL_TO || "mail@webvise.io";

		if (!resendApiKey) {
			console.error("RESEND_API_KEY not configured");
			return NextResponse.json(
				{ error: "Email service not configured" },
				{ status: 500 },
			);
		}

		const timestamp = new Date().toLocaleString("en-GB", {
			dateStyle: "long",
			timeStyle: "short",
			timeZone: "Europe/Berlin",
		});

		const serviceLabel = data.service
			? (SERVICE_LABELS[data.service] ?? data.service)
			: null;

		const subject = [
			data.company
				? `${data.name} (${data.company})`
				: data.name,
			serviceLabel ? `- ${serviceLabel}` : null,
		]
			.filter(Boolean)
			.join(" ");

		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${resendApiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from: "webvise <noreply@webvise.io>",
				to: [contactEmail],
				reply_to: data.email,
				subject,
				html: buildContactHtml({
					name: data.name,
					email: data.email,
					company: data.company,
					service: data.service,
					message: data.message,
					timestamp,
				}),
				text: [
					`From: ${data.name} <${data.email}>`,
					data.company ? `Company: ${data.company}` : null,
					serviceLabel ? `Service: ${serviceLabel}` : null,
					`Received: ${timestamp}`,
					"",
					data.message,
				]
					.filter(Boolean)
					.join("\n"),
			}),
		});

		if (!res.ok) {
			const error = await res.text();
			console.error("Resend error:", error);
			return NextResponse.json(
				{ error: "Failed to send email" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid input", details: error.issues },
				{ status: 400 },
			);
		}
		console.error("Contact form error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
