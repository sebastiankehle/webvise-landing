"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/typography";

const descriptions: Record<string, string> = {
	"Next.js": "React framework for production-grade web apps",
	React: "UI library for building component-based interfaces",
	TypeScript: "Typed superset of JavaScript for safer code",
	"Tailwind CSS": "Utility-first CSS framework for rapid styling",
	"shadcn/ui": "Beautifully designed, accessible component library",
	Motion: "Production-ready animation library for React",
	"Node.js": "JavaScript runtime for server-side applications",
	Bun: "Fast all-in-one JavaScript runtime and toolkit",
	Hono: "Ultra-fast web framework for the edge",
	tRPC: "End-to-end typesafe APIs without code generation",
	Convex: "Reactive backend platform with realtime sync",
	Drizzle: "TypeScript ORM with SQL-like query builder",
	Redis: "In-memory data store for caching and queues",
	PostgreSQL: "Advanced open-source relational database",
	"Better Auth": "Modern authentication framework for TypeScript",
	OpenAI: "GPT models for text, vision, and reasoning",
	Anthropic: "Claude models for safe, capable AI assistance",
	"Google AI Studio": "Google's platform for prototyping with Gemini models",
	"Vercel AI SDK": "Unified API for building AI-powered applications",
	Mastra: "TypeScript framework for AI agents and workflows",
	Inngest: "Durable workflow engine for background jobs",
	n8n: "Visual workflow automation and integration platform",
	Vercel: "Platform for frontend deployment and edge computing",
	Docker: "Containerization for consistent environments",
	Turborepo: "High-performance monorepo build system",
	Sentry: "Error monitoring and performance tracking",
	PostHog: "Open-source product analytics and feature flags",
	Stitch: "Google's AI-powered web development platform",
	Neon: "Serverless Postgres with branching and autoscaling",
	Greptile: "AI-powered codebase understanding and code review",
	Coderabbit: "AI-driven automated code review tool",
	"Drizzle ORM": "TypeScript ORM with SQL-like query builder",
	LangChain: "Framework for building LLM-powered applications",
	Gemini: "Google's multimodal AI model family",
};

export function TechBadge({ name }: { name: string }) {
	const description = descriptions[name];

	if (!description) {
		return (
			<Label className="border border-border/40 px-3 py-1.5 text-foreground text-sm transition-all hover:border-brand hover:bg-brand hover:text-white">
				{name}
			</Label>
		);
	}

	return (
		<TooltipProvider delay={300}>
			<Tooltip>
				<TooltipTrigger className="cursor-default border border-border/40 px-3 py-1.5 text-sm transition-all hover:border-brand hover:bg-brand hover:text-white">
					{name}
				</TooltipTrigger>
				<TooltipContent>{description}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
