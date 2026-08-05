import {
	emailLayout,
	escapeHtml,
	newsletterConfirmationUrl,
	s,
} from "./template";

export type WelcomeTopic = "ai-agents" | "ai-automation" | "web";

export interface WelcomeSource {
	postTitle?: string;
	topic: WelcomeTopic;
}

const TOPIC_COPY: Record<WelcomeTopic, { expect: string; offer: string }> = {
	"ai-agents": {
		expect:
			"Expect hands-on material on AI agents: memory, tool use, and what holds up in production.",
		offer:
			"If you want agents working inside your business, that's what we build.",
	},
	"ai-automation": {
		expect:
			"Expect practical material on putting AI to work in a business: automation, workflows, and honest cost-benefit breakdowns.",
		offer:
			"If you want to automate part of your operation, that's what we build.",
	},
	web: {
		expect:
			"Expect practical material on fast, modern websites: performance, SEO, and clean engineering.",
		offer:
			"If your website should be faster or bring in more leads, that's our core work.",
	},
};

const GENERIC_EXPECT =
	"You're in. We'll send you occasional updates on web performance, modern development, and what we're building.";
const GENERIC_OFFER =
	"If you have a project in mind, we'd love to hear about it.";

export const NEWSLETTER_CONFIRMATION_SUBJECT =
	"Confirm your webvise newsletter subscription";
export const NEWSLETTER_WELCOME_SUBJECT = "Welcome to the webvise newsletter";

export function buildNewsletterConfirmationHtml(email: string) {
	const confirmationUrl = newsletterConfirmationUrl(email);

	return emailLayout({
		label: "Newsletter",
		content: `
      <h1 style="${s.h1}">Confirm your newsletter subscription</h1>
      <p style="${s.p}">Please confirm that you want to receive occasional updates from webvise on web performance, modern development, and what we're building.</p>
      <div style="margin:20px 0">
        <a href="${confirmationUrl}" style="${s.button}">Confirm subscription</a>
      </div>
      <hr style="${s.hr}">
      <p style="${s.p};margin-bottom:0">If you did not request this, you can ignore this email.</p>`,
	});
}

export function newsletterConfirmationText(email: string) {
	const confirmationUrl = newsletterConfirmationUrl(email);

	return [
		"Confirm your webvise newsletter subscription",
		"",
		"Please confirm that you want to receive occasional updates from webvise on web performance, modern development, and what we're building.",
		"",
		`Confirm subscription: ${confirmationUrl}`,
		"",
		"If you did not request this, you can ignore this email.",
		"",
		"- The webvise team",
	].join("\n");
}

function welcomeCopy(source?: WelcomeSource) {
	const topicCopy = source ? TOPIC_COPY[source.topic] : undefined;
	return {
		intro: source?.postTitle
			? `You're in — you signed up while reading "${source.postTitle}".`
			: undefined,
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
      <h1 style="${s.h1}">Welcome to the webvise newsletter</h1>
      ${copy.intro ? `<p style="${s.p}">${escapeHtml(copy.intro)}</p>` : ""}
      <p style="${s.p}">${escapeHtml(copy.expect)}</p>
      <p style="${s.p}">No spam, no fluff. Unsubscribe anytime by replying to any email.</p>
      <hr style="${s.hr}">
      <p style="${s.p};margin-bottom:0">${escapeHtml(copy.offer)}</p>
      <div style="margin-top:16px">
        <a href="https://cal.com/webvise" style="${s.button}">Book a Free Call</a>
      </div>`,
	});
}

export function newsletterWelcomeText(source?: WelcomeSource) {
	const copy = welcomeCopy(source);

	return [
		"Welcome to the webvise newsletter",
		"",
		...(copy.intro ? [copy.intro, ""] : []),
		copy.expect,
		"",
		"No spam, no fluff. Unsubscribe anytime by replying to any email.",
		"",
		copy.offer,
		"Book a free call: https://cal.com/webvise",
		"",
		"- The webvise team",
	].join("\n");
}
