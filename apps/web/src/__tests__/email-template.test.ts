import {
	c,
	emailLayout,
	escapeHtml,
	s,
	scoreBadge,
	scoreColor,
	tableRow,
	unsubscribeUrl,
} from "@webvise-app/api/email/template";
import { describe, expect, it } from "vitest";

describe("escapeHtml", () => {
	it("escapes the standard 5 entities", () => {
		expect(escapeHtml('<script src="x">&</script>')).toBe(
			"&lt;script src=&quot;x&quot;&gt;&amp;&lt;/script&gt;"
		);
	});

	it("escapes single quotes", () => {
		expect(escapeHtml("it's")).toBe("it&#39;s");
	});

	it("returns empty string unchanged", () => {
		expect(escapeHtml("")).toBe("");
	});

	it("leaves safe characters alone", () => {
		expect(escapeHtml("hello world 123")).toBe("hello world 123");
	});
});

describe("scoreColor / scoreBadge", () => {
	it("green for >= 90, yellow for 50-89, red for < 50", () => {
		expect(scoreColor(95)).toBe(c.green);
		expect(scoreColor(70)).toBe(c.yellow);
		expect(scoreColor(40)).toBe(c.red);
	});

	it("badge contains the score and ends with /100", () => {
		expect(scoreBadge(73)).toContain(">73/100<");
	});
});

describe("emailLayout", () => {
	it("renders DOCTYPE, brand bar, and content", () => {
		const html = emailLayout({ label: "L", content: "<p>hi</p>" });
		expect(html).toContain("<!DOCTYPE html>");
		expect(html).toContain("WEBVISE");
		expect(html).toContain("<p>hi</p>");
	});

	it("escapes the label so it can't break out of HTML", () => {
		const html = emailLayout({
			label: "<script>alert(1)</script>",
			content: "x",
		});
		expect(html).not.toContain("<script>alert(1)</script>");
		expect(html).toContain("&lt;script&gt;");
	});

	it("includes the unsubscribe link only when an email is provided", () => {
		const without = emailLayout({ content: "x" });
		expect(without).not.toContain("UNSUBSCRIBE");
		const withUnsub = emailLayout({
			content: "x",
			unsubscribeEmail: "u@x",
		});
		expect(withUnsub).toContain("UNSUBSCRIBE");
		expect(withUnsub).toContain("/api/unsubscribe?token=");
	});

	it("includes the optional footer when provided", () => {
		const html = emailLayout({ content: "x", footer: "FOOTER" });
		expect(html).toContain("FOOTER");
	});
});

describe("tableRow", () => {
	it("renders a tr with escaped label and raw value", () => {
		const row = tableRow("Name & Co", "<a href='x'>x</a>");
		expect(row).toContain("Name &amp; Co");
		expect(row).toContain("<a href='x'>x</a>");
		expect(row.startsWith("<tr>")).toBe(true);
	});
});

describe("unsubscribeUrl", () => {
	it("base64url-encodes the email into the token query param", () => {
		const url = unsubscribeUrl("user@example.com");
		const parsed = new URL(url);
		expect(parsed.host).toBe("webvise.io");
		expect(parsed.pathname).toBe("/api/unsubscribe");
		const token = parsed.searchParams.get("token");
		expect(token).toBeTruthy();
		const decoded = Buffer.from(token ?? "", "base64url").toString("utf-8");
		expect(decoded).toBe("user@example.com");
	});
});

describe("style fragments", () => {
	it("exposes the documented inline style keys", () => {
		expect(s).toHaveProperty("h1");
		expect(s).toHaveProperty("p");
		expect(s).toHaveProperty("button");
		expect(s).toHaveProperty("box");
	});
});
