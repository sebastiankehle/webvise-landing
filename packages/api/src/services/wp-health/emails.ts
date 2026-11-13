import {
	c,
	emailLayout,
	escapeHtml,
	s,
	scoreBadge,
	tableRow,
} from "../../email/template";
import { SITE_URL } from "../../site";

function urgencyLabel(mobileScore: number): { text: string; color: string } {
	if (mobileScore < 40) {
		return { text: "HOT LEAD - score critical", color: c.red };
	}
	if (mobileScore < 60) {
		return {
			text: "WARM LEAD - clear improvement opportunity",
			color: c.yellow,
		};
	}
	return { text: "COOL LEAD - already decent performance", color: c.textMuted };
}

export function buildAdminHtml(data: {
	url: string;
	email: string;
	firstName?: string;
	mobileScore: number;
	desktopScore: number;
	projectedScore: number;
	issues: Array<{ title: string; displayValue?: string; savingsMs?: number }>;
	securityFlags: string[];
	timestamp: string;
}) {
	const urgency = urgencyLabel(data.mobileScore);
	const url = escapeHtml(data.url);
	const email = escapeHtml(data.email);
	const rawName = data.firstName || data.email.split("@")[0] || data.email;
	const firstName = escapeHtml(rawName);
	const replyHref = escapeHtml(
		`mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent("Your webvise WordPress health report")}&body=${encodeURIComponent(`Hi ${rawName},\n\n`)}`
	);

	const issueRows = data.issues
		.map(
			(i) =>
				`<li style="margin:0 0 4px;font-size:13px;color:${c.text}">${escapeHtml(i.title)}${i.displayValue ? ` <span style="color:${c.textMuted}">(${escapeHtml(i.displayValue)})</span>` : ""}</li>`
		)
		.join("");

	const securityRows =
		data.securityFlags.length > 0
			? data.securityFlags
					.map(
						(f) =>
							`<li style="margin:0 0 4px;font-size:13px;color:${c.red}">${escapeHtml(f)}</li>`
					)
					.join("")
			: `<li style="margin:0;font-size:13px;color:${c.green}">No flags detected</li>`;

	const rows = [
		tableRow("Name", firstName),
		tableRow(
			"Email",
			`<a href="mailto:${email}" style="${s.link}">${email}</a>`
		),
		tableRow("Website", `<a href="${url}" style="${s.link}">${url}</a>`),
		tableRow("Received", data.timestamp),
		tableRow("Scope", "Migration scope review required"),
	].join("");

	return emailLayout({
		label: "WP Health Report Lead",
		content: `
      <div style="border-left:3px solid ${urgency.color};padding:8px 0 8px 16px;margin-bottom:24px">
        <span style="${s.small};color:${urgency.color}">${urgency.text}</span>
      </div>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">${rows}</table>
      <div style="${s.box}">
        <p style="${s.label}">Performance scores</p>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:13px;color:${c.text};padding:4px 0">Mobile</td>
            <td style="text-align:right;padding:4px 0">${scoreBadge(data.mobileScore)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:${c.text};padding:4px 0">Desktop</td>
            <td style="text-align:right;padding:4px 0">${scoreBadge(data.desktopScore)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:${c.brand};font-weight:500;padding:8px 0 4px">After webvise migration</td>
            <td style="text-align:right;padding:8px 0 4px">${scoreBadge(data.projectedScore)}</td>
          </tr>
        </table>
      </div>
      <div style="margin-bottom:16px">
        <p style="${s.label}">Top issues found</p>
        <ul style="margin:0;padding:0 0 0 18px">${issueRows}</ul>
      </div>
      <div style="margin-bottom:24px">
        <p style="${s.label}">Security flags</p>
        <ul style="margin:0;padding:0 0 0 18px">${securityRows}</ul>
      </div>
      <a href="${replyHref}" style="${s.button}">Reply to ${firstName}</a>`,
	});
}

