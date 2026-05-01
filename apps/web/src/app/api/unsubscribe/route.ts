import { setContact } from "@webvise-app/api/email/resend";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");

	if (!token) {
		return NextResponse.redirect(
			new URL("/unsubscribe?error=missing", request.url)
		);
	}

	let email: string;
	try {
		email = Buffer.from(token, "base64url").toString("utf-8");
		if (!email?.includes("@")) {
			throw new Error("invalid");
		}
	} catch {
		return NextResponse.redirect(
			new URL("/unsubscribe?error=invalid", request.url)
		);
	}

	const result = await setContact({
		label: "unsubscribe",
		email,
		subscribed: false,
	});

	if (!result.ok && result.reason === "not_configured") {
		return NextResponse.redirect(
			new URL("/unsubscribe?error=config", request.url)
		);
	}

	return NextResponse.redirect(
		new URL("/unsubscribe?success=true", request.url)
	);
}
