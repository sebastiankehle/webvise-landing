import {
	emailLayout,
	escapeHtml,
	newsletterConfirmationUrl,
	s,
	tableRow,
} from "./template";

export type WelcomeTopic = "ai-agents" | "ai-automation" | "web";

export type EmailLocale = "de" | "en";

export interface WelcomeSource {
	postTitle?: string;
	topic: WelcomeTopic;
}

/** The language of the page a reader signed up on, read from its path. */
export function emailLocaleFromPath(path: string | null | undefined) {
	return path === "/en" || path?.startsWith("/en/") ? "en" : "de";
}

const TOPIC_COPY: Record<
	EmailLocale,
	Record<WelcomeTopic, { expect: string; offer: string }>
> = {
	en: {
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
	},
	de: {
		"ai-agents": {
			expect:
				"Sie erhalten vor allem E-Mails über KI-Agenten: was bei Kunden im Betrieb läuft, was funktioniert und was nicht.",
			offer:
				"Wenn Sie über Agenten für Ihr eigenes Unternehmen nachdenken, antworten Sie auf diese E-Mail. Wir bauen sie.",
		},
		"ai-automation": {
			expect:
				"Sie erhalten vor allem E-Mails über KI-Automation: echte Workflows, die wir für Unternehmen bauen, und was sie kosten.",
			offer:
				"Wenn ein Teil Ihres Betriebs noch über Kopieren und Einfügen läuft, antworten Sie und beschreiben Sie ihn. Das ist unsere Arbeit.",
		},
		web: {
			expect:
				"Sie erhalten vor allem E-Mails über Websites: Performance, SEO und was eine schnelle Seite braucht.",
			offer:
				"Wenn Ihre Website langsam ist oder zu wenige Anfragen bringt, antworten Sie auf diese E-Mail. Wir sehen sie uns an.",
		},
	},
};

const COPY = {
	en: {
		confirmSubject: "Confirm your webvise newsletter subscription",
		confirmTitle: "Confirm your subscription",
		confirmBody:
			"You signed up for the webvise newsletter. One click and you're on the list.",
		confirmAction: "Confirm subscription",
		confirmIgnore: "If you did not request this, ignore this email.",
		welcomeSubject: "Welcome to the webvise newsletter",
		welcomeTitle: "Welcome",
		onTheList: "You're on the list.",
		signedUpReading: (title: string) =>
			`You signed up while reading "${title}".`,
		genericExpect:
			"We send occasional emails on web performance, modern development, and what we're building.",
		genericOffer:
			"If you have a project in mind, reply to this email. We read every reply.",
		noSpam: "No spam. Unsubscribe anytime by replying.",
		bookCall: "Book a free call",
		unsubscribe: "Unsubscribe",
		signOff: "- The webvise team",
	},
	de: {
		confirmSubject:
			"Bitte bestätigen Sie Ihre Anmeldung zum webvise Newsletter",
		confirmTitle: "Anmeldung bestätigen",
		confirmBody:
			"Sie haben sich für den webvise Newsletter angemeldet. Ein Klick, und Sie stehen auf der Liste.",
		confirmAction: "Anmeldung bestätigen",
		confirmIgnore:
			"Falls Sie das nicht angefordert haben, ignorieren Sie diese E-Mail.",
		welcomeSubject: "Willkommen beim webvise Newsletter",
		welcomeTitle: "Willkommen",
		onTheList: "Sie stehen auf der Liste.",
		signedUpReading: (title: string) =>
			`Sie haben sich beim Lesen von „${title}“ angemeldet.`,
		genericExpect:
			"Wir schreiben gelegentlich über Web-Performance, moderne Entwicklung und das, woran wir gerade bauen.",
		genericOffer:
			"Wenn Sie ein Projekt im Kopf haben, antworten Sie auf diese E-Mail. Wir lesen jede Antwort.",
		noSpam:
			"Kein Spam. Abmelden können Sie sich jederzeit mit einer Antwort auf diese E-Mail.",
		bookCall: "Kostenloses Gespräch buchen",
		unsubscribe: "Abmelden",
		signOff: "- Das webvise Team",
	},
} as const;

export const NEWSLETTER_CONFIRMATION_SUBJECT = COPY.en.confirmSubject;
export const NEWSLETTER_WELCOME_SUBJECT = COPY.en.welcomeSubject;

export function newsletterConfirmationSubject(locale: EmailLocale = "en") {
	return COPY[locale].confirmSubject;
}

export function newsletterWelcomeSubject(locale: EmailLocale = "en") {
	return COPY[locale].welcomeSubject;
}

export function buildNewsletterConfirmationHtml(
	email: string,
	locale: EmailLocale = "en"
) {
	const confirmationUrl = newsletterConfirmationUrl(email);
	const t = COPY[locale];

	return emailLayout({
		label: "Newsletter",
		content: `
      <h1 style="${s.h1}">${t.confirmTitle}</h1>
      <p style="${s.p}">${t.confirmBody}</p>
      <div style="margin:20px 0">
        <a href="${confirmationUrl}" style="${s.button}">${t.confirmAction}</a>
      </div>
      <hr style="${s.hr}">
      <p style="${s.p};margin-bottom:0">${t.confirmIgnore}</p>`,
	});
}

export function newsletterConfirmationText(
	email: string,
	locale: EmailLocale = "en"
) {
	const confirmationUrl = newsletterConfirmationUrl(email);
	const t = COPY[locale];

	return [
		t.confirmSubject,
		"",
		t.confirmBody,
		"",
		`${t.confirmAction}: ${confirmationUrl}`,
		"",
		t.confirmIgnore,
		"",
		t.signOff,
	].join("\n");
}

function welcomeCopy(source: WelcomeSource | undefined, locale: EmailLocale) {
	const t = COPY[locale];
	const topicCopy = source ? TOPIC_COPY[locale][source.topic] : undefined;
	return {
		intro: source?.postTitle
			? t.signedUpReading(source.postTitle)
			: t.onTheList,
		expect: topicCopy?.expect ?? t.genericExpect,
		offer: topicCopy?.offer ?? t.genericOffer,
	};
}

export function buildNewsletterWelcomeHtml(
	email: string,
	source?: WelcomeSource,
	locale: EmailLocale = "en"
) {
	const copy = welcomeCopy(source, locale);
	const t = COPY[locale];

	return emailLayout({
		label: "Newsletter",
		unsubscribeEmail: email,
		unsubscribeLabel: t.unsubscribe,
		content: `
      <h1 style="${s.h1}">${t.welcomeTitle}</h1>
      <p style="${s.p}">${escapeHtml(copy.intro)}</p>
      <p style="${s.p}">${escapeHtml(copy.expect)}</p>
      <p style="${s.p}">${t.noSpam}</p>
      <hr style="${s.hr}">
      <p style="${s.p};margin-bottom:0">${escapeHtml(copy.offer)}</p>
      <div style="margin-top:16px">
        <a href="https://cal.com/webvise" style="${s.button}">${t.bookCall}</a>
      </div>`,
	});
}

export function newsletterWelcomeText(
	source?: WelcomeSource,
	locale: EmailLocale = "en"
) {
	const copy = welcomeCopy(source, locale);
	const t = COPY[locale];

	return [
		t.welcomeTitle,
		"",
		copy.intro,
		copy.expect,
		"",
		t.noSpam,
		"",
		copy.offer,
		`${t.bookCall}: https://cal.com/webvise`,
		"",
		t.signOff,
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
