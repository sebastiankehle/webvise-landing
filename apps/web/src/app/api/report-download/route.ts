import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
	createRateLimiter,
	getClientIP,
	rateLimitResponse,
} from "@/lib/rate-limit";

const limiter = createRateLimiter({
	name: "report-download",
	maxRequests: 3,
	windowMs: 60_000,
});

const REPORTS: Record<string, { de: string; en: string; subject: string }> = {
	"ai-coding-tools-deep-dive": {
		de: "reports/ai-coding-tools-deep-dive-de.pdf",
		en: "reports/ai-coding-tools-deep-dive-en.pdf",
		subject: "AI, Agents & AI Coding Tools - Deep Dive Report",
	},
};

const schema = z.object({
	email: z.string().email().max(200),
	reportId: z.string().max(100),
	locale: z.string().max(5).optional(),
});

export async function POST(request: Request) {
	const { limited, retryAfterSec } = limiter.check(getClientIP(request));
	if (limited) return rateLimitResponse(retryAfterSec);

	try {
		const body = await request.json();
		const { email, reportId, locale } = schema.parse(body);

		const report = REPORTS[reportId];
		if (!report) {
			return NextResponse.json({ error: "Report not found" }, { status: 404 });
		}

		const resendApiKey = process.env.RESEND_API_KEY;
		if (!resendApiKey) {
			return NextResponse.json(
				{ error: "Email service not configured" },
				{ status: 500 },
			);
		}

		const lang = locale === "de" ? "de" : "en";
		const pdfPath = join(process.cwd(), "public", report[lang]);
		const pdfContent = readFileSync(pdfPath).toString("base64");
		const filename = `${reportId}-${lang}.pdf`;

		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${resendApiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from: "webvise <noreply@webvise.io>",
				to: [email],
				subject: report.subject,
				html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border:1px solid #e5e7eb">
    <div style="background:#111827;padding:20px 28px">
      <span style="color:#ffffff;font-size:14px;font-weight:600;letter-spacing:0.05em">webvise</span>
      <span style="color:#f97316;font-size:14px;margin-left:8px">/ Report</span>
    </div>
    <div style="padding:28px">
      <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#111827">
        ${lang === "de" ? "Ihr Report ist da." : "Your report is ready."}
      </h1>
      <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6">
        ${lang === "de" ? "Vielen Dank für Ihr Interesse. Den Report finden Sie im Anhang dieser E-Mail." : "Thank you for your interest. You'll find the report attached to this email."}
      </p>
      <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6">
        ${lang === "de" ? "Bei Fragen stehe ich gerne zur Verfügung." : "If you have any questions, feel free to reach out."}
      </p>
      <div style="border-top:1px solid #e5e7eb;padding-top:16px;margin-top:16px">
        <p style="margin:0;font-size:13px;color:#111827;font-weight:500">Sebastian Kehle</p>
        <p style="margin:4px 0 0;font-size:12px;color:#6b7280">sebastian.kehle@webvise.io</p>
      </div>
    </div>
  </div>
</body>
</html>`,
				attachments: [{ filename, content: pdfContent }],
			}),
		});

		if (!res.ok) {
			const error = await res.text();
			console.error("Resend error:", error);
			return NextResponse.json(
				{ error: "Failed to send email" },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid input", details: error.issues },
				{ status: 400 },
			);
		}
		console.error("Report download error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
