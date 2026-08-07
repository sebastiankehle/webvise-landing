import { setContact } from "@webvise-app/api/email/resend";
import { verifyUnsubscribeToken } from "@webvise-app/api/email/unsubscribe-token";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");

	if (!token) {
		return NextResponse.redirect(
			new URL("/unsubscribe?error=missing", request.url)
		);
	}

	const verified = verifyUnsubscribeToken(token);
	if (!verified.ok) {
		return NextResponse.redirect(
			new URL("/unsubscribe?error=invalid", request.url)
		);
	}
	const email = verified.email;

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

// RFC 8058 one-click unsubscribe: mail providers POST to the
// List-Unsubscribe URL without rendering anything, so no redirect.
export async function POST(request: Request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");

	if (!token) {
		return new NextResponse(null, { status: 400 });
	}

	const verified = verifyUnsubscribeToken(token);
	if (!verified.ok) {
		return new NextResponse(null, { status: 400 });
	}

	const result = await setContact({
		label: "unsubscribe",
		email: verified.email,
		subscribed: false,
	});

	return new NextResponse(null, { status: result.ok ? 200 : 500 });
}
