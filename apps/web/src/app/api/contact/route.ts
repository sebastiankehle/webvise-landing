import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
	name: z.string().min(1).max(200),
	email: z.string().email().max(200),
	company: z.string().max(200).optional(),
	service: z.string().max(100).optional(),
	message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
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

		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${resendApiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from: "webvise <noreply@webvise.io>",
				to: [contactEmail],
				subject: `New inquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
				text: [
					`Name: ${data.name}`,
					`Email: ${data.email}`,
					data.company ? `Company: ${data.company}` : null,
					data.service ? `Service: ${data.service}` : null,
					"",
					"Message:",
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
