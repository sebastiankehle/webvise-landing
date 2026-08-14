import {
	emailLayout,
	escapeHtml,
	newsletterConfirmationUrl,
	s,
	tableRow,
} from "./template";

export type WelcomeTopic = "ai-agents" | "ai-automation" | "web";

export interface WelcomeSource {
	postTitle?: string;
	topic: WelcomeTopic;
}

const TOPIC_COPY: Record<WelcomeTopic, { expect: string; offer: string }> = {
	"ai-agents": {
		expect:
			"You'll mostly get emails about AI agents: what we run in production for clients, what works, what breaks.",
		offer:
			"If you're thinking about agents for your own business, reply to this email. We build them.",
	},
	"ai-automation": {
		expect:
			"You'll mostly get emails about AI automation: real workflows we build for companies and what they cost.",
		offer:
			"If part of your operation still runs on copy-paste, reply and describe it. That's the work we do.",
	},
	web: {
		expect:
			"You'll mostly get emails about websites: performance, SEO, and what a fast site takes.",
		offer:
			"If your site is slow or brings in too few leads, reply to this email. We can take a look.",
	},
};

const GENERIC_EXPECT =
	"We send occasional emails on web performance, modern development, and what we're building.";
const GENERIC_OFFER =
	"If you have a project in mind, reply to this email. We read every reply.";

export const NEWSLETTER_CONFIRMATION_SUBJECT =
	"Confirm your webvise newsletter subscription";
export const NEWSLETTER_WELCOME_SUBJECT = "Welcome to the webvise newsletter";

export function buildNewsletterConfirmationHtml(email: string) {
	const confirmationUrl = newsletterConfirmationUrl(email);

	return emailLayout({
		label: "Newsletter",
		content: `
      <h1 style="${s.h1}">Confirm your subscription</h1>
      <p style="${s.p}">You signed up for the webvise newsletter. One click and you're on the list.</p>
      <div style="margin:20px 0">
        <a href="${confirmationUrl}" style="${s.button}">Confirm subscription</a>
      </div>
      <hr style="${s.hr}">
      <p style="${s.p};margin-bottom:0">If you did not request this, ignore this email.</p>`,
	});
}

export function newsletterConfirmationText(email: string) {
	const confirmationUrl = newsletterConfirmationUrl(email);

	return [
		"Confirm your webvise newsletter subscription",
		"",
		"You signed up for the webvise newsletter. One click and you're on the list.",
		"",
		`Confirm subscription: ${confirmationUrl}`,
		"",
		"If you did not request this, ignore this email.",
		"",
		"- The webvise team",
	].join("\n");
}

function welcomeCopy(source?: WelcomeSource) {
	const topicCopy = source ? TOPIC_COPY[source.topic] : undefined;
	return {
		intro: source?.postTitle
			? `You signed up while reading "${source.postTitle}".`
			: "You're on the list.",
		expect: topicCopy?.expect ?? GENERIC_EXPECT,
		offer: topicCopy?.offer ?? GENERIC_OFFER,
	};
}

export function buildNewsletterWelcomeHtml(
	email: string,
	source?: WelcomeSource
) {
	const copy = welcomeCopy(source);

	return emailLayout({
		label: "Newsletter",
		unsubscribeEmail: email,
		content: `
      <h1 style="${s.h1}">Welcome</h1>
      <p style="${s.p}">${escapeHtml(copy.intro)}</p>
      <p style="${s.p}">${escapeHtml(copy.expect)}</p>
      <p style="${s.p}">No spam. Unsubscribe anytime by replying.</p>
      <hr style="${s.hr}">
      <p style="${s.p};margin-bottom:0">${escapeHtml(copy.offer)}</p>
      <div style="margin-top:16px">
        <a href="https://cal.com/webvise" style="${s.button}">Book a free call</a>
      </div>`,
	});
}

export function newsletterWelcomeText(source?: WelcomeSource) {
	const copy = welcomeCopy(source);

	return [
		"Welcome",
		"",
		copy.intro,
		copy.expect,
		"",
		"No spam. Unsubscribe anytime by replying.",
		"",
		copy.offer,
		"Book a free call: https://cal.com/webvise",
		"",
		"- The webvise team",
	].join("\n");
}

export interface SubscriberNotification {
	email: string;
	interests?: Array<{
		eventType: "newsletter_signup" | "deck_request";
		path: string;
		topic: string | null;
	}>;
	path: string;
	placement: string;
	postTitle?: string;
}

function formatInterest(
	interest: NonNullable<SubscriberNotification["interests"]>[number]
) {
	let label =
		interest.eventType === "deck_request"
			? "Deck request"
			: "Newsletter signup";
	if (interest.topic) {
		label += `: ${interest.topic}`;
	}
	return `${label} · ${interest.path || "unknown"}`;
}

function notificationRows(info: SubscriberNotification): [string, string][] {
	return [
		["Email", info.email],
		["Placement", info.placement],
		["Page", info.path || "unknown"],
		...(info.postTitle
			? [["Article", info.postTitle] as [string, string]]
			: []),
		...(info.interests ?? []).map((interest): [string, string] => [
			"Interest",
			formatInterest(interest),
		]),
	];
}

export function buildSubscriberNotificationHtml(info: SubscriberNotification) {
	const rows = notificationRows(info)
		.map(([label, value]) => tableRow(label, escapeHtml(value)))
		.join("");

	return emailLayout({
		label: "Newsletter",
		content: `
      <h1 style="${s.h1}">New newsletter subscriber</h1>
      <table style="border-collapse:collapse">${rows}</table>`,
	});
}

export function subscriberNotificationText(info: SubscriberNotification) {
	return [
		"New newsletter subscriber",
		"",
		...notificationRows(info).map(([label, value]) => `${label}: ${value}`),
	].join("\n");
}
