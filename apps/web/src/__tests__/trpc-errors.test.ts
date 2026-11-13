import { TRPCError } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { Context } from "@webvise-app/api/context";
import {
	GENERIC_ERROR_MESSAGE,
	isUnexpectedError,
	t,
} from "@webvise-app/api/index";
import { describe, expect, it, vi } from "vitest";

vi.mock("@webvise-app/env/server", () => ({
	env: { NODE_ENV: "test" },
}));

const testRouter = t.router({
	boom: t.procedure.query(() => {
		throw new Error("ENOENT: /var/task/secret");
	}),
	known: t.procedure.query(() => {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Email service not configured",
		});
	}),
});

async function call(path: string) {
	const res = await fetchRequestHandler({
		endpoint: "/api/trpc",
		req: new Request(`http://localhost/api/trpc/${path}`),
		router: testRouter,
		createContext: () => ({ session: null, ip: "test" }) as unknown as Context,
		onError: () => undefined,
	});
	return res.text();
}

describe("tRPC error formatter", () => {
	it("hides the message of an unexpected throw", async () => {
		const body = await call("boom");
		expect(JSON.parse(body).error.message).toBe(GENERIC_ERROR_MESSAGE);
		expect(body).not.toContain("/var/task");
	});

	it("keeps the message of a deliberate TRPCError", async () => {
		const body = await call("known");
		expect(JSON.parse(body).error.message).toBe("Email service not configured");
	});
});

describe("isUnexpectedError", () => {
	it("is true for a wrapped Error", () => {
		const error = new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			cause: new Error("x"),
		});
		expect(isUnexpectedError(error)).toBe(true);
	});

	it("is false for a TRPCError without cause", () => {
		const error = new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to send email",
		});
		expect(isUnexpectedError(error)).toBe(false);
	});

	it("is false for NOT_FOUND", () => {
		const error = new TRPCError({ code: "NOT_FOUND", cause: new Error("x") });
		expect(isUnexpectedError(error)).toBe(false);
	});
});
