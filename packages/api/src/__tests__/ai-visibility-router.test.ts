import { TRPCError } from "@trpc/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const envMock = vi.hoisted(() => ({
	NODE_ENV: "test",
	CONTACT_EMAIL_TO: "mail@webvise.io",
}));
vi.mock("@webvise-app/env/server", () => ({ env: envMock }));

const mocks = vi.hoisted(() => ({
	generateText: vi.fn(),
	lookup: vi.fn(),
	sendEmail: vi.fn(),
	insertValues: vi.fn(),
}));

vi.mock("ai", () => ({ generateText: mocks.generateText }));
vi.mock("@ai-sdk/gateway", () => ({
	gateway: (id: string) => ({ gatewayModel: id }),
}));
vi.mock("@webvise-app/db", () => ({
	db: { insert: () => ({ values: mocks.insertValues }) },
}));
vi.mock("node:dns/promises", () => ({ lookup: mocks.lookup }));
vi.mock("@webvise-app/api/email/resend", () => ({
	sendEmail: mocks.sendEmail,
	setContact: vi.fn(),
}));

const { aiVisibilityRouter } = await import(
	"@webvise-app/api/routers/ai-visibility"
);

interface GenerateCall {
	maxOutputTokens: number;
	model: { gatewayModel: string };
	prompt: string;
}

/** Fake answers: ChatGPT does not know the brand, Gemini names it, Perplexity cites the site. */
function fakeAnswer({ model, prompt }: GenerateCall) {
	if (model.gatewayModel.startsWith("openai/")) {
		return { text: "I'm not familiar with webvise.", sources: [] };
	}
	if (model.gatewayModel.startsWith("google/")) {
		return { text: `webvise is a studio. (${prompt})`, sources: [] };
	}
	return {
		text: "Agency A is well rated[1].",
		sources: [
			{ sourceType: "url", id: "1", url: "https://www.webvise.io/en" },
			{ sourceType: "url", id: "2", url: "https://feedbax.ai/potsdam" },
		],
	};
}

const BASE_INPUT = {
	brand: "webvise",
	url: "https://webvise.io",
	category: "web agency",
	city: "Potsdam",
	locale: "en" as const,
};

let ipCounter = 0;
function caller() {
	ipCounter += 1;
	return aiVisibilityRouter.createCaller({
		ip: `ai-visibility-test-${ipCounter}`,
		session: null,
	});
}

