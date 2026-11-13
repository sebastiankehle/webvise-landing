import { env } from "@webvise-app/env/server";

interface ContactLead {
	company?: string;
	email: string;
	message?: string;
	name: string;
	service?: string;
}

interface AttioLead {
	email: string;
	name?: string;
	noteContent: string;
	noteTitle: string;
}

const ATTIO_API = "https://api.attio.com/v2";
const WHITESPACE = /\s+/;

/**
 * Upserts the person by email in Attio and attaches a note. Never throws:
 * the notification email is the primary channel; Attio is best-effort.
 */
export async function syncLeadToAttio(lead: AttioLead): Promise<void> {
	const tag = `[attio:${lead.noteTitle}]`;
	const apiKey = env.ATTIO_API_KEY;
	if (!apiKey) {
		console.error(`${tag} ATTIO_API_KEY not configured`);
		return;
	}

	const headers = {
		Authorization: `Bearer ${apiKey}`,
		"Content-Type": "application/json",
	};

	try {
		const values: Record<string, unknown> = {
			email_addresses: [{ email_address: lead.email }],
		};
		if (lead.name) {
			const [firstName = "", ...rest] = lead.name.split(WHITESPACE);
			values.name = [
				{
					first_name: firstName,
					last_name: rest.join(" "),
					full_name: lead.name,
				},
			];
		}
		const personRes = await fetch(
			`${ATTIO_API}/objects/people/records?matching_attribute=email_addresses`,
			{
				method: "PUT",
				headers,
				body: JSON.stringify({ data: { values } }),
			}
		);
		if (!personRes.ok) {
			console.error(`${tag} person upsert failed:`, await personRes.text());
			return;
		}
		const person = (await personRes.json()) as {
			data: { id: { record_id: string } };
		};

		const noteRes = await fetch(`${ATTIO_API}/notes`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				data: {
					parent_object: "people",
					parent_record_id: person.data.id.record_id,
					title: lead.noteTitle,
					format: "plaintext",
					content: lead.noteContent,
				},
			}),
		});
		if (!noteRes.ok) {
			console.error(`${tag} note create failed:`, await noteRes.text());
		}
	} catch (err) {
		console.error(
			`${tag} sync failed:`,
			err instanceof Error ? err.message : String(err)
		);
	}
}

/** Mirrors a contact form submission into Attio. */
export function syncContactToAttio(lead: ContactLead): Promise<void> {
	return syncLeadToAttio({
		email: lead.email,
		name: lead.name,
		noteTitle: "Website contact form",
		noteContent: [
			`Email: ${lead.email}`,
			lead.company ? `Company: ${lead.company}` : null,
			lead.service ? `Service: ${lead.service}` : null,
			lead.message ? `\n${lead.message}` : null,
		]
			.filter(Boolean)
			.join("\n"),
	});
}
