import {
	buildNewsletterWelcomeHtml,
	NEWSLETTER_WELCOME_SUBJECT,
	newsletterWelcomeText,
} from "@webvise-app/api/email/newsletter";
import { verifyNewsletterConfirmationToken } from "@webvise-app/api/email/newsletter-confirmation-token";
import { sendEmail, setContact } from "@webvise-app/api/email/resend";
import { unsubscribeUrl } from "@webvise-app/api/email/template";
import { NextResponse } from "next/server";

function redirectToResult(request: Request, params: Record<string, string>) {
	const url = new URL("/newsletter-confirmed", request.url);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	return NextResponse.redirect(url);
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");

	if (!token) {
		return redirectToResult(request, { error: "missing" });
	}

	const verified = verifyNewsletterConfirmationToken(token);
	if (!verified.ok) {
		return redirectToResult(request, { error: "invalid" });
	}
	const email = verified.email;

	const contactResult = await setContact({
		label: "newsletter-confirm",
		email,
		subscribed: true,
	});

	if (!contactResult.ok) {
		return redirectToResult(request, {
			error: contactResult.reason === "not_configured" ? "config" : "failed",
		});
	}

	const emailResult = await sendEmail({
		label: "newsletter-welcome",
		from: "webvise <hello@webvise.io>",
		to: email,
		subject: NEWSLETTER_WELCOME_SUBJECT,
		headers: {
			"List-Unsubscribe": `<${unsubscribeUrl(email)}>`,
			"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
		},
		html: buildNewsletterWelcomeHtml(email),
		text: newsletterWelcomeText(),
	});
	if (!emailResult.ok) {
		console.error(
			`[email:newsletter-welcome] failed to send welcome email to ${email}:`,
			emailResult.reason,
			emailResult.details ?? ""
		);
	}

	return redirectToResult(request, { success: "true" });
}