const PROSPECT_COPY = {
	en: {
		subject: "Your website report from webvise",
		greeting: "Hi there, here's your report",
		analysedLead: "We've analysed",
		analysedRest: "Here's what we found and what's possible.",
		today: "Performance today",
		mobile: "Mobile",
		desktop: "Desktop",
		projected: "After migrating to Next.js",
		issues: "What's slowing you down",
		scopeLabel: "Scope review",
		scope:
			"webvise can review your content model, integrations, SEO risk, and support needs before recommending the right rebuild path.",
		bookCall: "Book a free call",
		viewWork: "View our work",
		siteUrl: `${SITE_URL}/en`,
		note: "You're receiving this because you ran a free health report at webvise.io. Reply to this email if you have questions.",
		textIntro: (url: string) =>
			`Here's your free WordPress health report for ${url}.`,
		textMobile: "Mobile score",
		textDesktop: "Desktop score",
		textIssues: "Top issues found:",
		textCall: "Ready to talk? Book a free call: https://cal.com/webvise",
		textReply: "Or reply to this email with any questions.",
		signOff: "- The webvise team",
	},
	de: {
		subject: "Ihr Website-Report von webvise",
		greeting: "Guten Tag, hier ist Ihr Report",
		analysedLead: "Wir haben",
		analysedRest: "analysiert. Das haben wir gefunden, und das ist möglich.",
		today: "Performance heute",
		mobile: "Mobil",
		desktop: "Desktop",
		projected: "Nach der Migration zu Next.js",
		issues: "Was Ihre Seite bremst",
		scopeLabel: "Umfang prüfen",
		scope:
			"webvise prüft Inhaltsmodell, Integrationen, SEO-Risiko und Betreuungsbedarf, bevor wir den passenden Weg für den Neubau empfehlen.",
		bookCall: "Kostenloses Gespräch buchen",
		viewWork: "Projekte ansehen",
		siteUrl: SITE_URL,
		note: "Sie erhalten diese E-Mail, weil Sie auf webvise.io einen kostenlosen Health Report erstellt haben. Bei Fragen antworten Sie auf diese E-Mail.",
		textIntro: (url: string) =>
			`Hier ist Ihr kostenloser WordPress Health Report für ${url}.`,
		textMobile: "Mobil",
		textDesktop: "Desktop",
		textIssues: "Die größten Bremsen:",
		textCall:
			"Bereit für ein Gespräch? Kostenlos buchen: https://cal.com/webvise",
		textReply: "Oder antworten Sie mit Ihren Fragen auf diese E-Mail.",
		signOff: "- Das webvise Team",
	},
} as const;

export type ProspectLocale = keyof typeof PROSPECT_COPY;

interface ProspectData {
	desktopScore: number;
	issues: Array<{ title: string; displayValue?: string }>;
	locale?: ProspectLocale;
	mobileScore: number;
	projectedScore: number;
	url: string;
}

export function prospectSubject(locale: ProspectLocale = "en") {
	return PROSPECT_COPY[locale].subject;
}

export function buildProspectHtml(data: ProspectData) {
	const t = PROSPECT_COPY[data.locale ?? "en"];
	const greeting = t.greeting;
	const url = escapeHtml(data.url);
	const site = `<strong style="color:${c.text}">${url}</strong>`;
	const analysed =
		data.locale === "de"
			? `${t.analysedLead} ${site} ${t.analysedRest}`
			: `${t.analysedLead} ${site}. ${t.analysedRest}`;

	const issueRows = data.issues
		.map(
			(i) =>
				`<li style="margin:0 0 6px;font-size:14px;color:${c.text}">${escapeHtml(i.title)}${i.displayValue ? ` <span style="color:${c.textMuted}">(${escapeHtml(i.displayValue)})</span>` : ""}</li>`
		)
		.join("");

	return emailLayout({
		label: "Health Report",
		content: `
      <h1 style="${s.h1}">${greeting}</h1>
      <p style="${s.p}">${analysed}</p>
      <div style="${s.box}">
        <p style="${s.label}">${t.today}</p>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:14px;color:${c.text};padding:6px 0">${t.mobile}</td>
            <td style="text-align:right;padding:6px 0">${scoreBadge(data.mobileScore)}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:${c.text};padding:6px 0">${t.desktop}</td>
            <td style="text-align:right;padding:6px 0">${scoreBadge(data.desktopScore)}</td>
          </tr>
        </table>
        <div style="border-top:2px solid ${c.brand};margin:16px 0 12px"></div>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:14px;color:${c.brand};font-weight:500;padding:0">${t.projected}</td>
            <td style="text-align:right;padding:0">${scoreBadge(data.projectedScore)}</td>
          </tr>
        </table>
      </div>
      ${
				data.issues.length > 0
					? `<div style="margin-bottom:24px">
        <p style="${s.label}">${t.issues}</p>
        <ul style="margin:0;padding:0 0 0 20px">${issueRows}</ul>
      </div>`
					: ""
			}
      <div style="${s.box}">
        <p style="${s.label};color:${c.brand}">${t.scopeLabel}</p>
        <p style="margin:0;font-size:15px;color:${c.text};line-height:1.6">${t.scope}</p>
      </div>
      <div style="margin-bottom:8px">
        <a href="https://cal.com/webvise" style="${s.button};margin-right:12px">${t.bookCall}</a>
        <a href="${t.siteUrl}" style="${s.buttonOutline}">${t.viewWork}</a>
      </div>
      <p style="margin:24px 0 0;font-size:12px;color:${c.textFaint};line-height:1.6">
        ${t.note}
      </p>`,
	});
}

export function prospectText(data: ProspectData) {
	const t = PROSPECT_COPY[data.locale ?? "en"];
	const salutation = data.locale === "de" ? "Guten Tag," : "Hi there,";

	return [
		salutation,
		"",
		t.textIntro(data.url),
		"",
		`${t.textMobile}: ${data.mobileScore}/100`,
		`${t.textDesktop}: ${data.desktopScore}/100`,
		`${t.projected}: ${data.projectedScore}/100`,
		"",
		t.textIssues,
		...data.issues.map(
			(i) => `- ${i.title}${i.displayValue ? ` (${i.displayValue})` : ""}`
		),
		"",
		`${t.scopeLabel}: ${t.scope}`,
		"",
		t.textCall,
		t.textReply,
		"",
		t.signOff,
	].join("\n");
}
