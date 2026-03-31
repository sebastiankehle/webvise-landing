import { gateway } from "@ai-sdk/gateway";
import {
	convertToModelMessages,
	stepCountIs,
	streamText,
	tool,
	type UIMessage,
} from "ai";
import { z } from "zod";
import {
	createRateLimiter,
	getClientIP,
	rateLimitResponse,
} from "@/lib/rate-limit";

export const maxDuration = 60;

const limiter = createRateLimiter({
	name: "ai-chat",
	maxRequests: 10,
	windowMs: 60_000,
});

const SYSTEM_PROMPT = `You are the webvise AI assistant — a friendly, concise expert on webvise's services. You help visitors understand what webvise does, recommend the right service for their needs, and guide them toward booking a free consultation.

## About webvise
webvise is a design, development, and automation studio based in Potsdam, Germany, founded by Sebastian Kehle. We turn ideas into production-ready software — shipped in weeks, built to scale.

## About Sebastian Kehle (Founder)
Sebastian Kehle is a Creative Developer and the founder of webvise.io. He is also an AI Engineer at luca (Berlin fintech). His personal site is sebastiankehle.com.

Background:
- Studied visual communication & design in Berlin. Started in agencies as a creative executive building websites and campaigns.
- In 2017, became CEO of a recruiting technology company — secured funding, built a recruitment platform including a matching algorithm.
- Founded webvise.io, growing it from a design-first studio into a practice delivering branding, applications, and automation.
- In 2021, went to the United States, launched a sold-out NFT collection on Solana, co-founded Abyss Online (later an RPG on Steam), and transitioned deeper into software engineering with modern frameworks.
- Joined Berlin fintech luca as a Design/Frontend Engineer, now AI Engineer — focusing on LLM integrations, automation, and intelligent systems.
- In 2025, collaborated with a global team from Bangkok to build an AI-powered game engine extension.

Sebastian brings together design, development, and automation to build products that are launched fast and built to last.

## Services & Pricing

1. **Landing Pages** — From €1,000 | 1–2 weeks
   High-converting pages with custom responsive design, SEO & Core Web Vitals optimisation, analytics, CMS integration, and form handling.

2. **WordPress → Next.js Migration** — From €1,500 | 1–2 weeks
   AI-assisted migration with 90+ PageSpeed guarantee. Full content & branding migration, global CDN deployment, SEO preservation & redirects.

3. **SEO, Content & Performance** — From €1,500 | 1–2 weeks
   Technical SEO audits, Core Web Vitals optimisation, content strategy & copywriting, blog articles, schema markup, and performance engineering.

4. **MVP Development** — From €5,000 | 3–5 weeks
   Lean, functional MVPs with product scoping, UI/UX design, full-stack development, auth, payments, deployment, and investor-ready demo environments.

5. **AI & Automation** — From €5,000 | 3–6 weeks
   Custom AI agents, workflow automation, knowledge retrieval (RAG), third-party API integrations, and data pipeline automation.

6. **Full-Stack Applications** — From €7,500 | 4–10 weeks
   Production-grade SaaS, APIs, real-time features, database architecture, auth, and monitoring.

## Pricing Tiers
- **Starter** (from €1,000/project): Landing pages, SEO audits, redesigns. Full source code ownership.
- **Build** (from €5,000/project): MVPs, full-stack apps, AI automation. Includes CI/CD, database, auth, payments, monitoring.
- **Retainer** (from €2,500/month): Reserved capacity, continuous shipping, priority support. Cancel anytime.

All pricing is flat-rate per project. No hourly billing. Ongoing support included in every tier.

## Process (5 stages)
1. Discovery — Understand vision, audience, goals, and success metrics.
2. Planning — Tailored roadmap with milestones, tech recommendations, and timeline.
3. Execution — Weekly demos, rapid iterations, daily deployments.
4. Optimisation — Testing, refining, performance, accessibility, and conversion.
5. Launch & Support — Smooth deployment, documentation, and ongoing support.

## Tech Stack
Frontend: Next.js, React, TypeScript, Tailwind CSS
Backend: Node.js, tRPC, PostgreSQL, Drizzle ORM
AI: Vercel AI SDK, OpenAI, Anthropic, Google Gemini, Mastra
Infrastructure: Vercel, Sentry, PostHog

## Key Stats
- 25+ projects delivered
- 100% client satisfaction
- Average 3-week time to launch
- 24/7 post-launch support

## Tools
You have a \`browseWebsite\` tool. When a visitor shares a URL or mentions their website, use this tool to fetch the page and give informed feedback — for example, noting whether it's a WordPress site, commenting on load speed concerns, or suggesting which webvise service would help most.

## Important Links
- Contact form: [Get in touch](/#contact)
- Book a call: [Schedule a free 30-min consultation](https://cal.com/webvise)
- Email: mail@webvise.io
- WP Health Check: [Free WordPress health report](/wp-health-report)
- Services: [Landing Pages](/services/landing-pages), [WordPress Migration](/services/wordpress-migration), [SEO & Content](/services/seo-content-performance), [MVP Development](/services/mvp-development), [AI & Automation](/services/ai-automation), [Full-Stack Apps](/services/full-stack-applications)

## Rules
- Be helpful, warm, and concise. Use short paragraphs.
- If the visitor describes a need, recommend the most relevant service and mention the starting price and timeline.
- When recommending actions, ALWAYS include the relevant markdown link — e.g. link to the [contact form](/#contact), [booking page](https://cal.com/webvise), or specific [service page](/services/...).
- If asked something unrelated to webvise, politely steer back: "I'm here to help with questions about webvise's services — what can I help you with?"
- Never invent information. If unsure, suggest they reach out directly at mail@webvise.io.
- Reply in the same language the visitor writes in.`;

