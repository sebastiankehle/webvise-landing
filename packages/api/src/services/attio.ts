import { env } from "@webvise-app/env/server";

interface ContactLead {
	company?: string;
	email: string;
	message?: string;
	name: string;
	service?: string;
}

const ATTIO_API = "https://api.attio.com/v2";
const WHITESPACE = /\s+/;

/**
 * Mirrors a contact form submission into Attio: upserts the person by email
 * and attaches the submission as a note. Never throws — the email to
 * mail@webvise.io is the primary channel; Attio is best-effort.
 */
export async function syncContactToAttio(lead: ContactLead): Promise<void> {
	const apiKey = env.ATTIO_API_KEY;
	if (!apiKey) {
		console.error("[attio:contact] ATTIO_API_KEY not configured");
		return;
	}

	const headers = {
		Authorization: `Bearer ${apiKey}`,
		"Content-Type": "application/json",
	};

	try {
		const [firstName = "", ...rest] = lead.name.split(WHITESPACE);
		const personRes = await fetch(
			`${ATTIO_API}/objects/people/records?matching_attribute=email_addresses`,
			{
				method: "PUT",
				headers,
				body: JSON.stringify({
					data: {
						values: {
							email_addresses: [{ email_address: lead.email }],
							name: [
								{
									first_name: firstName,
									last_name: rest.join(" "),
									full_name: lead.name,
								},
							],
						},
					},
				}),
			}
		);
		if (!personRes.ok) {
			console.error(
				"[attio:contact] person upsert failed:",
				await personRes.text()
			);
			return;
		}
		const person = (await personRes.json()) as {
			data: { id: { record_id: string } };
		};

		const content = [
			`Email: ${lead.email}`,
			lead.company ? `Company: ${lead.company}` : null,
			lead.service ? `Service: ${lead.service}` : null,
			lead.message ? `\n${lead.message}` : null,
		]
			.filter(Boolean)
			.join("\n");

		const noteRes = await fetch(`${ATTIO_API}/notes`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				data: {
					parent_object: "people",
					parent_record_id: person.data.id.record_id,
					title: "Website contact form",
					format: "plaintext",
					content,
				},
			}),
		});
		if (!noteRes.ok) {
			console.error(
				"[attio:contact] note create failed:",
				await noteRes.text()
			);
		}
	} catch (err) {
		console.error(
			"[attio:contact] sync failed:",
			err instanceof Error ? err.message : String(err)
		);
	}
}