describe("aiVisibilityRouter.run", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		for (const mock of Object.values(mocks)) {
			mock.mockReset();
		}
		mocks.lookup.mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);
		mocks.generateText.mockImplementation((call: GenerateCall) =>
			Promise.resolve(fakeAnswer(call))
		);
		mocks.insertValues.mockResolvedValue(undefined);
		mocks.sendEmail.mockResolvedValue({ ok: true });
		fetchMock.mockReset();
		fetchMock.mockImplementation((url: string) => {
			if (url.endsWith("/llms.txt")) {
				return Promise.resolve(new Response("# webvise", { status: 200 }));
			}
			if (url.endsWith("/robots.txt")) {
				return Promise.resolve(
					new Response("User-agent: GPTBot\nDisallow: /", { status: 200 })
				);
			}
			return Promise.resolve(
				new Response(
					'<script type="application/ld+json">{"@type":"Organization"}</script>',
					{ status: 200 }
				)
			);
		});
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("asks each assistant the three questions and reports what they said", async () => {
		const result = await caller().run(BASE_INPUT);

		expect(mocks.generateText).toHaveBeenCalledTimes(9);
		const calls = mocks.generateText.mock.calls.map(
			([call]) => call as GenerateCall
		);
		expect(new Set(calls.map((c) => c.model.gatewayModel))).toEqual(
			new Set([
				"openai/gpt-6.1-terra",
				"google/gemini-3.8-flash",
				"perplexity/sonar",
			])
		);
		expect(calls.every((c) => c.maxOutputTokens === 400)).toBe(true);
		expect(result.prompts).toEqual([
			{ id: "brand", question: "What is webvise?" },
			{
				id: "recommend",
				question: "Which web agency in Potsdam would you recommend?",
			},
			{ id: "website", question: "What is the website of webvise?" },
		]);

		const perplexity = result.answers.filter(
			(a) => a.assistant === "perplexity"
		);
		expect(perplexity).toHaveLength(3);
		expect(perplexity[0]).toMatchObject({
			ok: true,
			mentioned: false,
			cited: true,
			citations: [
				{ url: "https://www.webvise.io/en", own: true },
				{ url: "https://feedbax.ai/potsdam", own: false },
			],
		});

		expect(result.summary).toEqual({
			knows: { yes: 1, of: 3 },
			recommends: { yes: 1, of: 3 },
			citesSite: { yes: 1, of: 3 },
			models: [
				{ model: "chatgpt", knows: false, recommends: false, citesSite: false },
				{ model: "gemini", knows: true, recommends: true, citesSite: false },
				{
					model: "perplexity",
					knows: false,
					recommends: false,
					citesSite: true,
				},
			],
		});
		expect(result.geo).toEqual({
			llmsTxt: true,
			aiCrawlers: "partly-blocked",
			blockedCrawlers: ["GPTBot"],
			jsonLdTypes: ["Organization"],
		});
		expect(mocks.insertValues).not.toHaveBeenCalled();
		expect(mocks.sendEmail).not.toHaveBeenCalled();
	});

	it("asks in German on the German page", async () => {
		const result = await caller().run({ ...BASE_INPUT, locale: "de" });
		expect(result.prompts.map((p) => p.question)).toEqual([
			"Was ist webvise?",
			"Wen würden Sie als web agency in Potsdam empfehlen?",
			"Wie lautet die Website von webvise?",
		]);
	});

	it("skips the recommendation question without a category", async () => {
		const result = await caller().run({
			...BASE_INPUT,
			category: "  ",
			city: "Potsdam",
		});
		expect(mocks.generateText).toHaveBeenCalledTimes(6);
		expect(result.prompts.map((p) => p.id)).toEqual(["brand", "website"]);
	});

	it("marks a failed model call without failing the check", async () => {
		mocks.generateText.mockImplementation((call: GenerateCall) =>
			call.model.gatewayModel === "google/gemini-3.8-flash"
				? Promise.reject(new Error("upstream timeout"))
				: Promise.resolve(fakeAnswer(call))
		);
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
			// keep test output clean
		});

		const result = await caller().run(BASE_INPUT);

		errorSpy.mockRestore();
		const gemini = result.answers.filter((a) => a.assistant === "gemini");
		expect(gemini.every((a) => !a.ok)).toBe(true);
		expect(result.summary.models[1]).toEqual({
			model: "gemini",
			knows: null,
			recommends: null,
			citesSite: null,
		});
		expect(result.summary.knows).toEqual({ yes: 0, of: 2 });
	});

	it("fails when no assistant answers", async () => {
		mocks.generateText.mockRejectedValue(new Error("gateway down"));
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
			// keep test output clean
		});

		await expect(caller().run(BASE_INPUT)).rejects.toMatchObject({
			code: "INTERNAL_SERVER_ERROR",
		});
		errorSpy.mockRestore();
	});

	it("rejects a URL that points to a private address", async () => {
		mocks.lookup.mockResolvedValue([{ address: "127.0.0.1", family: 4 }]);
		await expect(caller().run(BASE_INPUT)).rejects.toMatchObject({
			code: "BAD_REQUEST",
		});
		expect(mocks.generateText).not.toHaveBeenCalled();
	});

	it("records the lead and notifies webvise when an email is given", async () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
			// Attio is not configured in tests
		});
		await caller().run({
			...BASE_INPUT,
			email: " Ada@Example.com ",
			firstName: "Ada",
		});
		errorSpy.mockRestore();

		expect(mocks.insertValues).toHaveBeenCalledWith({
			email: "ada@example.com",
			eventType: "ai_visibility_check",
			placement: "ai_visibility_check",
			path: "/tools/ai-visibility-check",
			topic: "webvise.io",
		});
		expect(mocks.sendEmail).toHaveBeenCalledOnce();
		expect(mocks.sendEmail.mock.calls[0]?.[0]).toMatchObject({
			to: "mail@webvise.io",
			replyTo: "ada@example.com",
			subject: "AI visibility lead: webvise (webvise.io)",
		});
	});

	it("allows three checks per hour from one address", async () => {
		const sameIp = aiVisibilityRouter.createCaller({
			ip: "ai-visibility-rate-limit",
			session: null,
		});
		for (let i = 0; i < 3; i++) {
			await sameIp.run(BASE_INPUT);
		}
		const blocked = await sameIp.run(BASE_INPUT).catch((e: unknown) => e);
		expect(blocked).toBeInstanceOf(TRPCError);
		expect((blocked as TRPCError).code).toBe("TOO_MANY_REQUESTS");
		expect((blocked as TRPCError).message).not.toBe("DAILY_LIMIT");
		expect(mocks.generateText).toHaveBeenCalledTimes(27);
	});

	it("lets GPT and Gemini search the web and tags the spend", async () => {
		await caller().run(BASE_INPUT);
		const calls = mocks.generateText.mock.calls.map(
			([call]) =>
				call as GenerateCall & {
					providerOptions: { gateway?: { tags?: string[] } };
					tools: Record<string, unknown>;
				}
		);
		const toolsFor = (prefix: string) =>
			calls
				.filter((c) => c.model.gatewayModel.startsWith(prefix))
				.map((c) => Object.keys(c.tools));
		expect(new Set(toolsFor("openai/").flat())).toEqual(
			new Set(["web_search"])
		);
		expect(new Set(toolsFor("google/").flat())).toEqual(
			new Set(["google_search"])
		);
		expect(toolsFor("perplexity/").flat()).toEqual([]);
		for (const call of calls) {
			expect(call.providerOptions.gateway?.tags).toEqual([
				"ai-visibility-check",
			]);
		}
	});

	it("allows five checks a day from one address", async () => {
		vi.useFakeTimers({ toFake: ["Date"] });
		try {
			const sameIp = aiVisibilityRouter.createCaller({
				ip: "ai-visibility-daily",
				session: null,
			});
			for (const checks of [3, 2]) {
				for (let i = 0; i < checks; i++) {
					await sameIp.run(BASE_INPUT);
				}
				// Past the hourly window, still inside the day.
				vi.advanceTimersByTime(61 * 60_000);
			}
			mocks.generateText.mockClear();
			const blocked = await sameIp.run(BASE_INPUT).catch((e: unknown) => e);
			expect((blocked as TRPCError).code).toBe("TOO_MANY_REQUESTS");
			expect((blocked as TRPCError).message).toBe("DAILY_LIMIT");
			expect(mocks.generateText).not.toHaveBeenCalled();
		} finally {
			vi.useRealTimers();
		}
	});

	it("stops all checks once the site-wide daily cap of 25 is reached", async () => {
		// Earlier tests already used part of the cap, so count only up to it.
		let blocked: unknown;
		let passed = 0;
		for (let i = 0; i <= 25 && !blocked; i++) {
			mocks.generateText.mockClear();
			try {
				await caller().run(BASE_INPUT);
				passed += 1;
			} catch (e) {
				blocked = e;
			}
		}
		expect(passed).toBeLessThan(25);
		expect((blocked as TRPCError).code).toBe("TOO_MANY_REQUESTS");
		expect((blocked as TRPCError).message).toBe("DAILY_LIMIT");
		expect(mocks.generateText).not.toHaveBeenCalled();
	});
});