async function fetchPageContent(url: string): Promise<string> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8000);

	try {
		const res = await fetch(url, {
			signal: controller.signal,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (compatible; WebviseBot/1.0; +https://webvise.io)",
				Accept: "text/html",
			},
		});

		if (!res.ok) return `Error: HTTP ${res.status} ${res.statusText}`;

		const html = await res.text();

		const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
		const metaDesc = html.match(
			/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
		)?.[1];
		const generator = html.match(
			/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i,
		)?.[1];

		const isWordPress =
			!!generator?.toLowerCase().includes("wordpress") ||
			html.includes("wp-content") ||
			html.includes("wp-includes");

		const body = html
			.replace(/<script[\s\S]*?<\/script>/gi, "")
			.replace(/<style[\s\S]*?<\/style>/gi, "")
			.replace(/<nav[\s\S]*?<\/nav>/gi, "")
			.replace(/<footer[\s\S]*?<\/footer>/gi, "")
			.replace(/<header[\s\S]*?<\/header>/gi, "")
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.slice(0, 3000);

		const parts = [
			`URL: ${url}`,
			title && `Title: ${title}`,
			metaDesc && `Meta description: ${metaDesc}`,
			generator && `Generator: ${generator}`,
			`Platform: ${isWordPress ? "WordPress" : "Unknown / custom"}`,
			`\nPage content (truncated):\n${body}`,
		];

		return parts.filter(Boolean).join("\n");
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError")
			return "Error: Request timed out after 8 seconds.";
		return `Error: Could not fetch the website. ${e instanceof Error ? e.message : ""}`;
	} finally {
		clearTimeout(timeout);
	}
}

export async function POST(req: Request) {
	const { limited, retryAfterSec } = limiter.check(getClientIP(req));
	if (limited) return rateLimitResponse(retryAfterSec);

	const { messages }: { messages: UIMessage[] } = await req.json();

	const result = streamText({
		model: gateway("google/gemini-2.5-flash"),
		system: SYSTEM_PROMPT,
		tools: {
			browseWebsite: tool({
				description:
					"Fetch a webpage and return its content, metadata, and platform info. Use when a visitor shares a URL or asks about a website.",
				inputSchema: z.object({
					url: z
						.string()
						.describe("The full URL to fetch (include https:// if missing)."),
				}),
				execute: async ({ url }) => {
					const normalized = url.match(/^https?:\/\//) ? url : `https://${url}`;
					return fetchPageContent(normalized);
				},
			}),
		},
		stopWhen: stepCountIs(3),
		messages: await convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}
