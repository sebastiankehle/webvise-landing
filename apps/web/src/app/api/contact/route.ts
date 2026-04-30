import { NextResponse } from "next/server";
import { z } from "zod";
import { c, emailLayout, escapeHtml, s, tableRow } from "@/lib/email-template";
import {
	createRateLimiter,
	getClientIP,
	rateLimitResponse,
} from "@/lib/rate-limit";

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
	message: z.string().max(5000).optional(),
});

const SERVICE_LABELS: Record<string, string> = {
	"landing-pages": "Landing Pages",
	"wordpress-migration": "WordPress Migration",
	"ai-consulting": "AI Consulting",
	"mvp-development": "MVP Development",
	"ai-automation": "AI Automation",
	"full-stack-applications": "Full-Stack Applications",
};

function buildContactHtml(data: {
	name: string;
	email: string;
	company?: string;
	service?: string;
	message?: string;
	timestamp: string;
}) {
	const name = escapeHtml(data.name);
	const email = escapeHtml(data.email);
	const company = data.company ? escapeHtml(data.company) : undefined;
	const message = data.message ? escapeHtml(data.message) : null;
	const serviceLabel = data.service
		? escapeHtml(SERVICE_LABELS[data.service] ?? data.service)
		: null;

	const rows = [
		tableRow("Name", name),
		tableRow(
			"Email",
			`<a href="mailto:${email}" style="${s.link}">${email}</a>`
		),
		company ? tableRow("Company", company) : "",
		serviceLabel ? tableRow("Service", serviceLabel) : "",
		tableRow("Received", data.timestamp),
	].join("");

	return emailLayout({
		label: "New Inquiry",
		content: `
      <h1 style="${s.h1}">${name}${company ? ` · ${company}` : ""}</h1>
      ${serviceLabel ? `<p style="${s.label};color:${c.brand};margin-bottom:20px">${serviceLabel}</p>` : '<div style="margin-bottom:20px"></div>'}
      <table style="border-collapse:collapse;width:100%">${rows}</table>
      ${
				message
					? `
      <hr style="${s.hr}">
      <p style="${s.label}">Message</p>
      <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.6;white-space:pre-wrap">${message}</p>`
					: ""
			}
      <div style="margin:24px 0 0">
        <a href="mailto:${email}?subject=Re: Your webvise inquiry" style="${s.button}">Reply to ${escapeHtml(data.name.split(" ")[0])}</a>
      </div>`,
	});
}

export async function POST(request: Request) {
	const { limited, retryAfterSec } = limiter.check(getClientIP(request));
	if (limited) {
		return rateLimitResponse(retryAfterSec);
	}

	try {
		const body = await request.json();
		const data = contactSchema.parse(body);

		const resendApiKey = process.env.RESEND_API_KEY;
		const contactEmail = process.env.CONTACT_EMAIL_TO || "mail@webvise.io";

		if (!resendApiKey) {
			console.error("RESEND_API_KEY not configured");
			return NextResponse.json(
				{ error: "Email service not configured" },
				{ status: 500 }
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
			data.company ? `${data.name} (${data.company})` : data.name,
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
					data.message ? `\n${data.message}` : null,
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
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid input", details: error.issues },
				{ status: 400 }
			);
		}
		console.error("Contact form error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
