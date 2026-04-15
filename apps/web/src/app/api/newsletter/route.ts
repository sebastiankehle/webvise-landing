import { NextResponse } from "next/server";
import { z } from "zod";
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

export async function POST(request: Request) {
	const { limited, retryAfterSec } = limiter.check(getClientIP(request));
	if (limited) return rateLimitResponse(retryAfterSec);

	try {
		const body = await request.json();
		const { email } = schema.parse(body);

		const resendApiKey = process.env.RESEND_API_KEY;
		const audienceId = process.env.RESEND_AUDIENCE_ID;

		if (!resendApiKey || !audienceId) {
			console.error("RESEND_API_KEY or RESEND_AUDIENCE_ID not configured");
			return NextResponse.json(
				{ error: "Newsletter service not configured" },
				{ status: 500 },
			);
		}

		const res = await fetch(
			`https://api.resend.com/audiences/${audienceId}/contacts`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${resendApiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, unsubscribed: false }),
			},
		);

		if (!res.ok) {
			const error = await res.text();
			console.error("Resend Audiences error:", error);
			return NextResponse.json(
				{ error: "Failed to subscribe" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid email address" },
				{ status: 400 },
			);
		}
		console.error("Newsletter error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
