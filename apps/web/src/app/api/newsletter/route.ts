import { NextResponse } from "next/server";
import { z } from "zod";
import { emailLayout, s, unsubscribeUrl } from "@/lib/email-template";
import {
	createRateLimiter,
	getClientIP,
	rateLimitResponse,
} from "@/lib/rate-limit";

const limiter = createRateLimiter({
	name: "newsletter",
	maxRequests: 3,
	windowMs: 60_000,
});

const schema = z.object({
	email: z.string().email().max(200),
});

function buildWelcomeHtml(email: string) {
	return emailLayout({
		label: "Newsletter",
		unsubscribeEmail: email,
		content: `
      <h1 style="${s.h1}">Welcome to the webvise newsletter</h1>
      <p style="${s.p}">You're in. We'll send you occasional updates on web performance, modern development, and what we're building.</p>
      <p style="${s.p}">No spam, no fluff. Unsubscribe anytime by replying to any email.</p>
      <hr style="${s.hr}">
      <p style="${s.p};margin-bottom:0">If you have a project in mind, we'd love to hear about it.</p>
      <div style="margin-top:16px">
        <a href="https://cal.com/webvise" style="${s.button}">Book a Free Call</a>
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
		const { email } = schema.parse(body);

		const resendApiKey = process.env.RESEND_API_KEY;

		if (!resendApiKey) {
			console.error("RESEND_API_KEY not configured");
			return NextResponse.json(
				{ error: "Newsletter service not configured" },
				{ status: 500 }
			);
		}

		// Add contact to Resend
		const contactRes = await fetch("https://api.resend.com/contacts", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${resendApiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, unsubscribed: false }),
		});

		if (!contactRes.ok) {
			const error = await contactRes.text();
			console.error("Resend contacts error:", error);
			return NextResponse.json(
				{ error: "Failed to subscribe" },
				{ status: 500 }
			);
		}

		// Send welcome email
		const emailRes = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${resendApiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from: "webvise <hello@webvise.io>",
				to: [email],
				subject: "Welcome to the webvise newsletter",
				headers: {
					"List-Unsubscribe": `<${unsubscribeUrl(email)}>`,
					"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
				},
				html: buildWelcomeHtml(email),
				text: [
					"Welcome to the webvise newsletter",
					"",
					"You're in. We'll send you occasional updates on web performance, modern development, and what we're building.",
					"",
					"No spam, no fluff. Unsubscribe anytime by replying to any email.",
					"",
					"If you have a project in mind, we'd love to hear about it.",
					"Book a free call: https://cal.com/webvise",
					"",
					"- The webvise team",
				].join("\n"),
			}),
		});

		if (!emailRes.ok) {
			console.error("Failed to send welcome email:", await emailRes.text());
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid email address" },
				{ status: 400 }
			);
		}
		console.error("Newsletter error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
