import {
	buildNewsletterWelcomeHtml,
	buildSubscriberNotificationHtml,
	NEWSLETTER_WELCOME_SUBJECT,
	newsletterWelcomeText,
	subscriberNotificationText,
} from "@webvise-app/api/email/newsletter";
import { verifyNewsletterConfirmationToken } from "@webvise-app/api/email/newsletter-confirmation-token";
import { sendEmail, setContact } from "@webvise-app/api/email/resend";
import { unsubscribeUrl } from "@webvise-app/api/email/template";
import { db } from "@webvise-app/db";
import { newsletterSubscriber } from "@webvise-app/db/schema/newsletter";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { welcomeSourceFromPath } from "@/lib/newsletter-topic";

interface Interest {
	eventType: "newsletter_signup" | "deck_request";
	path: string;
	topic: string | null;
}

function redirectToResult(
	request: Request,
	params: Record<string, string>,
	status: 303 | 307 = 307
) {
	const forwardedHost = request.headers.get("x-forwarded-host");
	const forwardedProto = request.headers.get("x-forwarded-proto");
	const fallbackOrigin = new URL(request.url).origin;
	const publicOrigin = forwardedHost
		? `${forwardedProto === "http" ? "http" : "https"}://${forwardedHost}`
		: fallbackOrigin;
	const url = new URL("/newsletter-confirmed", publicOrigin);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	return NextResponse.redirect(url, status);
}

async function getInterests(email: string): Promise<Interest[]> {
	try {
		return await db.query.leadEvent.findMany({
			where: (event, { eq }) => eq(event.email, email),
			orderBy: (event, { asc }) => [asc(event.createdAt)],
			columns: {
				eventType: true,
				path: true,
				topic: true,
			},
			limit: 20,
		});
	} catch (err) {
		console.error(
			"[email:newsletter-confirm] failed to read interest events:",
			err instanceof Error ? err.message : err
		);
		return [];
	}
}

export function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const token = searchParams.get("token");

	if (!token) {
		return redirectToResult(request, { error: "missing" });
	}

	const verified = verifyNewsletterConfirmationToken(token);
	if (!verified.ok) {
		return redirectToResult(request, { error: "invalid" });
	}

	return redirectToResult(request, { token });
}

export async function POST(request: Request) {
	const formData = await request.formData();
	const token = formData.get("token");
	if (typeof token !== "string") {
		return redirectToResult(request, { error: "missing" }, 303);
	}

	const verified = verifyNewsletterConfirmationToken(token);
	if (!verified.ok) {
		return redirectToResult(request, { error: "invalid" }, 303);
	}
	const email = verified.email;

	// Confirm the subscriber row and read back the signup source. The insert
	// covers the edge case where the pending row was never written.
	let subscriberPath: string | null = null;
	let subscriberPlacement = "unknown";
	try {
		const [row] = await db
			.insert(newsletterSubscriber)
			.values({
				email,
				placement: "unknown",
				path: "",
				status: "confirmed",
				confirmedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: newsletterSubscriber.email,
				set: {
					status: "confirmed",
					confirmedAt: new Date(),
					updatedAt: new Date(),
				},
				setWhere: sql`${newsletterSubscriber.status} = 'pending'`,
			})
			.returning({
				path: newsletterSubscriber.path,
				placement: newsletterSubscriber.placement,
			});
		subscriberPath = row?.path ?? null;
		subscriberPlacement = row?.placement ?? "unknown";
		if (!row) {
			return redirectToResult(request, { success: "true" }, 303);
		}
	} catch (err) {
		console.error(
			"[email:newsletter-confirm] failed to update subscriber row:",
			err instanceof Error ? err.message : err
		);
	}

	const contactResult = await setContact({
		label: "newsletter-confirm",
		email,
		subscribed: true,
	});

	if (!contactResult.ok) {
		return redirectToResult(
			request,
			{
				error: contactResult.reason === "not_configured" ? "config" : "failed",
			},
			303
		);
	}

	const source = welcomeSourceFromPath(subscriberPath);
	const interests = await getInterests(email);
	const emailResult = await sendEmail({
		label: "newsletter-welcome",
		from: "webvise <hello@webvise.io>",
		to: email,
		subject: NEWSLETTER_WELCOME_SUBJECT,
		headers: {
			"List-Unsubscribe": `<${unsubscribeUrl(email)}>`,
			"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
		},
		html: buildNewsletterWelcomeHtml(email, source),
		text: newsletterWelcomeText(source),
	});
	if (!emailResult.ok) {
		console.error(
			`[email:newsletter-welcome] failed to send welcome email to ${email}:`,
			emailResult.reason,
			emailResult.details ?? ""
		);
	}

	const notifyResult = await sendEmail({
		label: "newsletter-notify",
		from: "webvise <noreply@webvise.io>",
		to: process.env.CONTACT_EMAIL_TO || "mail@webvise.io",
		subject: `New newsletter subscriber: ${email}`,
		html: buildSubscriberNotificationHtml({
			email,
			placement: subscriberPlacement,
			path: subscriberPath ?? "",
			postTitle: source?.postTitle,
			interests,
		}),
		text: subscriberNotificationText({
			email,
			placement: subscriberPlacement,
			path: subscriberPath ?? "",
			postTitle: source?.postTitle,
			interests,
		}),
	});
	if (!notifyResult.ok) {
		console.error(
			"[email:newsletter-notify] failed to send subscriber notification:",
			notifyResult.reason,
			notifyResult.details ?? ""
		);
	}

	return redirectToResult(request, { success: "true" }, 303);
}
