import { emailLayout, newsletterConfirmationUrl, s } from "./template";

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

export function buildNewsletterWelcomeHtml(email: string) {
	return emailLayout({
		label: "Newsletter",
		unsubscribeEmail: email,
		content: `
      <h1 style="${s.h1}">Welcome to the webvise newsletter</h1>
      <p style="${s.p}">You're in. We'll send you occasional updates on web performance, modern development, and what we're building.</p>
      <p style="${s.p}">No spam, no fluff. Unsubscribe anytime by replying to any email.</p>
      <hr style="${s.hr}">
      <p style="${s.p};margin-bottom:0">If you have a project in mind, we'd love to hear about it.</p>
      <div style="margin-top:16px">
        <a href="https://cal.com/webvise" style="${s.button}">Book a Free Call</a>
      </div>`,
	});
}

export function newsletterWelcomeText() {
	return [
		"Welcome to the webvise newsletter",
		"",
		"You're in. We'll send you occasional updates on web performance, modern development, and what we're building.",
		"",
		"No spam, no fluff. Unsubscribe anytime by replying to any email.",
		"",
		"If you have a project in mind, we'd love to hear about it.",
		"Book a free call: https://cal.com/webvise",
		"",
		"- The webvise team",
	].join("\n");
}
