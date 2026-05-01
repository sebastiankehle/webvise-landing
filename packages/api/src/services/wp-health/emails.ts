import {
	c,
	emailLayout,
	escapeHtml,
	s,
	scoreBadge,
	tableRow,
} from "../../email/template";

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
	estimateMin: number;
	estimateMax: number;
	timestamp: string;
}) {
	const urgency = urgencyLabel(data.mobileScore);
	const url = escapeHtml(data.url);
	const email = escapeHtml(data.email);
	const firstName = escapeHtml(
		data.firstName || data.email.split("@")[0] || data.email
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
		tableRow(
			"Est. Value",
			`<strong>${"€"}${data.estimateMin.toLocaleString()}${"–€"}${data.estimateMax.toLocaleString()}</strong>`
		),
	].join("");

	return emailLayout({
		label: "WP Health Report Lead",
		content: `
      <div style="border-left:3px solid ${urgency.color};padding:8px 0 8px 16px;margin-bottom:24px">
        <span style="${s.mono};color:${urgency.color}">${urgency.text}</span>
      </div>
      <table style="border-collapse:collapse;width:100%;margin-bottom:24px">${rows}</table>
      <div style="${s.box}">
        <p style="${s.label}">Performance Scores</p>
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
        <p style="${s.label}">Top Issues Found</p>
        <ul style="margin:0;padding:0 0 0 18px">${issueRows}</ul>
      </div>
      <div style="margin-bottom:24px">
        <p style="${s.label}">Security Flags</p>
        <ul style="margin:0;padding:0 0 0 18px">${securityRows}</ul>
      </div>
      <a href="mailto:${email}?subject=Your webvise WordPress health report&body=Hi ${firstName},%0A%0A" style="${s.button}">Reply to ${firstName}</a>`,
	});
}

export function buildProspectHtml(data: {
	url: string;
	firstName?: string;
	mobileScore: number;
	desktopScore: number;
	projectedScore: number;
	issues: Array<{ title: string; displayValue?: string }>;
	estimateMin: number;
	estimateMax: number;
}) {
	const firstName = escapeHtml(data.firstName || "there");
	const url = escapeHtml(data.url);

	const issueRows = data.issues
		.map(
			(i) =>
				`<li style="margin:0 0 6px;font-size:14px;color:${c.text}">${escapeHtml(i.title)}${i.displayValue ? ` - ${escapeHtml(i.displayValue)}` : ""}</li>`
		)
		.join("");

	return emailLayout({
		label: "Health Report",
		content: `
      <h1 style="${s.h1}">Hi ${firstName}, here's your report</h1>
      <p style="${s.p}">We've analysed <strong style="color:${c.text}">${url}</strong>. Here's what we found - and what's possible.</p>
      <div style="${s.box}">
        <p style="${s.label}">Performance Today</p>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:14px;color:${c.text};padding:6px 0">Mobile</td>
            <td style="text-align:right;padding:6px 0">${scoreBadge(data.mobileScore)}</td>
          </tr>
          <tr>
            <td style="font-size:14px;color:${c.text};padding:6px 0">Desktop</td>
            <td style="text-align:right;padding:6px 0">${scoreBadge(data.desktopScore)}</td>
          </tr>
        </table>
        <div style="border-top:2px solid ${c.brand};margin:16px 0 12px"></div>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="font-size:14px;color:${c.brand};font-weight:500;padding:0">After migrating to Next.js</td>
            <td style="text-align:right;padding:0">${scoreBadge(data.projectedScore)}</td>
          </tr>
        </table>
      </div>
      ${
				data.issues.length > 0
					? `<div style="margin-bottom:24px">
        <p style="${s.label}">What's Slowing You Down</p>
        <ul style="margin:0;padding:0 0 0 20px">${issueRows}</ul>
      </div>`
					: ""
			}
      <div style="${s.box}">
        <p style="${s.label};color:${c.brand}">Migration Estimate</p>
        <p style="margin:0;font-size:22px;font-weight:600;color:${c.text}">${"€"}${data.estimateMin.toLocaleString()} ${"–"} ${"€"}${data.estimateMax.toLocaleString()}</p>
        <p style="margin:8px 0 0;font-size:13px;color:${c.textMuted};line-height:1.5">Fixed-price, from WordPress to a fast, modern Next.js site. No surprises.</p>
      </div>
      <div style="margin-bottom:8px">
        <a href="https://cal.com/webvise" style="${s.button};margin-right:12px">Book a Free Call</a>
        <a href="https://webvise.io" style="${s.buttonOutline}">View Our Work</a>
      </div>
      <p style="margin:24px 0 0;font-size:12px;color:${c.textFaint};line-height:1.6">
        You're receiving this because you ran a free health report at webvise.io. Reply to this email if you have questions.
      </p>`,
	});
}
