import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");

	if (!token) {
		return NextResponse.redirect(
			new URL("/unsubscribe?error=missing", request.url),
		);
	}

	let email: string;
	try {
		email = Buffer.from(token, "base64url").toString("utf-8");
		if (!email || !email.includes("@")) throw new Error("invalid");
	} catch {
		return NextResponse.redirect(
			new URL("/unsubscribe?error=invalid", request.url),
		);
	}

	const apiKey = process.env.RESEND_API_KEY;

	if (!apiKey) {
		console.error("RESEND_API_KEY not configured");
		return NextResponse.redirect(
			new URL("/unsubscribe?error=config", request.url),
		);
	}

	try {
		const res = await fetch("https://api.resend.com/contacts", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, unsubscribed: true }),
		});

		if (!res.ok) {
			const body = await res.text();
			console.error("Resend unsubscribe error:", res.status, body);
		}
	} catch (err) {
		console.error("Unsubscribe fetch error:", err);
	}

	return NextResponse.redirect(
		new URL("/unsubscribe?success=true", request.url),
	);
}
