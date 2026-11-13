import { createNewsletterConfirmationToken } from "./newsletter-confirmation-token";
import { createUnsubscribeToken } from "./unsubscribe-token";

const ESCAPE_MAP: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

const ESCAPE_RE = /[&<>"']/g;

export function escapeHtml(str: string): string {
	return str.replace(ESCAPE_RE, (ch) => ESCAPE_MAP[ch] ?? ch);
}

// The site's colour tokens as hex, since mail clients do not read oklch.
// Brand: oklch(0.75 0.18 55) → #ff8918
// Ink (text, header, buttons): oklch(0.18 0.012 250) → #0e1217
// Muted text: oklch(0.46 0.014 250) → #525960
// Page ground: oklch(0.965 0.006 245) → #f0f4f7
// Hairline: oklch(0.932 0.008 245) → #e4e9ee
const c = {
	brand: "#ff8918",
	bgOuter: "#f0f4f7",
	bgCard: "#ffffff",
	header: "#0e1217",
	text: "#0e1217",
	textMuted: "#525960",
	textFaint: "#7b8187",
	border: "#e4e9ee",
	green: "#16a34a",
	yellow: "#ca8a04",
	red: "#dc2626",
} as const;

// The mark as a picture: mail clients drop inline SVG. With pictures blocked,
// the wordmark beside it still names the sender.
const MARK_URL = "https://www.webvise.io/images/email/webvise-mark.png";

const font =
	"'Hanken Grotesk', Geist, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export function unsubscribeUrl(email: string): string {
	return `https://www.webvise.io/api/unsubscribe?token=${createUnsubscribeToken(email)}`;
}

export function newsletterConfirmationUrl(email: string): string {
	return `https://www.webvise.io/api/newsletter/confirm?token=${createNewsletterConfirmationToken(email)}`;
}

export function emailLayout(opts: {
	label?: string;
	content: string;
	footer?: string;
	unsubscribeEmail?: string;
	unsubscribeLabel?: string;
}) {
	const unsubscribeHtml = opts.unsubscribeEmail
		? `<div style="padding:14px 28px;border-top:1px solid ${c.border}">
      <a href="${unsubscribeUrl(opts.unsubscribeEmail)}" style="font-size:12px;color:${c.textFaint};text-decoration:none">${escapeHtml(opts.unsubscribeLabel ?? "Unsubscribe")}</a>
    </div>`
		: "";

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${c.bgOuter};font-family:${font}">
  <div style="max-width:560px;margin:40px auto;background:${c.bgCard};border:1px solid ${c.border};border-radius:12px;overflow:hidden">
    <div style="background:${c.header};padding:20px 28px;border-radius:11px 11px 0 0">
      <img src="${MARK_URL}" width="22" height="22" alt="" style="vertical-align:middle;margin-right:8px;border:0"><span style="color:#ffffff;font-size:17px;font-weight:600;letter-spacing:-0.02em;vertical-align:middle;font-family:${font}">webvise</span>${opts.label ? `<span style="color:#999fa4;font-size:13px;margin-left:10px;vertical-align:middle;font-family:${font}">${escapeHtml(opts.label)}</span>` : ""}
    </div>
    <div style="height:2px;background:${c.brand}"></div>
    <div style="padding:28px">
      ${opts.content}
    </div>${
			opts.footer
				? `
    <div style="border-top:1px solid ${c.border};padding:16px 28px">${opts.footer}</div>`
				: ""
		}
    <div style="padding:14px 28px;border-top:1px solid ${c.border}">
      <a href="https://www.webvise.io" style="font-size:12px;color:${c.textFaint};text-decoration:none">webvise.io</a>
    </div>${unsubscribeHtml}
  </div>
</body>
</html>`;
}

// Reusable inline style fragments
export const s = {
	h1: `margin:0 0 8px;font-size:20px;font-weight:600;color:${c.text};letter-spacing:-0.02em;font-family:${font}`,
	h2: `margin:0 0 8px;font-size:16px;font-weight:600;color:${c.text};letter-spacing:-0.01em;font-family:${font}`,
	p: `margin:0 0 16px;font-size:14px;color:${c.textMuted};line-height:1.6`,
	label: `display:block;margin:0 0 8px;font-size:12px;color:${c.textFaint};font-weight:600`,
	cellLabel: `padding:6px 16px 6px 0;color:${c.textMuted};font-size:13px;white-space:nowrap;vertical-align:top`,
	cellValue: `padding:6px 0;color:${c.text};font-size:13px`,
	link: `color:${c.brand};text-decoration:none`,
	button: `display:inline-block;background:${c.header};color:#ffffff;text-decoration:none;padding:10px 20px;font-size:13px;font-weight:500;border-radius:6px`,
	buttonOutline: `display:inline-block;border:1px solid ${c.border};color:${c.text};text-decoration:none;padding:10px 20px;font-size:13px;border-radius:6px`,
	hr: `border:none;border-top:1px solid ${c.border};margin:20px 0`,
	box: `border:1px solid ${c.border};border-radius:8px;padding:16px 20px;margin-bottom:20px`,
	small: "font-size:12px;font-weight:600",
} as const;

export { c };

export function scoreColor(score: number): string {
	if (score >= 90) {
		return c.green;
	}
	if (score >= 50) {
		return c.yellow;
	}
	return c.red;
}

export function scoreBadge(score: number): string {
	const color = scoreColor(score);
	return `<span style="display:inline-block;background:${color};color:#fff;font-size:12px;font-weight:500;padding:2px 8px;border-radius:4px">${score}/100</span>`;
}

export function tableRow(label: string, value: string): string {
	return `<tr><td style="${s.cellLabel}">${escapeHtml(label)}</td><td style="${s.cellValue}">${value}</td></tr>`;
}
