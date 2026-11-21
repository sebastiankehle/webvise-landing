import { db } from "@webvise-app/db";
import { leadEvent } from "@webvise-app/db/schema/newsletter";
import { env } from "@webvise-app/env/server";
import type { EmailResult } from "../email/resend";
import { getPostHogClient } from "../posthog";
import { syncLeadToAttio } from "./attio";

export type LeadType =
	| "ai_visibility_check"
	| "contact"
	| "partner_application"
	| "wp_health_report";

export interface LeadInput {
	email: string;
	name?: string;
	note: { content: string; title: string };
	path: string;
	placement: string;
	topic?: string | null;
	type: LeadType;
}

/**
 * Stores a lead in lead_event and mirrors it to Attio. Both writes are
 * best-effort: this never throws, so a failure cannot block the form.
 * Resolves true when at least one of the two writes kept the lead.
 */
export async function recordLead(lead: LeadInput): Promise<boolean> {
	const email = lead.email.trim().toLowerCase();

	let stored = true;
	try {
		await db.insert(leadEvent).values({
			email,
			eventType: lead.type,
			placement: lead.placement,
			path: lead.path,
			topic: lead.topic ?? null,
		});
	} catch (e) {
		console.error("[leads] failed to store lead:", e);
		stored = false;
	}

	const synced = await syncLeadToAttio({
		email,
		name: lead.name,
		noteTitle: lead.note.title,
		noteContent: lead.note.content,
	});
	return stored || synced;
}

/**
 * Reports a lead whose notification email to webvise failed. `stored` says
 * whether the database or Attio still has it. Production also sends a
 * `lead_notification_failed` event to PostHog, without the email address.
 * Never throws.
 */
export async function reportLeadNotificationFailure(
	type: LeadType,
	result: Extract<EmailResult, { ok: false }>,
	stored: boolean
): Promise<void> {
	console.error(
		`[leads] ${type} notification email failed (${result.reason}); lead ${stored ? "stored" : "lost"}`
	);
	if (env.VERCEL_ENV !== "production") {
		return;
	}
	try {
		const posthog = getPostHogClient();
		posthog?.capture({
			distinctId: "webvise-api",
			event: "lead_notification_failed",
			properties: {
				lead_type: type,
				reason: result.reason,
				stored,
				$process_person_profile: false,
			},
		});
		await posthog?.flush();
	} catch (e) {
		console.error("[leads] could not report the failed notification:", e);
	}
}
