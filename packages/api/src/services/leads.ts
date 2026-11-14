import { db } from "@webvise-app/db";
import { leadEvent } from "@webvise-app/db/schema/newsletter";
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
 */
export async function recordLead(lead: LeadInput): Promise<void> {
	const email = lead.email.trim().toLowerCase();

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
	}

	await syncLeadToAttio({
		email,
		name: lead.name,
		noteTitle: lead.note.title,
		noteContent: lead.note.content,
	});
}
