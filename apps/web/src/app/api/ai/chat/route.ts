import { gateway } from "@ai-sdk/gateway";
import {
	convertToModelMessages,
	stepCountIs,
	streamText,
	tool,
	type UIMessage,
} from "ai";
import { z } from "zod";

export const maxDuration = 60;

const DEFAULT_SYSTEM_PROMPT = `You are the webvise AI assistant — a friendly, concise expert on webvise's services. You help visitors understand what webvise does, recommend the right service for their needs, and guide them toward booking a free consultation. If asked something unrelated to webvise, politely steer back. Never invent information. Reply in the same language the visitor writes in.`;

const SYSTEM_PROMPT = process.env.AI_CHAT_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;

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
