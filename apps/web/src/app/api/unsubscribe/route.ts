import { setContact } from "@webvise-app/api/email/resend";
import { verifyUnsubscribeToken } from "@webvise-app/api/email/unsubscribe-token";
import { db } from "@webvise-app/db";
import { newsletterSubscriber } from "@webvise-app/db/schema/newsletter";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Resend decides who gets mail, so it must succeed. The row only records the
// state, so a database failure must not turn a success into an error.
async function unsubscribe(email: string) {
	const result = await setContact({
		label: "unsubscribe",
		email,
		subscribed: false,
	});
	if (!result.ok) {
		return result;
	}

	try {
		await db
			.update(newsletterSubscriber)
			.set({ status: "unsubscribed", updatedAt: new Date() })
			.where(eq(newsletterSubscriber.email, email));
	} catch (err) {
		console.error(
			"[unsubscribe] failed to update subscriber row:",
			err instanceof Error ? err.message : err
		);
	}
	return result;
}

// A mail scanner may open this link, so GET only leads to the page with the
// confirm button. The POST below does the work.
export function GET(request: Request) {
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

	return NextResponse.redirect(
		new URL(`/unsubscribe?token=${encodeURIComponent(token)}`, request.url)
	);
}

async function readFormToken(request: Request): Promise<string | null> {
	const contentType = request.headers.get("content-type") ?? "";
	if (
		!(
			contentType.includes("application/x-www-form-urlencoded") ||
			contentType.includes("multipart/form-data")
		)
	) {
		return null;
	}
	try {
		const token = (await request.formData()).get("token");
		return typeof token === "string" ? token : null;
	} catch {
		return null;
	}
}

export async function POST(request: Request) {
	const formToken = await readFormToken(request);

	// Form post from our unsubscribe page: answer with a redirect.
	if (formToken !== null) {
		const verified = verifyUnsubscribeToken(formToken);
		if (!verified.ok) {
			return NextResponse.redirect(
				new URL("/unsubscribe?error=invalid", request.url),
				303
			);
		}
		const result = await unsubscribe(verified.email);
		if (!result.ok) {
			const error = result.reason === "not_configured" ? "config" : "failed";
			return NextResponse.redirect(
				new URL(`/unsubscribe?error=${error}`, request.url),
				303
			);
		}
		return NextResponse.redirect(
			new URL("/unsubscribe?success=true", request.url),
			303
		);
	}

	// RFC 8058 one-click unsubscribe: mail providers POST to the
	// List-Unsubscribe URL without rendering anything, so no redirect.
	const token = new URL(request.url).searchParams.get("token");
	if (!token) {
		return new NextResponse(null, { status: 400 });
	}

	const verified = verifyUnsubscribeToken(token);
	if (!verified.ok) {
		return new NextResponse(null, { status: 400 });
	}

	const result = await unsubscribe(verified.email);
	return new NextResponse(null, { status: result.ok ? 200 : 500 });
}
