import { escapeHtml } from "@/lib/escape-html";

// Design tokens matching the website's oklch color system, converted to hex for email compatibility
// Brand: oklch(0.75 0.18 55) → #ff8918 (warm amber)
// Dark header: oklch(0.14 0.015 250) → #141418 (near-black, blue-tinted)
// Foreground: oklch(0.145 0 0) → #1a1a1a
// Muted foreground: oklch(0.556 0 0) → #7a7a7a
// Border: oklch(0.922 0 0) → #e5e5e5
const c = {
	brand: "#ff8918",
	bgOuter: "#f5f5f5",
	bgCard: "#ffffff",
	header: "#141418",
	text: "#1a1a1a",
	textMuted: "#7a7a7a",
	textFaint: "#999999",
	border: "#e5e5e5",
	green: "#16a34a",
	yellow: "#ca8a04",
	red: "#dc2626",
} as const;

const font =
	"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const mono = "'Geist Mono', ui-monospace, SFMono-Regular, monospace";

export function unsubscribeUrl(email: string): string {
	const token = Buffer.from(email, "utf-8").toString("base64url");
	return `https://webvise.io/api/unsubscribe?token=${token}`;
}

export function emailLayout(opts: {
	label?: string;
	content: string;
	footer?: string;
	unsubscribeEmail?: string;
}) {
	const unsubscribeHtml = opts.unsubscribeEmail
		? `<div style="padding:12px 28px;border-top:1px solid ${c.border}">
      <a href="${unsubscribeUrl(opts.unsubscribeEmail)}" style="font-size:11px;color:${c.textFaint};font-family:${mono};letter-spacing:0.04em;text-decoration:none">UNSUBSCRIBE</a>
    </div>`
		: "";

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${c.bgOuter};font-family:${font}">
  <div style="max-width:560px;margin:40px auto;background:${c.bgCard};border:1px solid ${c.border}">
    <div style="background:${c.header};padding:20px 28px">
      <span style="color:#ffffff;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;font-family:${mono}">WEBVISE</span>${opts.label ? `<span style="color:${c.brand};font-size:11px;font-family:${mono};letter-spacing:0.05em;text-transform:uppercase;margin-left:8px">/ ${escapeHtml(opts.label)}</span>` : ""}
    </div>
    <div style="height:2px;background:${c.brand}"></div>
    <div style="padding:28px">
      ${opts.content}
    </div>${opts.footer ? `
    <div style="border-top:1px solid ${c.border};padding:16px 28px">${opts.footer}</div>` : ""}
    <div style="padding:16px 28px;border-top:1px solid ${c.border}">
      <span style="font-size:11px;color:${c.textFaint};font-family:${mono};letter-spacing:0.04em;text-transform:uppercase">WEBVISE.IO</span>
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
	label: `display:block;margin:0 0 8px;font-size:11px;color:${c.textFaint};text-transform:uppercase;letter-spacing:0.06em;font-weight:500;font-family:${mono}`,
	cellLabel: `padding:6px 16px 6px 0;color:${c.textMuted};font-size:13px;white-space:nowrap;vertical-align:top`,
	cellValue: `padding:6px 0;color:${c.text};font-size:13px`,
	link: `color:${c.brand};text-decoration:none`,
	button: `display:inline-block;background:${c.header};color:#ffffff;text-decoration:none;padding:10px 20px;font-size:13px;font-weight:500;letter-spacing:0.02em`,
	buttonOutline: `display:inline-block;border:1px solid ${c.border};color:${c.text};text-decoration:none;padding:10px 20px;font-size:13px`,
	hr: `border:none;border-top:1px solid ${c.border};margin:20px 0`,
	box: `border:1px solid ${c.border};padding:16px 20px;margin-bottom:20px`,
	mono: `font-family:${mono};font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:${c.textFaint}`,
} as const;

export { c, escapeHtml };

export function scoreColor(score: number): string {
	if (score >= 90) return c.green;
	if (score >= 50) return c.yellow;
	return c.red;
}

export function scoreBadge(score: number): string {
	const color = scoreColor(score);
	return `<span style="display:inline-block;background:${color};color:#fff;font-size:12px;font-weight:600;padding:2px 8px">${score}/100</span>`;
}

export function tableRow(label: string, value: string): string {
	return `<tr><td style="${s.cellLabel}">${escapeHtml(label)}</td><td style="${s.cellValue}">${value}</td></tr>`;
}
